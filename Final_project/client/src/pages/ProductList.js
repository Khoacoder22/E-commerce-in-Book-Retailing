import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, Space, Modal, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { FaEdit } from "react-icons/fa";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title } = Typography;

const ProductListAdmin = () => {
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [editingProduct, setEditingProduct] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); 
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        const productsData = response.data.content;
    
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        toast.error("Failed to load products.");
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const showEditModal = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:8080/api/products/${editingProduct.id}`, editingProduct);
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id ? editingProduct : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setIsModalVisible(false);
      toast.success('The product has been updated successfully.');
    } catch (error) {
      toast.error('Unable to update the product.');
      console.error("Error updating product:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filteredData = products.filter((product) =>
      product.name && product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filteredData);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            style={{ backgroundColor: '#1890ff', borderRadius: '5px' }}
          >
            <FaEdit size={16} />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', color: 'white' }}>
        Inventory Management
      </Title>
      <Input
        placeholder="Search products"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '20px', width: '300px' }}
      />

      <Table
        dataSource={filteredProducts}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="id"
        bordered
        style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden' }}
      />

      <Modal
        title="Edit Book"
        visible={isModalVisible}
        footer={null} // Ẩn nút mặc định của Modal
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="Book Name"
          value={editingProduct?.name}
          onChange={(e) =>
            setEditingProduct({ ...editingProduct, name: e.target.value })
          }
          style={{ marginBottom: '10px' }}
        />
        <Input
          placeholder="Book Price"
          value={editingProduct?.price}
          type="number"
          onChange={(e) =>
            setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
          }
          style={{ marginBottom: '10px' }}
        />
        <Input
          placeholder="Book Quantity"
          value={editingProduct?.quantity}
          type="number"
          onChange={(e) =>
            setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value, 10) })
          }
          style={{ marginBottom: '10px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <Button onClick={() => setIsModalVisible(false)}><label>Cancel</label></Button>
          <Button type="primary" onClick={handleEditSave}><label>save</label></Button>
        </div>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ProductListAdmin;
