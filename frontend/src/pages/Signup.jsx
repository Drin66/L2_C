import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [user, setUser] = useState({
    name:"",
    surname:"",
    email:"",
    password:"",
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    setUser(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  useEffect(() => {
    axios.get('http://localhost:8080')
        .then(res => {
            if (res.data.valid) {
                navigate('/');
            } else {
                navigate('/Signup');
            }
        })
        .catch(err => console.log(err));
  }, [navigate]);

  const handleClick = async e => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/v1/register", user);
      console.log("New user created:", response.data);
      navigate("/user");
    } catch(err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '90vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        padding: '40px',
        borderRadius: '8px', 
        width: '400px', 
        border: '2px solid #d32f2f',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '24px', 
          color: '#d32f2f', 
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Sign Up Below
        </h1>

        <label htmlFor='name' style={{ 
          display: 'block', 
          marginBottom: '10px', 
          fontWeight: 'bold', 
          color: 'red' 
        }}>
          Name:
        </label>
        <input 
          type="text" 
          placeholder='Enter your name' 
          onChange={handleChange} 
          name="name" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            marginBottom: '20px', 
            border: '2px solid red', 
            borderRadius: '5px', 
            fontSize: '16px' 
          }}
        />

        <label htmlFor='surname' style={{ 
          display: 'block', 
          marginBottom: '10px', 
          fontWeight: 'bold', 
          color: 'red' 
        }}>
          Surname:
        </label>
        <input 
          type="text" 
          placeholder='Enter your surname' 
          onChange={handleChange} 
          name="surname" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            marginBottom: '20px', 
            border: '2px solid red', 
            borderRadius: '5px', 
            fontSize: '16px' 
          }}
        />

        <label htmlFor='email' style={{ 
          display: 'block', 
          marginBottom: '10px', 
          fontWeight: 'bold', 
          color: 'red' 
        }}>
          Email:
        </label>
        <input 
          type="email" 
          placeholder='Enter your email' 
          onChange={handleChange} 
          name="email" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            marginBottom: '20px', 
            border: '2px solid red', 
            borderRadius: '5px', 
            fontSize: '16px' 
          }}
        />

        <label htmlFor='password' style={{ 
          display: 'block', 
          marginBottom: '10px', 
          fontWeight: 'bold', 
          color: 'red' 
        }}>
          Password:
        </label>
        <input 
          type="password" 
          placeholder='Enter your password' 
          onChange={handleChange} 
          name="password" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            marginBottom: '20px', 
            border: '2px solid red', 
            borderRadius: '5px', 
            fontSize: '16px' 
          }}
        />

        <button 
          onClick={handleClick} 
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#20615b', 
            color: 'white', 
            borderRadius: '5px', 
            border: 'none', 
            fontSize: '16px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
            ':hover': {
              backgroundColor: '#b71c1c'
            }
          }}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Signup;