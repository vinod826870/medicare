/*
# Create blog_posts table

## 1. New Tables
- `blog_posts`
  - `id` (uuid, primary key, default: gen_random_uuid())
  - `title` (text, not null) - Blog post title
  - `slug` (text, unique, not null) - URL-friendly identifier
  - `excerpt` (text) - Short summary/preview
  - `content` (text, not null) - Full article content
  - `author` (text, not null) - Author name
  - `category` (text, not null) - Article category (Wellness, Mental Health, Fitness, etc.)
  - `image_url` (text) - Featured image URL
  - `read_time` (integer, default: 5) - Estimated reading time in minutes
  - `published` (boolean, default: false) - Publication status
  - `created_at` (timestamptz, default: now())
  - `updated_at` (timestamptz, default: now())

## 2. Security
- Enable RLS on `blog_posts` table
- Public read access for published posts
- Admin-only write access for creating/updating/deleting posts

## 3. Indexes
- Index on slug for fast lookups
- Index on category for filtering
- Index on published status

## 4. Sample Data
- Insert 6 sample blog posts for demonstration
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  author text NOT NULL,
  category text NOT NULL,
  image_url text,
  read_time integer DEFAULT 5,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

-- Admins can view all posts (including drafts)
CREATE POLICY "Admins can view all blog posts" ON blog_posts
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- Admins can insert posts
CREATE POLICY "Admins can insert blog posts" ON blog_posts
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

-- Admins can update posts
CREATE POLICY "Admins can update blog posts" ON blog_posts
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

-- Admins can delete posts
CREATE POLICY "Admins can delete blog posts" ON blog_posts
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, author, category, image_url, read_time, published) VALUES
(
  'Understanding Common Cold Medications',
  'understanding-common-cold-medications',
  'Learn about the different types of cold medications and how they work to relieve your symptoms.',
  E'# Understanding Common Cold Medications\n\nThe common cold is one of the most frequent illnesses, and choosing the right medication can make a significant difference in your recovery.\n\n## Types of Cold Medications\n\n### Decongestants\nDecongestants help relieve nasal congestion by narrowing blood vessels in the nasal passages. Common ingredients include pseudoephedrine and phenylephrine.\n\n### Antihistamines\nThese medications help reduce sneezing, runny nose, and watery eyes by blocking histamine receptors.\n\n### Pain Relievers\nAcetaminophen and ibuprofen can help reduce fever and relieve body aches associated with colds.\n\n## Important Considerations\n\n- Always read labels carefully\n- Don''t combine medications with the same active ingredients\n- Stay hydrated and get plenty of rest\n- Consult a healthcare provider if symptoms persist\n\n## Conclusion\n\nUnderstanding your cold medication options helps you make informed decisions about your health. Remember that rest and hydration are just as important as medication.',
  'Dr. Sarah Johnson',
  'Wellness',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
  8,
  true
),
(
  'The Importance of Mental Health Awareness',
  'importance-mental-health-awareness',
  'Mental health is just as important as physical health. Discover why awareness matters.',
  E'# The Importance of Mental Health Awareness\n\nMental health awareness has become increasingly important in our modern society. Understanding and addressing mental health issues can significantly improve quality of life.\n\n## Why Mental Health Matters\n\nMental health affects:\n- How we think and feel\n- Our relationships with others\n- Our ability to cope with stress\n- Physical health outcomes\n\n## Common Mental Health Conditions\n\n### Anxiety Disorders\nCharacterized by excessive worry and fear that interferes with daily activities.\n\n### Depression\nA mood disorder causing persistent feelings of sadness and loss of interest.\n\n### Stress-Related Disorders\nConditions that develop in response to traumatic or stressful events.\n\n## Seeking Help\n\nIt''s important to:\n- Talk to healthcare professionals\n- Build a support network\n- Practice self-care\n- Consider therapy or counseling\n\n## Breaking the Stigma\n\nOpen conversations about mental health help reduce stigma and encourage people to seek help when needed.',
  'Dr. Michael Chen',
  'Mental Health',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  6,
  true
),
(
  'Fitness Tips for a Healthier Lifestyle',
  'fitness-tips-healthier-lifestyle',
  'Simple yet effective fitness tips to help you maintain a healthy and active lifestyle.',
  E'# Fitness Tips for a Healthier Lifestyle\n\nMaintaining an active lifestyle doesn''t have to be complicated. Here are practical tips to help you stay fit and healthy.\n\n## Start Small\n\nDon''t try to change everything at once:\n- Begin with 10-15 minutes of exercise daily\n- Gradually increase duration and intensity\n- Set realistic, achievable goals\n\n## Mix It Up\n\n### Cardiovascular Exercise\n- Walking, jogging, or cycling\n- Swimming or dancing\n- Aim for 150 minutes per week\n\n### Strength Training\n- Bodyweight exercises\n- Resistance bands\n- Free weights or machines\n- 2-3 times per week\n\n### Flexibility\n- Stretching routines\n- Yoga or Pilates\n- Improves range of motion\n\n## Stay Consistent\n\n- Schedule workouts like appointments\n- Find activities you enjoy\n- Exercise with friends for motivation\n- Track your progress\n\n## Nutrition Matters\n\nExercise works best when combined with:\n- Balanced diet\n- Adequate hydration\n- Sufficient sleep\n- Stress management\n\n## Listen to Your Body\n\nRest when needed and avoid overtraining. Recovery is essential for progress.',
  'Emily Rodriguez',
  'Fitness',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  7,
  true
),
(
  'Vitamin Supplements: What You Need to Know',
  'vitamin-supplements-guide',
  'A comprehensive guide to understanding vitamin supplements and their role in your health.',
  E'# Vitamin Supplements: What You Need to Know\n\nVitamin supplements can play an important role in maintaining health, but it''s essential to understand when and how to use them.\n\n## Essential Vitamins\n\n### Vitamin D\n- Supports bone health\n- Boosts immune function\n- Many people are deficient\n\n### Vitamin B12\n- Essential for nerve function\n- Important for vegetarians/vegans\n- Supports energy production\n\n### Vitamin C\n- Antioxidant properties\n- Supports immune system\n- Aids in iron absorption\n\n## When to Consider Supplements\n\n- Diagnosed deficiencies\n- Dietary restrictions\n- Pregnancy or breastfeeding\n- Certain medical conditions\n- Age-related needs\n\n## Food First Approach\n\nWhenever possible, get nutrients from:\n- Fruits and vegetables\n- Whole grains\n- Lean proteins\n- Dairy or alternatives\n\n## Choosing Quality Supplements\n\n- Look for third-party testing\n- Check expiration dates\n- Follow recommended dosages\n- Consult healthcare providers\n\n## Potential Risks\n\n- Over-supplementation\n- Drug interactions\n- Quality concerns\n- False health claims\n\n## Conclusion\n\nSupplements can be beneficial but should complement, not replace, a healthy diet.',
  'Dr. Sarah Johnson',
  'Wellness',
  'https://images.unsplash.com/photo-1550572017-4a6c5d8f2f8e?w=800&q=80',
  9,
  true
),
(
  'Managing Stress in Daily Life',
  'managing-stress-daily-life',
  'Practical strategies for managing stress and maintaining mental well-being.',
  E'# Managing Stress in Daily Life\n\nStress is a natural part of life, but chronic stress can impact both mental and physical health. Learn effective strategies for stress management.\n\n## Understanding Stress\n\nStress responses include:\n- Physical symptoms (headaches, tension)\n- Emotional changes (irritability, anxiety)\n- Behavioral changes (sleep issues, appetite changes)\n\n## Stress Management Techniques\n\n### Mindfulness and Meditation\n- Practice deep breathing\n- Try guided meditation apps\n- Focus on the present moment\n- Even 5 minutes daily helps\n\n### Physical Activity\n- Regular exercise reduces stress hormones\n- Releases endorphins\n- Improves sleep quality\n- Provides mental clarity\n\n### Time Management\n- Prioritize tasks\n- Break large projects into steps\n- Learn to say no\n- Schedule breaks\n\n### Social Support\n- Connect with friends and family\n- Join support groups\n- Share your feelings\n- Seek professional help when needed\n\n## Healthy Lifestyle Habits\n\n- Maintain regular sleep schedule\n- Eat balanced meals\n- Limit caffeine and alcohol\n- Practice relaxation techniques\n\n## When to Seek Help\n\nConsult a healthcare provider if stress:\n- Interferes with daily activities\n- Causes physical symptoms\n- Leads to unhealthy coping mechanisms\n- Affects relationships\n\n## Conclusion\n\nEffective stress management is a skill that improves with practice. Be patient with yourself.',
  'Dr. Michael Chen',
  'Mental Health',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
  8,
  true
),
(
  'Building a Home Workout Routine',
  'building-home-workout-routine',
  'Create an effective workout routine you can do from the comfort of your home.',
  E'# Building a Home Workout Routine\n\nYou don''t need a gym membership to stay fit. Here''s how to create an effective home workout routine.\n\n## Benefits of Home Workouts\n\n- Convenience and flexibility\n- Cost-effective\n- Privacy and comfort\n- No commute time\n- Work out anytime\n\n## Essential Equipment\n\n### Minimal Investment\n- Yoga mat\n- Resistance bands\n- Dumbbells (adjustable)\n- Jump rope\n\n### Bodyweight Exercises\nNo equipment needed:\n- Push-ups\n- Squats\n- Lunges\n- Planks\n- Burpees\n\n## Sample Weekly Routine\n\n### Monday: Upper Body\n- Push-ups: 3 sets of 10-15\n- Dumbbell rows: 3 sets of 12\n- Shoulder press: 3 sets of 10\n- Tricep dips: 3 sets of 12\n\n### Wednesday: Lower Body\n- Squats: 3 sets of 15\n- Lunges: 3 sets of 10 each leg\n- Glute bridges: 3 sets of 15\n- Calf raises: 3 sets of 20\n\n### Friday: Full Body\n- Burpees: 3 sets of 10\n- Mountain climbers: 3 sets of 20\n- Plank: 3 sets of 30-60 seconds\n- Jump rope: 3 sets of 1 minute\n\n## Tips for Success\n\n- Warm up before exercising\n- Focus on proper form\n- Progress gradually\n- Stay consistent\n- Cool down and stretch\n\n## Staying Motivated\n\n- Set specific goals\n- Track your progress\n- Vary your routine\n- Follow online workout videos\n- Create a dedicated workout space\n\n## Conclusion\n\nHome workouts can be just as effective as gym sessions with the right approach and consistency.',
  'Emily Rodriguez',
  'Fitness',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  10,
  true
);