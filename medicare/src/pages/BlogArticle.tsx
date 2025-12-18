import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark } from 'lucide-react';
import { blogApi } from '@/db/api';
import type { BlogPost } from '@/types/types';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

const BlogArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (slug: string) => {
    setLoading(true);
    const post = await blogApi.getPostBySlug(slug);
    if (post) {
      setArticle(post);
      const related = await blogApi.getPostsByCategory(post.category);
      setRelatedArticles(related.filter(p => p.id !== post.id).slice(0, 3));
    }
    setLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt || '',
        url: window.location.href,
      }).catch(() => {
        toast.info('Sharing not supported');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleBookmark = () => {
    toast.success('Article bookmarked!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 xl:px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/blog')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Button>

        <article>
          <div className="mb-6">
            <Badge className="mb-4">{article.category}</Badge>
            <h1 className="text-4xl xl:text-5xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(article.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{article.read_time} min read</span>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleBookmark} className="gap-2">
                <Bookmark className="w-4 h-4" />
                Bookmark
              </Button>
            </div>
          </div>

          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div className="prose prose-lg max-w-none mb-12">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>

        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-12 border-t">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Card
                  key={related.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/blog/${related.slug}`)}
                >
                  <img
                    src={related.image_url || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80'}
                    alt={related.title}
                    className="w-full h-40 object-cover"
                  />
                  <CardHeader>
                    <Badge className="w-fit mb-2">{related.category}</Badge>
                    <CardTitle className="line-clamp-2 text-lg">{related.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {related.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogArticle;
