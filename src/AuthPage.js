// AuthPage.js
import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  const toggleAuth = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div>
      {showLogin ? <Login /> : <Signup />}
      <br />
      <button onClick={toggleAuth}>
        {showLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
      </button>
    </div>
  );
}

export default AuthPage;