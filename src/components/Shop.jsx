import React, { useState } from 'react';
import Cart from './Cart';
import Product from './Product';
import data from '../assets/data.json';

export const Shop = ({ toggleCart, cartItems, setCartItems }) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="container mx-auto py-8 relative">
            <div className='absolute top-0 right-0 w-full'>
                <Cart isOpen={isOpen} toggleCart={toggleCart} cartItems={cartItems} setCartItems={setCartItems} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 m-5">
                {data.products.slice(0, 12).map((product) => (
                    <Product
                        key={product.id}
                        product={product}
                        cartItems={cartItems}
                        setCartItems={setCartItems}
                        toggleCart={toggleCart}
                        setIsOpen={setIsOpen}
                    />
                ))}
            </div>
        </div>
    )
}
