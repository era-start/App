import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
  CAlert,
  CRow,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';

const Login = () => {
  const [credentials, setCredentials] = useState({
    employeeId: '',
    password: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await fetch('/api/auth/employee/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      dispatch(loginSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={5}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  <h1 className="text-center mb-4">Employee Login</h1>
                  
                  {error && (
                    <CAlert color="danger">{error}</CAlert>
                  )}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Employee ID"
                      value={credentials.employeeId}
                      onChange={(e) => setCredentials({
                        ...credentials,
                        employeeId: e.target.value
                      })}
                      required
                    />
                  </CInputGroup>
                  
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({
                        ...credentials,
                        password: e.target.value
                      })}
                      required
                    />
                  </CInputGroup>

                  <CButton 
                    color="primary" 
                    className="w-100" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login; 