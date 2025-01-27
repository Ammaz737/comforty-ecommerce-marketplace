"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CiShoppingCart } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import Swal from "sweetalert2";
import { addToCart } from "@/app/actions/actions";
import { getCartItems } from "@/app/actions/actions";

interface Product {
  _id: string;
  title: string;
  wishlist: string;
  price: number;
  description: string;
  discountPercentage: number;
  imageUrl: string;
  label?: string;
  labelColor?: string;
  tags: string[];
  inventory: number;
}

const ProductCards: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
//   const [cart, setCart] = useState<Product[]>([]); // Cart state for handling items
//   const router = useRouter();

  // Fetch products from the external API
  const fetchProducts = async () => {
    try {
      const response = await fetch("https://giaic-hackathon-template-08.vercel.app/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log("Error Fetching Products:", error);
    }
  };

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addToCart(product); // Call addToCart function from actions.ts
    setCart(getCartItems()); // Update the cart state with items from localStorage

    Swal.fire({
      title: "Added to Cart",
      text: `${product.title} has been added to your cart!`,
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Truncate description
  const truncateDescription = (description: string | undefined | null) => {
    if (!description) return "";
    return description.length > 100 ? description.substring(0, 100) + "..." : description;
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    setCart(getCartItems()); // Set initial cart state from localStorage
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border border-gray-200 rounded-lg p-4 flex flex-col items-center shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative w-full h-48 mb-4">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover rounded-lg"
              />
              {product.label && (
                <span
                  className={`absolute top-2 left-2 text-xs text-white px-2 py-1 rounded ${product.labelColor}`}
                >
                  {product.label}
                </span>
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">{product.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{truncateDescription(product.description)}</p>
            <div className="flex items-center justify-between w-full text-sm mb-4">
              <div>
                <span className="text-gray-900 font-bold">${product.price.toFixed(2)}</span>
                {product.discountPercentage > 0 && (
                  <span className="line-through ml-2 text-gray-500">
                    ${((product.price * 100) / (100 - product.discountPercentage)).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="flex justify-center w-20 bg-white text-center py-2 rounded-md hover:bg-red-400 mb-2"
              >
                <CiHeart size={40} />
              </button>
              <button
                className="flex justify-center w-20 bg-white text-sky-500 py-2 rounded-md hover:bg-gray-200"
                onClick={(e) => handleAddToCart(e, product)}
              >
                <CiShoppingCart size={40} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCards;
const setCart = (cartItems: Product[]) => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
};

