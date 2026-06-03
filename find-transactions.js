import fs from 'fs';

async function findTransactionContact() {
  const ghlLocationId = "p7xWcDzGEA2QmFHZSZoZ";
  const ghlApiKey = "pit-5726200c-de90-434e-a937-d2753d6c3af5";

  const headers = {
    'Authorization': `Bearer ${ghlApiKey}`,
    'Version': '2021-07-28',
    'Accept': 'application/json'
  };

  console.log("Fetching recent transactions...");
  try {
    const txnRes = await fetch(`https://services.leadconnectorhq.com/payments/transactions?altId=${ghlLocationId}&altType=location&limit=50`, { method: 'GET', headers });
    if (!txnRes.ok) throw new Error(await txnRes.text());
    
    const txnData = await txnRes.json();
    const transactions = txnData.data || [];
    console.log(`Found ${transactions.length} recent transactions.`);

    // Find the first transaction that has a contactId
    const txnWithContact = transactions.find(t => t.contactId);

    if (txnWithContact) {
      console.log(`Found transaction for Contact ID: ${txnWithContact.contactId}. Amount: $${txnWithContact.amount/100}`);
      
      // Fetch that contact's email
      const contactRes = await fetch(`https://services.leadconnectorhq.com/contacts/${txnWithContact.contactId}`, { method: 'GET', headers });
      if (!contactRes.ok) throw new Error(await contactRes.text());
      const contactData = await contactRes.json();
      
      console.log(`\nSUCCESS! Use this email to test: ${contactData.contact.email}`);
      console.log(`Name: ${contactData.contact.firstName} ${contactData.contact.lastName}`);
    } else {
      console.log("No transactions with a linked contactId were found.");
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

findTransactionContact();
