import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('communiti_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('communiti_token') || null);
  const [currentLocation, setCurrentLocation] = useState(() => {
    return localStorage.getItem('communiti_location') || 'Indiranagar, Bengaluru';
  });
  const [currentCity, setCurrentCity] = useState(() => {
    return localStorage.getItem('communiti_city') || 'Bengaluru';
  });
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync user profile on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.data);
          localStorage.setItem('communiti_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Could not refresh user session, using cached data.');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    if (token) {
      try {
        const res = await api.getBookmarks();
        setBookmarks(res.data || []);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    const { tokens, user: userData } = res.data;
    setToken(tokens.access);
    setUser(userData);
    localStorage.setItem('communiti_token', tokens.access);
    localStorage.setItem('communiti_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    const { tokens, user: newUser } = res.data;
    setToken(tokens.access);
    setUser(newUser);
    localStorage.setItem('communiti_token', tokens.access);
    localStorage.setItem('communiti_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setBookmarks([]);
    localStorage.removeItem('communiti_token');
    localStorage.removeItem('communiti_user');
  };

  const updateLocation = (locality, city) => {
    setCurrentLocation(locality);
    if (city) setCurrentCity(city);
    localStorage.setItem('communiti_location', locality);
    if (city) localStorage.setItem('communiti_city', city);
  };

  const toggleBookmark = async (listingId) => {
    if (!user) {
      return { success: false, requireAuth: true };
    }
    try {
      const res = await api.toggleBookmark(listingId);
      await fetchBookmarks();
      return { success: true, bookmarked: res.data.bookmarked, message: res.data.message };
    } catch (e) {
      return { success: false, error: 'Could not toggle bookmark' };
    }
  };

  // Quick Switch Demo Profiles for seamless testing
  const switchDemoRole = async (roleType) => {
    try {
      if (roleType === 'ADMIN') {
        await login('admin@communiti.in', 'Admin@123');
      } else if (roleType === 'ENTREPRENEUR') {
        await login('ananya.bakes@example.com', 'Entrepreneur@123');
      } else {
        await login('riya.sharma@example.com', 'Customer@123');
      }
      return true;
    } catch (err) {
      console.error('Failed to switch demo role', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        currentLocation,
        currentCity,
        bookmarks,
        login,
        register,
        logout,
        updateLocation,
        toggleBookmark,
        fetchBookmarks,
        switchDemoRole,
        isAuthenticated: !!user,
        isCustomer: user?.role === 'CUSTOMER',
        isEntrepreneur: user?.role === 'ENTREPRENEUR',
        isAdmin: user?.role === 'ADMIN' || user?.is_staff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
