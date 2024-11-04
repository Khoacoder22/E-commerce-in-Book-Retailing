import React, { useEffect, useState } from 'react';
import { Table, Typography, Button, notification } from 'antd';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const { Title } = Typography;

const Orders = () => {
  const { isAdmin, username, authHeader } = useAuth(); 
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/orders', {
          headers: {
            Authorization: authHeader,
          },
        });
        setOrders(response.data); 
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders(); 
  }, [authHeader]);

  const getUserOrders = () => {
    if (isAdmin) {
      return orders;
    } else {
      return orders.filter(order => order.username === username); 
    }
  };

  const handleOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    const affectedOrder = updatedOrders.find(order => order.id === orderId);
    if (affectedOrder) {
      const message = `Order ${orderId} has been marked as ${newStatus}.`;
      notification.success({
        message: 'Order Status Update',
        description: message,
      });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      // Gọi API DELETE để xóa đơn hàng
      await axios.delete(`http://localhost:8080/api/orders/${orderId}`, {
        headers: {
          Authorization: authHeader,
        },
      });

      // Xóa đơn hàng khỏi danh sách trên giao diện
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));

      notification.success({
        message: 'Order Deleted',
        description: `Order ${orderId} has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      notification.error({
        message: 'Delete Failed',
        description: `Failed to delete order ${orderId}.`,
      });
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/orders', {
          headers: {
            Authorization: authHeader,
          },
        });
        console.log(response.data); 
        setOrders(response.data); 
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    fetchOrders(); 
  }, [authHeader]);
  
  const orderColumns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'username', key: 'username' },
    { title: 'Total', dataIndex: 'total', key: 'total' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Products',
      dataIndex: 'orderDetails',
      key: 'orderDetails',
      render: (orderDetails) => 
        orderDetails
          ? orderDetails.map(item => `${item.product.name} (x${item.quantity})`).join(', ')
          : 'No products',
    },    
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleOrderStatus(record.id, 'delivered')}
            disabled={record.status === 'delivered'}
            style={{ marginRight: '10px' }}
          >
            <label>Mark as Delivered</label>
          </Button>
          {record.status === 'delivered' && (
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteOrder(record.id)}
            >
              <label style={{ backgroundColor: 'red', color: 'white', width: '90px', height: '20px', borderRadius: '5px' }}>Delete</label>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ textAlign: 'center', color: 'white' }}>
        {isAdmin ? "All Orders" : "My Orders"}
      </Title>
      <Table dataSource={getUserOrders()} columns={orderColumns} pagination={false} rowKey="id" />
    </div>
  );
};

export default Orders;
