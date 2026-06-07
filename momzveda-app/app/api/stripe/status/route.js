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

    // Check active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      limit: 1,
    });

    const isPremium = subscriptions.data.length > 0;
    const subscription = subscriptions.data[0] || null;

    return Response.json({
      isPremium,
      plan: subscription ? (subscription.items.data[0]?.price?.recurring?.interval === 'year' ? 'yearly' : 'monthly') : null,
      currentPeriodEnd: subscription?.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
    });
  } catch (error) {
    console.error('Stripe status check error:', error);
    return Response.json({ isPremium: false });
  }
}
