import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('auth_token');
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the protected component
    return children;
};

export default PrivateRoute; 