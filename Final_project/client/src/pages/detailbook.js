import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './detailbook.css'; 
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const DetailBook = () => {
  const { id } = useParams(); 
  const { products } = useProducts(); 
  const { addToCart } = useCart(); 
  const [image, setImage] = useState(null);
  
  const product = products.find(p => p.id === parseInt(id));

  useEffect(() => {
    const savedImage = localStorage.getItem(`product_image_${id}`);
    if (savedImage) {
      setImage(savedImage);
    } else if (product && product.image) {
      setImage(product.image);
    }
  }, [id, product]);

  if (!product) {
    return <p>Book not found!</p>;
  }

  const handleAddedToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`Product ${product.name} has been added to your cart`);
    } else {
      toast.error("Product not found");
    }
  };

  return (
    <div className="detail-book-container">
      <div className="image-section">
        <img
          alt={product.name}
          src={image || "https://m.media-amazon.com/images/I/71sVQDj0SCL._AC_UF1000,1000_QL80_.jpg"}
          className="book-image"
        />
      </div>
      <div className="info-section">
        <h1 className="book-title" style={{color:'white'}}>{product.name}</h1>
        <p className="book-price" style={{color:'white'}}><strong>Price:</strong> ${product.price}</p>
        <p className="book-description" style={{color:'white'}}><strong>Description:</strong> {product.description}</p>
        <p className="book-author" style={{color:'white'}}><strong>Author:</strong> {product.author}</p>
      </div>
      <div className='content'>
        <button type="button" style={{marginTop:'12px', marginLeft:"400px"}} onClick={handleAddedToCart}>
          Add to Cart
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DetailBook;
