'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import Navigation from '../components/Navigation';

export default function ContactPage() {
  const [contactData, setContactData] = useState(null);
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  useEffect(() => {
    fetchData();
    fetchFooter();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/contact-info?populate[faqItems]=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      if (response.data?.data) {
        setContactData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contact data:', error);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Helper to extract plain text with line breaks preserved
  const getPlainText = (richText) => {
    if (!richText) return '';
    if (typeof richText === 'string') return richText;
    if (Array.isArray(richText)) {
      return richText.map(block => 
        block.children?.map(child => child.text).join('') || ''
      ).join('\n');
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    try {
      const contactData = {
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message
        }
      };
      
      console.log('📦 Sending contact data:', JSON.stringify(contactData, null, 2));
      
      const response = await axios.post(`${API_URL}/api/contacts`, contactData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Contact form submitted:', response.data);
      setFormStatus('success');
      
      // Reset form
      setFormData({
        name: '', email: '', phone: '', subject: '', message: ''
      });
      
      setTimeout(() => setFormStatus(null), 5000);
      
    } catch (error) {
      console.error('❌ Full error object:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Error details:', error.response?.data?.error?.details);
      
      if (error.response?.data?.error?.message) {
        alert(`Error: ${error.response.data.error.message}`);
        console.error('❌ Strapi message:', error.response.data.error.message);
      }
      
      if (error.response?.data?.error?.details?.errors) {
        console.error('❌ Validation errors:', error.response.data.error.details.errors);
        alert('Validation errors: ' + JSON.stringify(error.response.data.error.details.errors));
      }
      
      setFormStatus('error');
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
      <div className="bg-gradient-to-r from-[#FFFF00] to-yellow-300 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-base text-gray-700 mb-4 text-center">
            <Link href="/" className="hover:text-gray-900 transition font-medium">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-semibold">Contact</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-800 text-center mb-4">
            {contactData?.attributes?.pageTitle || 'Contact Us'}
          </h1>
          <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto">
            We'd love to hear from you! Reach out with any questions, feedback, or collaboration ideas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 - Visit Us */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-[#FFFF00] rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-3xl">{contactData?.attributes?.card1Icon || '📍'}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {contactData?.attributes?.card1Title || 'Visit Us'}
            </h3>
            <div className="text-gray-600 text-center leading-relaxed">
              {extractText(contactData?.attributes?.card1Details) || 
                'Gulele Subcity, Addis Ababa, Ethiopia\nNew/Droga Building'}
            </div>
          </div>

          {/* Card 2 - Call Us */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-[#FFFF00] rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-3xl">{contactData?.attributes?.card2Icon || '📞'}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {contactData?.attributes?.card2Title || 'Call Us'}
            </h3>
            <div className="text-gray-600 text-center leading-relaxed">
              {contactData?.attributes?.card2Details ? (
                <div className="space-y-2">
                  {getPlainText(contactData.attributes.card2Details).split('\n').map((line, i) => (
                    line.trim() && <p key={i}>{line}</p>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <p>+251 112 734 554</p>
                  <p>+251 913 667 537</p>
                  <p>+251 912 345 678 (24/7 Support)</p>
                </div>
              )}
            </div>
          </div>

          {/* Card 3 - Email Us */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-[#FFFF00] rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-3xl">{contactData?.attributes?.card3Icon || '✉️'}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {contactData?.attributes?.card3Title || 'Email Us'}
            </h3>
            <div className="text-gray-600 text-center leading-relaxed">
              {extractText(contactData?.attributes?.card3Details) || 
                'info@drogapharma.com\npharmadroga@gmail.com'}
            </div>
          </div>
        </div>

        {/* Contact Form & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                    placeholder="+251 912 345 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                    placeholder="Inquiry about..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition resize-none text-gray-900 bg-white"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full bg-[#FFFF00] text-gray-800 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              {formStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                  Error sending message. Please try again.
                </div>
              )}
            </form>
          </div>

          {/* Google Maps */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Location</h2>
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <iframe
                src={contactData?.attributes?.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d600.2417299918443!2d38.725142!3d9.059361!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b891708d5e70b%3A0xf05afa9df59c924e!2sDroga%20Group%20Companies!5e1!3m2!1sen!2set!4v1771573775837!5m2!1sen!2set'}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {contactData?.attributes?.faqItems?.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {contactData.attributes.faqItems.map((item, index) => (
                <details key={index} className="group bg-white rounded-lg shadow-md hover:shadow-lg transition">
                  <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-gray-800">
                    <span>{item.question}</span>
                    <span className="text-[#FFFF00] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {extractText(item.answer)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Business Hours */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Business Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#FFFF00] mb-4">Monday - Friday</h3>
              <p className="text-xl">8:00 AM - 5:30 PM</p>
            </div>
            <div className="p-6 border-x border-gray-700">
              <h3 className="text-2xl font-bold text-[#FFFF00] mb-4">Saturday</h3>
              <p className="text-xl">8:00 AM - 12:30 PM</p>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#FFFF00] mb-4">Sunday</h3>
              <p className="text-xl">Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}