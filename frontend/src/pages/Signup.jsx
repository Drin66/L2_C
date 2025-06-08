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
          marginBottom: '2rem',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          Sign Up
        </h1>

        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor='name' style={{ 
              color: '#e5e7eb',
              fontWeight: '500',
            }}>
              Name:
            </label>
            <input 
              type="text" 
              placeholder='Enter your name' 
              onChange={handleChange} 
              name="name" 
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
            }}>
              Surname:
            </label>
            <input 
              type="text" 
              placeholder='Enter your surname' 
              onChange={handleChange} 
              name="surname" 
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
            }}>
              Email:
            </label>
            <input 
              type="email" 
              placeholder='Enter your email' 
              onChange={handleChange} 
              name="email" 
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
            }}>
              Password:
            </label>
            <input 
              type="password" 
              placeholder='Enter your password' 
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

          <button 
            onClick={handleClick} 
            style={{ 
              marginTop: '1rem',
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
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;