import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useBooking } from './BookingContext';

function CleanersDashboard() {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bookingDate, bookingTime, itemsToClean } = useBooking();

  useEffect(() => {
    const fetchCleaners = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/cleaners`);
        console.log('✅ All cleaners:', res.data);
        const freeCleaners = res.data.filter(c => c.Status === 'Free'); // Capital "Status" and "Free"
        setCleaners(freeCleaners);
      } catch (err) {
        console.error('❌ Failed to fetch cleaners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCleaners();
  }, []);

  const handleSelectCleaner = async (cleaner) => {
    const emailBody = `
Hello ${cleaner.Name},

You have been selected for a new cleaning appointment:
📅 Date: ${bookingDate?.toLocaleDateString()}
⏰ Time: ${bookingTime}
🧹 Items: ${itemsToClean.join(', ') || 'None'}

Please confirm your availability.
    `;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/send-email`, {
        to: cleaner.Email,
        subject: 'New Cleaning Assignment',
        text: emailBody,
      });

      alert(`✅ Email sent to ${cleaner.Name}`);
    } catch (error) {
      console.error('❌ Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  if (loading) return <p>Loading cleaners...</p>;

  return (
    <div style={styles.container}>
      <h2>Available Cleaners</h2>
      {cleaners.length === 0 ? (
        <p>No cleaners available.</p>
      ) : (
        cleaners.map((cleaner) => (
          <div key={cleaner.id} style={styles.card}>
            <p><strong>Name:</strong> {cleaner.Name}</p>
            <p><strong>Email:</strong> {cleaner.Email}</p>
            <p><strong>Status:</strong> {cleaner.Status}</p>
            <button
              style={styles.button}
              onClick={() => handleSelectCleaner(cleaner)}
              disabled={!bookingDate || !bookingTime}
            >
              Select Cleaner
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    marginTop: '40px',
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  button: {
    marginTop: '10px',
    padding: '10px 16px',
    fontSize: '15px',
    backgroundColor: '#1e7f2f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default CleanersDashboard;