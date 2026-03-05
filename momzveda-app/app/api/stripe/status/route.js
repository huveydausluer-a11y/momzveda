import Stripe from 'stripe';

export async function POST(request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { customerEmail } = await request.json();

    if (!customerEmail) {
      return Response.json({ isPremium: false });
    }

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
