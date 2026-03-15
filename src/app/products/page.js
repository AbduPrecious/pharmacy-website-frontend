'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Navigation from '../components/Navigation';

// Force no caching for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  
  const productsPerPage = 9;
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    
    const searchParam = searchParams.get('search');
    const noResultsParam = searchParams.get('noresults');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    if (noResultsParam === 'true') {
      setNoResults(true);
    }
  }, [searchParams]);

  // FIXED: Added cache-busting headers
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products?populate[category]=*&populate[image]=*&pagination[pageSize]=100`, {
        headers: { 
          Authorization: `Bearer ${API_TOKEN}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        params: {
          _t: Date.now() // This timestamp prevents URL caching
        }
      });
      if (response.data?.data) {
        console.log('✅ Products fetched fresh:', response.data.data.length);
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`, {
        headers: { 
          Authorization: `Bearer ${API_TOKEN}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        params: {
          _t: Date.now()
        }
      });
      if (response.data?.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.attributes.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.attributes.category?.data?.id === parseInt(selectedCategory)
      );
    }

    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'name-asc':
          return a.attributes.name.localeCompare(b.attributes.name);
        case 'name-desc':
          return b.attributes.name.localeCompare(a.attributes.name);
        case 'newest':
          return new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
    setNoResults(filtered.length === 0);
  };

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, sortBy, searchQuery]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Category Filter and Sort Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-gray-700 font-medium text-sm sm:text-base">Filter:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none text-gray-900 bg-white text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.attributes.name}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-gray-700 font-medium text-sm sm:text-base">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none text-gray-900 bg-white text-sm"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {searchQuery && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-gray-700">
            Showing results for: <span className="font-semibold">"{searchQuery}"</span>
            {filteredProducts.length > 0 && ` (${filteredProducts.length} products found)`}
          </p>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="text-gray-600 mb-6">
          Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} results
        </div>
      )}

      {/* Products Grid or No Results */}
      {currentProducts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Available</h2>
          <p className="text-gray-600 text-lg mb-4">
            {searchQuery 
              ? `No products found matching "${searchQuery}"`
              : 'No products found in this category'}
          </p>
          <p className="text-gray-500 mb-8">Try searching with different keywords or browse our categories.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="bg-[#FFFF00] text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              View All Products
            </Link>
            <Link 
              href="/" 
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.attributes.category?.data?.attributes?.slug || 'uncategorized'}/${product.attributes.slug}`}
              >
                <div 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full group cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100 flex-shrink-0">
                    {product.attributes.image?.data?.attributes?.url ? (
                      <Image
                        src={product.attributes.image?.data?.attributes?.url}
                        alt={product.attributes.name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                        unoptimized={true}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                    {product.attributes.isFeatured && (
                      <div className="absolute top-4 left-4 bg-[#FFFF00] text-gray-800 px-3 py-1 rounded-full text-sm font-semibold z-10">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#FFFF00] transition-colors line-clamp-2">
                      {product.attributes.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {product.attributes.category?.data?.attributes?.name || 'Uncategorized'}
                    </p>
                    
                    {/* SHORT BUTTON */}
                    <div className="mt-auto pt-4">
                      <span className="inline-block bg-[#FFFF00] text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300 hover:shadow-md hover:scale-105">
                        View Product
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-8 md:mt-12">
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white font-medium"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">←</span>
              </button>
              
              <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  
                  if (totalPages > 5) {
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-lg transition font-medium ${
                            currentPage === pageNum
                              ? 'bg-[#FFFF00] text-gray-800'
                              : 'border border-gray-300 hover:bg-gray-50 text-gray-900 bg-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return <span key={i} className="text-gray-500 px-1">...</span>;
                    }
                    return null;
                  } else {
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-lg transition font-medium ${
                          currentPage === pageNum
                            ? 'bg-[#FFFF00] text-gray-800'
                            : 'border border-gray-300 hover:bg-gray-50 text-gray-900 bg-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                })}
              </div>

              <button
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white font-medium"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">→</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div className="p-8 text-center">Loading products...</div>}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}