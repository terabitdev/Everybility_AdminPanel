import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { saveUserData, testFirestoreConnection } from '../services/userService';
import LoadingSpinner from '../Components/LoadingSpinner';

const AuthContext = createContext();

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, fullName) {
    try {
      console.log('=== Starting signup process ===');
      console.log('Email:', email);
      console.log('Full Name:', fullName);
      
      // Test Firestore connection first
      console.log('Testing Firestore connection...');
      const firestoreTest = await testFirestoreConnection();
      if (!firestoreTest) {
        console.error('❌ Firestore connection test failed - user data may not be saved');
      }
      
      // Create user with Firebase Auth
      console.log('Creating Firebase Auth user...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Firebase Auth user created successfully:', userCredential.user.uid);
      
      // Update the user profile with the full name
      console.log('Updating user profile...');
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      console.log('User profile updated successfully');
      
      // Save user data to Firestore
      const userData = {
        email: email,
        fullName: fullName,
        displayName: fullName,
        role: 'admin', // Always admin for this web app
        status: 'active',
        uid: userCredential.user.uid
      };

      console.log('Preparing to save user data to Firestore:', userData);
      
      // Save to Firestore
      try {
        await saveUserData(userCredential.user.uid, userData);
        console.log('✅ User data saved to Firestore successfully');
      } catch (firestoreError) {
        console.error('❌ Error saving to Firestore:', firestoreError);
        // Don't throw here, let the user continue even if Firestore fails
        // You might want to show a warning to the user
      }
      
      console.log('=== Signup process completed successfully ===');
      return userCredential;
    } catch (error) {
      console.error('❌ Error during signup:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth, AuthContext };