'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navigation from '../../../components/Navigation';

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [footer, setFooter] = useState(null);
  
  const params = useParams();
  const { category, slug } = params;
  
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

useEffect(() => {
  if (slug) {
    fetchProduct();
    fetchFooter();
  }
}, [slug]);
  const fetchProduct = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/products?filters[slug][$eq]=${slug}&populate[category]=*&populate[image]=*&populate[related_products][populate]=image`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );
    
    if (response.data?.data?.[0]) {
      const productData = response.data.data[0];
      setProduct(productData);
      
      // Related products are now in productData.attributes.related_products
      if (productData.attributes.related_products?.data) {
        setRelatedProducts(productData.attributes.related_products.data);
      }
    }
    setLoading(false);
  } catch (error) {
    console.error('Error fetching product:', error);
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

// Helper to extract text from rich text
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
  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!product) return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <Link href="/products" className="bg-[#FFFF00] text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
          Back to Products
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">


      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-[#FFFF00]">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/products" className="hover:text-[#FFFF00]">Products</Link>
            <span className="mx-2">›</span>
            <Link href={`/products/${category}`} className="hover:text-[#FFFF00] capitalize">{category.replace(/-/g, ' ')}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">{product.attributes.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center">
            <div className="relative h-[400px] w-full">
              {product.attributes.image?.data?.attributes?.url ? (
                <Image
                  src={`${API_URL}${product.attributes.image.data.attributes.url}`}
                  alt={product.attributes.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.attributes.name}</h1>
            
            <div className="mb-6">
              <span className="inline-block bg-[#FFFF00] text-gray-800 px-4 py-2 rounded-full text-sm font-semibold">
                {product.attributes.category?.data?.attributes?.name}
              </span>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">
  {extractText(product.attributes.description)}
</p>
            </div>

            <Link
              href="/contact"
              className="inline-block bg-[#FFFF00] text-gray-800 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition transform hover:scale-105"
            >
              Inquire About This Product
            </Link>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.attributes.category?.data?.attributes?.slug}/${item.attributes.slug}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
                    <div className="relative h-48 bg-gray-50">
                      {item.attributes.image?.data?.attributes?.url ? (
                        <Image
                          src={`${API_URL}${item.attributes.image.data.attributes.url}`}
                          alt={item.attributes.name}
                          fill
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 text-center">{item.attributes.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}