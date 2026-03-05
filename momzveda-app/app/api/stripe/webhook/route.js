import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Admin client bypasses RLS — used only in this webhook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updatePremiumByEmail(email, isPremium) {
  if (!email) return;
  // profiles table has no email column — look up user ID via auth admin API
  const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) { console.error('Failed to list users:', listErr); return; }
  const user = users.find(u => u.email === email);
  if (!user) { console.error('No auth user found for', email); return; }

  const { error } = await supabase
    .from('profiles')
    .update({ is_premium: isPremium, updated_at: new Date().toISOString() })
    .eq('id', user.id);
  if (error) console.error('Failed to update premium status for', email, error);
}

async function getCustomerEmail(customerId) {
  const customer = await stripe.customers.retrieve(customerId);
  return customer.email;
}

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return Response.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const email = session.customer_email || await getCustomerEmail(session.customer);
      await updatePremiumByEmail(email, true);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const email = await getCustomerEmail(subscription.customer);
      const active = ['active', 'trialing'].includes(subscription.status);
      await updatePremiumByEmail(email, active);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const email = await getCustomerEmail(subscription.customer);
      await updatePremiumByEmail(email, false);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      console.error('Payment failed for', invoice.customer_email);
      break;
    }

    default:
      console.log('Unhandled event type:', event.type);
  }

  return Response.json({ received: true });
}
