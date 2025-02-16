import React from 'react';
import './Homepage.css'

import NavigationBar from '@/mycomponents/NavigationBar'
import Footer from '@/mycomponents/Footer';
import ImageSlider from './ImageSlider';

const Homepage = () => {

  return (
    <>
      <NavigationBar/>
      
      <div className='w-full bg-gray-100'>
        <div className='w-[90%] mx-auto pt-20'>
          <ImageSlider/>
          </div>
        </div>
      <Footer/>
    </>
  )
}

export default Homepage