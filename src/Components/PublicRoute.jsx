import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('auth_token');
    
    // If authenticated, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // If not authenticated, render the public component
    return children;
};

export default PublicRoute; 