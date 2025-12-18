import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.4.0";

interface CheckoutItem {
  medicine_id: string;
  medicine_name: string;
  quantity: number;
  price_at_purchase: number;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  total_amount: number;
  shipping_address: string;
  user_id: string;
  success_url: string;
  cancel_url: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('=== create_stripe_checkout Edge Function called ===');

  try {
    // Get Stripe secret key from environment
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');

    if (!STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Parse request body
    const checkoutData: CheckoutRequest = await req.json();
    console.log('Checkout data received:', JSON.stringify(checkoutData, null, 2));

    // Validate required fields
    if (!checkoutData.items || checkoutData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No items provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Convert items to Stripe line items
    const lineItems = checkoutData.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.medicine_name,
          description: `Medicine ID: ${item.medicine_id}`,
        },
        unit_amount: Math.round(item.price_at_purchase * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping if applicable
    const subtotal = checkoutData.items.reduce(
      (sum, item) => sum + (item.price_at_purchase * item.quantity), 
      0
    );

    if (subtotal <= 50) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping',
          },
          unit_amount: 599, // $5.99 in cents
        },
        quantity: 1,
      });
    }

    console.log('Creating Stripe checkout session...');

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: checkoutData.success_url,
      cancel_url: checkoutData.cancel_url,
      metadata: {
        user_id: checkoutData.user_id,
        shipping_address: checkoutData.shipping_address,
        order_items: JSON.stringify(checkoutData.items),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'IN'],
      },
    });

    console.log('Stripe checkout session created:', session.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        sessionId: session.id,
        url: session.url,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
