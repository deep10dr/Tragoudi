import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bxijsrxazpkfnbfonlrt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4aWpzcnhhenBrZm5iZm9ubHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzU3MDAsImV4cCI6MjA2MTE1MTcwMH0.bLASp-wmOe-XqUTvF9FvUmawGgumRN-0TKLSEDqfTxI'; // Truncated
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
