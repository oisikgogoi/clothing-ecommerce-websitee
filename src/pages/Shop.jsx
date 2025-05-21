import {lazy, Suspense } from 'react';

import { useRecoilState } from 'recoil';
import { allItemsState } from '../states/atom';
const Card = lazy(() => import('../components/Card'));


export default function Shop() {
  const [allItems , setAllItems] = useRecoilState(allItemsState)


   
  return (
    <div className="md:p-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Shop All Items</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-3 md:gap-6 lg:gap-y-20">
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>  
        {allItems.map(product => (
            <Card 
                    image={product.images[0]}
                    price={product.price}
                    name={product.name.length < 50 ? product.name : product.name.slice(0, 50) + "..."}
                    id={product.id}

            />
        ))}
      </Suspense>
        
      </div>
    </div>
  );
}