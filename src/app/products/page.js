'use client';
import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

// Products content component
function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products?populate[image]=*&populate[category]=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4">
            {product.attributes.image?.data?.attributes?.url && (
              <div className="relative h-48 mb-4">
                <Image
                  src={product.attributes.image.data.attributes.url}
                  alt={product.attributes.name}
                  fill
                  className="object-contain"
                  unoptimized={true}
                />
              </div>
            )}
            <h2 className="text-xl font-semibold">{product.attributes.name}</h2>
            <p className="text-gray-600">{product.attributes.category?.data?.attributes?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main page
export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}