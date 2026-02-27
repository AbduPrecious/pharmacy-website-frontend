'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import Navigation from '../../components/Navigation';
import Accordion from '../../components/Accordion';

export default function WhatWeDoPage() {
  const [pageData, setPageData] = useState(null);
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  useEffect(() => {
    fetchData();
    fetchFooter();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/what-we-do?populate[rdImage]=*&populate[grantItems][populate]=image`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      if (response.data?.data) {
        setPageData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  return (
    <div className="min-h-screen bg-white">
    
      {/* Header with Breadcrumb */}
      <div className="bg-[#FFFF00] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-base text-gray-600 mb-3 text-center">
            <Link href="/" className="hover:text-gray-900 transition font-medium">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/rd" className="hover:text-gray-900 transition font-medium">R & D</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-semibold">What We Do</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-800 text-center">
            {pageData?.attributes?.pageTitle || 'What We Do'}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        
        {/* Droga Pharma Research & Development Section - CENTERED */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            {pageData?.attributes?.rdTitle || 'Droga Pharma Research & Development'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {extractText(pageData?.attributes?.rdDescription)}
          </p>
          {pageData?.attributes?.rdImage?.data?.attributes?.url && (
            <div className="relative h-[500px] w-full rounded-lg overflow-hidden shadow-xl mx-auto">
              <Image
                // FIXED: Using the full URL directly from Strapi
              src={pageData.attributes.rdImage.data.attributes.url?.startsWith('http') ? pageData.attributes.rdImage.data.attributes.url : `${API_URL}${pageData.attributes.rdImage.data.attributes.url}`}
                alt="Research & Development"
                fill
                className="object-contain"
                quality={100}
                unoptimized={true}
              />
            </div>
          )}
        </div>
        
        {/* DROGA RESEARCH GRANT Accordion Section */}
        {pageData?.attributes?.grantItems?.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">DROGA RESEARCH GRANT</h2>
            <Accordion items={pageData.attributes.grantItems} apiUrl={API_URL} />
          </div>
        )}

      </div>
    </div>
  );
}