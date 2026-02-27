'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import Navigation from '../components/Navigation';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featuredNews, setFeaturedNews] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const itemsPerPage = 6;

  useEffect(() => {
    fetchNews();
    fetchCategories();
    fetchFooter();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, selectedCategory, searchQuery]);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/news?populate=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      if (response.data?.data) {
        setNews(response.data.data);
        // Find featured news
        const featured = response.data.data.find(item => item.attributes.isFeatured);
        setFeaturedNews(featured);
        setFilteredNews(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      if (response.data?.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFooter = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/site-footer?populate[branchLocations][populate][0]=phones&populate[branchLocations][populate][1]=emails&populate[footerLinks]=*&populate[socialPlatforms]=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      if (response.data?.data) setFooter(response.data.data);
    } catch (error) {
      console.error('Error fetching footer:', error);
    }
  };

  const extractText = (richText) => {
    if (!richText) return '';
    if (typeof richText === 'string') return richText;
    if (Array.isArray(richText)) {
      return richText.map(block => 
        block.children?.map(child => child.text).join(' ') || ''
      ).join(' ');
    }
    return '';
  };

  const filterNews = () => {
    let filtered = [...news];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.attributes.category?.data?.id === parseInt(selectedCategory)
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => {
        const titleMatch = item.attributes.title.toLowerCase().includes(searchQuery.toLowerCase());
        const descriptionText = extractText(item.attributes.description).toLowerCase();
        const descriptionMatch = descriptionText.includes(searchQuery.toLowerCase());
        return titleMatch || descriptionMatch;
      });
    }

    setFilteredNews(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
    
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFFF00] to-yellow-300 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-base text-gray-700 mb-4">
            <Link href="/" className="hover:text-gray-900 transition font-medium">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-semibold">News</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">Latest News & Updates</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Stay informed with the latest happenings at Droga Pharma
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
              />
            </form>
          </div>
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.attributes.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured News - FIXED IMAGE URL */}
        {featuredNews && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Story</h2>
            <Link href={`/news/${featuredNews.id}`}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition cursor-pointer group">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-[300px] md:h-full">
                    <Image
                      // FIXED: Using the full URL directly from Strapi
                     src={featuredNews.attributes.image?.data?.attributes?.url?.startsWith('http') ? featuredNews.attributes.image.data.attributes.url : `${API_URL}${featuredNews.attributes.image?.data?.attributes?.url}` || '/placeholder.jpg'}
                      alt={featuredNews.attributes.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      unoptimized={true}
                    />
                  </div>
                  <div className="p-8 md:p-12">
                    <div className="text-sm text-[#FFFF00] font-semibold mb-2">
                      {formatDate(featuredNews.attributes.date)} • Featured
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-[#FFFF00] transition">
                      {featuredNews.attributes.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {extractText(featuredNews.attributes.description)}
                    </p>
                    <div className="inline-flex items-center text-[#FFFF00] font-semibold group-hover:gap-2 transition-all">
                      Read Full Story
                      <span className="ml-2 text-xl">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* News Grid - FIXED IMAGE URLS */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">All News</h2>
          
          {filteredNews.length === 0 ? (
            <p className="text-center text-gray-600 py-12">No news articles found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`}>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer group h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <Image
                          // FIXED: Using the full URL directly from Strapi
                         src={item.attributes.image?.data?.attributes?.url?.startsWith('http') ? item.attributes.image.data.attributes.url : `${API_URL}${item.attributes.image?.data?.attributes?.url}` || '/placeholder.jpg'}
                          alt={item.attributes.title}
                          fill
                          className="object-cover group-hover:scale-110 transition duration-500"
                          unoptimized={true}
                        />
                        {item.attributes.isFeatured && (
                          <div className="absolute top-4 left-4 bg-[#FFFF00] text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                            Featured
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="text-sm text-gray-500 mb-2">
                          {formatDate(item.attributes.date)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#FFFF00] transition line-clamp-2">
                          {item.attributes.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                          {extractText(item.attributes.description)}
                        </p>
                        <div className="inline-flex items-center text-[#FFFF00] font-semibold text-sm">
                          Read More
                          <span className="ml-1">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg transition text-gray-900 ${
                        currentPage === i + 1
                          ? 'bg-[#FFFF00] font-semibold'
                          : 'border border-gray-300 hover:bg-gray-50 bg-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Newsletter Signup - Mobile Optimized */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-6 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm md:text-base">
            Subscribe to our newsletter to receive the latest news and updates from Droga Pharma.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 px-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white text-sm"
            />
            <button
              type="submit"
              className="bg-[#FFFF00] text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition text-sm md:text-base whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}