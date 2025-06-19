import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useBooking } from './BookingContext';

function CleanersDashboard() {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const { bookingDate, bookingTime, itemsToClean } = useBooking();

  useEffect(() => {
    const fetchCleaners = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_URL;
        if (!baseURL) return console.error("❌ Missing REACT_APP_API_URL");

        const res = await axios.get(`${baseURL}/cleaners`);
        const normalized = res.data.map(c => ({
          id: c.id,
          name: c.name?.trim() || '',
          email: c.email?.trim() || '',
          status: c.status?.toLowerCase() || 'unknown',
        }));
        setCleaners(normalized);
      } catch (err) {
        console.error('❌ Failed to fetch cleaners:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCleaners();
  }, []);

  const updateCleanerStatus = async (cleanerId, newStatus) => {
    try {
      const baseURL = process.env.REACT_APP_API_URL;
      await axios.put(`${baseURL}/cleaners/${cleanerId}, { status: newStatus }`);
      setCleaners(prev =>
        prev.map(c => (c.id === cleanerId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      console.error(`❌ Failed to update status for ${cleanerId}:, err`);
    }
  };

  const handleSelectCleaner = async (cleaner) => {
    const emailBody = `
Hello ${cleaner.name},

You have been selected for a new cleaning appointment:
📅 Date: ${bookingDate?.toLocaleDateString()}
⏰ Time: ${bookingTime}
🧹 Items: ${itemsToClean.join(', ') || 'None'}

Please confirm your availability.
    `;

    try {
      const baseURL = process.env.REACT_APP_API_URL;
      await axios.post(`${baseURL}/send-email`, {
        to: cleaner.email,
        subject: 'New Cleaning Assignment',
        text: emailBody,
      });

      await updateCleanerStatus(cleaner.id, 'working');
      setSelectedCleaner(cleaner);
      alert(`✅ Email sent & ${cleaner.name}'s status updated`);
    } catch (error) {
      console.error('❌ Error selecting cleaner:', error);
      alert('Failed to send email or update status.');
    }
  };

  const filteredCleaners = filter === 'all'
    ? cleaners
    : cleaners.filter(c => c.status === filter);

  if (loading) return <p>Loading cleaners...</p>;

  return (
    <div style={styles.container}>
      <h2>Cleaners Dashboard</h2>

      {/* 🔎 Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label><strong>Filter by status:</strong> </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.select}>
          <option value="all">All</option>
          <option value="free">Free</option>
          <option value="working">Working</option>
          <option value="on leave">On Leave</option>
        </select>
      </div>

      {/* 👤 Selected Cleaner Display */}
      {selectedCleaner && (
        <div style={styles.selectedCard}>
          <h4>✅ Selected Cleaner</h4>
          <p><strong>Name:</strong> {selectedCleaner.name}</p>
          <p><strong>Email:</strong> {selectedCleaner.email}</p>
          <p><strong>Status:</strong> {selectedCleaner.status}</p>
        </div>
      )}

      {filteredCleaners.length === 0 ? (
        <p>No cleaners match this filter.</p>
      ) : (
        filteredCleaners.map((cleaner) => (
          <div key={cleaner.id} style={styles.card}>
            <p><strong>Name:</strong> {cleaner.name}</p>
            <p><strong>Email:</strong> {cleaner.email}</p>
            <p><strong>Status:</strong> {cleaner.status}</p>

            <div style={styles.buttonGroup}>
              <button
                style={styles.primaryButton}
                onClick={() => handleSelectCleaner(cleaner)}
                disabled={!bookingDate || !bookingTime}
              >
                Select Cleaner
              </button>

              <button
                style={styles.secondaryButton}
                onClick={() => updateCleanerStatus(cleaner.id, 'free')}
              >
                Mark as Free
              </button>

              <button
                style={styles.leaveButton}
                onClick={() => updateCleanerStatus(cleaner.id, 'on leave')}
              >
                Mark On Leave
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '700px',
    margin: '0 auto',
    marginTop: '40px',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    marginLeft: '8px',
  },
  selectedCard: {
    backgroundColor: '#e6ffed',
    padding: '15px',
    marginBottom: '25px',
    border: '2px solid #2ecc71',
    borderRadius: '8px',
  },
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  buttonGroup: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#1e7f2f',
    color: 'white',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  secondaryButton: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  leaveButton: {
    backgroundColor: '#e67e22',
    color: 'white',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default CleanersDashboard;