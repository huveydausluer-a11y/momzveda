import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function updatePremiumByEmail(supabase, email, isPremium) {
  if (!email) return;
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

export async function POST(request) {
  const stripe = getStripe();
  const supabase = getSupabaseAdmin();

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
      const email = session.customer_email || (await stripe.customers.retrieve(session.customer)).email;
      await updatePremiumByEmail(supabase, email, true);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const email = (await stripe.customers.retrieve(subscription.customer)).email;
      const active = ['active', 'trialing'].includes(subscription.status);
      await updatePremiumByEmail(supabase, email, active);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const email = (await stripe.customers.retrieve(subscription.customer)).email;
      await updatePremiumByEmail(supabase, email, false);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      console.error('Payment failed for', invoice.customer_email);
      break;
    }

    case 'customer.subscription.trial_will_end': {
      // Fires ~3 days before the 30-day free trial ends. No custom mailer is wired up
      // yet — the reminder currently relies on Stripe's own "trial ending" customer
      // email (enable it in Stripe Dashboard -> Settings -> Customer emails). Logged
      // here as a hook point for a future localized Resend-based reminder.
      const subscription = event.data.object;
      console.log('Trial ending soon for subscription', subscription.id, 'at', new Date(subscription.trial_end * 1000).toISOString());
      break;
    }

    default:
      console.log('Unhandled event type:', event.type);
  }

  return Response.json({ received: true });
}
