import { Email } from '../services';

export const emailFixture: Email = {
  destinations: [{ to: ['test@example.com'] }],
  templateName: 'template-name',
  templateData: { foo: 'bar' },
};
