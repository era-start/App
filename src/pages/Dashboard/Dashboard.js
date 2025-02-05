import React from 'react';
import { useSelector } from 'react-redux';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CProgress,
  CBadge
} from '@coreui/react';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const isProductBased = user?.type === 'product-based';

  return (
    <div className="dashboard">
      <CRow>
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{isProductBased ? 'Product Statistics' : 'Attendance Summary'}</strong>
            </CCardHeader>
            <CCardBody>
              {isProductBased ? (
                <>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Completed Products</span>
                      <span>75%</span>
                    </div>
                    <CProgress value={75} className="mb-3" />
                  </div>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <h4>15</h4>
                      <span>Assigned</span>
                    </div>
                    <div className="stat-item">
                      <h4>12</h4>
                      <span>Completed</span>
                    </div>
                    <div className="stat-item">
                      <h4>3</h4>
                      <span>Pending</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="attendance-summary">
                    <div className="stat-item">
                      <h4>22</h4>
                      <span>Present Days</span>
                    </div>
                    <div className="stat-item">
                      <h4>2</h4>
                      <span>Half Days</span>
                    </div>
                    <div className="stat-item">
                      <h4>1</h4>
                      <span>Absent</span>
                    </div>
                  </div>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Salary Overview</strong>
            </CCardHeader>
            <CCardBody>
              <div className="salary-details">
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>Basic Salary</span>
                    <span>₹{user?.salary || 0}</span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>Advances</span>
                    <span className="text-danger">-₹{user?.advances || 0}</span>
                  </div>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Net Payable</strong>
                  <strong>₹{(user?.salary || 0) - (user?.advances || 0)}</strong>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {isProductBased && (
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Current Assignments</strong>
          </CCardHeader>
          <CCardBody>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Deadline</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Product A</td>
                    <td>5</td>
                    <td>₹100</td>
                    <td>2024-02-20</td>
                    <td>
                      <CBadge color="warning">In Progress</CBadge>
                    </td>
                  </tr>
                  <tr>
                    <td>Product B</td>
                    <td>3</td>
                    <td>₹150</td>
                    <td>2024-02-25</td>
                    <td>
                      <CBadge color="success">Completed</CBadge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CCardBody>
        </CCard>
      )}
    </div>
  );
};

export default Dashboard; 