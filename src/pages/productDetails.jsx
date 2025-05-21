import React,{useEffect,useState} from "react";
import { ShoppingBag } from "lucide-react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useRecoilState } from "recoil";
import { cartItemState , allItemsState } from "../states/atom";
import "swiper/css";
import "swiper/css/pagination";

const ProductDetails = () => {
  const { id } = useParams();
  const [allItems , setAllItems] = useRecoilState(allItemsState);
  const [product , setProduct] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(()=>{
    if (allItems.length > 0) { 
      const foundProduct = allItems.find(item => item.id === id); 
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        console.warn(`Product with ID ${id} not found.`);
        setProduct(null); 
      }
      setLoading(false); 
    } else {

      console.log("allItems is empty, waiting for data to be loaded from Firebase in Home component.");
      setLoading(true); 
    }
  },[allItems, id]); 

  const [cartItems, setCartItems] = useRecoilState(cartItemState);

  const addToCartHandler = () => {
    if (product) {
      setCartItems(prevItems => {
        const exists = prevItems.some(item => item.id === product.id);
        console.log(prevItems)
        if (exists) return prevItems;

        return [...prevItems, { ...product, image:product.images[0] , quantity: 1 }];
      });
    }
  };

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  // Handle loading and product not found states
  if (loading) {
    return <div className="text-center py-20 text-xl">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-xl text-red-600">Product not found!</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Product Images */}
      <div className="w-full max-w-xl mx-auto">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={16}
          loop={true}
          slidesPerView={1}
        >
           { 
           product.images.map((url, i) => (
              <SwiperSlide key={i}>
                <img
                  src={url}
                  alt={`product-${i}`}
                  className="w-full h-auto max-h-[500px] object-contain rounded-2xl shadow-xl"
                />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            {product.name}
          </h1>
          <p className="text-gray-700 text-base md:text-lg mb-6">
            {product.description}
          </p>
          <p className="text-xl md:text-2xl font-semibold text-black mb-6">
            ₹{product.price ? product.price.toLocaleString() : 'N/A'} {/* Add a check for price too */}
          </p>

          {/* Size Selector */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Size</h2>
            <div className="flex gap-2 flex-wrap">
              {/* Ensure product.sizes exists and is an array before mapping */}
              {product.sizes && product.sizes.length > 0 ? (
                product.sizes.map((size) => (
                  <button
                    key={size} // Use size as key if sizes are unique strings/numbers
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-black hover:text-white transition font-medium"
                  >
                    {size}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No sizes available</p>
              )}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={addToCartHandler}
          className="w-full mt-8 inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-sm text-base font-semibold shadow hover:bg-gray-800 transition"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;