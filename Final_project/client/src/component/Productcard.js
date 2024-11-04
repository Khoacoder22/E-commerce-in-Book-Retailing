import React, { useState, useEffect } from 'react';
import { Form, Upload, Modal, Input, Button } from "antd";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Card.css';

const Card = ({ product }) => {
  const { addToCart } = useCart();
  const { editProduct, deleteProduct } = useProducts();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditOpen] = useState(false);
  const [image, setImage] = useState(product.image || '');

  const [editProductInfo, setEditProductInfo] = useState({
    product: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    author: product.author, 
  });

  const { isAdmin } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    const savedImage = localStorage.getItem(`product_image_${product.id}`);
    if (savedImage) {
      setImage(savedImage); 
    } else if (product && product.image) {
      setImage(product.image); 
    }
  }, [product.image, product.id]);

  const openDetailModal = () => setDetailModalOpen(true);
  const closeDetailModal = () => setDetailModalOpen(false);

  const openEditModal = () => {
    setEditOpen(true);
    setImage(product.image);
    form.setFieldsValue(editProductInfo);
  };

  const closeEditModal = () => {
    form.resetFields(); 
    setImage(product.image); 
    setEditOpen(false);
  };

  const handleUpload = async (info) => {
    const file = info.file;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dvpr4tp2n/image/upload`,
        formData
      );

      const uploadedImageUrl = response.data.secure_url;
      console.log('Uploaded Image URL:', uploadedImageUrl);
      localStorage.setItem(`product_image_${product.id}`, uploadedImageUrl);
      setImage(uploadedImageUrl);
      setEditProductInfo(prevInfo => ({
        ...prevInfo,
        image: uploadedImageUrl
      }));
      toast.success("Image uploaded and saved successfully!");
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image");
    }
  };
  
  const handleAddedToCart = () => {
    if (product && product.id) {
      addToCart(product);
      toast.success(`Product ${product.name} has been added to your cart`);
    } else {
      toast.error('Product data is invalid');
    }
  };

  const handleEdit = (values) => {
    const updatedProduct = { ...editProductInfo, ...values, image };
    editProduct({ id: product.id, ...updatedProduct });
    setEditProductInfo(updatedProduct);
    closeEditModal();
  };
  
  const handleDelete = () => {
    deleteProduct(product.id);
    toast.success(`Product ${product.name} has been deleted`);
  };

  return (
    <div className="card">
      <img
        alt={product.name}
        src={image ? image : "https://m.media-amazon.com/images/I/71sVQDj0SCL._AC_UF1000,1000_QL80_.jpg"}
        onClick={openDetailModal}
        style={{ width: '100%', objectFit: 'cover' }}
      />

      <div className="card-body">
        <h1 className="card-title">{editProductInfo.name}</h1>
        <p className="card-info">{editProductInfo.description || 'No description available.'}</p>

        {!isAdmin && (
          <>
            {product.quantity > 0 ? (
              <button className="card-btn" onClick={handleAddedToCart}>Add to Cart</button>
            ) : (
              <button className="card-btn" disabled style={{ backgroundColor: 'grey' }}>Out of Order</button>
            )}
            <Link to={`/book/${product.id}`}>
              <button className='card-btn' style={{ marginTop: '3px' }}>Details</button>
            </Link>
          </>
        )}
        {isAdmin && (
          <>
            <button className="card-btn" onClick={openEditModal}>Edit Product</button>
            <button className="card-btn" onClick={handleDelete}>Delete</button>

            <Upload
              className='image_button'
              name="image"
              showUploadList={false}
              beforeUpload={() => false}
              style={{ marginTop: '3px' }}
              onChange={handleUpload}
            >
              <button className="card-btn">Upload Image</button>
            </Upload>

            <button className='card-btn' onClick={openDetailModal} style={{ marginTop: '3px' }}>Details</button>
          </>
        )}
      </div>

      <Modal
        title="Product Details"
        visible={detailModalOpen}
        onCancel={closeDetailModal}
        footer={null}
      >
        <h2>{editProductInfo.name}</h2>
        <img
          alt={editProductInfo.name}
          src={image ? image : "https://m.media-amazon.com/images/I/71sVQDj0SCL._AC_UF1000,1000_QL80_.jpg"}
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />
        <p>{editProductInfo.description || 'No description available.'}</p>
        <p>Author: {editProductInfo.author || 'Unknown'}</p>
        <p>Price: {editProductInfo.price}</p>
      </Modal>

      {isAdmin && (
        <Modal
          title="Edit Product"
          visible={editModalOpen}
          onCancel={closeEditModal}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleEdit}
            layout="vertical"
            initialValues={editProductInfo}
          >
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: 'Please enter the product name.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="price"
              label="Product Price"
              rules={[{ required: true, message: 'Please enter the product price.' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Product Description"
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="author"
              label="Product Author"
            >
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit"><label>Save</label></Button>
          </Form>
        </Modal>
      )}

      <ToastContainer />
    </div>
  );
};

export default Card;
