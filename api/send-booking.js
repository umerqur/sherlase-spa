export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, phone, email, service, preferredDate, preferredTime, message } = req.body;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Sherlase Booking <onboarding@resend.dev>',
        to: 'info@sherlaseclinic.com',
        subject: `New Booking Request: ${service}`,
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Preferred Date:</strong> ${preferredDate || 'Not specified'}</p>
          <p><strong>Preferred Time:</strong> ${preferredTime || 'Not specified'}</p>
          <p><strong>Special Requests:</strong> ${message || 'None'}</p>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to send booking request' });
  }
}
