import { Resend } from 'resend';

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return Response.json({ error: 'Email is required.' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
      console.error('RESEND_AUDIENCE_ID is not set');
      return Response.json({ error: 'Mailing list not configured.' }, { status: 500 });
    }

    const { data, error } = await resend.contacts.create({
      email,
      firstName: name || undefined,
      unsubscribed: false,
      audienceId,
    });

    if (error) {
      console.error('Resend subscribe error:', error);
      return Response.json({ error: 'Failed to subscribe.' }, { status: 500 });
    }

    return Response.json({ success: true, contactId: data?.id });
  } catch (error) {
    console.error('Subscribe error:', error);
    return Response.json({ error: 'Failed to subscribe.' }, { status: 500 });
  }
}
