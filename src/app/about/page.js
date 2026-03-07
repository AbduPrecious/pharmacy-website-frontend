'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
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
    try {
      const response = await axios.get(
        `${API_URL}/api/about-us?populate[values][populate]=icon&populate[groupCompanies][populate]=logo&populate[partners][populate]=logo&populate[isoCertificates][populate]=image&populate[welcomeImage]=*&populate[missionIcon]=*&populate[visionIcon]=*&populate[leadersImage]=*&populate[leaderFollowImage]=*&populate[milestoneImage]=*&populate[qualityImage]=*`,
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      if (response.data?.data) {
        setAboutData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching about data:', error);
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
                {aboutData.attributes.welcomeImage?.data?.attributes?.url && (
                  <img
                    src={aboutData.attributes.welcomeImage.data.attributes.url}
                    alt="Welcome"
                    className="w-full h-full object-cover"
                  />
                )}
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
                    {value.icon?.data?.attributes?.url && (
                      <img
                        src={value.icon.data.attributes.url}
                        alt={value.title}
                        className="w-full h-full object-contain"
                      />
                    )}
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
                    <img
                      src={aboutData.attributes.missionIcon.data.attributes.url}
                      alt="Mission"
                      className="w-full h-full object-contain"
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
                    <img
                      src={aboutData.attributes.visionIcon.data.attributes.url}
                      alt="Vision"
                      className="w-full h-full object-contain"
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
                  src={aboutData.attributes.qualityImage.data.attributes.url}
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
                      src={aboutData.attributes.leadersImage.data.attributes.url}
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
                      src={aboutData.attributes.leaderFollowImage.data.attributes.url}
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
                        src={cert.image?.data?.attributes?.url || '/placeholder.jpg'}
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
                    src={aboutData.attributes.milestoneImage.data.attributes.url}
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
      {aboutData.attributes.groupCompanies.map((company, index) => {
        // Determine the correct link
        let linkHref = company.website;
        let isExternal = false;
        
        if (company.website === '/Home' || !company.website) {
          linkHref = '/'; // Redirect to homepage
          isExternal = false;
        } else if (company.website?.startsWith('http')) {
          isExternal = true;
        }
        
        const Wrapper = linkHref ? (isExternal ? 'a' : Link) : 'div';
        const wrapperProps = linkHref ? {
          href: linkHref,
          ...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})
        } : {};

        return (
          <Wrapper
            key={index}
            {...wrapperProps}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition border border-gray-100 p-6 flex flex-col items-center group"
          >
            <div className="relative h-32 w-full mb-4">
              {company.logo?.data?.attributes?.url && (
                <img
                  src={company.logo.data.attributes.url}
                  alt={company.name || 'Group company'}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <h3 className="font-semibold text-gray-800 text-center mb-3">{company.name || 'Company'}</h3>
            
            {linkHref && (
              <div className="mt-2">
                {isExternal ? (
                  <span className="inline-flex items-center px-4 py-2 bg-[#FFFF00] text-gray-800 rounded-lg text-sm font-semibold group-hover:bg-yellow-400 transition">
                    Visit Website <span className="ml-1">→</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 bg-[#FFFF00] text-gray-800 rounded-lg text-sm font-semibold group-hover:bg-yellow-400 transition">
                    Visit Website <span className="ml-1">→</span>
                  </span>
                )}
              </div>
            )}
          </Wrapper>
        );
      })}
    </div>
  </div>
)}

        {/* 11. Our Partners - Slideshow with clickable logos */}
{aboutData?.attributes?.partners?.length > 0 && (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Partners</h2>
    <div className="relative overflow-hidden">
      <div className="flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex py-10">
          {aboutData.attributes.partners.map((partner, index) => {
            // Only make clickable if website exists and is valid
            const hasValidLink = partner.website && 
              partner.website !== '#' && 
              partner.website !== '/Home' && 
              partner.website.startsWith('http');
            
            const Wrapper = hasValidLink ? 'a' : 'div';
            const wrapperProps = hasValidLink ? {
              href: partner.website,
              target: "_blank",
              rel: "noopener noreferrer"
            } : {};

            return (
              <Wrapper
                key={index}
                {...wrapperProps}
                className="mx-12 flex items-center justify-center group/partner"
              >
                <div className={`w-64 h-48 bg-white rounded-lg flex items-center justify-center p-6 shadow-xl hover:shadow-2xl transition border border-gray-100 ${hasValidLink ? 'cursor-pointer hover:border-[#FFFF00]' : ''}`}>
                  {partner.logo?.data?.attributes?.url && (
                    <img
                      src={partner.logo.data.attributes.url}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </div>
                {hasValidLink && (
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover/partner:opacity-100 transition">
                    Click to visit
                  </span>
                )}
              </Wrapper>
            );
          })}
        </div>
        
        {/* Duplicate for infinite scroll */}
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex py-10">
          {aboutData.attributes.partners.map((partner, index) => {
            const hasValidLink = partner.website && 
              partner.website !== '#' && 
              partner.website !== '/Home' && 
              partner.website.startsWith('http');
            
            const Wrapper = hasValidLink ? 'a' : 'div';
            const wrapperProps = hasValidLink ? {
              href: partner.website,
              target: "_blank",
              rel: "noopener noreferrer"
            } : {};

            return (
              <Wrapper
                key={`dup-${index}`}
                {...wrapperProps}
                className="mx-12 flex items-center justify-center group/partner"
              >
                <div className={`w-64 h-48 bg-white rounded-lg flex items-center justify-center p-6 shadow-xl hover:shadow-2xl transition border border-gray-100 ${hasValidLink ? 'cursor-pointer hover:border-[#FFFF00]' : ''}`}>
                  {partner.logo?.data?.attributes?.url && (
                    <img
                      src={partner.logo.data.attributes.url}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </div>
                {hasValidLink && (
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover/partner:opacity-100 transition">
                    Click to visit
                  </span>
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </div>
  </div>
)}

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee2 {
            0% { transform: translateX(100%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
          .animate-marquee2 {
            animation: marquee2 40s linear infinite;
          }
          .group:hover .animate-marquee,
          .group:hover .animate-marquee2 {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </div>
  );
}