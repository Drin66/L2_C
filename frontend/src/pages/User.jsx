import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/v1/users");
        console.log("Fetched users:", res.data);
        
        // Handle different response structures
        const usersData = res.data.data || res.data; // In case response is wrapped in a data object
        if (Array.isArray(usersData)) {
          setUsers(usersData);
        } else {
          console.error("API response is not an array:", usersData);
          setError("Unexpected data format received from server");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
      if (confirmDelete) {
        await axios.delete(`http://localhost:8080/api/v1/users/${id}`);
        setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
        alert("User has been deleted successfully.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("An error occurred while deleting the user.");
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>Loading users...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 className='h1-design' style={{ textAlign: "center", marginLeft: "40%", fontSize: '20px', color: 'white' }}>
        Cinema Users Dashboard
      </h1>
      
      {users.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'white', marginTop: '20px' }}>
          No users found
        </div>
      ) : (
        <center>
          <table style={{ 
            width: '80%', 
            margin: '10px auto', 
            borderCollapse: 'collapse', 
            fontSize: '18px', 
            fontFamily: 'Arial, sans-serif' 
          }} border="1">
            <thead>
              <tr style={{ backgroundColor: '#20615b', color: "white", textAlign: 'center' }}>
                <th style={{ padding: '10px 15px' }}>Id</th>
                <th style={{ padding: '10px 15px' }}>Name</th>
                <th style={{ padding: '10px 15px' }}>Surname</th>
                <th style={{ padding: '10px 15px' }}>Email</th>
                <th style={{ padding: '10px 15px' }}>Password</th>
                <th style={{ padding: '10px 15px' }}>Role</th>
                <th style={{ padding: '10px 15px' }}>Update</th>
                <th style={{ padding: '10px 15px' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ 
                  textAlign: 'center', 
                  backgroundColor: user.id % 2 === 0 ? '#761a1a' : '#761a1a',
                  color: 'white'
                }}>
                  <td style={{ padding: '12px' }}>{user.id}</td>
                  <td style={{ padding: '12px' }}>{user.name}</td>
                  <td style={{ padding: '12px' }}>{user.surname}</td>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>{user.password ? '••••••••' : ''}</td>
                  <td style={{ padding: '12px' }}>{user.role}</td>
                  <td className='update'>
                    <Link to={`/update/${user.id}`} style={{ 
                      color: "white", 
                      textDecoration: 'none', 
                      fontWeight: 'bold' 
                    }}>
                      🔄 Update
                    </Link>
                  </td>
                  <td className='delete' onClick={() => handleDelete(user.id)}>
                    <span style={{ 
                      color: "white", 
                      cursor: 'pointer', 
                      fontWeight: 'bold' 
                    }}>
                      ✖️ Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </center>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Link to="/Signup" style={{ textDecoration: 'none' }}>
          <button className='users-button' style={{ 
            backgroundColor: '#20615b', 
            color: '#fff', 
            padding: '10px 20px', 
            borderRadius: '5px', 
            border: 'none', 
            fontSize: '18px', 
            cursor: 'pointer' 
          }}>
            ➕ Add new User
          </button>
        </Link>
      </div>
    </div>
  );
};

export default User;