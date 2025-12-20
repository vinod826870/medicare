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
  CreateContactSubmission,
  BlogPost,
  CreateBlogPost,
  UpdateBlogPost
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

// Blog API
export const blogApi = {
  async getAllPosts(includeUnpublished = false): Promise<BlogPost[]> {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeUnpublished) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
    return data;
  },

  async getPostById(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
    return data;
  },

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts by category:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async searchPosts(searchTerm: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching blog posts:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async createPost(post: CreateBlogPost): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
    return data;
  },

  async updatePost(id: string, updates: UpdateBlogPost): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
    return data;
  },

  async deletePost(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
    return true;
  },

  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('published', true);

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    const categories = Array.isArray(data) 
      ? [...new Set(data.map(item => item.category))]
      : [];
    
    return categories;
  }
};

// New Features API (Reviews, Prescriptions, Interactions, Substitutes, Symptoms)
export const featuresApi = {
  // Medicine Reviews API
  async getMedicineReviews(medicineId: number) {
    const { data, error } = await supabase
      .from('medicine_reviews')
      .select(`
        *,
        profiles:user_id (
          full_name,
          email
        )
      `)
      .eq('medicine_id', medicineId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  },

  async getMedicineRatingSummary(medicineId: number) {
    const { data, error } = await supabase
      .from('medicine_ratings_summary')
      .select('*')
      .eq('medicine_id', medicineId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching rating summary:', error);
      return null;
    }

    return data;
  },

  async createMedicineReview(review: { medicine_id: number; rating: number; title: string; comment?: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to submit a review');
    }

    const { data, error } = await supabase
      .from('medicine_reviews')
      .insert({
        ...review,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      throw error;
    }

    return data;
  },

  async updateMedicineReview(reviewId: string, updates: { rating?: number; title?: string; comment?: string }) {
    const { data, error } = await supabase
      .from('medicine_reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      throw error;
    }

    return data;
  },

  async deleteMedicineReview(reviewId: string) {
    const { error } = await supabase
      .from('medicine_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Prescriptions API
  async getUserPrescriptions() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prescriptions:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  },

  async createPrescription(prescription: { image_url: string; doctor_name?: string; issue_date?: string; expiry_date?: string; notes?: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to upload a prescription');
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        ...prescription,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }

    return data;
  },

  async updatePrescription(prescriptionId: string, updates: { doctor_name?: string; issue_date?: string; expiry_date?: string; notes?: string; status?: string }) {
    const { data, error } = await supabase
      .from('prescriptions')
      .update(updates)
      .eq('id', prescriptionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating prescription:', error);
      throw error;
    }

    return data;
  },

  async deletePrescription(prescriptionId: string) {
    const { error } = await supabase
      .from('prescriptions')
      .delete()
      .eq('id', prescriptionId);

    if (error) {
      console.error('Error deleting prescription:', error);
      throw error;
    }
  },

  // Medicine Interactions API
  async checkMedicineInteractions(medicineIds: number[]) {
    if (medicineIds.length < 2) {
      return [];
    }

    const { data, error } = await supabase
      .from('medicine_interactions')
      .select(`
        *,
        medicine_a:medicine_data!medicine_interactions_medicine_a_id_fkey(id, name),
        medicine_b:medicine_data!medicine_interactions_medicine_b_id_fkey(id, name)
      `)
      .or(
        medicineIds.map((id, i) => 
          medicineIds.slice(i + 1).map(otherId => {
            const [smaller, larger] = id < otherId ? [id, otherId] : [otherId, id];
            return `and(medicine_a_id.eq.${smaller},medicine_b_id.eq.${larger})`;
          }).join(',')
        ).filter(Boolean).join(',')
      );

    if (error) {
      console.error('Error checking interactions:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  },

  // Medicine Substitutes API
  async getMedicineSubstitutes(medicineId: number) {
    const { data, error } = await supabase
      .from('medicine_substitutes')
      .select(`
        *,
        substitute_medicine:medicine_data!medicine_substitutes_substitute_medicine_id_fkey(*)
      `)
      .eq('original_medicine_id', medicineId)
      .order('price_difference', { ascending: true });

    if (error) {
      console.error('Error fetching substitutes:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  },

  // Symptoms API
  async getAllSymptoms() {
    const { data, error} = await supabase
      .from('symptoms')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching symptoms:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  },

  async getSymptomsByCategory(category: string) {
    const { data, error } = await supabase
      .from('symptoms')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching symptoms by category:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  },

  async getMedicinesBySymptoms(symptomIds: string[]) {
    if (symptomIds.length === 0) {
      return [];
    }

    // First, get the selected symptoms with their search keywords
    const { data: symptomsData, error: symptomsError } = await supabase
      .from('symptoms')
      .select('*')
      .in('id', symptomIds);

    if (symptomsError) {
      console.error('Error fetching symptoms:', symptomsError);
      return [];
    }

    if (!symptomsData || symptomsData.length === 0) {
      return [];
    }

    // Build search keywords from symptom names and search_keywords
    const keywords = symptomsData
      .map(s => (s.search_keywords || s.name).toLowerCase())
      .join(' ')
      .split(' ')
      .filter(k => k.length > 3); // Filter out short words

    if (keywords.length === 0) {
      return [];
    }

    // Search medicines by name or type matching any keyword
    const searchConditions = keywords
      .slice(0, 10) // Limit to first 10 keywords to avoid query length issues
      .map(keyword => `name.ilike.%${keyword}%,type.ilike.%${keyword}%`)
      .join(',');
    
    const { data, error } = await supabase
      .from('medicine_data')
      .select('*')
      .or(searchConditions)
      .limit(30);

    if (error) {
      console.error('Error fetching medicines by symptoms:', error);
      return [];
    }

    // Format the results to match expected structure
    const results = Array.isArray(data) ? data.map(medicine => ({
      medicine_id: medicine.id,
      relevance_score: 8,
      medicine: medicine
    })) : [];

    return results;
  },

  // Symptom CRUD operations
  async createSymptom(symptom: { name: string; description: string; category: string; search_keywords: string }) {
    const { data, error } = await supabase
      .from('symptoms')
      .insert([symptom])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating symptom:', error);
      throw error;
    }

    return data;
  },

  async updateSymptom(id: string, updates: Partial<{ name: string; description: string; category: string; search_keywords: string }>) {
    const { data, error } = await supabase
      .from('symptoms')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating symptom:', error);
      throw error;
    }

    return data;
  },

  async deleteSymptom(id: string) {
    const { error } = await supabase
      .from('symptoms')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting symptom:', error);
      throw error;
    }

    return true;
  },

  // Interaction CRUD operations
  async getAllInteractions() {
    const { data, error } = await supabase
      .from('medicine_interactions')
      .select(`
        *,
        medicine_a:medicine_data!medicine_interactions_medicine_a_id_fkey(*),
        medicine_b:medicine_data!medicine_interactions_medicine_b_id_fkey(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interactions:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  },

  async createInteraction(interaction: { medicine_a_id: number; medicine_b_id: number; severity: string; description: string; recommendation: string }) {
    const { data, error } = await supabase
      .from('medicine_interactions')
      .insert([interaction])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating interaction:', error);
      throw error;
    }

    return data;
  },

  async updateInteraction(id: string, updates: Partial<{ medicine_a_id: number; medicine_b_id: number; severity: string; description: string; recommendation: string }>) {
    const { data, error } = await supabase
      .from('medicine_interactions')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating interaction:', error);
      throw error;
    }

    return data;
  },

  async deleteInteraction(id: string) {
    const { error } = await supabase
      .from('medicine_interactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting interaction:', error);
      throw error;
    }

    return true;
  },

  // Substitute CRUD operations
  async getAllSubstitutes() {
    const { data, error } = await supabase
      .from('medicine_substitutes')
      .select(`
        *,
        original_medicine:medicine_data!medicine_substitutes_original_medicine_id_fkey(*),
        substitute_medicine:medicine_data!medicine_substitutes_substitute_medicine_id_fkey(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching substitutes:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  },

  async createSubstitute(substitute: { original_medicine_id: number; substitute_medicine_id: number; price_difference: number; notes: string }) {
    const { data, error } = await supabase
      .from('medicine_substitutes')
      .insert([substitute])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating substitute:', error);
      throw error;
    }

    return data;
  },

  async updateSubstitute(id: string, updates: Partial<{ original_medicine_id: number; substitute_medicine_id: number; price_difference: number; notes: string }>) {
    const { data, error } = await supabase
      .from('medicine_substitutes')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating substitute:', error);
      throw error;
    }

    return data;
  },

  async deleteSubstitute(id: string) {
    const { error } = await supabase
      .from('medicine_substitutes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting substitute:', error);
      throw error;
    }

    return true;
  },

  // Admin operations for reviews and prescriptions
  async getAllReviews() {
    const { data, error } = await supabase
      .from('medicine_reviews')
      .select(`
        *,
        user:profiles(email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all reviews:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  },

  async getAllPrescriptions() {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        user:profiles(email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all prescriptions:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  }
};
