'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import Navigation from '../components/Navigation';

export default function AboutNewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/about-us?populate[values][populate]=icon&populate[groupCompanies][populate]=logo&populate[partners][populate]=logo&populate[isoCertificates][populate]=image`,
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      console.log('API Response:', response.data);
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!data) return <div className="p-8 text-center">No data</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">About Us (New Page)</h1>
        
        {/* Values Section - Simple Test */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Values - TEST</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data?.attributes?.values?.map((value, i) => (
              <div key={i} className="border p-4 rounded-lg">
                <div className="h-20 w-20 mx-auto mb-2">
                  {value.icon?.data?.attributes?.url && (
                    <img 
                      src={value.icon.data.attributes.url} 
                      alt={value.title}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <p className="text-center font-bold">{value.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Group Companies */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Group Companies - TEST</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data?.attributes?.groupCompanies?.map((company, i) => (
              <div key={i} className="border p-4 rounded-lg">
                <div className="h-20 w-full mb-2 flex items-center justify-center">
                  {company.logo?.data?.attributes?.url && (
                    <img 
                      src={company.logo.data.attributes.url} 
                      alt={company.name || 'Company'}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Partners - TEST</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {data?.attributes?.partners?.map((partner, i) => (
              <div key={i} className="border p-4 rounded-lg h-24 flex items-center justify-center">
                {partner.logo?.data?.attributes?.url && (
                  <img 
                    src={partner.logo.data.attributes.url} 
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}