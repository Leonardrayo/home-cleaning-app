import React, { useEffect, useState } from "react";

const CleanerList = () => {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCleaners = async () => {
      try {
        const res = await fetch("https://home-cleaning-backend.onrender.com/cleaners");
        const data = await res.json();
        setCleaners(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch cleaners:", error);
        setLoading(false);
      }
    };

    fetchCleaners();
  }, []);

  if (loading) return <p>Loading cleaners...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Cleaners</h2>
      <ul>
        {cleaners.map((cleaner) => (
          <li key={cleaner.id} className="border p-2 my-2 rounded shadow">
            <p><strong>Name:</strong> {cleaner.name}</p>
            <p><strong>Status:</strong> {cleaner.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CleanerList;