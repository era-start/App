import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CButton,
  CAlert
} from '@coreui/react';

const ProductSubmission = () => {
  const [submission, setSubmission] = useState({
    productId: '',
    quantity: '',
    comments: '',
    defects: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connect with admin panel API
      const response = await fetch('/api/products/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        throw new Error('Failed to submit product');
      }

      setSuccess('Product submitted successfully');
      setSubmission({
        productId: '',
        quantity: '',
        comments: '',
        defects: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <strong>Submit Completed Products</strong>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}

          <div className="mb-3">
            <CFormInput
              label="Product ID"
              value={submission.productId}
              onChange={(e) => setSubmission({...submission, productId: e.target.value})}
              required
            />
          </div>

          <div className="mb-3">
            <CFormInput
              type="number"
              label="Quantity Completed"
              value={submission.quantity}
              onChange={(e) => setSubmission({...submission, quantity: e.target.value})}
              required
            />
          </div>

          <div className="mb-3">
            <CFormTextarea
              label="Comments"
              value={submission.comments}
              onChange={(e) => setSubmission({...submission, comments: e.target.value})}
            />
          </div>

          <div className="mb-3">
            <CFormTextarea
              label="Defects (if any)"
              value={submission.defects}
              onChange={(e) => setSubmission({...submission, defects: e.target.value})}
            />
          </div>

          <CButton type="submit" color="primary">
            Submit Products
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default ProductSubmission; 