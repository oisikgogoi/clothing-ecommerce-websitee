import  { useState , lazy, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { NavLink } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { useRecoilState } from 'recoil';
import { allItemsState } from '../states/atom';


const Card = lazy(() => import( '../components/Card'));

export default function Home() {


  const [allItems , setAllItems] = useRecoilState(allItemsState)
  const [featuredItems, setFeaturedItems] = useState([]);
  const [exploreMoreItems , setExploreMoreItems] = useState([])

  const HeaderImages = [
    { src: "/headerBg3.avif", alt: "Left Image" },
    { src: "/headerBg6.jpg", alt: "Middle Image" },
    { src: "/headerBg1.avif", alt: "Right Image" },
  ];


  
  useEffect(()=>{
    if (allItems && allItems.length > 0) {
      const newFeatured = allItems.filter(item => item.isNew === true); 
      setFeaturedItems(newFeatured); 

      const newExplored = allItems.filter(item => item.isNew === false).slice(0,4)
      setExploreMoreItems(newExplored)

    }
  },[allItems]); 

  return (

    <div className='wrap-container'>

    {/* //welcome page */}

     <div className="welcome">
      
      <div className='frontpageTexts z-200 absolute flex justify-center align-center flex-col'>
         <img src='/fashion.png' alt='header-img' className='min-w-[350px] w-8/10 m-auto'></img>
           <NavLink to="/shop" className='min-w-[280px] m-auto w-1/2 ' >
                <button  className='px-6 py-2  w-full text-white font-semibold rounded-sm shadow-md '>
                   shop now <ArrowUpRight className="inline mr-2" /> 
                </button>
            </NavLink>
         
      </div>

      <div className="welcome-container-lg hidden lg:flex justify-center">
             {HeaderImages.map((img, idx) => (
              <div className={`w-1/3 `}>
                <img
                  key={idx}
                  src={img.src}
                  alt={img.alt}
                     className={`object-cover object-top h-full w-full ${idx === 1 ? 'welcome-img' : '' }`}
                />
                </div>
        ))}
      </div>

      {/* carousel for small and medium screens */}
       <div className="welcome-container-sm-md flex justify-center items-stretch lg:hidden carousel ">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: false }}
          spaceBetween={16}
           loop={true} 
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 0,
            },
          }}
        >
               {HeaderImages.map((img, i) => (
              <SwiperSlide key={i}>
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full object-cover object-top h-full "
                  />
              </SwiperSlide>
            ))}
          </Swiper>
      </div>
     </div>

{/* 
     featured products */}

    
       <section className="py-12 bg-white sm:py-16 lg:py-20 featured-section ">
    <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Our featured items</h2>
            <p className="mt-4 text-base font-normal leading-7 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus faucibus massa dignissim tempus.</p>
        </div>


          <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4 test">
            {featuredItems.map(product => (
                 <Card 
                    image={product.images[0]}
                    price={product.price}
                    name={product.name.length < 50 ? product.name : product.name.slice(0, 50) + "..."}
                    isNew={true}
                    id={product.id}
                 />
             
           ))}
           </div>
        </div>
        </section>


        {/* explore more */}

     
    
       <section className="py-12 bg-white sm:py-16 lg:py-20 explore-more relative">



    <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Explore more</h2>
            <p className="mt-4 text-base font-normal leading-7 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus faucibus massa dignissim tempus.</p>
        </div>


          <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4 ">
            {exploreMoreItems.map(product => (
                 <Card 
                    image={product.images[0]}
                    price={product.price}
                    name={product.name.length < 50 ? product.name : product.name.slice(0, 50) + "..."}
                    id={product.id}

                 />
             
           ))}
           </div>
        </div>


        <div className='w-full h-cover flex items-center justify-center my-20' >
            <NavLink to="/shop"  >
                <button  className='px-6 py-2 m-auto w-cover bg-white font-semibold rounded-sm shadow-md view-all-products-btn'>
                   view all products <ArrowRight className="inline mr-2" /> 
                </button>
            </NavLink>
          </div>

        </section>
      
    </div>
  );
}