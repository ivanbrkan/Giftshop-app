import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import cart_photo from '../assets/cart.svg';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';

const Navbar = ({ toggleCart, cartItems, isAuth, setAuth }) => {




    const signUserOut = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem("isAuth");
                setAuth(false);
            })
            .catch(error => {
                console.error('Error signing out:', error);
            });
    };

    return (
        <div className="w-full bg-[#FCFCFC] border-[#ECEFED] border-1">
            <div className="max-w-[1514px] mx-auto px-4 flex justify-between items-center h-24">
                <div className="flex items-center"> {/* Wrap both logo and Giftshop in a flex container */}
                    <Link to="/">
                        <img className='w-16' src={logo} alt="Logo" />
                    </Link>
                    <Link to="/">
                        <h1 className='text-2xl ml-3 cursor-pointer font-medium'>Giftshop</h1>
                    </Link>
                </div>
                <div className="flex items-center">
                    <Link to="/">
                        <button className='mr-5'>Home</button>
                    </Link>
                    {isAuth && (
                        <>
                            <Link to="/shop" className="flex items-center">
                                <button className='mr-5'>Shop</button>
                            </Link>
                            <button onClick={signUserOut}>Log Out</button>

                            {/* Open the cart when clicked */}
                            <div className="relative cursor-pointer ml-8" onClick={toggleCart}>
                                <img src={cart_photo} alt="Cart" className="mr-2" />
                                {cartItems.length > 0 && (
                                    <span className="bg-[#EA0B2C] text-white border-2 border-white rounded-full px-2.5 py-1 text-sm absolute -top-4 right-0 semiboldText">
                                        {cartItems.length}
                                    </span>
                                )}
                            </div>


                            <Link to="/profile" className="flex items-center">
                                <button className='ml-3'>Profile</button>
                            </Link>
                        </>
                    )}
                    {!isAuth && (
                        <>
                            <button><Link to="/login">Login</Link></button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
