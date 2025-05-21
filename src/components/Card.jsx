import { ShoppingBag } from 'lucide-react';
import  {  useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { cartItemState } from '../states/atom';

const Card = ({id , image , price ,name ,  isNew}) => {   
    

    const product = {
        id,
        name:name ,
        price: price,
        image:image
    }

    const [cartItems, setCartItems] = useRecoilState(cartItemState)


    const addToCartButtonHandler=()=>{
        setCartItems(prevItems => {
            const exists = prevItems.some(item => item.id === product.id);
            if (exists) return prevItems;
               return [...prevItems, { ...product, quantity: 1 }];

        });

    }
    

    useEffect(() => {
      localStorage.setItem('cart_items', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
                <div className="relative group card flex flex-col justify-between z-1">
                   <Link to={`/product/${product.id}`} key={product.id} >

                        <div className="overflow-hidden aspect-w-1 aspect-h-1">
                            <img
                            className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125"
                            src={product.image}
                            alt={product.name}
                            />
                        </div>

                        {
                           isNew && 
                           (  <div className="absolute left-3 top-3">
                                    <p className="sm:px-3 sm:py-1.5 px-1.5 py-1 text-[8px] sm:text-xs font-bold tracking-wide text-gray-900 uppercase bg-white rounded-full">
                                    New
                                    </p>
                              </div>
                           )
                        }
                       
                        <div className="flex flex-col  w-full card-bottom">
                            <div>
                                
                            <h3>
                                <a
                                href="#"
                                className="text-xs font-bold sm:text-sm md:text-base card-desc"
                                >
                                {name}
                                <span className="absolute inset-0" aria-hidden="true"></span>
                                </a>
                            </h3>
                            </div>

                            <p className=" mt-[.8rem]  text-xs font-bold sm:text-sm md:text-base text-black card-price">
                                ₹{price.toLocaleString()}
                            </p>
                        </div>
                    </Link>
                        <div className='w-full flex mb-3'>
                              <button  className={' z-10 px-6 py-2 m-auto  w-[90%]  bg-white font-semibold rounded-xs  card-addtocart-btn'}  onClick={(e)=> addToCartButtonHandler(e)}    >
                                add to cart <ShoppingBag  className="inline mr-2 w-4.5 h-5 md:w-5 md:h-5"  /> 
                            </button>
                        </div>
                          
                </div>



    )
}
export default Card;