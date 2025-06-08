import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const Update = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        console.log(`Fetching user with ID: ${id}`);
        const response = await axios.get(`http://localhost:8080/api/v1/users/${id}`);
        
        if (response.data) {
          const userData = response.data.data || response.data;
          setUser(userData);
        } else {
          setError("No user data received from server");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error.response?.data?.message || error.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchUser();
    } else {
      setError("No user ID provided");
      setLoading(false);
    }
  }, [id]);
  
  const handleChange = (e) => {
    setUser(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const confirmUpdate = window.confirm("Are you sure you want to update this user?");
      if (confirmUpdate && user) {
        await axios.put(`http://localhost:8080/api/v1/users/${id}`, user);
        navigate("/user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      alert(err.response?.data?.message || "Failed to update user");
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Loading user data...</h1>
        <p>Fetching user with ID: {id}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Error</h1>
        <p>{error}</p>
        <Link to="/user" style={{ 
          color: '#d32f2f', 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>Back to Users</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>User Not Found</h1>
        <p>No user data available for ID: {id}</p>
        <Link to="/user" style={{ 
          color: '#d32f2f', 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>Back to Users</Link>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, rgba(17, 25, 40, 0.75) 0%, rgba(17, 25, 40, 0.95) 100%)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        padding: '2rem',
        background: 'rgba(17, 25, 40, 0.75)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.125)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(10px)',
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#fff',
          fontSize: '2rem',
          marginBottom: '1.5rem',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>Update User</h1>
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '2rem', 
          color: '#9ca3af'
        }}>Editing User ID: <span style={{color: '#60a5fa'}}>{id}</span></p>
      
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor='name' style={{ 
              color: '#e5e7eb',
              fontWeight: '500',
            }}>Name:</label>
            <input 
              type="text" 
              placeholder='Name' 
              value={user?.name || ''} 
              onChange={handleChange} 
              name="name"
              required
              style={{
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.125)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                '&:focus': {
                  borderColor: '#60a5fa',
                  boxShadow: '0 0 0 2px rgba(96, 165, 250, 0.2)'
                }
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor='surname' style={{ 
              color: '#e5e7eb',
              fontWeight: '500',
            }}>Surname:</label>
            <input 
              type="text" 
              placeholder='Surname' 
              value={user?.surname || ''} 
              onChange={handleChange} 
              name="surname"
              required
              style={{
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.125)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                '&:focus': {
                  borderColor: '#60a5fa',
                  boxShadow: '0 0 0 2px rgba(96, 165, 250, 0.2)'
                }
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor='email' style={{ 
              color: '#e5e7eb',
              fontWeight: '500',
            }}>Email:</label>
            <input 
              type="email" 
              placeholder='Email' 
              value={user?.email || ''} 
              onChange={handleChange} 
              name="email"
              required
              style={{
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.125)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                '&:focus': {
                  borderColor: '#60a5fa',
                  boxShadow: '0 0 0 2px rgba(96, 165, 250, 0.2)'
                }
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor='password' style={{ 
              color: '#e5e7eb',
              fontWeight: '500',
            }}>Password:</label>
            <input 
              type="password" 
              placeholder='Leave blank to keep current' 
              value={user?.password || ''} 
              onChange={handleChange} 
              name="password"
              style={{
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.125)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                '&:focus': {
                  borderColor: '#60a5fa',
                  boxShadow: '0 0 0 2px rgba(96, 165, 250, 0.2)'
                }
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #20615b 0%, #1a4c47 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(32, 97, 91, 0.4)'
                }
              }}
            >
              Update User
            </button>
            <Link 
              to="/user"
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'rgba(220, 38, 38, 0.1)',
                color: '#ef4444',
                textDecoration: 'none',
                textAlign: 'center',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(220, 38, 38, 0.2)'
                }
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;