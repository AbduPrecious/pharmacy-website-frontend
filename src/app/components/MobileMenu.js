'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu({ menus, getDropdownItems, API_URL }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (menuId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-700 hover:text-[#FFFF00] focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 max-h-[80vh] overflow-y-auto">
          <div className="py-2">
            {menus.map((menu) => {
              const dropdownItems = getDropdownItems(menu.id);
              return (
                <div key={menu.id} className="border-b border-gray-100 last:border-0">
                  {dropdownItems.length > 0 ? (
                    <div>
                      {/* Main link with dropdown arrow */}
                      <div className="flex items-center justify-between w-full px-4 py-3">
                        {/* Main link - different handling based on menu type */}
                        {menu.attributes.title === 'Group Companies' || menu.attributes.title === 'R & D' ? (
                          <span className="text-gray-700 font-medium cursor-default">
                            {menu.attributes.title}
                          </span>
                        ) : (
                          <Link
                            href={menu.attributes.title === 'Vacancy' ? '/careers' : menu.attributes.url}
                            className="text-gray-700 font-medium hover:text-[#FFFF00]"
                            onClick={toggleMenu}
                          >
                            {menu.attributes.title}
                          </Link>
                        )}
                        
                        {/* Dropdown arrow - using same ⌵ icon as desktop */}
                        <button
                          onClick={() => toggleDropdown(menu.id)}
                          className="p-1 text-gray-800 hover:text-[#FFFF00] focus:outline-none"
                        >
                          <span className={`text-sm font-extrabold transform transition-transform inline-block ${openDropdowns[menu.id] ? 'rotate-180' : ''}`}>
                            ⌵
                          </span>
                        </button>
                      </div>
                      
                      {/* Dropdown items */}
                      {openDropdowns[menu.id] && (
                        <div className="bg-gray-50 py-1">
                          {menu.attributes.title === 'Vacancy' ? (
                            // For Vacancy, show the jobs link
                            <Link
                              href="/careers"
                              className="block px-8 py-2 text-sm text-gray-600 hover:text-[#FFFF00]"
                              onClick={toggleMenu}
                            >
                              View Jobs
                            </Link>
                          ) : (
                            // For other dropdowns, show all dropdown items
                            dropdownItems.map((item) => (
                              <Link
                                key={item.id}
                                href={item.attributes.url}
                                className="block px-8 py-2 text-sm text-gray-600 hover:text-[#FFFF00]"
                                onClick={toggleMenu}
                              >
                                {item.attributes.title}
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    // No dropdown - simple link
                    <Link
                      href={menu.attributes.url === '/vacancy' ? '/careers' : menu.attributes.url}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium"
                      onClick={toggleMenu}
                    >
                      {menu.attributes.title}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}