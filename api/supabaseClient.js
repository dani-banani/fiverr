import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = "https://irywemujuaeldlkuhfam.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyeXdlbXVqdWFlbGRsa3VoZmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTQ0MjMsImV4cCI6MjA5NDQ5MDQyM30.SB6JHFWb6GzXfedPzXV5fueTOBh-k_TiaSUcmaP338o";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);