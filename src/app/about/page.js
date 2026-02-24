'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { getAboutUs } from '../../../lib/strapi';
import Navigation from '../components/Navigation'; 

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  useEffect(() => {
    fetchAboutData();
    fetchFooter();
  }, []);

  const fetchAboutData = async () => {
    const data = await getAboutUs();
    if (data?.data) {
      setAboutData(data.data);
    }
    setLoading(false);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Component */}
      <Navigation />
      
      {/* Header with Breadcrumb */}
      <div className="bg-[#FFFF00] py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb - Centered */}
          <div className="text-base text-gray-600 mb-3 text-center">
            <Link href="/" className="hover:text-gray-900 transition font-medium">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-semibold">About Us</span>
          </div>
          
          {/* Title - Centered */}
          <h1 className="text-6xl font-bold text-gray-800 text-center">About Us</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        
       {/* 1. Welcome Section with Image */}
{aboutData?.attributes?.welcomeTitle && (
  <div>
    {/* Centered Title */}
    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">
      {aboutData.attributes.welcomeTitle}
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <p className="text-lg text-gray-700 leading-relaxed">
          {extractText(aboutData.attributes.welcomeDescription)}
        </p>
      </div>
      <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
        <Image
          src={aboutData.attributes.welcomeImage?.data?.attributes?.url ? `${API_URL}${aboutData.attributes.welcomeImage.data.attributes.url}` : '/placeholder.jpg'}
          alt="Welcome"
          fill
          className="object-cover"
        />
      </div>
    </div>
  </div>
)}

        {/* 2. Our Values */}
        {aboutData?.attributes?.values?.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aboutData.attributes.values.map((value, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition border-t-4 border-[#FFFF00]">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <Image
                      src={value.icon?.data?.attributes?.url ? `${API_URL}${value.icon.data.attributes.url}` : '/placeholder.jpg'}
                      alt={value.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{extractText(value.description)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3 & 4. Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {aboutData?.attributes?.missionTitle && (
            <div className="bg-gray-50 p-8 rounded-lg border-t-4 border-[#FFFF00]">
              <div className="flex items-center gap-4 mb-4">
                {aboutData.attributes.missionIcon?.data?.attributes?.url && (
                  <div className="relative w-12 h-12">
                    <Image
                      src={`${API_URL}${aboutData.attributes.missionIcon.data.attributes.url}`}
                      alt="Mission"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-800">{aboutData.attributes.missionTitle}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {extractText(aboutData.attributes.missionDescription)}
              </p>
            </div>
          )}
          {aboutData?.attributes?.visionTitle && (
            <div className="bg-gray-50 p-8 rounded-lg border-t-4 border-[#FFFF00]">
              <div className="flex items-center gap-4 mb-4">
                {aboutData.attributes.visionIcon?.data?.attributes?.url && (
                  <div className="relative w-12 h-12">
                    <Image
                      src={`${API_URL}${aboutData.attributes.visionIcon.data.attributes.url}`}
                      alt="Vision"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-800">{aboutData.attributes.visionTitle}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {extractText(aboutData.attributes.visionDescription)}
              </p>
            </div>
          )}
        </div>

        {/* 5. Quality Policy - Full width with little gaps (NO TITLE) */}
        {aboutData?.attributes?.qualityImage?.data?.attributes?.url && (
          <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
              <div className="relative w-full overflow-x-auto">
                <img
                  src={`${API_URL}${aboutData.attributes.qualityImage.data.attributes.url}`}
                  alt="Quality Policy"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* 6 & 7. Leaders Images - Perfectly stacked (NO GAP) */}
        {(aboutData?.attributes?.leadersImage?.data?.attributes?.url || aboutData?.attributes?.leaderFollowImage?.data?.attributes?.url) && (
          <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
            {aboutData?.attributes?.leadersImage?.data?.attributes?.url && (
              <div className="bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <div className="relative w-full overflow-hidden">
                    <img
                      src={`${API_URL}${aboutData.attributes.leadersImage.data.attributes.url}`}
                      alt="Our Leaders"
                      className="w-full h-auto object-contain block"
                      style={{ display: 'block', marginBottom: '-4px' }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {aboutData?.attributes?.leaderFollowImage?.data?.attributes?.url && (
              <div className="bg-gray-100" style={{ marginTop: '-4px' }}>
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <div className="relative w-full overflow-hidden">
                    <img
                      src={`${API_URL}${aboutData.attributes.leaderFollowImage.data.attributes.url}`}
                      alt="Leadership Team"
                      className="w-full h-auto object-contain block"
                      style={{ display: 'block', marginTop: '-4px' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. ISO Certificates - Side by side with little gaps */}
        {aboutData?.attributes?.isoCertificates?.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">ISO Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {aboutData.attributes.isoCertificates.map((cert, index) => (
                <div key={index} className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
                  <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                    <div className="relative w-full overflow-x-auto">
                      <img
                        src={cert.image?.data?.attributes?.url ? `${API_URL}${cert.image.data.attributes.url}` : '/placeholder.jpg'}
                        alt={cert.title || 'ISO Certificate'}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    {cert.title && (
                      <div className="text-center mt-4 text-gray-700 font-medium">
                        {cert.title}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. Our Journey - Full width with little gaps */}
        {aboutData?.attributes?.milestoneImage?.data?.attributes?.url && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Journey</h2>
            <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gray-100">
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <div className="relative w-full overflow-x-auto">
                  <img
                    src={`${API_URL}${aboutData.attributes.milestoneImage.data.attributes.url}`}
                    alt="Our Journey"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. Group Companies - Side by side grid */}
        {aboutData?.attributes?.groupCompanies?.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Droga Group Companies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aboutData.attributes.groupCompanies.map((company, index) => (
                <a 
                  key={index}
                  href={company.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition border border-gray-100 p-6 flex flex-col items-center"
                >
                  <div className="relative h-32 w-full mb-4">
                    <Image
                      src={company.logo?.data?.attributes?.url ? `${API_URL}${company.logo.data.attributes.url}` : '/placeholder.png'}
                      alt={company.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-center">{company.name}</h3>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 11. Our Partners - Slideshow with HUGE images */}
        {aboutData?.attributes?.partners?.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Partners</h2>
            <div className="relative overflow-hidden">
              <div className="flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex py-10">
                  {aboutData.attributes.partners.map((partner, index) => (
                    <a 
                      key={index}
                      href={partner.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-12 flex items-center justify-center"
                    >
                      <div className="w-64 h-48 bg-white rounded-lg flex items-center justify-center p-6 shadow-xl hover:shadow-2xl transition border border-gray-100">
                        <Image
                          src={partner.logo?.data?.attributes?.url ? `${API_URL}${partner.logo.data.attributes.url}` : '/placeholder.png'}
                          alt={partner.name}
                          width={220}
                          height={160}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </a>
                  ))}
                </div>
                <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex py-10">
                  {aboutData.attributes.partners.map((partner, index) => (
                    <a 
                      key={`dup-${index}`}
                      href={partner.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-12 flex items-center justify-center"
                    >
                      <div className="w-64 h-48 bg-white rounded-lg flex items-center justify-center p-6 shadow-xl hover:shadow-2xl transition border border-gray-100">
                        <Image
                          src={partner.logo?.data?.attributes?.url ? `${API_URL}${partner.logo.data.attributes.url}` : '/placeholder.png'}
                          alt={partner.name}
                          width={220}
                          height={160}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
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
                  <h3 className="font-bold text-xl mb-6 text-[#FFFF00] border-b border-gray-700 pb-2 inline-block">
                    {branch.name}
                  </h3>
                  <ul className="space-y-4 text-gray-300 text-sm">
                    {branch.phones?.map((phone, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-3 text-[#FFFF00] text-lg">📞</span>
                        <div>
                          <div>{phone.number}</div>
                          {phone.location && (
                            <div className="text-xs text-gray-400">{phone.location}</div>
                          )}
                        </div>
                      </li>
                    ))}
                    
                    {branch.emails?.map((email, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-3 text-[#FFFF00] text-lg">📧</span>
                        <div>
                          <div>{email.address}</div>
                          {email.department && (
                            <div className="text-xs text-gray-400">{email.department}</div>
                          )}
                        </div>
                      </li>
                    ))}
                    
                    <li className="flex items-start">
                      <span className="mr-3 text-[#FFFF00] text-lg">📍</span>
                      <span className="leading-relaxed">{branch.address}</span>
                    </li>
                  </ul>
                </div>
              ))}

              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-xl mb-6 text-[#FFFF00] border-b border-gray-700 pb-2 inline-block">
                  Quick Links
                </h3>
                <ul className="space-y-4 text-gray-300 text-sm mb-8">
                  {footer?.attributes?.footerLinks?.map((link) => (
                    <li key={link.id}>
                      <a href={link.url} className="hover:text-[#FFFF00] transition block">
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
                
                <h4 className="font-semibold mb-4 text-[#FFFF00] text-lg">Follow Us</h4>
                <div className="flex space-x-5">
                  {footer?.attributes?.socialPlatforms?.map((social) => (
                    <a 
                      key={social.id}
                      href={social.url}
                      className="text-gray-400 hover:text-[#FFFF00] transition transform hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.platform === 'Facebook' && (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                        </svg>
                      )}
                      {social.platform === 'X' && (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      )}
                      {social.platform === 'LinkedIn' && (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#FFFF00] py-6 w-full">
            <p className="text-gray-800 text-base text-center font-medium">
              {footer?.attributes?.copyrightText || '© 2026 Droga Pharma PLC. All rights reserved.'}
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}