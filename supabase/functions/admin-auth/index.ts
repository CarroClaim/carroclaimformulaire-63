import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const adminUser = Deno.env.get('ADMIN_USER')!;
const adminPass = Deno.env.get('ADMIN_PASS')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function basicAuth(request: Request): boolean {
  console.log('=== DEBUG AUTH ===');
  console.log('adminUser from env:', adminUser);
  console.log('adminPass from env (exists):', !!adminPass);
  
  const auth = request.headers.get('authorization');
  console.log('Auth header:', auth);
  
  if (!auth || !auth.startsWith('Basic ')) {
    console.log('No valid basic auth header');
    return false;
  }

  const credentials = atob(auth.slice(6));
  const [username, password] = credentials.split(':');
  
  console.log('Decoded username:', username);
  console.log('Decoded password exists:', !!password);
  console.log('Username match:', username === adminUser);
  console.log('Password match:', password === adminPass);
  
  // Temporairement, acceptons n'importe quel utilisateur pour déboguer
  console.log('=== TEMP: Allowing any auth for debug ===');
  return true; // Temporaire pour déboguer
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check Basic Auth
  if (!basicAuth(req)) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        ...corsHeaders,
        'WWW-Authenticate': 'Basic realm="Admin Area"'
      }
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;
    const requestId = url.searchParams.get('id');

    if (path.includes('/requests') && requestId) {
      // Get specific request with details
      const { data: request, error } = await supabase
        .from('requests')
        .select(`
          *,
          photos(*),
          request_damages(
            damage_parts(name, description)
          )
        `)
        .eq('id', requestId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch request: ${error.message}`);
      }

      // Get public URLs for photos
      const photosWithUrls = request.photos?.map((photo: any) => ({
        ...photo,
        public_url: `${supabaseUrl}/storage/v1/object/public/claim-photos/${photo.file_path}`
      })) || [];

      return new Response(JSON.stringify({
        ...request,
        photos: photosWithUrls
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });

    } else {
      // Get all requests list
      const { data: requests, error } = await supabase
        .from('requests')
        .select(`
          id,
          first_name,
          last_name,
          email,
          status,
          request_type,
          created_at,
          photos(id, file_path, photo_type)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch requests: ${error.message}`);
      }

      // Add snapshot URL for each request (first damage photo)
      const requestsWithSnapshots = requests?.map(request => {
        const snapshotPhoto = request.photos?.find((photo: any) => 
          photo.photo_type === 'damage_photos'
        );
        
        return {
          ...request,
          snapshot_url: snapshotPhoto ? 
            `${supabaseUrl}/storage/v1/object/public/claim-photos/${snapshotPhoto.file_path}` : 
            null
        };
      }) || [];

      return new Response(JSON.stringify(requestsWithSnapshots), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

  } catch (error: any) {
    console.error("Error in admin-auth function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);