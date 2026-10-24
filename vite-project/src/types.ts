export type Product = {
    id: number;
    image: string;
    name: string;
    category: string;
    description: string;
    specification: string;
    price: number;
    rating: number;
    quantity: number;
};
export type CartItem = Product & {
    cartQty: number;
    subtotal: number;
};