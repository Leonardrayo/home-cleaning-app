// Login.js
import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from './Firebase';
import { useNavigate } from 'react-router-dom';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;

      const userDocRef = doc(db, 'activities', userEmail);
      const logsCollectionRef = collection(userDocRef, 'logs');
      await addDoc(logsCollectionRef, {
        type: 'login',
        timestamp: serverTimestamp(),
      });

      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err.code, err.message);

      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');

    if (!navigator.onLine) {
      setError('You appear to be offline. Google Sign-In requires internet.');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      const userDocRef = doc(db, 'activities', userEmail);
      const logsCollectionRef = collection(userDocRef, 'logs');
      await addDoc(logsCollectionRef, {
        type: 'google-login',
        timestamp: serverTimestamp(),
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err.code, err.message);
      setError('Google login failed. Try again or use email/password.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <br />
      <button onClick={handleGoogleLogin} disabled={loading}>
        Log In with Google
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br />
      <p>Don’t have an account? <a href="/signup">Sign up</a></p>
    </div>
  );
}

export default Login;