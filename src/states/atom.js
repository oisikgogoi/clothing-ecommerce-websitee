import { atom } from 'recoil';

const savedCart = localStorage.getItem('cart_items');
const parsedCart = savedCart ? JSON.parse(savedCart) : [];

export const totalCostState = atom({
  key:'totalCostState',
  default: 0
})
export const cartItemState = atom({
  key: 'cartItemState',
  default: parsedCart
});

export const allItemsState = atom({
  key:'allItemsState',
  default:[]
})

export const headerImagesLoadedState = atom({
  key:'headerImagesLoadedState',
  default:false
})