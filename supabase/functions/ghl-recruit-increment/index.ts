// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ─── 1. Authenticate the caller ───
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized', details: userError?.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // ─── 2. Parse the request body ───
    const { referrerId, newUserEmail } = await req.json();
    if (!referrerId) {
      return new Response(JSON.stringify({ error: 'Missing referrerId' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // ─── 3. Get GHL credentials ───
    const ghlApiKey = Deno.env.get('GHL_API_KEY');
    const ghlLocationId = Deno.env.get('GHL_LOCATION_ID');

    if (!ghlApiKey || !ghlLocationId) {
      return new Response(JSON.stringify({ error: 'GHL credentials not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const ghlHeaders = {
      'Authorization': `Bearer ${ghlApiKey}`,
      'Version': '2021-07-28',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // ─── 4. Fetch the referring ambassador's contact from GHL ───
    const contactRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/${referrerId}`,
      { method: 'GET', headers: ghlHeaders }
    );

    if (!contactRes.ok) {
      const errText = await contactRes.text();
      console.error(`GHL fetch referrer failed: ${contactRes.status} ${errText}`);
      return new Response(JSON.stringify({ 
        error: 'Could not find referring ambassador in GHL',
        details: errText
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    const contactData = await contactRes.json();
    const contact = contactData.contact || contactData;
    const customFields = contact.customFields || [];

    // ─── 5. Find current "Ambassador Total Recruits" value ───
    let currentRecruits = 0;
    let recruitFieldKey = '';

    for (const cf of customFields) {
      const cfKey = (cf.key || cf.id || '').toLowerCase();
      const cfName = (cf.name || '').toLowerCase();
      if (cfKey === 'ambassador_total_recruits' || cfName === 'ambassador total recruits') {
        currentRecruits = parseInt(String(cf.value ?? cf.field_value ?? '0'), 10);
        recruitFieldKey = cf.id || cf.key || '';
        break;
      }
    }

    const newRecruits = currentRecruits + 1;

    // ─── 6. Update the contact's custom field in GHL ───
    // Build the update payload — we need to use the custom field ID
    let updateBody: any = {};

    if (recruitFieldKey) {
      // Update using the specific custom field key/id
      updateBody = {
        customFields: [
          { id: recruitFieldKey, value: newRecruits }
        ]
      };
    } else {
      // If we couldn't find the field by iteration, try by key name
      updateBody = {
        customFields: [
          { key: 'ambassador_total_recruits', value: newRecruits }
        ]
      };
    }

    const updateRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/${referrerId}`,
      {
        method: 'PUT',
        headers: ghlHeaders,
        body: JSON.stringify(updateBody)
      }
    );

    if (!updateRes.ok) {
      const updateErr = await updateRes.text();
      console.error(`GHL update referrer failed: ${updateRes.status} ${updateErr}`);
      return new Response(JSON.stringify({ 
        error: 'Failed to update referrer recruit count',
        details: updateErr
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const updateData = await updateRes.json();

    // ─── 7. Also tag the new recruit in GHL if they exist ───
    if (newUserEmail) {
      try {
        // Search for the new user in GHL
        const newUserRes = await fetch(
          `https://services.leadconnectorhq.com/contacts/?locationId=${ghlLocationId}&query=${encodeURIComponent(newUserEmail)}`,
          { method: 'GET', headers: ghlHeaders }
        );
        if (newUserRes.ok) {
          const newUserData = await newUserRes.json();
          if (newUserData.contacts && newUserData.contacts.length > 0) {
            const newContact = newUserData.contacts[0];
            // Tag them as referred and store who referred them
            await fetch(
              `https://services.leadconnectorhq.com/contacts/${newContact.id}`,
              {
                method: 'PUT',
                headers: ghlHeaders,
                body: JSON.stringify({
                  tags: [...(newContact.tags || []), 'referred-ambassador'],
                  customFields: [
                    { key: 'referred_by_contact_id', value: referrerId }
                  ]
                })
              }
            );
          }
        }
      } catch (tagErr) {
        console.warn('Could not tag new recruit in GHL (non-blocking):', tagErr);
      }
    }

    // ─── 8. Return success ───
    return new Response(JSON.stringify({
      success: true,
      referrerId,
      previousRecruits: currentRecruits,
      newRecruits,
      message: `Ambassador recruit count updated from ${currentRecruits} to ${newRecruits}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: unknown) {
    console.error('Function error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
