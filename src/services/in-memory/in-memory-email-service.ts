import { EmailService } from "../email";

export interface Email {
  to: string;
  subject: string;
  body: string;
}

export class InMemoryEmailService implements EmailService {
  private emails: Email[] = [];

  async sendEmail(email: string, body: string) {
    this.emails.push({ body, to: email, subject: email });
  }
}
