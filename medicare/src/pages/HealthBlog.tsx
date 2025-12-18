import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Calendar, User, ArrowRight, TrendingUp, Heart, Brain, Activity, Clock } from 'lucide-react';
import { blogApi } from '@/db/api';
import type { BlogPost } from '@/types/types';

const HealthBlog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadArticles();
    loadCategories();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    const posts = await blogApi.getAllPosts();
    setArticles(posts);
    setLoading(false);
  };

  const loadCategories = async () => {
    const cats = await blogApi.getCategories();
    setCategories(cats);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setLoading(true);
      const results = await blogApi.searchPosts(searchQuery);
      setArticles(results);
      setLoading(false);
    } else {
      loadArticles();
    }
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    if (category === 'all') {
      await loadArticles();
    } else {
      const posts = await blogApi.getPostsByCategory(category);
      setArticles(posts);
    }
    setLoading(false);
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = filteredArticles[0];
  const regularArticles = filteredArticles.slice(1);

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('wellness')) return Heart;
    if (cat.includes('mental')) return Brain;
    if (cat.includes('fitness')) return Activity;
    return TrendingUp;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 xl:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Health Blog</h1>
          <p className="text-muted-foreground">
            Expert insights and tips for a healthier lifestyle
          </p>
        </div>

        <div className="mb-8 flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => handleCategoryChange('all')}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            All Articles
          </Button>
          {categories.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <Button
                key={category}
                variant={selectedCategory.toLowerCase() === category.toLowerCase() ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(category)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {category}
              </Button>
            );
          })}
        </div>

        {featuredArticle && (
          <Card className="mb-8 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/blog/${featuredArticle.slug}`)}>
            <div className="xl:flex">
              <div className="xl:w-1/2">
                <img
                  src={featuredArticle.image_url || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80'}
                  alt={featuredArticle.title}
                  className="w-full h-64 xl:h-full object-cover"
                />
              </div>
              <div className="xl:w-1/2 p-6">
                <Badge className="mb-4">{featuredArticle.category}</Badge>
                <h2 className="text-3xl font-bold mb-4">{featuredArticle.title}</h2>
                <p className="text-muted-foreground mb-6">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredArticle.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredArticle.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredArticle.read_time} min read
                  </div>
                </div>
                <Button className="gap-2">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {regularArticles.map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/blog/${article.slug}`)}
            >
              <img
                src={article.image_url || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80'}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <Badge className="w-fit mb-2">{article.category}</Badge>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.read_time} min
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No articles found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthBlog;
