import { DeleteOutlined } from '@ant-design/icons';
import { FaMinus, FaPlus } from "react-icons/fa";
import { Button, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, setCart, clearCart } = useCart(); // Thêm clearCart từ CartContext
  const { isAuthenticated } = useAuth();
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (cart.length === 0) {
      setShowEmptyCartModal(true);
    }
  }, [cart]);

  const handleDelete = (id) => {
    const updatedCart = cart.filter((product) => product.id !== id);
    setCart(updatedCart);
  };

  const handleQuantityChange = (id, change) => {
    const updatedCart = cart.map((product) => {
      if (product.id === id) {
        const newQuantity = product.quantity + change;
        return { ...product, quantity: Math.max(newQuantity, 1) };
      }
      return product;
    });
    setCart(updatedCart);
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      localStorage.setItem('navigatedFromCart', 'true');
      navigate('/checkout');
    } else {
      setShowLoginRequiredModal(true);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginRequiredModal(false);
    navigate('/auth/login', { state: { from: 'cart' } });
  };

  const handleCloseEmptyCartModal = () => {
    setShowEmptyCartModal(false);
    navigate('/');
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: ['product', 'name'],  
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: ['product', 'price'],  
      key: 'price',
      render: (price) => `$${price}`
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaMinus onClick={() => handleQuantityChange(record.id, -1)} />
          <span style={{ margin: '0 8px' }}>{text}</span>
          <FaPlus onClick={() => handleQuantityChange(record.id, 1)} />
        </div>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (text, record) => `$${record.product.price * record.quantity}`, 
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="link" danger onClick={() => handleDelete(record.id)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Modal
        title="Open library"
        open={true}
        onCancel={() => navigate('/')}
        footer={null}
        width={600}
      >
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <Table dataSource={cart} columns={columns} pagination={false} rowKey="id" />
            <div style={{ marginTop: '1rem', textAlign: 'right'}}>
              <p>Total Price: ${cart.reduce((total, product) => total + product.product.price * product.quantity, 0)}</p>
              <Button danger onClick={clearCart}><label>Clear Cart</label></Button>
              <Button type="primary" style={{ marginLeft: '1rem' }} onClick={handleCheckout}><label>Checkout</label></Button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        title="Login Required"
        open={showLoginRequiredModal}
        onCancel={() => setShowLoginRequiredModal(false)}
        footer={[
          <Button key="login" type="primary" onClick={handleLoginRedirect}>
            <label>Login</label>
          </Button>,
          <Button key="close" onClick={() => setShowLoginRequiredModal(false)}>
             <label>Close</label>
          </Button>,
        ]}
      >
        <p>Please log in to proceed with checkout.</p>
      </Modal>
      <Modal
        title="Cart is Empty"
        open={showEmptyCartModal}
        onCancel={handleCloseEmptyCartModal}
        footer={[
          <Button key="home" type="primary" onClick={handleCloseEmptyCartModal}>
            <label>Close</label>
          </Button>,
        ]}
      >
        <p>There are no products in your cart.</p>
      </Modal>
    </div>
  );
};

export default Cart;
