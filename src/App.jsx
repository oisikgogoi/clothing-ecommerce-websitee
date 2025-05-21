import './App.css'
import { collection ,  getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Suspense, lazy , useEffect} from 'react';
import {  Routes, Route, NavLink } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import "swiper/css";
import "swiper/css/pagination";
import { useRecoilState } from 'recoil';
import { cartItemState , allItemsState } from './states/atom';
import CheckoutPage from './pages/Checkout';
import CongratulationsPage from './pages/CongratulationPage';

// Custom Button component
const Button = ({ children, ...props }) => (
  <button className="px-4 py-2 border allbtn  rounded-sm hover:bg-gray-100 sm:px-2 sm:font-sm " {...props}>
    {children}
  </button>
);



const Cart = lazy(() => import('./pages/CartPage'));
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/productDetails'));


export default function App() {
  // ✅ Declare state and handler inside the App component
    const [cartItems, setCartItems] = useRecoilState(cartItemState);
    const [allItems , setAllItems] = useRecoilState(allItemsState)

      useEffect(()=>{
    
        const apiCall = async () => {
          try {
            const rawData = await getDocs(collection(db, "stock"));
    
            const allData = rawData.docs.map(doc => ({ ...doc.data() }));
            // console.log("All data as an array:", allData);
            setAllItems(allData)
    
          } catch (error) {
            console.error("Error fetching documents: ", error);
          }
        };
    
        apiCall();
      },[])
    

  return (
      <div className="min-h-screen bg-gray-50 font-sans ">
        <nav className="flex lg:text-lg  sm:text-md items-center justify-between px-10 py-4  shadow bg-white select-none">
          <NavLink to='/'>
            <img src='/logo.jpg' alt='logo' className='h-[3rem] w-[3rem]'></img>
          </NavLink>
          <div className='flex items-center justify-center'>
          <div className=" px-8 space-x-5">
            <NavLink to="/" className={({ isActive }) => isActive ? 'text-[#0D0D0D] font-semibold' : 'text-[#8C8C8C] navLinksInactive font-semibold'}>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => isActive ? 'text-[#0D0D0D] font-semibold' : 'text-[#8C8C8C] navLinksInactive font-semibold'}>
              Shop
            </NavLink>
          </div>
          <NavLink to="/cart">
            <Button>
              <ShoppingCart className="inline mr-2" /> Cart ({cartItems.length})
            </Button>
          </NavLink>
          </div>
        </nav>

        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home  />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/congrats' element={<CongratulationsPage  />} />

          </Routes>
        </Suspense>

      </div>
  );
}
