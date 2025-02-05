export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          message: data.message || 'Invalid request',
          code: 'BAD_REQUEST'
        };
      case 401:
        return {
          message: 'Session expired. Please login again',
          code: 'UNAUTHORIZED'
        };
      case 403:
        return {
          message: 'You do not have permission to perform this action',
          code: 'FORBIDDEN'
        };
      case 404:
        return {
          message: 'Resource not found',
          code: 'NOT_FOUND'
        };
      case 422:
        return {
          message: data.message || 'Validation error',
          errors: data.errors,
          code: 'VALIDATION_ERROR'
        };
      case 500:
        return {
          message: 'Internal server error',
          code: 'SERVER_ERROR'
        };
      default:
        return {
          message: 'Something went wrong',
          code: 'UNKNOWN_ERROR'
        };
    }
  } else if (error.request) {
    // Request was made but no response
    return {
      message: 'No response from server',
      code: 'NETWORK_ERROR'
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'CLIENT_ERROR'
    };
  }
};

export const showErrorMessage = (error) => {
  if (error.errors) {
    // Handle validation errors
    return Object.values(error.errors).join('\n');
  }
  return error.message;
}; 