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
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: 'white',
        backgroundColor: 'Darkred',
        fontSize: '25px',
        marginBottom: '20px',
        borderRadius:'2% ',
        borderColor:'#e57373'
      }}>Update User</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px', color:'#20615b' }}>Editing User ID:<text style={{color:'blue'}}> {id}</text></p>
      
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor='name' style={{ 
            color: 'red',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>Name:</label>
          <input 
            type="text" 
            placeholder='Name' 
            value={user.name || ''} 
            onChange={handleChange} 
            name="name"
            required
            style={{
              padding: '10px',
              border: '2px solid red',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor='surname' style={{ 
            color: 'red',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>Surname:</label>
          <input 
            type="text" 
            placeholder='Surname' 
            value={user.surname || ''} 
            onChange={handleChange} 
            name="surname"
            required
            style={{
              padding: '10px',
              border: '2px solid red',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor='email' style={{ 
            color: 'red',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>Email:</label>
          <input 
            type="email" 
            placeholder='Email' 
            value={user.email || ''} 
            onChange={handleChange} 
            name="email"
            required
            style={{
              padding: '10px',
              border: '2px solid red',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor='password' style={{ 
            color: 'red',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>Password:</label>
          <input 
            type="password" 
            placeholder='Leave blank to keep current' 
            value={user.password || ''} 
            onChange={handleChange} 
            name="password"
            style={{
              padding: '10px',
              border: '2px solid red',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor='role' style={{ 
            color: 'red',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>Role:</label>
          <select 
            name="role" 
            value={user.role || 'visitor'} 
            onChange={handleChange}
            required
            style={{
              padding: '10px',
              border: '2px solid red',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: 'white'
            }}
          >
            <option value="visitor">Visitor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginTop: '20px'
        }}>
          <button type="submit" style={{ 
            padding: '10px 20px',
            backgroundColor: '#20615b', // Light green
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>Update User</button>
          
          <Link to="/user" style={{ 
            padding: '10px 20px',
            backgroundColor: '#e57373', // Light red
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default Update;