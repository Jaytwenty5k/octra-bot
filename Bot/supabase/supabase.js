import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wpdfnxkhzdtazgjmlpen.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZGZueGtoemR0YXpnam1scGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MjA2NDksImV4cCI6MjA2MTk5NjY0OX0.yAqsR0jR0zOPgAOdilMJJ-KD7GSeypzbeOumf37isaM'; // Achtung: NICHT public posten

export const supabase = createClient(supabaseUrl, supabaseKey);