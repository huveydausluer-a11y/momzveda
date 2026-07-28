import Stripe from 'stripe';
import { createClient } from '../../../../lib/supabase-server';

// Owner/test accounts that always have Premium (no Stripe subscription needed)
const ALWAYS_PREMIUM_EMAILS = [
  'info@momzveda.com',
  'ruveydausluer@gmail.com',
  'ruveyusluer@hotmail.com',
];

export async function POST(request) {
  try {
    // Prefer the authenticated user's email — cannot be spoofed via the request body
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
      return Response.json({ isPremium: false });
    }

    if (ALWAYS_PREMIUM_EMAILS.includes(customerEmail.toLowerCase())) {
      return Response.json({ isPremium: true, plan: 'lifetime', currentPeriodEnd: null });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Find customer by email
    const customers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return Response.json({ isPremium: false });
    }

    // Check subscriptions — 'trialing' counts as premium too, so the 30-day free trial
    // grants full access, not just 'active' (post-trial) subscriptions.
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'all',
      limit: 5,
    });

    const subscription = subscriptions.data.find(s => ['active', 'trialing'].includes(s.status)) || null;
    const isPremium = !!subscription;

    return Response.json({
      isPremium,
      plan: subscription ? (subscription.items.data[0]?.price?.recurring?.interval === 'year' ? 'yearly' : 'monthly') : null,
      isTrialing: subscription?.status === 'trialing',
      trialEnd: subscription?.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      currentPeriodEnd: subscription?.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
    });
  } catch (error) {
    console.error('Stripe status check error:', error);
    return Response.json({ isPremium: false });
  }
}
