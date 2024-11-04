import React, { useState, useEffect } from 'react';
import Card from '../component/Productcard';
import { Modal, Input, Button, Form, Pagination } from 'antd';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import './shop.css';
import SearchBar from '../component/SearchBar';
import Footer from '../component/footer'; 

const Shop = () => {
  const { products, totalItems, fetchProducts, createProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { isAdmin } = useAuth();
  const [sortOrder, setSortOrder] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchProducts({ page: currentPage - 1, size: pageSize, sort: sortOrder, query: searchQuery });
  }, [currentPage, pageSize, sortOrder, searchQuery]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    const newProduct = {
      name: values.productName,
      price: values.productPrice,
      description: values.productDescription,
      author: values.productAuthor,
    };
    createProduct(newProduct);
    closeModal();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setDropdownOpen(false);
    setCurrentPage(1);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'white' }}>Welcome to the Shop</h1>

      {isAdmin && (
        <Button type="primary" onClick={openModal} style={{ marginBottom: '20px', color: 'white', fontWeight: 'bold' }}>
          <label>Add New Product</label>
        </Button>
      )}
      <Modal title="Add New Product" open={isModalOpen} onCancel={closeModal} footer={null}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="productName" label="Product Name" rules={[{ required: true, message: 'Please enter the product name' }]}>
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item name="productPrice" label="Product Price" rules={[{ required: true, message: 'Please enter the product price' }]}>
            <Input type="number" placeholder="Enter product price" />
          </Form.Item>
          <Form.Item name="productAuthor" label="Product Author" rules={[{ required: true, message: 'Please enter the author name' }]}>
            <Input placeholder="Enter author name" />
          </Form.Item>
          <Form.Item name="productDescription" label="Product Description">
            <Input.TextArea placeholder="Enter product description" />
          </Form.Item>
          <div className="button_holder" style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button className="closebtn" onClick={closeModal}>
              <label>Close</label>
            </Button>
            <Button type="primary" htmlType="submit">
              <label>Submit</label>
            </Button>
          </div>
        </Form>
      </Modal>

      <div className="searchbar-container">
        <SearchBar onSearch={handleSearch} />
        <div className="sort-container" style={{ color: 'white', border: '1px solid gray', borderRadius: '40px', width: '200px' }}>
          <div className="dropdown">
            <button onClick={toggleDropdown} className="dropbtn">
              {sortOrder === 'asc' ? 'Low to High' : sortOrder === 'desc' ? 'High to Low' : 'Default'}
            </button>
            {dropdownOpen && (
              <ul className="dropdown-content" style={{ listStyle: 'none', padding: 0, backgroundColor: 'gray', color: 'white' }}>
                <li onClick={() => handleSortChange('')} style={{ cursor: 'pointer', padding: '5px', backgroundColor: sortOrder === '' ? '#ddd' : '' }}>
                  Default
                </li>
                <li onClick={() => handleSortChange('asc')} style={{ cursor: 'pointer', padding: '5px', backgroundColor: sortOrder === 'asc' ? '#ddd' : '' }}>
                  Low to High
                </li>
                <li onClick={() => handleSortChange('desc')} style={{ cursor: 'pointer', padding: '5px', backgroundColor: sortOrder === 'desc' ? '#ddd' : '' }}>
                  High to Low
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="card-container">
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onChange={handlePageChange}
        onShowSizeChange={handlePageChange}
        style={{ alignItems: 'center', textAlign: 'center', marginTop: '20px' }}
      />
    <Footer></Footer>
    </div>
  );
};

export default Shop;
