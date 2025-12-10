import { supabase } from './supabase';
import type {
  Profile,
  Category,
  Medicine,
  CartItem,
  Order,
  OrderItem,
  MedicineWithCategory,
  CartItemWithMedicine,
  CheckoutRequest,
  CheckoutResponse,
  PaymentVerificationRequest,
  PaymentVerificationResponse
} from '@/types/types';

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
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
    return true;
  }
};

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async create(category: Omit<Category, 'id' | 'created_at'>): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }
    return data;
  },

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }
    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
    return true;
  }
};

export const medicinesApi = {
  async getAll(filters?: {
    categoryId?: string;
    search?: string;
    prescriptionRequired?: boolean;
  }): Promise<MedicineWithCategory[]> {
    let query = supabase
      .from('medicines')
      .select('*, category:categories(*)');

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.prescriptionRequired !== undefined) {
      query = query.eq('prescription_required', filters.prescriptionRequired);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) {
      console.error('Error fetching medicines:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string): Promise<MedicineWithCategory | null> {
    const { data, error } = await supabase
      .from('medicines')
      .select('*, category:categories(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching medicine:', error);
      return null;
    }
    return data;
  },

  async create(medicine: Omit<Medicine, 'id' | 'created_at' | 'updated_at'>): Promise<Medicine | null> {
    const { data, error } = await supabase
      .from('medicines')
      .insert(medicine)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating medicine:', error);
      throw error;
    }
    return data;
  },

  async update(id: string, updates: Partial<Medicine>): Promise<Medicine | null> {
    const { data, error } = await supabase
      .from('medicines')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating medicine:', error);
      throw error;
    }
    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    }
    return true;
  },

  async updateStock(id: string, quantity: number): Promise<Medicine | null> {
    const { data, error } = await supabase
      .from('medicines')
      .update({ stock_quantity: quantity, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
    return data;
  }
};

export const cartApi = {
  async getCartItems(userId: string): Promise<CartItemWithMedicine[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, medicine:medicines(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async addToCart(userId: string, medicineId: string, quantity: number): Promise<CartItem | null> {
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('medicine_id', medicineId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existing.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating cart item:', error);
        throw error;
      }
      return data;
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
    return data;
  },

  async updateQuantity(id: string, quantity: number): Promise<CartItem | null> {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
    return data;
  },

  async removeFromCart(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
    return true;
  },

  async clearCart(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
    return true;
  }
};

export const ordersApi = {
  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
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
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }
    return data;
  },

  async updateOrderStatus(id: string, status: 'pending' | 'completed' | 'cancelled' | 'refunded'): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
    return data;
  },

  async createCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
    const { data, error } = await supabase.functions.invoke('create_stripe_checkout', {
      body: JSON.stringify(request)
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Error creating checkout:', errorMsg);
      throw new Error(errorMsg || 'Failed to create checkout session');
    }

    if (data.code !== 'SUCCESS') {
      throw new Error(data.message || 'Failed to create checkout session');
    }

    return data.data;
  },

  async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    const { data, error } = await supabase.functions.invoke('verify_stripe_payment', {
      body: JSON.stringify(request)
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Error verifying payment:', errorMsg);
      throw new Error(errorMsg || 'Failed to verify payment');
    }

    if (data.code !== 'SUCCESS') {
      throw new Error(data.message || 'Failed to verify payment');
    }

    return data.data;
  }
};
