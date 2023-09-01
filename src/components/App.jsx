import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import { Home } from './Home';
import { Shop } from './Shop';
import Profile from './Profile';
import Checkout from './Checkout';
import OrderHistory from './OrderHistory';
import { onAuthStateChanged } from "firebase/auth";
import { auth as firebaseAuth } from './firebase-config'; // Rename the auth object here
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const App = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [isAuth, setAuth] = useState(localStorage.getItem("isAuth") === "true");
    const [userEmail, setUserEmail] = useState('');
    const stripePromise = loadStripe(
        "pk_test_51NlGcHLONOSBGQ4LYh0vwbzG2wVme2KasUUx7yzduYEFhLQlS3wjK8ZrCr4JBTWTbzQjMP77abApKdRYvmlg9kOQ00wUVBPHCN"
    );

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => { // Use the renamed firebaseAuth here
            if (user) {
                setAuth(true);
                localStorage.setItem("isAuth", "true"); // Store in local storage
            } else {
                setAuth(false);
                localStorage.removeItem("isAuth"); // Remove from local storage
            }
        });
    }, []);

    useEffect(() => {

        const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                setUserEmail(user.email);
            } else {
                setUserEmail('');
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);


    return (
        <Elements stripe={stripePromise}>

            <div>
                <Navbar toggleCart={toggleCart} cartItems={cartItems} isAuth={isAuth} setAuth={setAuth} />

                <Routes>
                    <Route path="/" element={<Home isAuth={isAuth} userEmail={userEmail} />} />
                    <Route path="/shop" element={<Shop toggleCart={toggleCart} cartItems={cartItems} setCartItems={setCartItems} isAuth={isAuth} setAuth={setAuth} />} />
                    <Route path="/login" element={<Login setAuth={setAuth} />} />
                    <Route path="/profile" element={<Profile isAuth={isAuth} />} />
                    <Route path="/checkout" element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} />
                    <Route path="/order-history" element={<OrderHistory isAuth={isAuth} userEmail={userEmail} />} />
                </Routes>
            </div>
        </Elements>
    );
};

export default App;
