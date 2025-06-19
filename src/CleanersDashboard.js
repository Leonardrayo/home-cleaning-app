import React, { useEffect, useState } from 'react'; import axios from 'axios'; import { useBooking } from './BookingContext';

function CleanersDashboard() { const [cleaners, setCleaners] = useState([]); const [loading, setLoading] = useState(true); const [filter, setFilter] = useState('all'); const [searchQuery, setSearchQuery] = useState(''); const [selectedCleaner, setSelectedCleaner] = useState(null); const { bookingDate, bookingTime, itemsToClean } = useBooking();

useEffect(() => { const fetchCleaners = async () => { try { const baseURL = process.env.REACT_APP_API_URL; if (!baseURL) return console.error("❌ Missing REACT_APP_API_URL");

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

const interval = setInterval(fetchCleaners, 30000); // auto-refresh
return () => clearInterval(interval);

}, []);

const updateCleanerStatus = async (cleanerId, newStatus) => { try { const baseURL = process.env.REACT_APP_API_URL; await axios.put(`${baseURL}/cleaners/${cleanerId}`, { status: newStatus }); setCleaners(prev => prev.map(c => (c.id === cleanerId ? { ...c, status: newStatus } : c)) ); } catch (err) { console.error(`❌ Failed to update status for ${cleanerId}:, err`); } };

const handleSelectCleaner = async (cleaner) => { if (cleaner.status === 'working') { return alert(`${cleaner.name} is already working.`); }

const emailBody = `

Hello ${cleaner.name},

You have been selected for a new cleaning appointment: 📅 Date: ${bookingDate?.toLocaleDateString()} ⏰ Time: ${bookingTime} 🧹 Items: ${itemsToClean.join(', ') || 'None'}

Please confirm your availability.`;

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

const filteredCleaners = cleaners.filter(c => { const matchesFilter = filter === 'all' || c.status === filter; const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()); return matchesFilter && matchesSearch; });

if (loading) return <p>Loading cleaners...</p>;

return ( <div style={styles.container}> <h2>Cleaners Dashboard</h2>

{/* Filter */}
  <div style={styles.controls}>
    <label><strong>Filter by status:</strong> </label>
    <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.select}>
      <option value="all">All</option>
      <option value="free">Free</option>
      <option value="working">Working</option>
      <option value="on leave">On Leave</option>
    </select>
    <input
      type="text"
      placeholder="Search by name or email"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={styles.searchInput}
    />
  </div>

  {/* Selected Cleaner */}
  {selectedCleaner && (
    <div style={styles.selectedCard}>
      <h4>✅ Selected Cleaner</h4>
      <p><strong>Name:</strong> {selectedCleaner.name}</p>
      <p><strong>Email:</strong> {selectedCleaner.email}</p>
      <p><strong>Status:</strong> {selectedCleaner.status}</p>
    </div>
  )}

  {filteredCleaners.length === 0 ? (
    <p>No cleaners match this filter or search.</p>
  ) : (
    filteredCleaners.map((cleaner) => (
      <div key={cleaner.id} style={styles.card}>
        <p><strong>Name:</strong> {cleaner.name}</p>
        <p><strong>Email:</strong> {cleaner.email}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span style={{ color: statusColors[cleaner.status] || 'black' }}>
            {cleaner.status.toUpperCase()}
          </span>
        </p>
        <button
          style={styles.primaryButton}
          onClick={() => handleSelectCleaner(cleaner)}
          disabled={!bookingDate || !bookingTime || cleaner.status === 'working'}
        >
          Select Cleaner
        </button>
      </div>
    ))
  )}
</div>

); }

const statusColors = { free: 'green', working: 'red', 'on leave': 'orange', };

const styles = { container: { padding: '20px', maxWidth: '800px', margin: '0 auto', marginTop: '40px', }, controls: { marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', }, select: { padding: '8px 12px', borderRadius: '6px', fontSize: '14px', }, searchInput: { padding: '8px 12px', borderRadius: '6px', fontSize: '14px', flex: '1', minWidth: '200px', }, selectedCard: { backgroundColor: '#e6ffed', padding: '15px', marginBottom: '25px', border: '2px solid #2ecc71', borderRadius: '8px', }, card: { backgroundColor: '#f4f4f4', borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', }, primaryButton: { marginTop: '10px', padding: '10px 16px', fontSize: '15px', backgroundColor: '#1e7f2f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', }, };

export default CleanersDashboard;