import React,{useEffect,useState} from "react";
import { ShoppingCart, ChevronLeft, ChevronDown, Plus, Minus } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { cartItemState , totalCostState } from '../states/atom';
import { useNavigate } from 'react-router-dom';


export default function Cart() {
    const [products, setProducts] = useRecoilState(cartItemState);
    const [totalCost , setTotalCost] = useRecoilState(totalCostState)
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const navigate = useNavigate()

    // Load cart items from localStorage on initial mount
    useEffect(() => {
        const storedCartItems = localStorage.getItem('cart_items');
        if (storedCartItems) {
            try {
                // Ensure parsed data is an array
                const parsedItems = JSON.parse(storedCartItems);
                if (Array.isArray(parsedItems)) {
                    setProducts(parsedItems);
                } else {
                    console.error("Stored cart items are not an array:", parsedItems);
                    setProducts([]); // Fallback to empty array if malformed
                }
            } catch (e) {
                console.error("Error parsing cart items from localStorage:", e);
                setProducts([]); // Fallback to empty array on parse error
            }
        }
    }, [setProducts]); // Add setProducts to dependency array to satisfy ESLint, though it's stable


    const updateQuantity = (id, delta) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id
                    ? {
                        ...product,
                        quantity: Math.max(1, product.quantity + delta),
                    }
                    : product
            )
        );
    };

    const removeItem = (id) => {
        const updatedCart = products.filter(product => product.id !== id);
        setProducts(updatedCart);
        // localStorage is updated via the useEffect watching cartItems state
    };


    // Calculate totals. These will re-run on every render when products or discount change.
    const itemCount = products.reduce((sum, p) => sum + p.quantity, 0);
    const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const shipping = 0; // Assuming free shipping for now
    const total = subtotal + shipping - discount;

    // Update totalCost Recoil state whenever `total` changes
    useEffect(() => {
        setTotalCost(total);
    }, [total, setTotalCost]);


    const handleApplyPromoCode = () => {
        if (promoCode === 'SAVE10') {
            setDiscount(subtotal * 0.10);
        } else {
            setDiscount(0);
            alert('Invalid promo code.');
        }
    };

    // Use a useEffect to save cartItems to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('cart_items', JSON.stringify(products));
    }, [products]); // Depend on 'products' Recoil state


    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>
                    {products.length === 0 ? (
                        <div className='w-full flex lg:justify-end justify-center h-[60vh] items-center'>
                            <p className='lg:text-3xl md:text-xl sm:text:lg text-sm'>Your cart is empty </p> <ShoppingCart className='ml-3' />
                        </div>
                    ) : (

                        <div className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <div key={product.id} className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-4 w-full sm:w-1/2">
                                        {/* Defensive rendering for product.image */}
                                        <img
                                            src={product.image } 
                                            alt={product.name || 'Product Image'}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold">{product.name || 'Unnamed Product'}</h3>
                                            <button
                                                className="text-sm text-red-500 mt-1"
                                                onClick={() => removeItem(product.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-4 w-full sm:w-1/2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="border rounded p-1"
                                                onClick={() => updateQuantity(product.id, -1)}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center">{product.quantity}</span>
                                            <button
                                                className="border rounded p-1"
                                                onClick={() => updateQuantity(product.id, 1)}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="w-20 text-right">₹{product.price ? product.price.toFixed(2) : '0.00'}</p>
                                        <p className="w-24 text-right font-semibold">₹{(product.price && product.quantity) ? (product.price * product.quantity).toFixed(2) : '0.00'}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-6">
                                <button
                                    className="text-sm text-indigo-600 flex items-center"
                                    onClick={() => {
                                        navigate('/shop')
                                    }}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" /> Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                {products.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                    <div className="bg-white rounded-md shadow p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Items ({itemCount})</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Payment Method</label>
                                <div className="relative">
                                    <select className="w-full border rounded px-3 py-2 appearance-none">
                                        <option>Cash on Delivery - ₹0.00</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Promo Code</label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        placeholder="Enter your code"
                                        className="border rounded px-3 py-2 flex-1"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                        onClick={handleApplyPromoCode}
                                        disabled={!promoCode.trim()}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span>Discount</span>
                                    <span className="text-green-500">-₹{discount.toFixed(2)}</span>
                                </div>
                            )}
                            <hr />
                            <div className="flex justify-between font-semibold">
                                <span>Total Cost</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2 rounded px-4 py-2"
                                onClick={() => {
                                    navigate('/checkout')
                                }}
                            >
                                Checkout
                            </button>
                        </div>

                    </div>
                </div>
                )}
            </div>
        </div>
    );
}