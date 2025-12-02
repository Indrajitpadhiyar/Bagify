import Footer from '../ui/Footer';

const Cart = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const increaseQty = (item) => {
        if (item.stock <= item.qty) return toast.error("Stock limit reached");
        dispatch(addToCart({ ...item, qty: item.qty + 1 }));
    };

    const decreaseQty = (item) => {
        if (item.qty <= 1) return;
        dispatch(addToCart({ ...item, qty: item.qty - 1 }));
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-700">Your cart is empty</h2>
                    <Link to="/products" className="mt-6 inline-block px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-10 text-orange-600">Your Cart</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white rounded-2xl shadow-lg p-6 flex gap-6"
                                >
                                    <img src={item.image} alt={item.name} className="w-32 h-32 object-contain rounded-lg" />

                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold">{item.name}</h3>
                                        <p className="text-orange-600 font-bold text-2xl mt-2">₹{item.price.toLocaleString()}</p>

                                        <div className="flex items-center gap-3 mt-4">
                                            <button onClick={() => decreaseQty(item)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-lg font-medium w-12 text-center">{item.qty}</span>
                                            <button onClick={() => increaseQty(item)} className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => dispatch(removeFromCart(item._id))}
                                        className="text-red-500 hover:bg-red-50 p-3 rounded-full"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 text-lg">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-orange-600">₹{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <CheckoutButton />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Cart;