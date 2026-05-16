// api/supabase_helpers.js
import { supabase } from './supabaseClient.js';

/**
 * 1. Upsert User Profile
 * Triggers when a Web3 wallet connects. Inserts a new profile or updates an existing one.
 */
export async function dbUpsertUser(walletAddress, username, userType = 'client') {
  const lowercaseAddress = walletAddress.toLowerCase();
  const { data, error } = await supabase
    .from('users')
    .upsert([{ 
      id: lowercaseAddress, 
      username: username,
      wallet_address: lowercaseAddress,
      user_type: userType
    }])
    .select();

  if (error) throw error;
  return data[0];
}

/**
 * 2. Post a New Escrow Job Listing
 * Client logs a job off-chain that mirrors a Monad smart contract transaction parameters.
 */
export async function dbPostJob(contractJobId, title, description, budget, daysFromNow, clientAddress) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + parseInt(daysFromNow));

  const { data, error } = await supabase
    .from('jobs')
    .insert([{
      id: contractJobId,
      title: title,
      description: description,
      budget: budget,
      due_date: dueDate.toISOString(),
      status: 'OPEN',
      client_id: clientAddress.toLowerCase()
    }])
    .select();

  if (error) throw error;
  return data[0];
}

/**
 * 3. Fetch Open Marketplace Gigs
 * Used by freelancers to browse jobs with an 'OPEN' status filter.
 */
export async function dbFetchMarketplaceJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'OPEN')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * 4. Fetch Client Workspace Dashboard
 * Retrieves all jobs posted by a specific client wallet layout.
 */
export async function dbFetchClientJobs(clientAddress) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('client_id', clientAddress.toLowerCase())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * 5. Instant Claim Gig
 * Updates an 'OPEN' job to 'IN_PROGRESS' and attaches the freelancer's identity.
 */
export async function dbAcceptJob(jobId, freelancerAddress) {
  const { data, error } = await supabase
    .from('jobs')
    .update({ 
      Freelancer_id: freelancerAddress.toLowerCase(), 
      status: 'IN_PROGRESS' 
    })
    .eq('id', jobId)
    .select();

  if (error) throw error;
  return data[0];
}

/**
 * 6. Submit Completed Deliverables
 * Freelancer pushes delivery summaries or verification tracking URIs to the client.
 */
export async function dbSubmitWork(jobId, deliveryNotes, deliveryUrl) {
  const { data, error } = await supabase
    .from('jobs')
    .update({ 
      status: 'SUBMITTED',
      delivery_notes: deliveryNotes,
      chat_logs: deliveryUrl
    })
    .eq('id', jobId)
    .select();

  if (error) throw error;
  return data[0];
}

/**
 * 7. Approve Work & Finalize Payout
 * Client marks the job lifecycle as finalized and settled.
 */
export async function dbResolveJob(jobId) {
  const { data, error } = await supabase
    .from('jobs')
    .update({ status: 'RESOLVED' })
    .eq('id', jobId)
    .select();

  if (error) throw error;
  return data[0];
}