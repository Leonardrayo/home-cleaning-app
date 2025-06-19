const handleSelectCleaner = async (cleaner) => {
  console.log("🧼 Selected cleaner:", cleaner);
  console.log("📅 Booking Date:", bookingDate);
  console.log("⏰ Booking Time:", bookingTime);
  console.log("🧹 Items to Clean:", itemsToClean);

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
    if (!baseURL) {
      console.error("❌ Missing REACT_APP_API_URL in .env");
      return alert("Server URL not set in .env file.");
    }

    const response = await axios.post(`${baseURL}/send-email`, {
      to: cleaner.email,
      subject: 'New Cleaning Assignment',
      text: emailBody,
    });

    console.log("📨 Email API response:", response.data);
    alert(`✅ Email sent to ${cleaner.name}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    alert('Failed to send email. Please try again.');
  }
};