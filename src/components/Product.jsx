const Product = ({ product, cartItems, setCartItems, setIsOpen }) => {

    // Add to cart implementation with checking if the item already exists in the cart
    const addToCart = () => {

        // Check if the product already exists in the cart
        const productExists = cartItems.find((item) => item.id === product.id);

        // If the product exists, update its quantity
        if (productExists) {
            const updatedItems = cartItems.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCartItems(updatedItems);
        } else {

            // If the product doesn't exist, add it to the cart with a quantity of 1
            const updatedItems = [...cartItems, { ...product, quantity: 1 }];
            setCartItems(updatedItems);
        }

        setIsOpen(true);
    };


    return (
        <div key={product.id} className="flex flex-col justify-between">

            <div className="w-full h-48 mb-3 bg-white cursor-pointer hover:scale-110 duration-300 flex items-center justify-center">
                {product && product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover max-h-full max-w-full"
                        onClick={() => addToCart(product)}
                    />
                ) : (
                    <div className="placeholderImage">Image not available</div>
                )}
            </div>

            <div>
                {product && product.name && (
                    <h3 className="text-lg font-semibold semiboldText">{product.name}</h3>
                )}

                {product && product.range && (
                    <p className="text-gray-600 normalText">
                        ${product.range.min}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Product;
