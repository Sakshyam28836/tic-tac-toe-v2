// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cptsuzbzqarpadwqnive.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdHN1emJ6cWFycGFkd3FuaXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NDM5MjcsImV4cCI6MjA1NTExOTkyN30.1CTnlMXH0_rzGplpvDg4rVBMshjAX-uCJQspkGwokhU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);