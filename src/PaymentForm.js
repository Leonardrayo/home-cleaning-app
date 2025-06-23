import React, { useState } from 'react';
import axios from 'axios';

function PaymentForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('500');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePayment = async () => {
    if (!phoneNumber.match(/^07\d{8}$/)) {
      return setMessage('❌ Enter a valid Safaricom number (07XXXXXXXX)');
    }

    try {
      setLoading(true);
      setMessage('');

      const baseURL = process.env.REACT_APP_API_URL;

      const response = await axios.post(`${baseURL}/mpesa/stk-push`, {
        phoneNumber: `254${phoneNumber.slice(1)}`,
        amount,
      });

      console.log('✅ Payment Response:', response.data);
      setMessage('✅ STK Push sent. Check your phone to complete the payment.');
    } catch (err) {
      console.error('❌ Payment error:', err.response?.data || err.message);
      setMessage('❌ Failed to initiate payment. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Pay with M-Pesa</h2>
      <input
        type="text"
        placeholder="Phone Number (07XXXXXXXX)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={styles.input}
      />
      <button onClick={handlePayment} style={styles.button} disabled={loading}>
        {loading ? 'Sending STK Push...' : 'Pay with M-Pesa'}
      </button>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#1e7f2f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default PaymentForm;