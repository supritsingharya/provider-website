"use client";

import Link from 'next/link';
import { FaInstagram, FaYoutube, FaLinkedin, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi'; // A clean mail icon

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '/about-us' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  const contactDetails = [
    { 
      name: '+91 73038 31326', 
      href: 'tel:+917303831326', 
      icon: <FaPhoneAlt size={16} />,
      label: 'Call Us'
    },
    { 
      name: '+91 73038 31326', 
      href: 'https://wa.me/917303831326', 
      icon: <FaWhatsapp size={16} />,
      label: 'WhatsApp'
    },
    { 
      name: 'support@dreamprovider.in', 
      href: 'mailto:support@dreamprovider.in', 
      icon: <FiMail size={16} />,
      label: 'Query'
    },
    { 
      name: 'admin@dreamprovider.in', 
      href: 'mailto:admin@dreamprovider.in', 
      icon: <FiMail size={16} />,
      label: 'Collaborate'
    },
  ];

  const socialMedia = [
    { name: 'Instagram', href: 'https://www.instagram.com/providerapp.in/', icon: <FaInstagram size={20} /> },
    { name: 'YouTube', href: 'https://www.youtube.com/channel/UCTUVjKuWrQLVBSJKtovx6BQ', icon: <FaYoutube size={20} /> },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/providerapp/posts/?feedView=all', icon: <FaLinkedin size={20} /> },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Tagline */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dream Provider Pvt Ltd.
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Book your Hostel, Anytime, Anywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-md font-semibold tracking-wider uppercase text-slate-300 mb-4">Company</h5>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="text-md font-semibold tracking-wider uppercase text-slate-300 mb-4">Get in Touch</h5>
            <ul className="space-y-4">
              {contactDetails.map((contact) => (
                <li key={contact.label}>
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-slate-400 hover:text-white transition-colors duration-300 group"
                  >
                    <span className="mr-3 flex-shrink-0">{contact.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 group-hover:text-slate-400">{contact.label}</span>
                      <span>{contact.name}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h5 className="text-md font-semibold tracking-wider uppercase text-slate-300 mb-4">Follow Us</h5>
            <div className="flex space-x-4">
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-3 bg-slate-800 rounded-full text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-sm text-slate-500 mb-4 sm:mb-0">
            © {currentYear} Dream Provider Pvt. Ltd. All Rights Reserved.
          </p>
          {/* You could re-add social links here if desired */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;