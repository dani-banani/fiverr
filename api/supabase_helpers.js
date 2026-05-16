// api/supabase_helpers.js
import { supabase } from './supabaseClient.js';

/**
 * 🔥 THE ULTIMATE DYNAMIC QUERY HELPER
 * Allows you to run single-line queries from anywhere in your app.
 * * @param {string} table - The name of the table ('jobs', 'users')
 * @param {object} options - Configure filters, selections, limits, and updates dynamically
 */
export async function dbQuery(table, options = {}) {
  const columns = options.select || '*';
  let query;

  if (options.update) {
    query = supabase.from(table).update(options.update);
  } else if (options.insert) {
    query = supabase.from(table).insert(options.insert).select(columns);
  } else {
    query = supabase.from(table).select(columns);
  }

  // Apply filters — only for update/select, not bare insert
  if (options.eq) {
    for (const [column, value] of Object.entries(options.eq)) {
      if (value !== undefined) query = query.eq(column, value);
    }
  }

  if (options.update) {
    query = query.select(columns); // return updated rows
  }

  if (options.order) {
    const column    = options.order.column    ?? 'created_at';
    const ascending = options.order.ascending ?? false;
    query = query.order(column, { ascending });
  }

  if (options.single) {
    query = query.single();
  } else if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// ============================================================================
// 🛠️ YOUR FIXED HARDCODED SHORTCUTS (Kept intact so your code doesn't break!)
// ============================================================================

export async function dbUpsertUser(walletAddress, username, userType = 'client') {
  const lowercaseAddress = walletAddress.toLowerCase();
  const { data, error } = await supabase
    .from('users')
    .upsert([{ id: lowercaseAddress, username, wallet_address: lowercaseAddress, user_type: userType }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function dbPostJob(title, description, budget, daysFromNow, clientAddress) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + parseInt(daysFromNow));

  return dbQuery('jobs', {
    insert: [{
      title,
      description,
      budget,
      due_date:  dueDate.toISOString(),
      status:    'OPEN',
      client_id: clientAddress.toLowerCase(),
      // no id field — Supabase auto-generates it
    }]
  }).then(res => res[0]);
}

export async function dbFetchMarketplaceJobs() {
  return dbQuery('jobs', { eq: { status: 'OPEN' }, order: { column: 'created_at', ascending: false } });
}

export async function dbFetchClientJobs(clientAddress) {
  return dbQuery('jobs', { eq: { client_id: clientAddress.toLowerCase() }, order: { column: 'created_at', ascending: false } });
}

export async function dbAcceptJob(jobId, freelancerAddress) {
  return dbQuery('jobs', {
    update: { freelancer_id: freelancerAddress.toLowerCase(), status: 'IN_PROGRESS' }, // ← was Freelancer_id
    eq: { id: jobId }
  }).then(res => res[0]);
}

export async function dbSubmitWork(jobId, deliveryNotes, deliveryUrl) {
  return dbQuery('jobs', {
    update: { status: 'SUBMITTED', delivery_notes: deliveryNotes, chat_logs: deliveryUrl },
    eq: { id: jobId }
  }).then(res => res[0]);
}

export async function dbResolveJob(jobId) {
  return dbQuery('jobs', {
    update: { status: 'RESOLVED' },
    eq: { id: jobId }
  }).then(res => res[0]);
}
