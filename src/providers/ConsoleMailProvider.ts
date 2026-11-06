import { injectable } from 'inversify';
import { IMailProvider } from './IMailProvider';

// Modo "test": não usa internet, só imprime o e-mail no console.
@injectable()
export class ConsoleMailProvider implements IMailProvider {
  async sendMail(to: string, subject: string, text: string, html: string): Promise<string | false> {
    console.log('----- E-mail simulado (ConsoleMailProvider) -----');
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);
    console.log(text);
    console.log('--------------------------------------------------');
    return false; // não existe link de pré-visualização
  }
}
