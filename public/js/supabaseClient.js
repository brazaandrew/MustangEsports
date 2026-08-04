// MUSTANG ESPORTS — SUPABASE CLIENT INITIALIZER
window.MUSTANG_SUPABASE_CONFIG = {
  url: 'https://your-project-id.supabase.co', // Replace with your Supabase Project URL
  anonKey: 'your-supabase-anon-key'           // Replace with your Supabase Anon Key
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
