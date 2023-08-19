import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import { Home } from './Home';
import { Shop } from './Shop';
import Profile from './Profile';
import Checkout from './Checkout';
import OrderHistory from './OrderHistory';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase-config';

const App = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [isAuth, setAuth] = useState(localStorage.getItem("isAuth") === "true");
    const [userEmail, setUserEmail] = useState('');

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    const auth = getAuth();


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuth(true);
                localStorage.setItem("isAuth", "true"); // Store in local storage
            } else {
                setAuth(false);
                localStorage.removeItem("isAuth"); // Remove from local storage
            }
        });
    }, [auth]);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = auth.onAuthStateChanged(user => {
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
        <div>
            <Navbar toggleCart={toggleCart} cartItems={cartItems} isAuth={isAuth} setAuth={setAuth} />

            <Routes>
                <Route path="/" element={<Home isAuth={isAuth} userEmail={userEmail} />} />
                <Route path="/shop" element={<Shop toggleCart={toggleCart} cartItems={cartItems} setCartItems={setCartItems} isAuth={isAuth} setAuth={setAuth} />} />
                <Route path="/login" element={<Login setAuth={setAuth} />} />
                <Route path="/profile" element={<Profile isAuth={isAuth} />} />
                <Route path="/checkout" element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} />
                <Route path="/order-history" element={<OrderHistory />} />

            </Routes>
        </div>
    );
};

export default App;
