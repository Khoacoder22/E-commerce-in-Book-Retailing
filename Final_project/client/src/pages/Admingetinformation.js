import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminGetInformation = () => {
  const [submittedData, setSubmittedData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('contactFormData')) || [];
    setSubmittedData(storedData);
  }, []);

  const handleDelete = (key) => {
    const updatedData = submittedData.filter((_, index) => index !== key);
    setSubmittedData(updatedData);
    localStorage.setItem('contactFormData', JSON.stringify(updatedData));
    notification.success({
      message: 'Contact Deleted',
      description: 'The contact information has been deleted successfully.',
    });
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' }, 
    { title: 'Message', dataIndex: 'message', key: 'message' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record, index) => (
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(index)}
        >
          <label style={{border:"2px solid black", backgroundColor:"red", color:"white", width:"200px", borderRadius:"10px"}}>Delete</label>
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ textAlign: 'center', color:'white' }}>Admin Panel: Submitted Information</Title>
      <Table dataSource={submittedData} columns={columns} pagination={false} rowKey={(record, index) => index} />
    </div>
  );
};

export default AdminGetInformation;