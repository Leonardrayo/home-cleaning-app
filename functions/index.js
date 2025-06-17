const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// ✅ Securely use the SendGrid API key from Firebase environment config
sgMail.setApiKey(functions.config().sendgrid.key);

// Callable function to send email to a cleaner
exports.sendCleanerNotification = functions.https.onCall(async (data, context) => {
  const {cleanerName, cleanerEmail, clientEmail} = data;

  if (!cleanerName || !cleanerEmail || !clientEmail) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields"
    );
  }

  const msg = {
    to: cleanerEmail,
    from: "your_verified_sender@example.com", // 🔐 Must be verified in SendGrid
    subject: `New Cleaning Request for ${cleanerName}`,
    text:
      `Hello ${cleanerName},\n\n `+
      `A client (${clientEmail}) has selected you for a cleaning job.\n\n `+
      `Please check your dashboard for more details.`,
  };

  try {
    await sgMail.send(msg);
    return {success: true, message: "Email sent successfully."};
  } catch (error) {
    console.error("SendGrid Error:", error);
    throw new functions.https.HttpsError("internal", "Failed to send email");
  }
});