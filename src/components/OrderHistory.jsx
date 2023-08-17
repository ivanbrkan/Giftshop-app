import React, { useState, useEffect } from "react";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { database, auth } from "./firebase-config";
import productsData from "../assets/data.json";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { Link } from "react-router-dom";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const products = productsData.products;
    const [authInitialized, setAuthInitialized] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                setAuthInitialized(true);
            })
            .catch((error) => {
                console.log("Error setting persistence:", error);
            });
    }, []);

    useEffect(() => {
        if (authInitialized && auth.currentUser) {
            const fetchOrders = async () => {
                try {
                    const ordersCollectionRef = collection(database, "orders");
                    let q;

                    // Check if the user is admin
                    if (auth.currentUser.email === "admin@giftshop.com") {
                        q = ordersCollectionRef; // Fetch all orders for admin
                    } else {
                        q = query(ordersCollectionRef, where("userId", "==", auth.currentUser.uid));
                    }

                    const querySnapshot = await getDocs(q);
                    const ordersData = [];
                    querySnapshot.forEach((doc) => {
                        ordersData.push({ id: doc.id, ...doc.data() });
                    });
                    setOrders(ordersData);
                } catch (error) {
                    console.log("Error fetching orders:", error);
                }
            };

            fetchOrders();
        }
    }, [authInitialized]);

    const calculateTotalPrice = (cartItems) => {
        return cartItems.reduce((total, item) => {
            const product = products.find(product => product.id === item.id);
            if (product) {
                total += product.range.min * item.quantity;
            }
            return total;
        }, 0);
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            // Delete order from Firestore
            const ordersCollectionRef = collection(database, "orders");
            await deleteDoc(doc(ordersCollectionRef, orderId));

            // Remove order from local state
            setOrders(orders.filter(order => order.id !== orderId));
        } catch (error) {
            console.log("Error deleting order:", error);
        }
    };

    return (
        <div className="mt-3 p-3">
            <h1 className="font-semibold"> Order History</h1>
            {orders.length === 0 ? (
                <div className="text-center p-8">
                    <h2 className="text-2xl font-semibold mb-4">Welcome to our Gift Card Store!</h2>



                    <p className="mt-4">
                        You have no orders. Go to the shop and start ordering!

                    </p>
                    <div className="mt-6">
                        <Link to="/shop" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                            Get Started
                        </Link>
                    </div></div>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="order-item">
                        <h2>Order ID: {order.id}</h2>
                        <p>Shipping Address: {order.shippingAddress}</p>
                        <h3>Items:</h3>
                        <ul className="order-items-list">
                            {order.cartItems.map((cartItem, index) => {
                                const product = products.find((p) => p.id === cartItem.id);
                                if (!product) {
                                    return null; // Handle if product is not found
                                }

                                const totalItemPrice = product.range.min * cartItem.quantity;

                                return (
                                    <li key={index} className="order-item-details">
                                        <div className="item-image-container">
                                            <img src={product.image} alt={product.name} className="item-image" />
                                        </div>
                                        <div className="item-info">
                                            <p>Name: {product.name}</p>
                                            <p>Price: ${product.range.min}</p>
                                            <p>Quantity: {cartItem.quantity}</p>
                                            <p>Total Price: ${totalItemPrice.toFixed(2)}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <p className="order-total-price">Total: ${calculateTotalPrice(order.cartItems).toFixed(2)}</p>
                        <button onClick={() => handleDeleteOrder(order.id)} className="noselect">
                            <span className="text">Cancel</span>
                            <span className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistory;
