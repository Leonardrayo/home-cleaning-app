// Signup.js
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from './Firebase';
import { useNavigate } from 'react-router-dom';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;

      const userDocRef = doc(db, 'activities', userEmail);
      const logsCollectionRef = collection(userDocRef, 'logs');
      await addDoc(logsCollectionRef, {
        type: 'signup',
        timestamp: serverTimestamp(),
      });

      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      console.error('Signup error:', err.code, err.message);

      switch (err.code) {
        case 'auth/email-already-in-use':
          alert('Email already in use. Redirecting to login...');
          navigate('/login');
          break;
        case 'auth/invalid-email':
          setError('Invalid email format.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection.');
          break;
        case 'auth/visibility-check-was-unavailable':
          setError(
            'We couldn’t complete the signup due to a browser issue. Please retry in a new tab or switch to another browser (like Chrome).'
          );
          break;
        default:
          setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleGoogleSignup = async () => {
    setError('');

    if (!navigator.onLine) {
      setError('You appear to be offline. Google Sign-In requires an internet connection.');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      const userDocRef = doc(db, 'activities', userEmail);
      const logsCollectionRef = collection(userDocRef, 'logs');
      await addDoc(logsCollectionRef, {
        type: 'google-signup',
        timestamp: serverTimestamp(),
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Google signup error:', err.code, err.message);
      setError('Google signup failed. Try again or use email/password.');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
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
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <br />
      <button onClick={handleGoogleSignup} disabled={loading}>
        Sign Up with Google
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br />
      <p>Already have an account? <a href="/login">Log in</a></p>
    </div>
  );
}

export default Signup;