// MUSTANG ESPORTS — SUPABASE CLIENT INITIALIZER
window.MUSTANG_SUPABASE_CONFIG = {
  url: 'https://qrxqidcjimpnehoofnzx.supabase.co', // Replace with your Supabase Project URL
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyeHFpZGNqaW1wbmVob29mbnp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NDQ0MDcsImV4cCI6MjEwMTQyMDQwN30.ACzoH8BXinEi8KWc-_sTH6EKR8-v2p-36WozCdta8eo'           // Replace with your Supabase Anon Key
};

function initSupabaseClient() {
  if (window.supabase && window.MUSTANG_SUPABASE_CONFIG && window.MUSTANG_SUPABASE_CONFIG.url.includes('supabase.co')) {
    try {
      window.supabaseClient = window.supabase.createClient(
        window.MUSTANG_SUPABASE_CONFIG.url,
        window.MUSTANG_SUPABASE_CONFIG.anonKey
      );
      console.log('Supabase Database Client Initialized');
    } catch (e) {
      console.warn('Supabase initialization failed:', e);
    }
  }
}

document.addEventListener('DOMContentLoaded', initSupabaseClient);
