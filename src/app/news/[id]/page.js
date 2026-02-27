'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navigation from '../../components/Navigation';

export default function NewsDetailPage() {
  const [newsItem, setNewsItem] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const params = useParams();
  const newsId = params.id;
  
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  useEffect(() => {
    if (newsId) {
      fetchNewsItem();
    }
  }, [newsId]);

  const fetchNewsItem = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/news/${newsId}?populate[image]=*&populate[related_articles_v2][populate]=image`,
        {
          headers: { Authorization: `Bearer ${API_TOKEN}` }
        }
      );
      
      console.log('🔍 News ID:', newsId);
      console.log('🔍 Full news data:', response.data);
      console.log('🔍 Image field:', response.data.data?.attributes?.image);
      
      if (response.data?.data) {
        setNewsItem(response.data.data);
        console.log('📸 Full image object:', response.data.data.attributes.image);
        
        // Set related articles from the relation field
        if (response.data.data.attributes.related_articles_v2?.data) {
          setRelatedNews(response.data.data.attributes.related_articles_v2.data);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error.message);
      setLoading(false);
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!newsItem) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">News Not Found</h1>
      <Link href="/news" className="bg-[#FFFF00] text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
        Back to News
      </Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      
      
      {/* Header with Breadcrumb */}
      <div className="bg-gradient-to-r from-[#FFFF00] to-yellow-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-base text-gray-700 mb-4">
            <Link href="/" className="hover:text-gray-900 transition font-medium">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/news" className="hover:text-gray-900 transition font-medium">News</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-semibold">{newsItem.attributes.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {newsItem.attributes.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <span>{formatDate(newsItem.attributes.date)}</span>
            {newsItem.attributes.isFeatured && (
              <span className="bg-[#FFFF00] text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Featured Image - FIXED URL */}
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl mb-10 bg-gray-100">
          {newsItem.attributes.image?.data?.attributes?.url ? (
            <Image
              // FIXED: Using the full URL directly from Strapi
            src={newsItem.attributes.image.data.attributes.url?.startsWith('http') ? newsItem.attributes.image.data.attributes.url : `${API_URL}${newsItem.attributes.image.data.attributes.url}`}
              alt={newsItem.attributes.title}
              fill
              className="object-contain"
              priority
              unoptimized={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500 text-lg">No image available</span>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {/* Description (short preview) */}
          {newsItem.attributes.description && (
            <div className="mb-8 pb-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Summary</h3>
              <div className="text-gray-700 leading-relaxed">
                {extractText(newsItem.attributes.description)}
              </div>
            </div>
          )}
          
          {/* Full Content */}
          {newsItem.attributes.content && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Full Article</h3>
              <div className="text-gray-700 leading-relaxed">
                {extractText(newsItem.attributes.content)}
              </div>
            </div>
          )}
          
          {/* Fallback if both are empty */}
          {!newsItem.attributes.description && !newsItem.attributes.content && (
            <p className="text-gray-500 italic">No content available</p>
          )}
        </div>

        {/* Share Buttons */}
        <div className="border-t border-b border-gray-200 py-6 mb-12">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold">Share this News:</span>
            
            {/* Facebook */}
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#1877F2] transition"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            
            {/* X (Twitter) */}
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(newsItem?.attributes?.title || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            
            {/* LinkedIn */}
            <a 
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(newsItem?.attributes?.title || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#0A66C2] transition"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            
            {/* Email */}
            <a 
              href={`mailto:?subject=${encodeURIComponent(newsItem?.attributes?.title || '')}&body=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <svg className="w-6 h-6 stroke-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Related News - FIXED IMAGE URLS */}
        {relatedNews.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    {item.attributes.image?.data?.attributes?.url && (
                      <div className="relative h-40">
                        <Image
                          // FIXED: Using the full URL directly from Strapi
                         src={item.attributes.image.data.attributes.url?.startsWith('http') ? item.attributes.image.data.attributes.url : `${API_URL}${item.attributes.image.data.attributes.url}`}
                          alt={item.attributes.title}
                          fill
                          className="object-cover"
                          unoptimized={true}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800">{item.attributes.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to News */}
        <div className="text-center mt-12">
          <Link href="/news" className="bg-[#FFFF00] text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
            ← Back to News
          </Link>
        </div>
      </div>
    </div>
  );
}