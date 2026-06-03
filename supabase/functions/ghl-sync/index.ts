import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Initialize Supabase client to verify the user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 2. Get the user from the token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Response('Unauthorized', { status: 401 })
    }

    const email = user.email;
    if (!email) {
      throw new Error('User has no email address');
    }

    // 3. Get GHL Secrets
    const ghlApiKey = Deno.env.get('GHL_API_KEY');
    const ghlLocationId = Deno.env.get('GHL_LOCATION_ID');

    if (!ghlApiKey || !ghlLocationId) {
      console.warn("GHL_API_KEY or GHL_LOCATION_ID not set. Returning mock data.");
      // Return fallback demo data so the app doesn't break if keys aren't configured yet.
      return new Response(JSON.stringify({
         sales: 2,
         recruits: 1,
         volume: 3000,
         selectedRank: 0,
         referralLink: "https://remotefitlabs.com/join?ref=ambassador123",
         mocked: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // 4. Call GoHighLevel API to fetch the contact by email
    const ghlRes = await fetch(`https://services.leadconnectorhq.com/contacts/?locationId=${ghlLocationId}&query=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ghlApiKey}`,
        'Version': '2021-07-28', // Use current version header
        'Accept': 'application/json'
      }
    });

    if (!ghlRes.ok) {
      const errText = await ghlRes.text();
      throw new Error(`GHL API Error: ${ghlRes.status} ${errText}`);
    }

    const ghlData = await ghlRes.json();
    
    if (!ghlData.contacts || ghlData.contacts.length === 0) {
      // Contact not found in GHL, return default zeroed stats
      return new Response(JSON.stringify({
         sales: 0,
         recruits: 0,
         volume: 0,
         selectedRank: 0,
         referralLink: "https://remotefitlabs.com/join?ref=pending",
         mocked: false,
         contactFound: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const contact = ghlData.contacts[0];
    const customFields = contact.customFields || [];

    // NOTE: Replace these with your actual Custom Field IDs or logic
    // We are trying to find custom fields by name if possible, or extracting values based on standard naming conventions.
    // Since IDs vary per account, you might need to map them. 
    // Example format from GHL: [{ id: "...", value: "10" }]
    
    // As a helper, we will just return the full customFields array so the frontend can parse it, 
    // but we'll also try to extract known metrics if we can identify them.
    
    return new Response(JSON.stringify({
      contactId: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      tags: contact.tags,
      customFields: customFields,
      // For now, we will return custom fields raw, and the frontend will map them.
      mocked: false,
      contactFound: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: unknown) {
    console.error('Function error:', error)
    // If it's a standard error, return it
    if (error instanceof Response) return error;
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
