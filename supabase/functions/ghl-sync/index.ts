// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

// ─── Helper: extract a custom field value by its field name (case-insensitive) ───
function getCustomFieldValue(customFields: any[], fieldName: string): string | null {
  if (!Array.isArray(customFields)) return null;
  // GHL custom fields come as { id, value, field_value } or { key, value }
  // We also get the field key which is a snake_case version of the name
  const keyVariant = fieldName.toLowerCase().replace(/\s+/g, '_');
  const found = customFields.find((cf: any) => {
    const cfKey = (cf.key || cf.id || '').toLowerCase();
    const cfName = (cf.name || '').toLowerCase();
    return cfKey === keyVariant || cfName === fieldName.toLowerCase();
  });
  return found ? String(found.value ?? found.field_value ?? '') : null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ─── 1. Authenticate the user via Supabase ───
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
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

    const email = user.email;
    if (!email) {
      throw new Error('User has no email address');
    }

    // ─── 2. Get GHL credentials from Supabase Secrets ───
    const ghlApiKey = Deno.env.get('GHL_API_KEY');
    const ghlLocationId = Deno.env.get('GHL_LOCATION_ID');

    if (!ghlApiKey || !ghlLocationId) {
      console.warn("GHL_API_KEY or GHL_LOCATION_ID not set. Returning fallback data.");
      return new Response(JSON.stringify({
        sales: 0, recruits: 0, volume: 0, selectedRank: 0,
        referralLink: '',
        commissions: { available: 0, pending: 0 },
        transactions: [], subscriptions: [],
        mocked: true, contactFound: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const ghlHeaders = {
      'Authorization': `Bearer ${ghlApiKey}`,
      'Version': '2021-07-28',
      'Accept': 'application/json'
    };

    // ─── 3. Fetch the Contact record from GHL ───
    const contactRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/?locationId=${ghlLocationId}&query=${encodeURIComponent(email)}`,
      { method: 'GET', headers: ghlHeaders }
    );

    if (!contactRes.ok) {
      const errText = await contactRes.text();
      throw new Error(`GHL Contacts API Error: ${contactRes.status} ${errText}`);
    }

    const contactData = await contactRes.json();

    if (!contactData.contacts || contactData.contacts.length === 0) {
      return new Response(JSON.stringify({
        sales: 0, recruits: 0, volume: 0, selectedRank: 0,
        referralLink: '',
        commissions: { available: 0, pending: 0 },
        transactions: [], subscriptions: [],
        mocked: false, contactFound: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const contact = contactData.contacts[0];
    const customFields = contact.customFields || [];

    // ─── 4. Extract Ambassador metrics from Custom Fields ───
    const sales = parseInt(getCustomFieldValue(customFields, 'Ambassador Total Sales') || '0', 10);
    const recruits = parseInt(getCustomFieldValue(customFields, 'Ambassador Total Recruits') || '0', 10);
    const volume = parseFloat(getCustomFieldValue(customFields, 'Ambassador Total Volume') || '0');
    const rankLevel = parseInt(getCustomFieldValue(customFields, 'Ambassador Rank Level') || '1', 10);

    // Attempt to find the real GHL Affiliate link natively
    let referralLink = getCustomFieldValue(customFields, 'Ambassador Referral Link') || '';
    if (!referralLink) {
      // Loop through all custom fields to find any link containing '?am_id='
      for (const cf of customFields) {
        const val = String(cf.value ?? cf.field_value ?? '');
        if (val.includes('?am_id=')) {
          referralLink = val;
          break;
        }
      }
    }

    // Rank level is 1-indexed in the UI (0-indexed in the array), so subtract 1
    const selectedRank = Math.max(0, Math.min(rankLevel - 1, 7));

    // ─── 5. Fetch Payment Transactions, Subscriptions, and Team in Parallel ───
    let transactions: any[] = [];
    let commissionAvailable = 0;
    let commissionPending = 0;
    let subscriptions: any[] = [];
    let allAmbassadors: any[] = [];

    try {
      const [txnRes, subRes, teamRes] = await Promise.all([
        fetch(`https://services.leadconnectorhq.com/payments/transactions?altId=${ghlLocationId}&altType=location&contactId=${contact.id}&limit=10`, { method: 'GET', headers: ghlHeaders }),
        fetch(`https://services.leadconnectorhq.com/payments/subscriptions?altId=${ghlLocationId}&altType=location&contactId=${contact.id}&limit=10`, { method: 'GET', headers: ghlHeaders }),
        fetch(`https://services.leadconnectorhq.com/contacts/?locationId=${ghlLocationId}&limit=100`, { method: 'GET', headers: ghlHeaders })
      ]);

      // Handle Transactions
      if (txnRes.ok) {
        const txnData = await txnRes.json();
        transactions = (txnData.data || []).map((t: any) => ({
          id: t._id || t.id,
          amount: (t.amount || 0), // GHL returns dollars, not cents
          currency: t.currency || 'usd',
          status: t.status || 'unknown',
          createdAt: t.createdAt || t.created_at,
          description: t.name || t.title || 'Payment',
          type: t.type || 'charge',
        }));

        for (const t of transactions) {
          if (t.status === 'succeeded' || t.status === 'completed') {
            commissionAvailable += (t.amount * 0.10); // 10% commission
          } else if (t.status === 'pending') {
            commissionPending += (t.amount * 0.10);
          }
        }
      }

      // Handle Subscriptions
      if (subRes.ok) {
        const subData = await subRes.json();
        subscriptions = (subData.data || []).map((s: any) => ({
          id: s._id || s.id,
          name: s.name || s.title || 'Subscription',
          status: s.status || 'unknown',
          amount: (s.amount || 0),
          currency: s.currency || 'usd',
          interval: s.recurrence?.interval || s.interval || 'month',
          createdAt: s.createdAt || s.created_at,
        }));
      }

      // Handle Team / Leaderboard
      if (teamRes.ok) {
        const teamData = await teamRes.json();
        const allContacts = teamData.contacts || [];

        // Filter to only contacts that have ambassador-related tags
        const ambassadorContacts = allContacts.filter((c: any) => {
          const tags = (c.tags || []).map((t: string) => t.toLowerCase());
          return tags.includes('ambassador - active') ||
            tags.includes('ambassador approved') ||
            tags.includes('ambassador-active') ||
            tags.includes('ambassador-approved');
        });

        for (const amb of ambassadorContacts) {
          const ambCF = amb.customFields || [];
          const ambSales = parseInt(getCustomFieldValue(ambCF, 'Ambassador Total Sales') || '0', 10);
          const ambRecruits = parseInt(getCustomFieldValue(ambCF, 'Ambassador Total Recruits') || '0', 10);
          const ambVolume = parseFloat(getCustomFieldValue(ambCF, 'Ambassador Total Volume') || '0');
          const ambRankLevel = parseInt(getCustomFieldValue(ambCF, 'Ambassador Rank Level') || '1', 10);

          // Find their affiliate link
          let ambRefLink = getCustomFieldValue(ambCF, 'Ambassador Referral Link') || '';
          if (!ambRefLink) {
            for (const cf of ambCF) {
              const val = String(cf.value ?? cf.field_value ?? '');
              if (val.includes('?am_id=')) {
                ambRefLink = val;
                break;
              }
            }
          }

          // Determine status from tags
          const ambTags = (amb.tags || []).map((t: string) => t.toLowerCase());
          let status = 'Active';
          if (ambTags.includes('ambassador - pending') || ambTags.includes('ambassador-pending')) {
            status = 'Pending';
          } else if (ambTags.includes('ambassador - inactive') || ambTags.includes('ambassador-inactive')) {
            status = 'Inactive';
          }

          allAmbassadors.push({
            id: amb.id,
            name: `${amb.firstName || ''} ${amb.lastName || ''}`.trim() || 'Unknown',
            email: amb.email || '',
            rank: ambRankLevel,
            volume: ambVolume,
            sales: ambSales,
            recruits: ambRecruits,
            status,
            joined: amb.dateAdded ? new Date(amb.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown',
            referralLink: ambRefLink,
          });
        }

        // Sort by volume descending for leaderboard
        allAmbassadors.sort((a: any, b: any) => (b.volume || 0) - (a.volume || 0));
      }
    } catch (teamErr) {
      console.warn('Could not fetch ambassador team data:', teamErr);
    }

    // ─── 8. Build the response ───
    return new Response(JSON.stringify({
      contactId: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      tags: contact.tags || [],

      // Ambassador metrics (from Custom Fields)
      sales,
      recruits,
      volume,
      selectedRank,
      referralLink,

      // Payment data (from GHL's connected Stripe)
      commissions: {
        available: commissionAvailable,
        pending: commissionPending,
      },
      transactions,
      subscriptions,

      // Team & Leaderboard data (ALL ambassadors from GHL)
      teamMembers: allAmbassadors,
      leaderboard: allAmbassadors.slice(0, 20), // top 20 for leaderboard

      // Raw custom fields for debugging / future mapping
      customFields,
      mocked: false,
      contactFound: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: unknown) {
    console.error('Function error:', error)
    if (error instanceof Response) return error;

    const errorMessage = error instanceof Error ? error.message : String(error);

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
