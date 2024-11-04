import React, { createContext, useContext, useEffect, useState } from 'react';
import { useProducts } from './ProductContext';
import axios from 'axios';

const CartContext = createContext();

const initializeCart = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    return storedCart ? storedCart : [];
};

const initializeOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders'));
    return storedOrders ? storedOrders : [];
};

export const CartProvider = ({ children }) => {
    const { onProductChange } = useProducts();
    const [cart, setCart] = useState(initializeCart());
    const [orders, setOrders] = useState(initializeOrders());
    
    useEffect(() => {
        console.log('Cart data:', cart);  
      }, [cart]);
      
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        const handleProductChange = (updatedProduct) => {
            if (updatedProduct.delete) {
                setCart((prevCart) => prevCart.filter((p) => p.id !== updatedProduct.id));
            } else {
                setCart((prevCart) =>
                    prevCart.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
                );
            }
        };

        onProductChange(handleProductChange);
    }, [onProductChange]);

    const addToCart = async (product) => {
        try {
            console.log("Adding to cart:", { product: { id: product.id }, quantity: 1 }); 
    
            const response = await axios.post(
                'http://localhost:8080/api/cart',
                { 
                    product: { id: product.id },  
                    quantity: 1 
                }
            );
            setCart(response.data);
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };
    
    const editProductInCart = async (updatedProduct) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/cart/${updatedProduct.id}`,
                updatedProduct
            );
            setCart(response.data);
        } catch (error) {
            console.error('Error editing product in cart:', error);
        }
    };

    const deleteProductFromCart = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/cart/${id}`);
            setCart((prevCart) => prevCart.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Error deleting product from cart:', error);
        }
    };
    const clearCart = async () => {
        const response = await axios.delete('http://localhost:8080/api/cart');
        setCart(response.data);
    };

    return (
        <CartContext.Provider value={{ cart, setCart, orders, setOrders, addToCart, editProductInCart, deleteProductFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
