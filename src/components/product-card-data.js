"use client";

import { useEffect, useState } from "react";
import { getCategories } from "../sanity/schemaTypes/queries"; // Adjust the path to your queries file

// Define fallback images
const fallbackImages = {
    "STEAM Books": "/images/ProductImages/ABC.JPG",
    "STEAM Kits": "/images/ProductImages/stemkit.jpg",
    "STEAM Wear": "/images/ProductImages/vest.jpg",
    "STEAM Combo": "/images/logo/logo.png",
};

const productData = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndSetCategories = async () => {
            try {
                const fetchedCategories = await getCategories();

                // Map the fetched categories with fallback logic
                const formattedCategories = fetchedCategories.map((category) => ({
                    id: category._id,
                    category: category.title,
                    image: category.imageUrl || fallbackImages[category.title] || "/images/default.png",
                }));

                setCategories(formattedCategories);
            } catch (err) {
                setError("Failed to fetch categories. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAndSetCategories();
    }, []);

    if (loading) return <p>Loading categories...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
                <div key={cat.id} className="category-card border rounded-md shadow-sm p-4">
                    <img
                        src={cat.image}
                        alt={cat.category}
                        className="w-full h-48 object-cover rounded-md"
                    />
                    <h3 className="text-center text-lg font-semibold mt-2">{cat.category}</h3>
                </div>
            ))}
        </div>
    );
};

export default productData;
