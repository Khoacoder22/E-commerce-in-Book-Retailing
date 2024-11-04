import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

const initializeProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem('products'));
    if (storedProducts && storedProducts.every(p => p.id)) { 
        return storedProducts;
    } else {
        const defaultProducts = [];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        return defaultProducts;
    }
};

export const ProductProvider = ({ children }) => {
    const { authHeader } = useAuth(); 
    const [products, setProducts] = useState(initializeProducts());
    const [totalItems, setTotalItems] = useState(0);
    const [subscribers, setSubscribers] = useState([]); 

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const fetchProducts = async ({ page = 0, size = 5, sort = '', query = '' }) => {
        try {
            const response = await axios.get('http://localhost:8080/api/products', {
                params: { page, size, sort, query },
                headers: { Authorization: authHeader },
            });
            console.log("response.data.content:", response.data.content);
            if (Array.isArray(response.data.content)) {
                setProducts(response.data.content);
            } else {
                console.error("Fetched data is not an array:", response.data.content);
            }
            setTotalItems(response.data.totalElements);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    

    const createProduct = async (product) => {
        try {
            const newProduct = {
                name: product.name,
                price: product.price,
                description: product.description,
                author: product.author,  
            };

            const response = await axios.post('http://localhost:8080/api/products', newProduct, {
                headers: { Authorization: authHeader },
            });
            setProducts((prevProducts) => [...prevProducts, response.data]); 
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const editProduct = async (updatedProduct) => {
        try {
            if (!updatedProduct.id) {
                throw new Error('Product ID is missing');
            }

            const response = await axios.put(`http://localhost:8080/api/products/${updatedProduct.id}`, updatedProduct, {
                headers: { Authorization: authHeader },
            });

            setProducts((prevProducts) => 
                prevProducts.map((p) => (p.id === updatedProduct.id ? response.data : p))
            );
        } catch (error) {
            console.error('Error editing product:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/products/${id}`, {
                headers: { Authorization: authHeader },
            });

            setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const onProductChange = useCallback((callback) => {
        setSubscribers((prevSubscribers) => {
            if (!prevSubscribers.includes(callback)) {
                return [...prevSubscribers, callback];
            }
            return prevSubscribers;
        });
    }, []);

    return (
        <ProductContext.Provider 
            value={{ 
                products, 
                totalItems, 
                fetchProducts, 
                createProduct, 
                editProduct, 
                deleteProduct, 
                onProductChange 
            }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
