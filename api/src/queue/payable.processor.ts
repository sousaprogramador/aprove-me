import {
  Process,
  Processor,
  OnQueueFailed,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Processor('payables')
export class PayableProcessor {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  @Process()
  async handlePayableBatch(job: Job) {
    const payables = job.data.payables;
    let successCount = 0;
    let failureCount = 0;

    for (const payable of payables) {
      try {
        await this.prisma.payable.create({ data: payable });
        successCount++;
      } catch (error) {
        failureCount++;
        if (job.attemptsMade < 4) {
          await job.retry();
        } else {
          await this.moveToDeadLetterQueue(job, payable);
        }
      }
    }

    job.data.successCount = successCount;
    job.data.failureCount = failureCount;
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job) {
    const { email, successCount, failureCount } = job.data;
    await this.sendEmail(email, successCount, failureCount);
  }

  @OnQueueFailed()
  async handleQueueFailed(job: Job, error: any) {
    if (job.attemptsMade < 4) {
      await job.retry();
    } else {
      await this.moveToDeadLetterQueue(job, job.data);
    }
  }

  private async moveToDeadLetterQueue(job: Job, data: any) {
    const deadLetterQueue = job.queue;
    await deadLetterQueue.add('dead-letter', data);

    const operationsEmail = this.configService.get<string>('OPERATIONS_EMAIL');
    await this.sendOperationsEmail(operationsEmail, data);
  }

  private async sendEmail(to: string, success: number, failure: number) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject: 'Processamento de Lote Concluído',
      text: `O processamento do lote foi concluído. Sucessos: ${success}, Falhas: ${failure}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  private async sendOperationsEmail(to: string, data: any) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject: 'Item Movido para Fila Morta',
      text: `O seguinte item de pagável foi movido para a fila morta após 4 tentativas:\n\n${JSON.stringify(data)}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
