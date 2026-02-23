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
        `${API_URL}/api/products?filters[slug][$eq]=${slug}&populate[category]=*&populate[image]=*`,
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      
      if (response.data?.data?.[0]) {
        const productData = response.data.data[0];
        setProduct(productData);
        
        // Fetch related products from same category
        const categoryId = productData.attributes.category?.data?.id;
        if (categoryId) {
          const relatedResponse = await axios.get(
            `${API_URL}/api/products?filters[category][id][$eq]=${categoryId}&filters[id][$ne]=${productData.id}&populate[image]=*&pagination[limit]=4`,
            { headers: { Authorization: `Bearer ${API_TOKEN}` } }
          );
          if (relatedResponse.data?.data) {
            setRelatedProducts(relatedResponse.data.data);
          }
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
  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!product) return (
    <div className="min-h-screen bg-white">
      <Navigation />
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
      <Navigation />

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
                {product.attributes.description || 'No description available.'}
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

      {/* Footer */}
      {footer && (
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {footer?.attributes?.branchLocations?.map((branch) => (
                <div key={branch.id}>
                  <h3 className="font-bold text-xl mb-6 text-[#FFFF00] border-b border-gray-700 pb-2 inline-block">{branch.name}</h3>
                  <ul className="space-y-4 text-gray-300 text-sm">
                    {branch.phones?.map((phone, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-3 text-[#FFFF00] text-lg">📞</span>
                        <div><div>{phone.number}</div>{phone.location && <div className="text-xs text-gray-400">{phone.location}</div>}</div>
                      </li>
                    ))}
                    {branch.emails?.map((email, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-3 text-[#FFFF00] text-lg">📧</span>
                        <div><div>{email.address}</div>{email.department && <div className="text-xs text-gray-400">{email.department}</div>}</div>
                      </li>
                    ))}
                    <li className="flex items-start"><span className="mr-3 text-[#FFFF00] text-lg">📍</span><span className="leading-relaxed">{branch.address}</span></li>
                  </ul>
                </div>
              ))}
              <div>
                <h3 className="font-bold text-xl mb-6 text-[#FFFF00] border-b border-gray-700 pb-2 inline-block">Quick Links</h3>
                <ul className="space-y-4 text-gray-300 text-sm mb-8">
                  {footer?.attributes?.footerLinks?.map((link) => (
                    <li key={link.id}><Link href={link.url} className="hover:text-[#FFFF00] transition block">{link.title}</Link></li>
                  ))}
                </ul>
                <h4 className="font-semibold mb-4 text-[#FFFF00] text-lg">Follow Us</h4>
                <div className="flex space-x-5">
                  {footer?.attributes?.socialPlatforms?.map((social) => (
                    <a key={social.id} href={social.url} className="text-gray-400 hover:text-[#FFFF00] transition transform hover:scale-110" target="_blank" rel="noopener noreferrer">
                      {social.platform === 'Facebook' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>}
                      {social.platform === 'X' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                      {social.platform === 'LinkedIn' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#FFFF00] py-6 w-full">
            <p className="text-gray-800 text-base text-center font-medium">{footer?.attributes?.copyrightText || '© 2026 Droga Pharma PLC. All rights reserved.'}</p>
          </div>
        </footer>
      )}
    </div>
  );
}