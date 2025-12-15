import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Calendar, User, ArrowRight, TrendingUp, Heart, Brain, Activity } from 'lucide-react';

const HealthBlog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Articles', icon: TrendingUp },
    { id: 'wellness', name: 'Wellness', icon: Heart },
    { id: 'mental-health', name: 'Mental Health', icon: Brain },
    { id: 'fitness', name: 'Fitness', icon: Activity },
  ];

  const articles = [
    {
      id: 1,
      title: 'Understanding Common Cold: Symptoms and Treatment',
      excerpt: 'Learn about the symptoms of common cold and effective treatment options to help you recover faster.',
      category: 'wellness',
      author: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80',
    },
    {
      id: 2,
      title: 'The Importance of Mental Health in Daily Life',
      excerpt: 'Discover why mental health is just as important as physical health and how to maintain it.',
      category: 'mental-health',
      author: 'Dr. Michael Chen',
      date: '2024-01-14',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    },
    {
      id: 3,
      title: 'Antibiotics: When to Use and When to Avoid',
      excerpt: 'Understanding the proper use of antibiotics and the dangers of antibiotic resistance.',
      category: 'wellness',
      author: 'Dr. Emily Rodriguez',
      date: '2024-01-13',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
    },
    {
      id: 4,
      title: 'Staying Active: Simple Exercises for Busy People',
      excerpt: 'Easy-to-follow exercise routines that fit into your busy schedule.',
      category: 'fitness',
      author: 'Dr. James Wilson',
      date: '2024-01-12',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    },
    {
      id: 5,
      title: 'Managing Stress and Anxiety Naturally',
      excerpt: 'Natural methods and techniques to help manage stress and anxiety in your daily life.',
      category: 'mental-health',
      author: 'Dr. Lisa Anderson',
      date: '2024-01-11',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    },
    {
      id: 6,
      title: 'Nutrition Tips for a Healthier Immune System',
      excerpt: 'Foods and nutrients that can help boost your immune system naturally.',
      category: 'wellness',
      author: 'Dr. Robert Taylor',
      date: '2024-01-10',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = articles[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 xl:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Health Blog</h1>
          <p className="text-muted-foreground">Expert advice and insights for your health and wellness</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Featured Article */}
        {selectedCategory === 'all' && !searchQuery && (
          <Card className="mb-8 overflow-hidden cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate(`/blog/${featuredArticle.id}`)}>
            <div className="grid grid-cols-1 xl:grid-cols-2">
              <div className="h-64 xl:h-auto">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 xl:p-8">
                <Badge className="mb-4">Featured</Badge>
                <h2 className="text-3xl font-bold mb-4">{featuredArticle.title}</h2>
                <p className="text-muted-foreground mb-6">{featuredArticle.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {featuredArticle.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(featuredArticle.date).toLocaleDateString()}
                  </div>
                </div>
                <Button>
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredArticles.slice(selectedCategory === 'all' && !searchQuery ? 1 : 0).map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate(`/blog/${article.id}`)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{article.category}</Badge>
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                </div>
                <CardTitle className="text-xl">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.date).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthBlog;
