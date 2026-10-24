import type { Product } from '../types.ts';

export const initialProducts: Product[] = [
  {
    id: 1,
    image: 'classic burger.jpeg',
    name: 'Classic Burger',
    category: 'Burgers',
    description: 'Juicy patty with fresh lettuce, tomato, and special sauce.',
    specification: 'patty, sesame bun, lettuce, tomato, cheese, sauce',
    price: 100.00,
    rating: 4.5,
    quantity: 15
  },
  {
    id: 2,
    image: 'double cheese burger.jpeg',
    name: 'Double Cheese Burger',
    category: 'Burgers',
    description: 'Two patties loaded with melted cheddar cheese.',
    specification: 'Double patty, cheddar cheese, bun, pickles',
    price: 85.00,
    rating: 4.7,
    quantity: 8
  },
  {
    id: 3,
    image: 'crispy chicken burger.jpeg',
    name: 'Crispy Chicken Burger',
    category: 'Burgers',
    description: 'Golden fried chicken fillet with mayo and fresh coleslaw.',
    specification: 'Chicken fillet, bun, mayo, coleslaw',
    price: 85.00,
    rating: 4.2,
    quantity: 3
  }
];