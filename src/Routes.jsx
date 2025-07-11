import React from "react";
import { useRoutes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";

const ProjectRoutes = () => {
    let element = useRoutes([
        { 
            path: "/login", 
            element: <LoginPage />
        },
        { 
            path: "/", 
            element: <Dashboard />
        },
        { 
            path: "/users", 
            element: <div>Users Management</div>
        },
        { 
            path: "/settings", 
            element: <div>Settings</div>
        },
        { 
            path: "*", 
            element: <div>404 - Page Not Found</div>
        },
    ]);

    return element;
};

export default ProjectRoutes;