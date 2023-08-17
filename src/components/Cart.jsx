import React, { useEffect, useState } from 'react';
import trash from '../assets/trash.svg';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, setCartItems }) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter((item) => item.id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity > 0) {
            setCartItems(
                cartItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
            );
        } else {
            setCartItems(cartItems.filter((item) => item.id !== itemId));
        }
    };

    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach((item) => {
            total += item.range.min * item.quantity;
        });
        return total;
    };

    const itemPrice = (quantity, price) => {
        return quantity > 0 ? (price * quantity).toFixed(2) : 0;
    };

    // Retrieving cart items from local storage
    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, [setCartItems]);

    // Updating local storage cart items when changes occur
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);


    return (
        <>

            <div className="absolute top-0 right-0 bg-white p-5 border border-gray-200 rounded-2xl shadow sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4">
                <div className="cart-items-container">
                    {cartItems.length > 0 ? (
                        <>
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center mb-4 p-1">
                                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover mr-2" />
                                    <div>
                                        <p className="semiboldText">{item.name}</p>
                                        <p className="normalText">${item.range.min} value</p>
                                    </div>
                                    <div className="ml-auto flex items-center">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                            className="border border-gray-300 rounded-2xl px-3 py-2 text-sm mr-2 w-20"
                                        />
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center">
                                                <button onClick={() => removeFromCart(item.id)}>
                                                    <img src={trash} alt="Remove" className="w-6 h-6" />
                                                </button>
                                            </div>
                                            <p className="p-2 normalText" style={{ width: "60px" }}>
                                                ${itemPrice(item.quantity, item.range.min)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center justify-between">
                                <p className="normalText">Total:</p>
                                <p className="semiboldText">${calculateTotal().toFixed(2)}</p>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button className="bg-[#EA0B2C] text-white px-4 py-2 rounded-full semiboldText">
                                    <Link to="/checkout" state={{ cartItems }}>
                                        Proceed to Checkout
                                    </Link>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="empty-cart" onClick={toggleCart}>
                            <p>Cart is empty.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Cart;