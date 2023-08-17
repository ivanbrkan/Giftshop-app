import React from 'react';
import { Link } from 'react-router-dom';

export const Home = ({ isAuth, userEmail }) => {
    const isAdmin = userEmail === 'admin@giftshop.com';

    return (
        <div className="text-center p-8">
            {isAdmin ? (<> <h1 className="text-2xl font-semibold mb-4">ADMIN PANEL</h1>
                <p className="text-gray-600">
                    Hello Admin! You have access to view all orders and manage the store.
                    Feel free to browse through the orders and make any necessary changes.
                </p></>
            ) : (
                <><h2 className="text-2xl font-semibold mb-4">Welcome to our Gift Card Store!</h2>

                    <p className="text-gray-600">
                        Explore our collection of unique and delightful gift cards for various occasions.
                        Whether it's a birthday, anniversary, or any special event, our gift cards are the perfect way to share your joy with your loved ones.
                    </p></>
            )}

            <p className="mt-4">
                {isAuth ? (
                    <>
                        {isAdmin ? (
                            <>You have admin privileges. Start managing the store or continue shopping!</>
                        ) : (
                            <>If you're ready to start your gift-giving journey, browse our selection, add items to your cart, and enjoy a seamless shopping experience with us!</>
                        )}
                    </>
                ) : (
                    <>
                        To get started, simply login or register to unlock the full experience of our website.
                    </>
                )}
            </p>
            <div className="mt-6">
                <Link
                    to={isAuth && userEmail === "admin@giftshop.com" ? "/order-history" : (isAuth ? "/shop" : "/login")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Get Started
                </Link>
            </div>



        </div>
    );
};
