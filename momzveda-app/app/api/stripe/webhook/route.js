import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

  // Handle subscription events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('✅ New subscription:', session.customer_email, session.subscription);
      // In a production app, you would:
      // 1. Save the customer email + subscription ID to your database
      // 2. Mark the user as premium
      // For now, the app uses client-side premium state from the success URL
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      console.log('🔄 Subscription updated:', subscription.id, subscription.status);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      console.log('❌ Subscription cancelled:', subscription.id);
      // Mark user as free tier
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      console.log('⚠️ Payment failed:', invoice.customer_email);
      break;
    }

    default:
      console.log('Unhandled event type:', event.type);
  }

  return Response.json({ received: true });
}
