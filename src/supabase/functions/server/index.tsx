import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-e46e3ba6/health", (c) => {
  return c.json({ status: "ok" });
});

// Signup endpoint
app.post("/make-server-e46e3ba6/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Use Service Role Key for admin privileges (creating users with email_confirm: true)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !serviceRoleKey) {
       console.error("Missing Supabase configuration");
       return c.json({ error: "Server configuration error" }, 500);
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { name: name },
      email_confirm: true
    })

    if (error) {
      console.error("Error creating user:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Generic user data endpoints
app.get("/make-server-e46e3ba6/user-data/:key", async (c) => {
  try {
    const key = c.req.param('key');
    const authHeader = c.req.header('Authorization');
    if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);
    
    const accessToken = authHeader.split(' ')[1];
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    // Create client to verify user
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${accessToken}` } }
    });
    
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error || !user) return c.json({ error: 'Unauthorized' }, 401);

    const value = await kv.get(`user:${user.id}:${key}`);
    return c.json({ data: value });
  } catch (error) {
    console.error("Get data error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/make-server-e46e3ba6/user-data/:key", async (c) => {
  try {
    const key = c.req.param('key');
    const { data: value } = await c.req.json();
    const authHeader = c.req.header('Authorization');
    if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);
    
    const accessToken = authHeader.split(' ')[1];
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${accessToken}` } }
    });
    
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error || !user) return c.json({ error: 'Unauthorized' }, 401);

    await kv.set(`user:${user.id}:${key}`, value);
    return c.json({ success: true });
  } catch (error) {
    console.error("Set data error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

Deno.serve(app.fetch);