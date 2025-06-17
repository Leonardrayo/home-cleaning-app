import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState('');
  const [itemsToClean, setItemsToClean] = useState([]);

  return (
    <BookingContext.Provider
      value={{
        bookingDate,
        setBookingDate,
        bookingTime,
        setBookingTime,
        itemsToClean,
        setItemsToClean,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}