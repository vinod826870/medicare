import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark } from 'lucide-react';
import { toast } from 'sonner';

const BlogArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const article = {
    id: 1,
    title: 'Understanding Common Cold: Symptoms and Treatment',
    category: 'wellness',
    author: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=80',
    content: `
      <h2>What is the Common Cold?</h2>
      <p>The common cold is a viral infection of your upper respiratory tract — your nose and throat. A common cold is usually harmless, although it might not feel that way. Many types of viruses can cause a common cold.</p>
      
      <h2>Symptoms</h2>
      <p>Symptoms of a common cold usually appear one to three days after exposure to a cold-causing virus. Signs and symptoms might include:</p>
      <ul>
        <li>Runny or stuffy nose</li>
        <li>Sore throat</li>
        <li>Cough</li>
        <li>Congestion</li>
        <li>Slight body aches or mild headache</li>
        <li>Sneezing</li>
        <li>Low-grade fever</li>
        <li>Generally feeling unwell</li>
      </ul>

      <h2>Treatment Options</h2>
      <p>There's no cure for a common cold. Antibiotics are of no use against cold viruses. Treatment is directed at relieving signs and symptoms:</p>
      
      <h3>Over-the-Counter Medications</h3>
      <ul>
        <li><strong>Pain relievers:</strong> For fever, sore throat and headache, many people turn to acetaminophen (Tylenol) or other mild pain relievers.</li>
        <li><strong>Decongestant nasal sprays:</strong> Adults can use decongestant drops or sprays for up to five days.</li>
        <li><strong>Cough syrups:</strong> The FDA and the American Academy of Pediatrics strongly recommend not giving over-the-counter cough and cold medicines to children younger than age 4.</li>
      </ul>

      <h3>Home Remedies</h3>
      <ul>
        <li>Drink lots of fluids to help loosen congestion</li>
        <li>Get plenty of rest</li>
        <li>Soothe a sore throat with salt water gargle</li>
        <li>Use a humidifier to add moisture to the air</li>
        <li>Try chicken soup for its anti-inflammatory effects</li>
      </ul>

      <h2>When to See a Doctor</h2>
      <p>For adults — seek medical attention if you have:</p>
      <ul>
        <li>Fever greater than 101.3 F (38.5 C)</li>
        <li>Fever lasting five days or more or returning after a fever-free period</li>
        <li>Shortness of breath</li>
        <li>Wheezing</li>
        <li>Severe sore throat, headache or sinus pain</li>
      </ul>

      <h2>Prevention</h2>
      <p>There's no vaccine for the common cold, but you can take common-sense precautions to slow the spread of cold viruses:</p>
      <ul>
        <li>Wash your hands frequently and thoroughly</li>
        <li>Disinfect your stuff</li>
        <li>Use tissues</li>
        <li>Don't share drinking glasses or utensils</li>
        <li>Stay away from people who are sick</li>
        <li>Choose your child care center wisely</li>
        <li>Take care of yourself</li>
      </ul>

      <h2>Conclusion</h2>
      <p>While the common cold is usually a minor illness, it can significantly impact your daily life. By understanding the symptoms and knowing how to treat them effectively, you can minimize discomfort and recover more quickly. Remember, if symptoms persist or worsen, don't hesitate to consult with a healthcare professional.</p>
    `,
  };

  const handleShare = () => {
    toast.success('Link copied to clipboard!');
  };

  const handleBookmark = () => {
    toast.success('Article bookmarked!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 xl:px-6 py-8">
        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate('/blog')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>

        {/* Article Header */}
        <div className="mb-8">
          <Badge className="mb-4">{article.category}</Badge>
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {article.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(article.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {article.readTime}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleBookmark}>
              <Bookmark className="mr-2 h-4 w-4" />
              Bookmark
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <Card>
          <CardContent className="prose prose-lg max-w-none p-8">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 @md:grid-cols-2 gap-6">
            {[
              {
                id: 2,
                title: 'Antibiotics: When to Use and When to Avoid',
                image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80',
              },
              {
                id: 3,
                title: 'Nutrition Tips for a Healthier Immune System',
                image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80',
              },
            ].map((related) => (
              <Card
                key={related.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/blog/${related.id}`)}
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={related.image}
                    alt={related.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{related.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle;
