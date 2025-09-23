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
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
};

function basicAuth(request: Request): boolean {
  console.log('=== AUTH DEBUG ===');
  console.log('adminUser:', adminUser);
  console.log('adminPass exists:', !!adminPass);
  
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) {
    console.log('No basic auth header');
    return false;
  }

  const credentials = atob(auth.slice(6));
  const [username, password] = credentials.split(':');
  
  console.log('Username:', username, 'matches:', username === adminUser);
  console.log('Password matches:', password === adminPass);
  
  return username === adminUser && password === adminPass;
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
    const requestId = url.searchParams.get('id');
    const statusFilter = url.searchParams.get('status');

    // Handle status update requests
    if (req.method === 'PATCH' && requestId) {
      const { status } = await req.json();
      
      if (!['pending', 'processing', 'completed', 'archived', 'deleted'].includes(status)) {
        return new Response(JSON.stringify({ error: 'Invalid status' }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const { error: updateError } = await supabase.rpc('update_request_status', {
        request_id: requestId,
        new_status: status
      });

      if (updateError) {
        console.error('Error updating request status:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update status' }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (requestId) {
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
      // Build query with optional status filter
      let query = supabase
        .from('requests')
        .select(`
          id,
          first_name,
          last_name,
          email,
          status,
          request_type,
          created_at,
          damage_screenshot,
          photos(id, file_path, photo_type)
        `)
        .order('created_at', { ascending: false });

      // Apply status filter if provided
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data: requests, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch requests: ${error.message}`);
      }

      // Add snapshot URL for each request (from damage_screenshot field or first photo)
      const requestsWithSnapshots = requests?.map(request => {
        let snapshotUrl = null;
        
        // Préférer le damage_screenshot si disponible
        if (request.damage_screenshot) {
          snapshotUrl = request.damage_screenshot;
        } else {
          // Sinon, utiliser la première photo de damage_photos
          const snapshotPhoto = request.photos?.find((photo: any) => 
            photo.photo_type === 'damage_photos'
          );
          
          if (snapshotPhoto) {
            snapshotUrl = `${supabaseUrl}/storage/v1/object/public/claim-photos/${snapshotPhoto.file_path}`;
          }
        }
        
        return {
          ...request,
          snapshot_url: snapshotUrl
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