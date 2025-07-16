import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ProjectRoutes from './Routes';
import { AuthProvider } from './contexts/AuthContext';
import { testFirestoreConnection } from './services/userService';

function App() {
  useEffect(() => {
    // Test Firestore connection when app loads
    const testConnection = async () => {
      console.log('=== Testing Firestore on App Load ===');
      try {
        const result = await testFirestoreConnection();
        if (result) {
          console.log('✅ Firestore is working correctly');
        } else {
          console.error('❌ Firestore connection failed');
        }
      } catch (error) {
        console.error('❌ Firestore test error:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <ProjectRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
