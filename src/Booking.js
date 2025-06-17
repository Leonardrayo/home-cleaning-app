// Booking.js
import React, { useState } from 'react';
import { db, auth } from './Firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

function Booking() {
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      setMessage("You must be logged in to book.");
      return;
    }

    try {
      await addDoc(collection(db, 'bookings'), {
        userEmail: user.email,
        serviceType,
        date,
        time,
        address,
        status: 'pending',
        timestamp: serverTimestamp()
      });
      setMessage("Booking successful!");
      setServiceType(''); setDate(''); setTime(''); setAddress('');
    } catch (err) {
      setMessage("Booking failed: " + err.message);
    }
  };

  return (
    <form onSubmit={handleBooking}>
      <h2>Book a Cleaning</h2>
      <input placeholder="Service Type" value={serviceType} onChange={e => setServiceType(e.target.value)} required />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
      <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
      <button type="submit">Book Now</button>
      <p>{message}</p>
    </form>
  );
}

export default Booking;