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
    ).join('\n'); // Join with newlines to preserve structure
  }
  return '';
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setFormStatus(null), 3000);
    }, 1500);
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
      <Navigation />

      {/* Header with Breadcrumb */}
      <div className="bg-gradient-to-r from-[#FFFF00] to-yellow-300 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-base text-gray-700 mb-4 text-center">
            <Link href="/" className="hover:text-gray-900 transition font-medium">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-semibold">Contact</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-800 text-center mb-4">
            {contactData?.attributes?.pageTitle || 'Get In Touch'}
          </h1>
          <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto">
            We'd love to hear from you! Reach out with any questions, feedback, or collaboration ideas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
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
          {/* Card 3 */}
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
            </form>
          </div>

          {/* Google Maps */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Location</h2>
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <iframe
                src={contactData?.attributes?.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.83523456789!2d38.763456!3d9.012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDAnNDQuNCJOIDM4wrA0NSc0OC4zIkU!5e0!3m2!1sen!2set!4v1234567890'}
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

      {/* Footer */}
      {footer && (
        <footer className="bg-gray-900 text-white mt-20">
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

              <div>
                <h3 className="font-bold text-xl mb-6 text-[#FFFF00] border-b border-gray-700 pb-2 inline-block">Quick Links</h3>
                <ul className="space-y-4 text-gray-300 text-sm mb-8">
                  {footer?.attributes?.footerLinks?.map((link) => (
                    <li key={link.id}>
                      <Link href={link.url} className="hover:text-[#FFFF00] transition block">{link.title}</Link>
                    </li>
                  ))}
                </ul>
                <h4 className="font-semibold mb-4 text-[#FFFF00] text-lg">Follow Us</h4>
                <div className="flex space-x-5">
                  {footer?.attributes?.socialPlatforms?.map((social) => (
                    <a key={social.id} href={social.url} className="text-gray-400 hover:text-[#FFFF00] transition transform hover:scale-110" target="_blank" rel="noopener noreferrer">
                      {social.platform === 'Facebook' && (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                      )}
                      {social.platform === 'X' && (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      )}
                      {social.platform === 'LinkedIn' && (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
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