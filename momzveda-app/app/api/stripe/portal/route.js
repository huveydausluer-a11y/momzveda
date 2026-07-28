import Stripe from 'stripe';
import { createClient } from '../../../../lib/supabase-server';

export async function POST(request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    let customerEmail = null;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      customerEmail = user?.email || null;
    } catch {}

    if (!customerEmail) {
      const body = await request.json().catch(() => ({}));
      customerEmail = body?.customerEmail || null;
    }

    if (!customerEmail) {
      return Response.json({ error: 'No customer email.' }, { status: 400 });
    }

    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    if (customers.data.length === 0) {
      return Response.json({ error: 'No Stripe customer found.' }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://momzveda.com'}/`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe billing portal error:', error);
    return Response.json({ error: 'Failed to create billing portal session.' }, { status: 500 });
  }
}
