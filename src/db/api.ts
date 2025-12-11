import { supabase } from './supabase';
import type {
  Profile,
  CartItem,
  Order,
  CheckoutRequest,
  CheckoutResponse,
  PaymentVerificationRequest,
  PaymentVerificationResponse,
  ContactSubmission,
  CreateContactSubmission
} from '@/types/types';

// Profile API
export const profilesApi = {
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    return data;
  },

  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
    return Array.isArray(data) ? data : [];
  },

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }
};

// Cart API - stores medicine_id from external API
export const cartApi = {
  async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
    return Array.isArray(data) ? data : [];
  },

  async addToCart(userId: string, medicineId: string, quantity: number): Promise<CartItem> {
    const existing = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('medicine_id', medicineId)
      .maybeSingle();

    if (existing.data) {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.data.quantity + quantity })
        .eq('id', existing.data.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data!;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, medicine_id: medicineId, quantity })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
    return data!;
  },

  async updateQuantity(itemId: string, quantity: number): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },

  async removeFromCart(itemId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

// Orders API
export const ordersApi = {
  async createOrder(orderData: {
    user_id: string;
    total_amount: number;
    status: 'pending' | 'completed' | 'cancelled' | 'refunded';
    shipping_address: string;
    items: Array<{
      medicine_id: string;
      medicine_name: string;
      quantity: number;
      price_at_purchase: number;
    }>;
  }): Promise<Order> {
    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        total_amount: orderData.total_amount,
        currency: 'usd',
        status: orderData.status,
        shipping_address: orderData.shipping_address,
        items: orderData.items.map(item => ({
          name: item.medicine_name,
          price: item.price_at_purchase,
          quantity: item.quantity
        }))
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      medicine_id: item.medicine_id,
      medicine_name: item.medicine_name,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Try to delete the order if items creation failed
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    return order;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error} = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
    return Array.isArray(data) ? data : [];
  },

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
    return Array.isArray(data) ? data : [];
  },

  async updateOrderStatus(
    orderId: string,
    status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  ): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async createCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
    const { data, error } = await supabase.functions.invoke('create_stripe_checkout', {
      body: request
    });

    if (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }

    return data;
  },

  async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    const { data, error } = await supabase.functions.invoke('verify_stripe_payment', {
      body: request
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Error verifying payment:', errorMsg);
      throw new Error(errorMsg || 'Payment verification failed');
    }

    return data;
  }
};

// Contact Submissions API
export const contactApi = {
  async createSubmission(submission: CreateContactSubmission): Promise<ContactSubmission | null> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([submission])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating contact submission:', error);
      throw error;
    }

    return data;
  },

  async getSubmissions(): Promise<ContactSubmission[]> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact submissions:', error);
      throw error;
    }

    return Array.isArray(data) ? data : [];
  },

  async getUserSubmissions(userId: string): Promise<ContactSubmission[]> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user submissions:', error);
      throw error;
    }

    return Array.isArray(data) ? data : [];
  },

  async updateSubmissionStatus(id: string, status: string): Promise<ContactSubmission | null> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating submission status:', error);
      throw error;
    }

    return data;
  },

  async sendEmailNotification(submission: CreateContactSubmission): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('send_contact_email', {
        body: submission
      });

      if (error) {
        const errorMsg = await error?.context?.text().catch(() => error.message || 'Unknown error');
        console.error('Error sending email notification:', errorMsg);
        console.error('Full error object:', error);
        return { success: false, error: errorMsg };
      }

      console.log('Email notification sent successfully:', data);
      return { success: true };
    } catch (err) {
      console.error('Exception in sendEmailNotification:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }
};
