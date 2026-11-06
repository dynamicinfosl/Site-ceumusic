import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { S3Client, PutObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3.533.0";

const R2_ACCESS_KEY_ID = Deno.env.get('R2_ACCESS_KEY_ID') || '';
const R2_SECRET_ACCESS_KEY = Deno.env.get('R2_SECRET_ACCESS_KEY') || '';
const R2_ENDPOINT = Deno.env.get('R2_ENDPOINT') || '';
const R2_BUCKET_NAME = Deno.env.get('R2_BUCKET_NAME') || '';
const R2_PUBLIC_URL = Deno.env.get('R2_PUBLIC_URL') || '';

const SAFE_PATH = /^[A-Za-z0-9][A-Za-z0-9/_.-]*$/;

const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });

// A chave pública do site também passa pela verificação de JWT da plataforma,
// então a função precisa confirmar que quem envia é um administrador.
async function isAdminRequest(req: Request): Promise<boolean> {
  const authorization = req.headers.get('Authorization');
  if (!authorization) return false;

  const supabase = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_ANON_KEY') || '', {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });

  const { data: { user } } = await supabase.auth.getUser(authorization.replace(/^Bearer\s+/i, ''));
  if (!user) return false;

  const { data, error } = await supabase.rpc('is_admin');
  return !error && data === true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    if (!(await isAdminRequest(req))) {
      return jsonResponse({ error: 'Não autorizado' }, 403);
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;

    if (!file || !path) {
      return jsonResponse({ error: 'Arquivo ou caminho ausente' }, 400);
    }
    if (!SAFE_PATH.test(path) || path.includes('..')) {
      return jsonResponse({ error: 'Caminho inválido' }, 400);
    }
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return jsonResponse({ error: 'Envie apenas imagens ou vídeos' }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();

    await s3Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: path,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
      })
    );

    const publicUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL}/${path}`
      : `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${path}`;

    return jsonResponse({ url: publicUrl }, 200);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
});
