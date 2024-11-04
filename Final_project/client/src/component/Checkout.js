import { Button, DatePicker, Form, Input, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './check.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const Checkout = () => {
  const { cart, setCart, orders, setOrders } = useCart();
  const { username, authHeader } = useAuth();
  const navigate = useNavigate();
  const [isNavigatedFromCart, setIsNavigatedFromCart] = useState(false);
  const initialCheckDoneRef = useRef(false);
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm từ backend

  useEffect(() => {
    if (!initialCheckDoneRef.current) {
      const navigatedFromCart = localStorage.getItem('navigatedFromCart');
      if (cart.length === 0 || navigatedFromCart !== 'true') {
        navigate('/cart');
      } else {
        setIsNavigatedFromCart(true);
        localStorage.removeItem('navigatedFromCart');
      }
      initialCheckDoneRef.current = true;
    }
  }, [cart, navigate]);

  const totalPrice = cart.reduce(
    (total, product) => total + (product.product.price || 0) * (product.quantity || 0),
    0
  );

  // Hàm tải lại danh sách sản phẩm từ backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products', {
        headers: { Authorization: authHeader },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleFinish = async (values) => {
    const newOrder = {
      date: new Date().toLocaleString(),
      total: totalPrice,
      username: username,
      orderDetails: cart.map((item) => ({
        product: {
          id: item.product.id,
        },
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post('http://localhost:8080/api/orders', newOrder, {
        headers: { Authorization: authHeader },
      });

      if (response.status === 201) {
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));

        for (const item of cart) {
          try {
              console.log(`Calling reduce API for product ID: ${item.product.id} with quantity: ${item.quantity}`);
              const response = await axios.post(
                  `http://localhost:8080/api/products/${item.product.id}/reduce`,
                  null,
                  {
                      params: { quantity: item.quantity },
                      headers: { Authorization: authHeader },
                  }
              );
              console.log('Reduce API response:', response.data);
          } catch (error) {
              console.error('Error reducing product quantity:', error);
              toast.error(`Failed to reduce stock for ${item.product.name}`, {
                  position: 'top-right',
                  autoClose: 3000,
              });
          }
      }
        await fetchProducts();

        setCart([]);
        toast.success('Payment completed successfully! Redirecting to shop', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate('/shop');
        }, 3000);
      }
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };

  const disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };

  return (
    <>
      <ToastContainer />
      {isNavigatedFromCart && (
        <Modal
          title="Enter Visa Information"
          open={true}
          onCancel={() => navigate('/cart')}
          footer={null}
          closable={false}
          width={500}
          className="checkout-modal"
        >
          <div className="checkout-products">
            <h3>Products in Your Cart:</h3>
            <div className="product-list">
              {cart.map((item) => (
                <div key={item.product.id} className="product-item">
                  <img
                    src={item.product.image || 'https://via.placeholder.com/150'}
                    alt={item.product.name}
                    className="product-image"
                  />
                  <div className="product-details">
                    <p className="product-name"><strong>{item.product.name}</strong></p>
                    <p className="product-price">Price: ${item.product.price || 0}</p>
                    <p className="product-quantity">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="total-price">
              <strong>Total Price: ${totalPrice}</strong>
            </p>
          </div>

          <Form className="checkout-form" layout="vertical" onFinish={handleFinish}>
            <Form.Item
              className="visa"
              label="Visa Card Number"
              name="cardNumber"
              rules={[
                { required: true, message: 'Please input your Visa card number!' },
                { min: 4, message: 'Card number must be at least 4 digits!' },
              ]}
            >
              <Input placeholder="Enter card number" maxLength={16} />
            </Form.Item>
            <Form.Item
              label="Expiration Date"
              name="expirationDate"
              rules={[{ required: true, message: 'Please input the expiration date!' }]}
            >
              <DatePicker
                format="MM/YY"
                picker="month"
                placeholder="Select expiration date"
                style={{ width: '100%' }}
                disabledDate={disabledDate}
              />
            </Form.Item>
            <Button className="submit-button" type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default Checkout;
