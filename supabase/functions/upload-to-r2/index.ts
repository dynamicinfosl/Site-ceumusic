import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { S3Client, PutObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3.533.0";

const R2_ACCESS_KEY_ID = Deno.env.get('R2_ACCESS_KEY_ID')!;
const R2_SECRET_ACCESS_KEY = Deno.env.get('R2_SECRET_ACCESS_KEY')!;
const R2_ENDPOINT = Deno.env.get('R2_ENDPOINT')!;
const R2_BUCKET_NAME = Deno.env.get('R2_BUCKET_NAME')!;
const R2_PUBLIC_URL = Deno.env.get('R2_PUBLIC_URL'); // Opcional: URL pública do bucket ou Worker

const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;

    if (!file || !path) {
      return new Response(JSON.stringify({ error: 'Arquivo ou caminho ausente' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
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

    // Constrói a URL de retorno
    // Se não houver R2_PUBLIC_URL, usamos uma estrutura padrão (pode precisar de ajuste dependendo da config do Cloudflare)
    const publicUrl = R2_PUBLIC_URL 
      ? `${R2_PUBLIC_URL}/${path}`
      : `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${path}`;

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { 
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
