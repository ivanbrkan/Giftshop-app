import React, { useState, useEffect } from 'react';
import OrderHistory from './OrderHistory';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

const Profile = () => {
    const auth = getAuth(); // Initialize Firebase Auth
    const firestore = getFirestore(); // Initialize Firestore

    const [user, setUser] = useState(null); // Initialize user as null
    const [numberOfOrders, setNumberOfOrders] = useState(0); // Initialize number of orders

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user); // Set user when it becomes available
                fetchNumberOfOrders(user.uid); // Fetch and set the number of orders
                // Set up an onSnapshot listener for "orders" collection
                const ordersCollectionRef = collection(firestore, 'orders');
                const q = query(ordersCollectionRef, where('userId', '==', user.uid));
                const unsubscribeOrders = onSnapshot(q, (snapshot) => {
                    setNumberOfOrders(snapshot.size); // Update number of orders in real-time
                    console.log('krug')
                });
                return () => {
                    unsubscribeOrders();
                };
            }
        });

        return () => unsubscribe();
    });

    const fetchNumberOfOrders = async (userId) => {
        const ordersCollectionRef = collection(firestore, 'orders');
        const q = query(ordersCollectionRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        setNumberOfOrders(querySnapshot.size); // Set the number of orders
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            {user ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                        <label className="font-semibold">User Name:</label>
                        <p>{user.displayName}</p>
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold">User Email:</label>
                        <p>{user.email}</p>
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold">Number of Orders:</label>
                        <p>{numberOfOrders}</p>
                    </div>
                </div>
            ) : (
                <p className="text-center">Loading...</p>
            )}
            <OrderHistory />
        </div>
    );
};

export default Profile;
