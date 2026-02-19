'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Navigation() {
  const [menus, setMenus] = useState([]);
  const [headerInfo, setHeaderInfo] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  useEffect(() => {
    fetchMenus();
    fetchHeaderInfo();
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/menus?populate[menus][populate]=*&pagination[pageSize]=100`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      if (response.data?.data) setMenus(response.data.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const fetchHeaderInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/header-info?populate=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      if (response.data?.data) setHeaderInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching header info:', error);
    }
  };

  const getMainMenus = () => {
    return menus
      .filter(item => !item.attributes.menus?.data?.length)
      .sort((a, b) => a.attributes.order - b.attributes.order);
  };

  const getDropdownItems = (menuId) => {
    return menus.filter(item => item.attributes.menus?.data?.[0]?.id === menuId);
  };

  return (
    <>
    

      {/* MAIN NAVIGATION */}
      <nav className={`bg-white border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-md py-3' : 'py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center">
              {headerInfo?.attributes?.logo?.data?.attributes?.url ? (
                <img 
                  src={`${API_URL}${headerInfo.attributes.logo.data.attributes.url}`} 
                  alt="Droga Pharma" 
                  className="h-10 w-auto"
                />
              ) : (
                <div className="text-2xl font-bold">DROGA</div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6 flex-wrap justify-center">
              {getMainMenus().map((menu) => {
                const dropdownItems = getDropdownItems(menu.id);
                return (
                  <div key={menu.id} className="relative group">
                    {dropdownItems.length > 0 ? (
                      <>
                        <button className="text-gray-700 hover:text-[#FFFF00] font-medium flex items-center text-base">
                          {menu.attributes.title} 
                          <span className="ml-1 text-sm font-extrabold text-gray-800">⌵</span>
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                          <div className="py-1">
    {dropdownItems.map((item) => (
  <a 
    key={item.id}
    href={item.attributes.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-[#FFFF00] hover:text-gray-900"
    onClick={(e) => {
      // Allow the default link behavior to handle the navigation
      // We don't need to do anything special here
    }}
  >
    {item.attributes.title}
  </a>
))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link href={menu.attributes.url} className="text-gray-700 hover:text-[#FFFF00] font-medium text-base">
                        {menu.attributes.title}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Phone Number */}
            <div className="text-gray-800 font-bold text-base">
              {headerInfo?.attributes?.phoneNumber || '+251-112-73-45-54'}
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding when navbar is fixed */}
      {isScrolled && <div className="pt-[80px]"></div>}
    </>
  );
}