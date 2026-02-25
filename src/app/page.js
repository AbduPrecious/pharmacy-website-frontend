'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from './components/Navigation';  // 👈 ADD THIS LINE

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

  // ... rest of your code remains exactly the same ...

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
      
      

      {/* Add padding when navbar is fixed */}
      {isScrolled && <div className="pt-[80px]"></div>}

      {/* SLIDESHOW SECTION */}
{slideshow?.attributes?.slides?.length > 0 && (
  <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
    <div 
      className="flex transition-transform duration-700 ease-in-out h-full" 
      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
    >
      {slideshow.attributes.slides.map((slide, index) => (
        <div key={index} className="min-w-full h-full">
          <div className="flex flex-col md:flex-row h-full">
            {/* Text section - full width on mobile, half on desktop */}
            <div className="w-full md:w-1/2 bg-black h-[200px] md:h-full flex items-center justify-center p-4 md:p-12">
              <div className="text-white text-center md:text-left">
                <h2 className="text-xl md:text-4xl font-bold mb-2 md:mb-6 text-[#FFFF00]">{slide.title}</h2>
                <p className="text-xs md:text-lg mb-2 md:mb-8 line-clamp-3 md:line-clamp-none">
                  {slide.description.map(block => 
                    block.children?.map(child => child.text).join(' ') || ''
                  ).join(' ')}
                </p>
                {slide.buttonText && (
                  <span className="bg-[#FFFF00] text-gray-800 px-3 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-base font-semibold">
                    {slide.buttonText}
                  </span>
                )}
              </div>
            </div>
            {/* Image section - full width on mobile, half on desktop */}
            <div className="w-full md:w-1/2 h-[200px] md:h-full relative bg-gray-900">
              <Image
                src={slide.image?.data?.attributes?.url ? `${API_URL}${slide.image.data.attributes.url}` : '/placeholder.jpg'}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                quality={100}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* Navigation Arrows - hide on mobile */}
    <button onClick={prevSlide} className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition z-20">❮</button>
    <button onClick={nextSlide} className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition z-20">❯</button>

    {/* Dots - visible on all devices */}
    <div className="absolute bottom-2 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-20">
      {slideshow.attributes.slides.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition ${
            currentSlide === index ? 'bg-[#FFFF00] w-4 md:w-6' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
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
    <p className="text-gray-600 max-w-3xl mx-auto mb-10">
      We offer a wide range of pharmaceutical products, medical equipment, and healthcare solutions to meet your needs.
    </p>
    
    {/* BROWSE PRODUCTS BUTTON with icon */}
<Link href="/products">
  <button className="group bg-[#FFFF00] text-gray-800 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition transform hover:scale-105 shadow-md inline-flex items-center gap-2">
    Browse All Products
    <span className="group-hover:translate-x-1 transition-transform">→</span>
  </button>
</Link>
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
                <Link href="/about">
  <button className="bg-white text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-md">
    {welcome.attributes.buttonText || 'Learn More'}
  </button>
</Link>
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

    </div>
  );
}