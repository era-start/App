import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalBody
} from '@coreui/react';
import { useSelector } from 'react-redux';

const SalaryDetails = () => {
  const { user } = useSelector(state => state.auth);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const downloadInvoice = async (month) => {
    try {
      const response = await fetch(`/api/salary/invoice/${month}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to download invoice');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${month}.pdf`;
      a.click();
    } catch (err) {
      console.error('Error downloading invoice:', err);
    }
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Monthly Salary Details</strong>
        </CCardHeader>
        <CCardBody>
          <div className="table-responsive">
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Month</CTableHeaderCell>
                  <CTableHeaderCell>Basic Salary</CTableHeaderCell>
                  <CTableHeaderCell>Advances</CTableHeaderCell>
                  <CTableHeaderCell>Net Salary</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {[...Array(3)].map((_, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>January 2024</CTableDataCell>
                    <CTableDataCell>₹{user?.salary || 0}</CTableDataCell>
                    <CTableDataCell>₹{user?.advances || 0}</CTableDataCell>
                    <CTableDataCell>
                      ₹{(user?.salary || 0) - (user?.advances || 0)}
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className="badge bg-success">Paid</span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton 
                        color="primary" 
                        size="sm"
                        onClick={() => {
                          setSelectedInvoice({
                            month: 'January 2024',
                            amount: (user?.salary || 0) - (user?.advances || 0)
                          });
                          setShowInvoice(true);
                        }}
                        className="me-2"
                      >
                        View
                      </CButton>
                      <CButton 
                        color="success" 
                        size="sm"
                        onClick={() => downloadInvoice('2024-01')}
                      >
                        Download
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      <CModal 
        visible={showInvoice} 
        onClose={() => setShowInvoice(false)}
        size="lg"
      >
        <CModalHeader>
          Invoice - {selectedInvoice?.month}
        </CModalHeader>
        <CModalBody>
          <div className="invoice-preview">
            <div className="text-center mb-4">
              <h2>MK Exports</h2>
              <p>Salary Invoice</p>
            </div>
            
            <div className="row mb-4">
              <div className="col-6">
                <h5>Employee Details</h5>
                <p>Name: {user?.name}</p>
                <p>ID: {user?.id}</p>
                <p>Type: {user?.type}</p>
              </div>
              <div className="col-6 text-end">
                <h5>Invoice Details</h5>
                <p>Month: {selectedInvoice?.month}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <CTable bordered>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Basic Salary</CTableHeaderCell>
                  <CTableDataCell>₹{user?.salary || 0}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Advances</CTableHeaderCell>
                  <CTableDataCell>-₹{user?.advances || 0}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Net Payable</CTableHeaderCell>
                  <CTableDataCell>₹{selectedInvoice?.amount}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            <div className="row mt-5">
              <div className="col-6">
                <p>Employee Signature</p>
                <div className="signature-line"></div>
              </div>
              <div className="col-6 text-end">
                <p>Authorized Signature</p>
                <div className="signature-line"></div>
              </div>
            </div>
          </div>
        </CModalBody>
      </CModal>
    </>
  );
};

export default SalaryDetails; 