const handleSelectCleaner = async (cleaner) => {
  if (!cleaner?.email) {
    alert("❌ Cleaner email not available. Cannot send email.");
    return;
  }

  if (!bookingDate || !bookingTime || !itemsToClean?.length) {
    alert("❌ Missing booking information. Please make sure date, time, and items are selected.");
    return;
  }

  console.log("🧼 Selected cleaner:", cleaner.name);
  console.log("📅 Date:", bookingDate?.toLocaleDateString());
  console.log("⏰ Time:", bookingTime);
  console.log("🧹 Items:", itemsToClean);

  const emailBody = `
Hello ${cleaner.name},

You have been selected for a new cleaning appointment:
📅 Date: ${bookingDate?.toLocaleDateString()}
⏰ Time: ${bookingTime}
🧹 Items: ${itemsToClean.join(', ')}

Please confirm your availability.
  `;

  try {
    const baseURL = process.env.REACT_APP_API_URL;
    if (!baseURL) {
      console.error("❌ Missing REACT_APP_API_URL in .env");
      return alert("Server URL not configured. Please check your .env file.");
    }

    const url = `${baseURL.replace(/\/$/, '')}/send-email`;

    const response = await axios.post(url, {
      to: cleaner.email,
      subject: 'New Cleaning Assignment',
      text: emailBody,
    });

    console.log("📨 Email sent successfully:", response.data);
    alert(`✅ Email sent to ${cleaner.name}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    alert('❌ Failed to send email. Please try again later.');
  }
};