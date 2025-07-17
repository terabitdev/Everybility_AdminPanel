import React from "react";
import { useRoutes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import UserAccounts from "./Pages/UserAccounts";
import Subscriptions from "./Pages/Subscriptions";
import Settings from "./Pages/Settings";
import CreateAccountPage from "./Pages/CreateAccountPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import PrivateRoute from "./Components/PrivateRoute";
import PublicRoute from "./Components/PublicRoute";

const ProjectRoutes = () => {
    let element = useRoutes([
        { 
            path: "/login", 
            element: <PublicRoute><LoginPage /></PublicRoute>
        },
        { 
            path: "/create-account", 
            element: <PublicRoute><CreateAccountPage /></PublicRoute>
        },
        { 
            path: "/forgot-password", 
            element: <PublicRoute><ForgotPasswordPage /></PublicRoute>
        },
        { 
            path: "/", 
            element: <PrivateRoute><Dashboard /></PrivateRoute>
        },
        { 
            path: "/users", 
            element: <PrivateRoute><UserAccounts /></PrivateRoute>
        },
        { 
            path: "/subscriptions", 
            element: <PrivateRoute><Subscriptions /></PrivateRoute>
        },
        { 
            path: "/settings", 
            element: <PrivateRoute><Settings /></PrivateRoute>
        },
        { 
            path: "*", 
            element: <div>404 - Page Not Found</div>
        },
    ]);

    return element;
};

export default ProjectRoutes;