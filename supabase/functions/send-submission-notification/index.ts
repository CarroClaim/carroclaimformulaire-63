import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  submissionId: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  requestType: string;
  damageCount: number;
  description?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: NotificationRequest = await req.json();
    console.log('Received notification request:', body);

    // Get request details and photos
    const { data: requestData, error: requestError } = await supabase
      .from('requests')
      .select(`
        *,
        photos(*),
        request_damages(
          damage_parts(name, description)
        )
      `)
      .eq('id', body.submissionId)
      .single();

    if (requestError) {
      console.error('Error fetching request data:', requestError);
      throw new Error(`Failed to fetch request: ${requestError.message}`);
    }

    // Get photo URLs
    const photoUrls = requestData.photos?.map((photo: any) => {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/claim-photos/${photo.file_path}`;
      return `• ${photo.photo_type}: ${publicUrl}`;
    }).join('\n') || 'Aucune photo';

    // Get damages list
    const damages = requestData.request_damages?.map((rd: any) => 
      rd.damage_parts?.name
    ).filter(Boolean).join(', ') || 'Aucun dommage spécifié';

    // Create email content
    const emailSubject = "Nouvelle demande de devis/rendez-vous";
    const emailBody = `
      <h2>Nouvelle demande reçue</h2>
      
      <h3>Informations client :</h3>
      <ul>
        <li><strong>Nom :</strong> ${body.contact.firstName} ${body.contact.lastName}</li>
        <li><strong>Email :</strong> ${body.contact.email}</li>
        <li><strong>Téléphone :</strong> ${body.contact.phone}</li>
        <li><strong>Adresse :</strong> ${body.contact.address}, ${body.contact.city} ${body.contact.postalCode}</li>
      </ul>

      <h3>Détails de la demande :</h3>
      <ul>
        <li><strong>Type :</strong> ${body.requestType === 'quote' ? 'Devis' : 'Rendez-vous'}</li>
        <li><strong>Dommages :</strong> ${damages}</li>
        <li><strong>Description :</strong> ${body.description || 'Aucune description'}</li>
        ${requestData.preferred_date ? `<li><strong>Date préférée :</strong> ${requestData.preferred_date}</li>` : ''}
        ${requestData.preferred_time ? `<li><strong>Heure préférée :</strong> ${requestData.preferred_time}</li>` : ''}
      </ul>

      <h3>Photos :</h3>
      <pre>${photoUrls}</pre>

      <p>ID de la demande : ${body.submissionId}</p>
      <p>Date de soumission : ${new Date(requestData.created_at).toLocaleString('fr-FR')}</p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Notifications <onboarding@resend.dev>",
      to: ["notifications@lovableproject.com"], // Email pour recevoir les notifications
      subject: emailSubject,
      html: emailBody,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-submission-notification function:", error);
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