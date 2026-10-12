// api/donations.js
let donations = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  console.log(`📨 ${req.method} request to donations`);

  if (req.method === 'GET') {
    const lastCheck = parseInt(req.query.lastCheck) || 0;
    const newDonations = donations.filter(d => new Date(d.timestamp).getTime() > lastCheck);
    console.log(`📤 Sending ${newDonations.length} new donations`);
    return res.json(newDonations);
  }

  if (req.method === 'POST') {
    try {
      console.log('💰 DONATION DATA:', JSON.stringify(req.body, null, 2));
      
      let donationData = req.body;
      if (req.body.event === 'donation' && req.body.data) {
        donationData = req.body.data;
      }
      
      const donation = {
        id: Date.now(),
        name: donationData.donor_name || donationData.name || 'Axzyy027',
        amount: donationData.amount || donationData.donation_amount || 10000,
        message: donationData.message || donationData.donation_message || '',
        timestamp: new Date().toISOString()
      };
      
      donations.push(donation);
      console.log('💾 DONATION SAVED:', donation);
      
      return res.json({ status: 'success', donation: donation });
      
    } catch (error) {
      console.error('❌ ERROR:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.json({ status: 'online', donations_count: donations.length });
}