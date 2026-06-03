import fs from 'fs';

async function testGHL() {
  const ghlLocationId = "p7xWcDzGEA2QmFHZSZoZ";
  const ghlApiKey = "pit-5726200c-de90-434e-a937-d2753d6c3af5";
  const email = "test@example.com"; // We will try to just list some contacts if this email doesn't exist

  const headers = {
    'Authorization': `Bearer ${ghlApiKey}`,
    'Version': '2021-07-28',
    'Accept': 'application/json'
  };

  console.log("1. Testing Contacts API...");
  try {
    const contactRes = await fetch(`https://services.leadconnectorhq.com/contacts/?locationId=${ghlLocationId}&limit=5`, { method: 'GET', headers });
    if (!contactRes.ok) {
      console.error("Contacts Error:", await contactRes.text());
    } else {
      const contactData = await contactRes.json();
      console.log(`Found ${contactData.contacts?.length} contacts.`);
      if (contactData.contacts?.length > 0) {
         console.log("Sample contact:", contactData.contacts[0].email, contactData.contacts[0].id);
         
         const testContactId = contactData.contacts[0].id;
         console.log(`\n2. Testing Transactions API for contact ${testContactId}...`);
         const txnRes = await fetch(`https://services.leadconnectorhq.com/payments/transactions?altId=${ghlLocationId}&altType=location&contactId=${testContactId}&limit=5`, { method: 'GET', headers });
         if (!txnRes.ok) {
           console.error("Transactions Error:", await txnRes.text());
         } else {
           const txnData = await txnRes.json();
           console.log("Transactions data:", JSON.stringify(txnData, null, 2));
         }
      }
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testGHL();
