import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { priceId, customerEmail } = await request.json();

    if (!priceId) {
      return Response.json({ error: 'Price ID is required.' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: undefined, // Let Stripe auto-select based on customer's country
      payment_method_collection: 'always',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://momzveda.com'}/?premium=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://momzveda.com'}/?premium=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      tax_id_collection: { enabled: true },
      automatic_tax: { enabled: true },
      locale: 'auto',
      subscription_data: {
        trial_period_days: 30,
        metadata: {
          source: 'momzveda_app',
        },
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: 'Failed to create checkout session.' }, { status: 500 });
  }
}
