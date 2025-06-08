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
        
        const usersData = res.data.data || res.data;
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
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Cinema Users Dashboard
      </h1>
      
      {users.length === 0 ? (
        <div className="text-center text-white mt-4">
          No users found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th style={{ width: '0%' }}>Id</th>
                <th style={{ width: '0%' }}>Name</th>
                <th style={{ width: '0%' }}>Surname</th>
                <th style={{ width: '0%' }}>Email</th>
                <th style={{ width: '0%' }}>Password</th>
                <th style={{ width: '0%' }}>Role</th>
                <th style={{ width: '0%' }}>Update</th>
                <th style={{ width: '0%' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ textAlign: 'center' }}>{user.id}</td>
                  <td style={{ paddingLeft: '1rem' }}>{user.name}</td>
                  <td style={{ paddingLeft: '1rem' }}>{user.surname}</td>
                  <td style={{ paddingLeft: '1rem' }}>{user.email}</td>
                  <td style={{ textAlign: 'center' }}>{user.password ? '••••••••' : ''}</td>
                  <td style={{ textAlign: 'center' }}>{user.role}</td>
                  <td style={{ textAlign: 'center' }}>
                    <Link to={`/update/${user.id}`} className="text-white hover:text-blue-300 transition-colors">
                      🔄 Update
                    </Link>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-white hover:text-red-300 transition-colors"
                    >
                      ✖️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="text-center mt-8">
        <Link to="/Signup">
          <button className="dashboard-button">
            ➕ Add new User
          </button>
        </Link>
      </div>
    </div>
  );
};

export default User;