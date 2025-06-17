import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { useBooking } from './BookingContext'; // ✅ Make sure the path is correct

function Dashboard() {
  const {
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    itemsToClean,
    setItemsToClean,
  } = useBooking();

  const navigate = useNavigate();

  const handleItemChange = (item) => {
    setItemsToClean((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const availableItems = [
    'Kitchen',
    'Bathroom',
    'Living Room',
    'Bedroom',
    'Windows',
    'Floors',
  ];

  return (
    <div style={styles.container}>
      <h2>Book a Cleaning Appointment</h2>

      <div style={styles.formGroup}>
        <label>Select a Date:</label>
        <DatePicker
          selected={bookingDate}
          onChange={setBookingDate}
          dateFormat="MMMM d, yyyy"
          minDate={new Date()}
          placeholderText="Choose a date"
        />
      </div>

      <div style={styles.formGroup}>
        <label>Select Time:</label>
        <select
          value={bookingTime}
          onChange={(e) => setBookingTime(e.target.value)}
        >
          <option value="">--Select Time--</option>
          <option value="9:00 AM">9:00 AM</option>
          <option value="11:00 AM">11:00 AM</option>
          <option value="1:00 PM">1:00 PM</option>
          <option value="3:00 PM">3:00 PM</option>
          <option value="5:00 PM">5:00 PM</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label>Items to be cleaned:</label>
        {availableItems.map((item) => (
          <div key={item}>
            <label>
              <input
                type="checkbox"
                checked={itemsToClean.includes(item)}
                onChange={() => handleItemChange(item)}
              />
              {item}
            </label>
          </div>
        ))}
      </div>

      <button
        style={{ ...styles.button, backgroundColor: '#1e7f2f' }}
        onClick={() => navigate('/cleaners')}
      >
        Go to Cleaners Dashboard
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    marginTop: '50px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default Dashboard;