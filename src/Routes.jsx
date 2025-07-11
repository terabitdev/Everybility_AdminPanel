import React from "react";
import { useRoutes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import UserAccounts from "./Pages/UserAccounts";
import Subscriptions from "./Pages/Subscriptions";
import Settings from "./Pages/Settings";
import CreateAccountPage from "./Pages/CreateAccountPage";

const ProjectRoutes = () => {
    let element = useRoutes([
        { 
            path: "/login", 
            element: <LoginPage />
        },
        { 
            path: "/create-account", 
            element: <CreateAccountPage />
        },
        { 
            path: "/", 
            element: <Dashboard />
        },
        { 
            path: "/users", 
            element: <UserAccounts />
        },
        { 
            path: "/subscriptions", 
            element: <Subscriptions />
        },
        { 
            path: "/settings", 
            element: <Settings />
        },
        { 
            path: "*", 
            element: <div>404 - Page Not Found</div>
        },
    ]);

    return element;
};

export default ProjectRoutes;