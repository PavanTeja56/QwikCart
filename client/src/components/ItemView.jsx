import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cookie from 'js-cookie';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";


function ItemView() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [turn, setTurn] = useState(0);
    const [loading,setLoading]=useState(true);
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(`http://localhost:8000/product/${id}`)
            .then(res => {
                if (!res.data) {
                    toast.error("Product not found");
                    return;
                }
                setProduct(res.data);
                setLoading(false);
            })
            .catch(err => {
                if (err.response?.status !== 404) {
                    console.error("Error loading product:", err);
                    toast.error(err.response?.data?.error || "Error loading product details");
                }
                setLoading(false);
            });
            
    }, [id]);

    const handleImageLeft = () => {
        if (turn > 0) setTurn(turn - 1);
    };

    const handleImageRight = () => {
        if (product.image && turn < product.image.length - 1) setTurn(turn + 1);
    };

    const handleSubmitReview = () => {
        axios.post(`http://localhost:8000/product/${id}/review`, {
            rating,
            review
        }).then(res => {
            toast.success("Review submitted");
            setProduct(res.data);
            setRating(0);
            setReview("");
        }).catch(() => toast.error("Failed to submit review"));
    };
    const handleAddToCart = async () => {
        const email = Cookie.get("email");
        if (!email) {
            toast.error("Please log in to add to cart.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/addToCart", {
                userEmail: email,
                product
            });

            if (response.data.success) {
                toast.success("Added to cart!");
            } else {
                toast.error("Failed to add to cart.");
            }
        } catch (error) {
            toast.error("Error adding to cart.");
        }
    };

    if(loading){
    return <div className="cart-empty">
    <div className="loader">
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
    </div>;
  }

    if (!product) return <p>Loading...</p>;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="relative w-full h-96 flex items-center justify-center bg-white border rounded">
                    <button
                        onClick={handleImageLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white px-3 py-2 rounded-r hover:bg-gray-900 disabled:opacity-50"
                        disabled={turn === 0}
                    >
                        ◀
                    </button>
                    <img
                        className="max-h-full object-contain"
                        src={product.image?.[turn]}
                        alt="Product"
                    />
                    <button
                        onClick={handleImageRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white px-3 py-2 rounded-l hover:bg-gray-900 disabled:opacity-50"
                        disabled={turn === product.image?.length - 1}
                    >
                        ▶
                    </button>
                </div>

                <div>
                    <h2 className="text-2xl font-bold">{product.name}</h2>
                    <p className="text-gray-500">Type: {product.type}</p>
                    <p className="text-lg font-semibold mt-2">Price: ₹{product.price}</p>
                    <p className="text-lg font-semibold mt-2">Canteen: {product.description}</p>
                    <p className={`mt-1 ${product.stocks > 0 ? "text-green-500" : "text-red-500"}`}>
                        {product.stocks > 0 ? "In Stock" : "Out of Stock"}
                    </p>

                    <div className="mt-4 space-x-2">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={() => {
                                if (product?.stocks <= 0) {
                                    toast.error("Out of stock!");
                                    return;
                                }

                                navigate('/place-order', {
                                    state: {
                                        cartItems: [{
                                            productId: product._id,
                                            name: product.name,
                                            price: product.price,
                                            image: product.image?.[0],
                                            quantity: 1,
                                            description:product.description,
                                        }],
                                        totalAmount: product.price
                                    }
                                });
                            }}
                        >
                            Buy Now
                        </button>

                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>

                    </div>

                    <hr className="my-6" />

                    <h3 className="text-xl font-semibold mb-2">Ratings & Reviews</h3>
                    <ul className="space-y-2 mb-4">
                        {(product.allReviews || []).map((r, index) => (
                            <li key={index} className="bg-gray-100 p-2 rounded">
                                <p className="text-sm">⭐ {(product.allRatings || [])[index] || 0} / 5</p>
                                <p>{r}</p>
                            </li>
                        ))}
                        {(!product.allReviews || product.allReviews.length === 0) && <p>No reviews yet.</p>}
                    </ul>

                    <h4 className="font-semibold mb-1">Add Your Review:</h4>
                    <div className="space-y-2">
                        <input
                            type="number"
                            max="5"
                            min="1"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            placeholder="Rating (1-5)"
                            className="w-full border p-2 rounded"
                        />
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Write your review..."
                            className="w-full border p-2 rounded"
                        ></textarea>
                        <button
                            onClick={handleSubmitReview}
                            className="bg-purple-600 text-white px-4 py-2 rounded"
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemView;
