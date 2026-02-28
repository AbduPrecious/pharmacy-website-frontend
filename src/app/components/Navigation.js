'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import MobileMenu from './MobileMenu';

export default function Navigation() {
  const [menus, setMenus] = useState([]);
  const [headerInfo, setHeaderInfo] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // ... search logic
  };

  const isHomePage = pathname === '/';

  return (
    <>
      {/* TOP YELLOW BAR */}
      {!isScrolled && isHomePage && (
        <div className="hidden md:block bg-[#FFFF00] py-2">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-end">
              <form onSubmit={handleSearch} className="flex items-center w-64">
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white w-full">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={headerInfo?.attributes?.searchPlaceholder || "Search products..."} 
                    className="px-3 py-1.5 w-full outline-none text-sm text-gray-700"
                  />
                  <button 
                    type="submit"
                    className="bg-white px-3 py-1.5 text-gray-500 hover:text-gray-700 transition border-l border-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MAIN NAVIGATION */}
      <nav className={`bg-white border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-md py-2' : 'py-3'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo - SMALLER SIZE */}
            <div className="flex items-center">
              {headerInfo?.attributes?.logo?.data?.attributes?.url ? (
                <div className="relative" style={{ height: '40px', width: 'auto' }}>
                  <Image 
                    src={headerInfo.attributes.logo.data.attributes.url.startsWith('http') 
                      ? headerInfo.attributes.logo.data.attributes.url 
                      : `${API_URL}${headerInfo.attributes.logo.data.attributes.url}`}
                    alt="Droga Pharma" 
                    width={120}
                    height={40}
                    className="h-[40px] w-auto object-contain"
                    unoptimized={true}
                    priority
                  />
                </div>
              ) : (
                <div className="text-xl font-bold">DROGA</div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-5 lg:space-x-6">
              {getMainMenus().map((menu) => {
                const dropdownItems = getDropdownItems(menu.id);
                return (
                  <div key={menu.id} className="relative group">
                    {dropdownItems.length > 0 ? (
                      <div className="flex items-center">
                        {menu.attributes.title === 'Group Companies' || menu.attributes.title === 'R & D' ? (
                          <span className="text-gray-700 text-sm lg:text-base font-medium cursor-default">
                            {menu.attributes.title}
                          </span>
                        ) : (
                          <Link 
                            href={menu.attributes.title === 'Vacancy' ? '/careers' : menu.attributes.url}
                            className="text-gray-700 text-sm lg:text-base font-medium hover:text-[#FFFF00] transition-colors"
                          >
                            {menu.attributes.title}
                          </Link>
                        )}
                        <span className="ml-1 text-xs text-gray-800">⌵</span>
                        
                        <div className="absolute top-full left-0 mt-1 w-40 bg-white shadow-lg rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                          <div className="py-1">
                            {dropdownItems.map((item) => (
                              <Link 
                                key={item.id}
                                href={item.attributes.url}
                                className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-[#FFFF00] hover:text-gray-900"
                              >
                                {item.attributes.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link 
                        href={menu.attributes.url} 
                        className="text-gray-700 text-sm lg:text-base font-medium hover:text-[#FFFF00] transition-colors"
                      >
                        {menu.attributes.title}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Phone Number */}
            <div className="hidden md:block text-gray-800 font-semibold text-sm">
              {headerInfo?.attributes?.phoneNumber || '+251-112-73-45-54'}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <MobileMenu 
                menus={getMainMenus()} 
                getDropdownItems={getDropdownItems}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      {isScrolled && <div className="h-[60px]"></div>}
    </>
  );
}