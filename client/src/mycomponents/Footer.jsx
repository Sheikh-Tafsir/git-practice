import React, {useState, useEffect} from 'react'
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {

  useEffect(() => {
    const componentSlide = () => {
      var sectionId = window.location.hash.substring(1);
    
      // Check if the section ID exists and corresponds to an element on the page
      if (sectionId) {
        var targetSection = document.getElementById(sectionId);
    
        // Scroll to the target section smoothly
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'auto'
          });
        }
      }
    }

    setTimeout(() => {
      componentSlide();
    }, 150);
  }, []);

  return (
    <footer className="text-gray-300 bg-blue-900">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            {/* <h2 className="text-2xl font-bold mb-4">বিশ্বনাথ পৌরসভা</h2> */}
            <div className='flex mb-4'>
              <img src="/navbar/icon3.png" className="h-12 w-12" alt="logo"/>
              <p className='text-white my-auto ml-2 text-3xl'>Aspire</p>
            </div>
            <p className="text-sm">
              description
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#service" className="hover:text-white transition-colors">
                  Service
                </a>
              </li>
              <li>
                <a href="/#gallery" className="hover:text-white transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/#contacts" className="hover:text-white transition-colors">
                  Contacts
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Social Media</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={24} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube size={24} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">For the latest news stay with us</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="text-black border-gray-700 focus:border-gray-600"
                value="190041130tafsir@gmail.com"
                disabled={true}
              />
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Aspire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;