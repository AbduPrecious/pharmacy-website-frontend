'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navigation from '../../components/Navigation';

export default function CategoryProductsPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [footer, setFooter] = useState(null);
  
  const params = useParams();
  const categorySlug = params.category;
  
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  useEffect(() => {
    if (categorySlug) {
      fetchCategoryAndProducts();
    }
  }, [categorySlug]);
  useEffect(() => {
  if (categorySlug) {
    fetchCategoryAndProducts();
    fetchFooter();
  }
}, [categorySlug]);

  const fetchCategoryAndProducts = async () => {
    try {
      // First, find the category by slug
      const categoryResponse = await axios.get(
        `${API_URL}/api/categories?filters[slug][$eq]=${categorySlug}`,
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      
      if (categoryResponse.data?.data?.[0]) {
        const categoryData = categoryResponse.data.data[0];
        setCategory(categoryData);
        
        // Then fetch products in this category
        const productsResponse = await axios.get(
          `${API_URL}/api/products?filters[category][id][$eq]=${categoryData.id}&populate[image]=*`,
          { headers: { Authorization: `Bearer ${API_TOKEN}` } }
        );
        
        if (productsResponse.data?.data) {
          setProducts(productsResponse.data.data);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching category products:', error);
      setLoading(false);
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!category) return (
    <div className="min-h-screen bg-white">
      
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Category Not Found</h1>
        <Link href="/products" className="bg-[#FFFF00] text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
          Back to Products
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
    

      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFFF00] to-yellow-300 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-base text-gray-700 mb-4">
            <Link href="/" className="hover:text-gray-900 transition font-medium">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/products" className="hover:text-gray-900 transition font-medium">Products</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-semibold">{category.attributes.name}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">{category.attributes.name}</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {category.attributes.description || `Browse our selection of ${category.attributes.name}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Results Count */}
        <div className="text-gray-600 mb-6">
          Showing {products.length} {products.length === 1 ? 'product' : 'products'}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <p className="text-center text-gray-600 py-12">No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${categorySlug}/${product.attributes.slug}`}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer group">
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {product.attributes.image?.data?.attributes?.url ? (
                      <Image
                        src={`${API_URL}${product.attributes.image.data.attributes.url}`}
                        alt={product.attributes.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#FFFF00] transition">
                      {product.attributes.name}
                    </h3>
                    <div className="inline-flex items-center text-[#FFFF00] font-semibold text-sm">
                      View Product
                      <span className="ml-1">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

               {/* Back to Products */}
        <div className="text-center mt-12">
          <Link href="/products" className="inline-block bg-[#FFFF00] text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition shadow-md">
            ← Back to All Products
          </Link>
        </div>
      </div>
    </div>
  );
}