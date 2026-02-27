'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Footer() {
  const [footer, setFooter] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  useEffect(() => {
    fetchFooter();
  }, []);

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

  if (!footer) return null;

  // Social media icons mapping
  const getSocialIcon = (platform) => {
    const icons = {
      'Facebook': (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
        </svg>
      ),
      'X': (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.44,4.83c-.8.37-1.5.38-2.22.16.93-.56.98-.96,1.32-2.02-.88.52-1.86.9-2.9,1.1-.82-.88-2-1.43-3.3-1.43-2.5,0-4.55,2.05-4.55,4.55,0,.36.04.7.1,1.04-3.8-.2-7.17-2-9.42-4.74-.4.68-.6,1.48-.6,2.32,0,1.6.8,3,2.02,3.82-.74-.02-1.44-.23-2.05-.57v.06c0,2.2,1.56,4.03,3.64,4.44-.38.1-.78.16-1.2.16-.3,0-.58-.03-.86-.08.58,1.8,2.26,3.1,4.24,3.14-1.55,1.22-3.5,1.94-5.62,1.94-.36,0-.72-.02-1.07-.07,2,1.28,4.38,2.03,6.94,2.03,8.33,0,12.88-6.9,12.88-12.88,0-.2,0-.4-.02-.58.88-.64,1.65-1.44,2.26-2.35Z"/>
        </svg>
      ),
      'LinkedIn': (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.45,20.45H16.9V14.9c0-1.3-.02-3-1.82-3-1.82,0-2.1,1.42-2.1,2.9v5.66H9.45V9.4h3.4v1.56h.05c.48-.9,1.64-1.8,3.3-1.8,3.5,0,4.15,2.3,4.15,5.3v6Z"/>
          <rect x="4.4" y="9.4" width="3.6" height="11.05"/>
          <circle cx="6.2" cy="5.5" r="2.05"/>
        </svg>
      ),
      'Instagram': (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.7,4.92,4.92.07,1.27.07,1.64.07,4.85s0,3.58-.07,4.85c-.15,3.22-1.67,4.77-4.92,4.92-1.27.07-1.64.07-4.85.07s-3.58,0-4.85-.07c-3.25-.15-4.77-1.7-4.92-4.92-.07-1.27-.07-1.64-.07-4.85s0-3.58.07-4.85c.15-3.22,1.67-4.77,4.92-4.92,1.27-.07,1.64-.07,4.85-.07M12,0C8.74,0,8.33,0,7.05.07c-4.35.2-6.78,2.62-6.98,6.98C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.36,2.63,6.78,6.98,6.98,1.28.07,1.69.07,4.95.07s3.67,0,4.95-.07c4.35-.2,6.78-2.62,6.98-6.98.07-1.28.07-1.69.07-4.95s0-3.67-.07-4.95c-.2-4.36-2.63-6.78-6.98-6.98C15.67,0,15.26,0,12,0Zm0,5.84c-3.4,0-6.16,2.76-6.16,6.16s2.76,6.16,6.16,6.16,6.16-2.76,6.16-6.16-2.76-6.16-6.16-6.16Zm0,10.16c-2.2,0-4-1.8-4-4s1.8-4,4-4,4,1.8,4,4-1.8,4-4,4Zm6.4-10.4c0,.8-.64,1.44-1.44,1.44-.8,0-1.44-.64-1.44-1.44,0-.8.64-1.44,1.44-1.44.8,0,1.44.64,1.44,1.44Z"/>
        </svg>
      ),
      'YouTube': (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.5,6.4c-.3-1-1-1.8-2-2.1C19.8,3.5,12,3.5,12,3.5s-7.8,0-9.5.8c-1,.3-1.7,1.1-2,2.1-.5,1.6-.5,5-.5,5s0,3.4.5,5c.3,1,1,1.8,2,2.1,1.7.8,9.5.8,9.5.8s7.8,0,9.5-.8c1-.3,1.7-1.1,2-2.1.5-1.6.5-5,.5-5s0-3.4-.5-5Z"/>
          <polygon points="9.5,15.5 15.5,12 9.5,8.5" fill="#FFFF00"/>
        </svg>
      )
    };
    return icons[platform] || null;
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branch Locations */}
          {footer?.attributes?.branchLocations?.map((branch) => (
            <div key={branch.id}>
              <h3 className="font-bold text-xl mb-6 text-[#FFFF00] border-b border-gray-700 pb-2 inline-block">{branch.name}</h3>
              <ul className="space-y-4 text-gray-300 text-sm">
                {branch.phones?.map((phone, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-3 text-[#FFFF00] text-lg">📞</span>
                    <div>
                      <div>{phone.number}</div>
                      {phone.location && <div className="text-xs text-gray-400">{phone.location}</div>}
                    </div>
                  </li>
                ))}
                {branch.emails?.map((email, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-3 text-[#FFFF00] text-lg">📧</span>
                    <div>
                      <div>{email.address}</div>
                      {email.department && <div className="text-xs text-gray-400">{email.department}</div>}
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
          
          {/* Quick Links & Social Media */}
          <div>
            <h3 className="font-bold text-xl mb-6 text-[#FFFF00] border-b border-gray-700 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-4 text-gray-300 text-sm mb-8">
              {footer?.attributes?.footerLinks?.map((link) => (
                <li key={link.id}>
                  <Link href={link.url} className="hover:text-[#FFFF00] transition block">
                    {link.title}
                  </Link>
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
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-[#FFFF00] py-6 w-full">
        <p className="text-gray-800 text-base text-center font-medium">
          {footer?.attributes?.copyrightText || '© 2026 Droga Pharma PLC. All rights reserved.'}
        </p>
      </div>
    </footer>
  );
}