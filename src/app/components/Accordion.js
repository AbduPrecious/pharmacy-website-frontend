'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Accordion({ items, apiUrl }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
{/* Accordion Header */}
<button
  onClick={() => toggleItem(index)}
  className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center group border-l-4 border-[#FFFF00]"
>
  <span className="font-semibold text-gray-800 text-lg">{item.title}</span>
  
  {/* Icon with helper text */}
  <div className="flex items-center gap-2">
    <span className="text-sm text-gray-500 hidden sm:inline">
      {openIndex === index ? 'Click to close' : 'Click to expand'}
    </span>
    <svg
      className={`w-6 h-6 text-[#FFFF00] bg-gray-800 rounded-full p-1 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</button>
          {/* Accordion Content - REPLACE THIS ENTIRE SECTION */}
          {openIndex === index && (
            <div className="p-6 border-t border-gray-200">
              {/* Image FIRST (if exists) */}
              {item.hasImage && item.image?.data?.attributes?.url && (
                <div className="mb-6">
                  <div className="relative h-[500px] w-full rounded-lg overflow-hidden bg-gray-100 shadow-lg">
                    <Image
                      src={`${apiUrl}${item.image.data.attributes.url}`}
                      alt={item.title}
                      fill
                      className="object-contain"
                      quality={100}
                    />
                  </div>
                </div>
              )}
              
              {/* Description AFTER image */}
              <div className="text-gray-700 leading-relaxed">
                {extractText(item.description)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}