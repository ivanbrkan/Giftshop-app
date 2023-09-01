import React, { useState } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { collection, addDoc } from "firebase/firestore";
import { database, auth } from "./firebase-config";
import { useNavigate } from "react-router-dom";
import productsData from "../assets/data.json";

const Checkout = ({ cartItems, setCartItems }) => {
    const [shippingAddress, setShippingAddress] = useState("");
    const navigate = useNavigate();
    const products = productsData.products;



    const handleSubmit = async (event) => {
        event.preventDefault();

        if (cartItems.length === 0) {
            alert(
                "Your cart is empty. Please add items to your cart before placing an order."
            );
            navigate("/shop");
            return;
        }

        try {
            const ordersCollectionRef = collection(database, "orders");
            await addDoc(ordersCollectionRef, {
                cartItems,
                shippingAddress,
                timestamp: new Date(),
                userId: auth.currentUser.uid,
                approved: false,
            });

            alert("Order placed successfully!");
            localStorage.removeItem("cartItems");
            setCartItems([]);
            navigate("/profile");
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };


    const calculateTotalPrice = (cartItems) => {
        return cartItems.reduce((total, item) => {
            const product = products.find((product) => product.id === item.id);
            if (product) {
                total += product.range.min * item.quantity;
            }
            return total;
        }, 0);
    };

    const handleDeleteItem = async (itemToDelete) => {
        try {
            setCartItems(cartItems.filter((item) => item.id !== itemToDelete.id));
        } catch (error) {
            console.log("Error deleting item:", error);
        }
    };

    return (
        <div className="p-3">
            <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-4"
            >
                <label className="block">
                    Shipping Address:
                    <input
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        required
                        className="border rounded p-1"
                    />
                </label>

                <h3 className="text-lg font-semibold">Cart Items:</h3>
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index} className="flex items-center space-x-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover"
                            />
                            <div className="flex-grow">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-gray-600">
                                    ${item.range.min} x {item.quantity}
                                </p>
                                <p className="font-semibold">
                                    Total: ${item.range.min * item.quantity}
                                </p>
                            </div>
                            <button
                                className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition duration-300"
                                onClick={() => handleDeleteItem(item)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>

                {cartItems.length > 0 && (
                    <p className="font-bold">
                        Total Price: ${calculateTotalPrice(cartItems).toFixed(2)}
                    </p>
                )}

                <h3 className="text-lg font-semibold">Payment Details:</h3>
                <div className="border rounded p-3">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "18px",
                                    fontFamily: '"Open Sans", sans-serif',
                                },
                            },
                        }}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Place Order
                </button>
                <button
                    type="button"
                    className="bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-300"
                    onClick={() => navigate("/shop")}
                >
                    Go back to shop
                </button>
            </form>
        </div>
    );
};

export default Checkout;
