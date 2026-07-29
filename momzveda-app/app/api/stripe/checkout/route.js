import Stripe from 'stripe';

export async function POST(request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { priceId, customerEmail, plan } = await request.json();

    if (!priceId) {
      return Response.json({ error: 'Price ID is required.' }, { status: 400 });
    }

    // Monthly plan starts with a 30-day free trial; card is still required up front
    // (payment_method_collection: 'always') so billing continues automatically at
    // EUR 13.99/month once the trial ends. Yearly has no trial.
    const isTrial = plan === 'monthly';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
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
        metadata: {
          source: 'momzveda_app',
        },
        ...(isTrial && {
          trial_period_days: 30,
          trial_settings: {
            end_behavior: { missing_payment_method: 'cancel' },
          },
        }),
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: 'Failed to create checkout session.' }, { status: 500 });
  }
}
