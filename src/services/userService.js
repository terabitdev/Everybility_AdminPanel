import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload profile image to Firebase Storage and return the download URL
export const uploadProfileImage = async (file, userId) => {
  try {
    const storageRef = ref(storage, `profileImages/${userId}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// Make test function available globally for manual testing
window.testFirestoreManually = async () => {
  try {
    console.log('=== Manual Firestore Test ===');
    console.log('Firestore db:', db);
    
    // Test write
    const testRef = doc(db, 'test', 'manual-test');
    await setDoc(testRef, {
      test: true,
      message: 'Manual test successful',
      timestamp: new Date()
    });
    console.log('✅ Write test successful');
    
    // Test read
    const testDoc = await getDoc(testRef);
    if (testDoc.exists()) {
      console.log('✅ Read test successful:', testDoc.data());
    }
    
    // Clean up
    await deleteDoc(testRef);
    console.log('✅ Delete test successful');
    
    return true;
  } catch (error) {
    console.error('❌ Manual test failed:', error);
    return false;
  }
};

// Test Firestore connectivity
export const testFirestoreConnection = async () => {
  try {
    console.log('=== Testing Firestore Connection ===');
    console.log('Firestore db instance:', db);
    
    if (!db) {
      console.error('❌ Firestore database is not initialized');
      return false;
    }
    
    // Try to write a test document
    const testRef = doc(db, 'test', 'connection-test');
    await setDoc(testRef, {
      test: true,
      timestamp: new Date()
    });
    
    console.log('✅ Firestore write test successful');
    
    // Try to read the test document
    const testDoc = await getDoc(testRef);
    if (testDoc.exists()) {
      console.log('✅ Firestore read test successful');
    }
    
    // Clean up test document
    await deleteDoc(testRef);
    console.log('✅ Firestore delete test successful');
    
    return true;
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return false;
  }
};

// Save user data to Firestore
export const saveUserData = async (userId, userData) => {
  try {
    console.log('=== Starting saveUserData ===');
    console.log('Firestore db instance:', db);
    console.log('User ID:', userId);
    console.log('User data to save:', userData);
    
    if (!db) {
      throw new Error('Firestore database is not initialized');
    }
    
    const userRef = doc(db, 'users', userId);
    console.log('User document reference created:', userRef);
    
    const dataToSave = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Data to save to Firestore:', dataToSave);
    
    await setDoc(userRef, dataToSave);
    
    console.log('✅ User data saved successfully to Firestore');
    console.log('Document path:', userRef.path);
    return true;
  } catch (error) {
    console.error('❌ Error saving user data to Firestore:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    throw error;
  }
};

// Get user data from Firestore
export const getUserData = async (userId) => {
  try {
    console.log('Getting user data for ID:', userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      console.log('User data found:', userDoc.data());
      return userDoc.data();
    } else {
      console.log('No user data found in Firestore for ID:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error getting user data from Firestore:', error);
    throw error;
  }
};

// Get all users (for admin panel)
export const getAllUsers = async () => {
  try {
    console.log('Fetching all users from Firestore...');
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(usersQuery);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    console.log('Fetched users from Firestore:', users.length);
    return users;
  } catch (error) {
    console.error('Error getting all users from Firestore:', error);
    throw error;
  }
};

// Update user data
export const updateUserData = async (userId, userData) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...userData,
      updatedAt: new Date()
    });
    console.log('User data updated successfully in Firestore');
    return true;
  } catch (error) {
    console.error('Error updating user data in Firestore:', error);
    throw error;
  }
};

// Delete user data
export const deleteUserData = async (userId) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    console.log('User data deleted successfully from Firestore');
    return true;
  } catch (error) {
    console.error('Error deleting user data from Firestore:', error);
    throw error;
  }
};

// Get dashboard metrics
export const getDashboardMetrics = async (currentAdminId) => {
  try {
    console.log('Fetching dashboard metrics...');
    
    // Count total users including admins but exclude current admin
    const usersQuery = query(collection(db, 'users'));
    const usersSnapshot = await getDocs(usersQuery);
    const totalUsers = usersSnapshot.docs.filter(doc => doc.id !== currentAdminId).length;
    
    // Count users from users collection only (non-admin users)
    const regularUsersQuery = query(
      collection(db, 'users'),
      where('role', '!=', 'admin')
    );
    const regularUsersSnapshot = await getDocs(regularUsersQuery);
    const regularUsersCount = regularUsersSnapshot.size;
    
    // Count games
    const gamesQuery = query(collection(db, 'games'));
    const gamesSnapshot = await getDocs(gamesQuery);
    const totalGames = gamesSnapshot.size;
    
    // Count programs
    const programsQuery = query(collection(db, 'programs'));
    const programsSnapshot = await getDocs(programsQuery);
    const totalPrograms = programsSnapshot.size;
    
    // Count subscriptions
    const subscriptionsQuery = query(collection(db, 'subscriptions'));
    const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
    const totalSubscriptions = subscriptionsSnapshot.size;
    
    const metrics = {
      totalUsers,
      regularUsers: regularUsersCount,
      totalGames,
      totalPrograms,
      totalSubscriptions
    };
    
    console.log('Dashboard metrics fetched:', metrics);
    return metrics;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
}; 