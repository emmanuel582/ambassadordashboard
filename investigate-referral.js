const ghlApiKey = "pit-5726200c-de90-434e-a937-d2753d6c3af5";
const ghlLocationId = "p7xWcDzGEA2QmFHZSZoZ";
const contactId = "YllkQ7FjEbo1K0HhMo0p";

async function investigateContact() {
  const headers = {
    'Authorization': `Bearer ${ghlApiKey}`,
    'Version': '2021-07-28',
    'Accept': 'application/json'
  };

  console.log(`\n=== Fetching contact ID: ${contactId} ===\n`);

  const fullRes = await fetch(
    `https://services.leadconnectorhq.com/contacts/${contactId}`,
    { method: 'GET', headers }
  );

  if (!fullRes.ok) {
    console.error('Fetch failed:', fullRes.status, await fullRes.text());
    return;
  }

  const fullData = await fullRes.json();
  const contact = fullData.contact || fullData;
  
  console.log('✅ Contact FOUND!');
  console.log('   ID:', contact.id);
  console.log('   Name:', contact.firstName, contact.lastName);
  console.log('   Email:', contact.email);
  console.log('   Tags:', JSON.stringify(contact.tags || []));
  
  console.log('\n=== Custom Fields ===');
  const customFields = contact.customFields || [];
  if (customFields.length === 0) {
    console.log('   No custom fields found on this contact.');
  } else {
    for (const cf of customFields) {
      console.log(`   ${cf.id || cf.key} | ${cf.name || '(no name)'} = ${cf.value ?? cf.field_value ?? '(empty)'}`);
    }
  }

  console.log('\n=== Looking for referral/affiliate fields ===');
  const interestingKeys = Object.keys(contact).filter(k => 
    k.toLowerCase().includes('referral') || 
    k.toLowerCase().includes('affiliate') || 
    k.toLowerCase().includes('ref') ||
    k.toLowerCase().includes('link') ||
    k.toLowerCase().includes('source') ||
    k.toLowerCase().includes('attribution')
  );
  
  if (interestingKeys.length > 0) {
    for (const key of interestingKeys) {
      console.log(`   ${key}: ${JSON.stringify(contact[key])}`);
    }
  } else {
    console.log('   No referral/affiliate keys found in top-level contact fields.');
  }
}

investigateContact().catch(console.error);
