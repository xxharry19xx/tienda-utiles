import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://oscituaklxfonvcmsrsc.supabase.co'
const SUPABASE_ANON = 'sb_publishable_jsi8l3TgCePI9b0ZY1x7rg_s_nitFD0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
