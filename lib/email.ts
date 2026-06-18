import { Resend } from 'resend';
import { env } from '@/lib/env';

const FROM_EMAIL = env.RESEND_FROM_EMAIL;

function getResend(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  return new Resend(env.RESEND_API_KEY);
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping email');
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    console.error('[email] send failed:', error);
    throw new Error(error.message);
  }

  return data;
}
