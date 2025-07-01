"use server";
import { createClient } from "@/lib/supabase/server";

export const supabase = createClient();
