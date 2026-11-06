import { injectable } from 'inversify';
import nodemailer from 'nodemailer';
import { getMailClient } from '../lib/mail';
import logger from '../lib/logger';
import { IMailProvider } from './IMailProvider';

@injectable()
export class EtherealMailProvider implements IMailProvider {
  async sendMail(to: string, subject: string, text: string, html: string) {
    const mailer = await getMailClient();
    const info = await mailer.sendMail({
      from: '"DevStore" <noreply@devstore.com>',
      to,
      subject,
      text,
      html
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    logger.info(`Email enviado: ${previewUrl}`);
    return previewUrl;
  }
}
