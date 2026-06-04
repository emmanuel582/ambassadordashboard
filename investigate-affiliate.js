// investigate-affiliate.js
const ghlApiKey = "pit-5726200c-de90-434e-a937-d2753d6c3af5";
const ghlLocationId = "p7xWcDzGEA2QmFHZSZoZ";
const email = "christianhuntington23@gmail.com";

async function investigateAffiliate() {
  const headers = {
    'Authorization': `Bearer ${ghlApiKey}`,
    'Version': '2021-07-28',
    'Accept': 'application/json'
  };

  console.log('=== Checking GHL Affiliate API ===');
  
  // Is there an affiliate endpoint? Let's try fetching affiliates.
  // GHL v2 Affiliate API endpoints: https://services.leadconnectorhq.com/affiliates
  try {
    const res = await fetch(`https://services.leadconnectorhq.com/affiliates?locationId=${ghlLocationId}`, { headers });
    console.log('Affiliates API Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Affiliates:', JSON.stringify(data.affiliates || data, null, 2));
    } else {
      console.log('Error:', await res.text());
    }
  } catch (err) {
    console.log('Affiliate API error:', err.message);
  }

  // Let's also check if they are stored as Users
  try {
    const userRes = await fetch(`https://services.leadconnectorhq.com/users/?locationId=${ghlLocationId}`, { headers });
    console.log('\nUsers API Status:', userRes.status);
    if (userRes.ok) {
      const userData = await userRes.json();
      const user = (userData.users || []).find(u => u.email === email);
      if (user) {
        console.log('User found in location:', user);
      } else {
        console.log('No user found with this email.');
      }
    }
  } catch (err) {}
}

investigateAffiliate().catch(console.error);
