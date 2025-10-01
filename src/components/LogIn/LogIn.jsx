
import React from 'react';
import './Login.css';
import azureLogo from '../../assets/images/blue-logo-azure-bank.svg'

function LogIn() {
  return (
    <div className="azure-login-page">
    <img className="login-logo" src={azureLogo} alt="" />
    <div className="login-container">
      <p className="welcome">Welcome!</p>
      <p className="welcome-p">Hello! Please enter your details.</p>




      <div className="input-div">
        <p className="username">Username</p>
        <input
          className="username-input"
          type="text"
          placeholder="Enter your Username"
        />
      </div>


      <div className="input-div">
        <p className="username">Password</p>
        <input
          className="username-input"
          type="password" // Use 'password' type for password input
          placeholder="Enter your Password"
        />
      </div>

      <div className="rememberme-and-password">
        <div className="rememberme">
          <input type="checkbox" />
          <p>Remember me</p>
        </div>

        <div className="password">
          <p>
            <a href="#">Forgot password?</a>
          </p>
        </div>
      </div>

      <button className="sign-in">Sign in</button>
      <button className="contact-us">Contact us</button>

      <p className="no-account">
        Don't have an account? <a href="#" className="sign-up">Sign up</a>
      </p>
    </div>
  </div>
  )
}

export default LogIn;