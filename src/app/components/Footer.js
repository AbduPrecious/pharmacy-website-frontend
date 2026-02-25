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

  return (
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
                  {/* SVG icons here - same as before */}
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
  );
}