'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link'; 

export default function Home() {
  const [menus, setMenus] = useState([]);
  const [headerInfo, setHeaderInfo] = useState(null);
  const [slideshow, setSlideshow] = useState(null);
  const [categories, setCategories] = useState([]);
  const [welcome, setWelcome] = useState(null);
  const [news, setNews] = useState([]);
  const [clients, setClients] = useState([]);
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // API functions
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  const getMenus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/menus?populate[menus][populate]=*&pagination[pageSize]=100`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching menus:', error);
      return null;
    }
  };

  const getHeaderInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/header-info?populate=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching header info:', error);
      return null;
    }
  };

  const getSlideshow = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/slideshow?populate[slides][populate]=image`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching slideshow:', error);
      return null;
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories?populate=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return null;
    }
  };

  const getWelcome = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/welcome?populate=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching welcome:', error);
      return null;
    }
  };

  const getNews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/news?populate=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      return null;
    }
  };

  const getClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/clients?populate=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return null;
    }
  };

  const getFooter = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/site-footer?populate[branchLocations][populate][0]=phones&populate[branchLocations][populate][1]=emails&populate[footerLinks]=*&populate[socialPlatforms]=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching footer:', error);
      return null;
    }
  };

  // Helper function to extract text from rich text
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [menusData, headerData, slideshowData, categoriesData, welcomeData, newsData, clientsData, footerData] = await Promise.all([
          getMenus(),
          getHeaderInfo(),
          getSlideshow(),
          getCategories(),
          getWelcome(),
          getNews(),
          getClients(),
          getFooter()
        ]);

        if (menusData?.data) setMenus(menusData.data);
        if (headerData?.data) setHeaderInfo(headerData.data);
        if (slideshowData?.data) {
          console.log('✅ Slideshow data:', slideshowData.data);
          setSlideshow(slideshowData.data);
        }
        if (categoriesData?.data) setCategories(categoriesData.data);
        if (welcomeData?.data) setWelcome(welcomeData.data);
        if (newsData?.data) setNews(newsData.data);
        if (clientsData?.data) setClients(clientsData.data);
        if (footerData?.data) setFooter(footerData.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();

    // Scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Menu functions
  const getMainMenus = () => {
    return menus
      .filter(item => !item.attributes.menus?.data?.length)
      .sort((a, b) => a.attributes.order - b.attributes.order);
  };

  const getDropdownItems = (menuId) => {
    return menus.filter(item => item.attributes.menus?.data?.[0]?.id === menuId);
  };

  // Slideshow functions
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideshow.attributes.slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideshow.attributes.slides.length) % slideshow.attributes.slides.length);
  };

  // SINGLE timer useEffect
  useEffect(() => {
    if (!slideshow?.attributes?.slides?.length) return;
    
    console.log('🎬 Setting up slideshow timer for', slideshow.attributes.slides.length, 'slides');
    
    const timerId = setInterval(() => {
      setCurrentSlide(prev => {
        const next = (prev + 1) % slideshow.attributes.slides.length;
        return next;
      });
    }, 5000);
    
    return () => {
      console.log('🧹 Cleaning up timer');
      clearInterval(timerId);
    };
  }, [slideshow]);

  // Reset to first slide when slideshow changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [slideshow]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* TOP YELLOW BAR - Search only from Strapi */}
      <div className="bg-[#FFFF00] py-3 md:py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-end">
            <div className="flex items-center w-full sm:w-80">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white w-full shadow-sm">
                <input 
                  type="text" 
                  placeholder={headerInfo?.attributes?.searchPlaceholder || "Search products..."} 
                  className="px-4 py-2 w-full outline-none text-sm text-gray-700 placeholder-gray-400"
                />
                <button className="bg-white px-4 py-2 text-gray-500 hover:text-gray-700 transition border-l border-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION - Becomes fixed when scrolled */}
      <nav className={`bg-white border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-md py-3' : 'py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo - Dynamic from Strapi */}
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

            {/* Navigation Links - Dynamic from Strapi */}
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
                                className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-[#FFFF00] hover:text-gray-900"
                              >
                                {item.attributes.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <a href={menu.attributes.url} className="text-gray-700 hover:text-[#FFFF00] font-medium text-base">
                        {menu.attributes.title}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Phone Number - Dynamic from Strapi */}
            <div className="text-gray-800 font-bold text-base">
              {headerInfo?.attributes?.phoneNumber || '+251-112-73-45-54'}
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding when navbar is fixed */}
      {isScrolled && <div className="pt-[80px]"></div>}

      {/* SLIDESHOW SECTION - Fixed version */}
      {slideshow?.attributes?.slides?.length > 0 && (
        <div className="relative w-full h-[500px] overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out h-full" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slideshow.attributes.slides.map((slide, index) => (
              <div key={index} className="min-w-full h-full">
                <div className="flex h-full">
                  {/* Left side - Black background with text */}
                  <div className="w-1/2 bg-black h-full flex items-center justify-center p-12">
                    <div className="text-white max-w-lg">
                      <h2 className="text-4xl font-bold mb-6 text-[#FFFF00]">{slide.title}</h2>
                      <p className="text-lg mb-8 leading-relaxed">
                        {Array.isArray(slide.description) 
                          ? slide.description.map(block => 
                              block.children?.map(child => child.text).join(' ') || ''
                            ).join(' ')
                          : slide.description}
                      </p>
                      {slide.buttonText && (
                        <span className="bg-[#FFFF00] text-gray-800 px-6 py-2 rounded-full font-semibold">
                          {slide.buttonText}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Right side - Image */}
                  <div className="w-1/2 h-full relative bg-gray-900">
                    <Image
                      src={slide.image?.data?.attributes?.url ? `${API_URL}${slide.image.data.attributes.url}` : '/placeholder.jpg'}
                      alt={slide.title}
                      fill
                      className="object-contain"
                      priority={index === 0}
                      quality={100}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition z-20"
          >
            ❮
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition z-20"
          >
            ❯
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {slideshow.attributes.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  currentSlide === index ? 'bg-[#FFFF00] w-6' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* PRODUCTS SECTION - White Background */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Products</h2>
          <div className="w-24 h-1 bg-[#FFFF00] mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We offer a wide range of pharmaceutical products, medical equipment, and healthcare solutions to meet your needs.
          </p>
        </div>
      </div>

      {/* WELCOME SECTION - Dynamic from Strapi */}
      {welcome && (
        <div className="bg-[#FFFF00] py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{welcome.attributes.title}</h2>
                <p className="text-gray-800 text-lg leading-relaxed mb-6">{extractText(welcome.attributes.description)}</p>
                <button className="bg-white text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-md">
                  {welcome.attributes.buttonText || 'Learn More'}
                </button>
              </div>
              <div className="w-full md:w-1/2">
                <div className="h-[550px] rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src={welcome.attributes.image?.data?.attributes?.url ? `${API_URL}${welcome.attributes.image.data.attributes.url}` : '/placeholder.jpg'}
                    alt="Welcome"
                    className="w-full h-full object-contain bg-gray-100"
                  />
                </div>
                {welcome.attributes.imageCaption && (
                  <p className="text-xl font-semibold text-gray-800 mt-4 text-center">
                    {welcome.attributes.imageCaption}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEWS SECTION - Dynamic from Strapi */}
      {news.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest News</h2>
              <div className="w-24 h-1 bg-[#FFFF00] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.slice(0, 6).map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="relative h-48">
                    <img 
                      src={item.attributes.image?.data?.attributes?.url ? `${API_URL}${item.attributes.image.data.attributes.url}` : '/placeholder.jpg'}
                      alt={item.attributes.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#FFFF00] text-gray-800 px-3 py-1 rounded-full text-sm font-bold">NEWS</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.attributes.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{extractText(item.attributes.description)}</p>
                    <Link href={`/news/${item.id}`} className="text-[#FFFF00] font-semibold hover:underline">
  Read More →
</Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/news">
  <button className="bg-[#FFFF00] text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition shadow-md">
    View All News
  </button>
</Link>
            </div>
          </div>
        </div>
      )}

      {/* CLIENTS SECTION - Dynamic from Strapi */}
      {clients.length > 0 && (
        <div className="bg-white py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 mb-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Trusted Clients</h2>
              <div className="w-24 h-1 bg-[#FFFF00] mx-auto mb-4"></div>
              <p className="text-gray-600">Partnering with healthcare leaders across Ethiopia and beyond</p>
            </div>
          </div>

          <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee whitespace-nowrap flex py-4">
              {clients.map((client) => (
                <div key={client.id} className="mx-8 flex items-center justify-center">
                  <div className="w-40 h-32 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-gray-100">
                    <img 
                      src={client.attributes.logo?.data?.attributes?.url ? `${API_URL}${client.attributes.logo.data.attributes.url}` : '/placeholder.png'}
                      alt={client.attributes.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex py-4">
              {clients.map((client) => (
                <div key={`dup-${client.id}`} className="mx-8 flex items-center justify-center">
                  <div className="w-40 h-32 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-gray-100">
                    <img 
                      src={client.attributes.logo?.data?.attributes?.url ? `${API_URL}${client.attributes.logo.data.attributes.url}` : '/placeholder.png'}
                      alt={client.attributes.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

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
      )}

      {/* FOOTER */}
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