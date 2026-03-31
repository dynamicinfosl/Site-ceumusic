import { useState, useRef } from 'react';
import { supabase } from '../../../utils/supabase';
import { Upload, X, Loader2, Image as ImageIcon, Video } from 'lucide-react';

interface MediaUploadProps {
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
  type?: 'image' | 'video';
  path?: string;
  label?: string;
}

export default function MediaUpload({ 
  onUploadComplete, 
  currentUrl, 
  type = 'image', 
  path = 'uploads',
  label = 'Upload Media'
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      if (!supabase) throw new Error('Supabase client not initialized');

      // 1. Get the session for JWT authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Não autenticado');

      // 2. Prepare the file name and path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      // 3. Call the Edge Function
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', filePath);

      const { data, error: uploadError } = await supabase.functions.invoke('upload-to-r2', {
        body: formData,
      });

      if (uploadError) throw uploadError;
      if (data?.error) throw new Error(data.error);

      // 4. Return the URL
      onUploadComplete(data.url);
    } catch (err: any) {
      console.error('Erro no upload:', err);
      setError(err.message || 'Falha no upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearSelection = () => {
    onUploadComplete('');
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium text-white/40 ml-1 uppercase flex items-center gap-1">
        {type === 'image' ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
        {label}
      </label>

      {currentUrl ? (
        <div className="relative group">
          {type === 'image' ? (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
              <img 
                src={currentUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
              <Video className="w-12 h-12 text-white/20" />
              <p className="absolute bottom-2 text-[10px] text-white/40">URL do Vídeo Selecionada</p>
            </div>
          )}
          
          <button
            onClick={clearSelection}
            className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white/60 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed border-white/10 rounded-2xl p-8
            flex flex-col items-center justify-center gap-3
            cursor-pointer hover:border-[#0EA8A0]/50 hover:bg-[#0EA8A0]/5 transition-all
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-[#0EA8A0]" />
              <p className="text-xs text-white/40">Enviando para o R2...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                <Upload className="w-6 h-6 text-white/40" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white/60">Clique para selecionar</p>
                <p className="text-[10px] text-white/30 mt-1">PNG, JPG, WEBP ou MP4</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-[10px] text-red-500 ml-1">{error}</p>
      )}

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept={type === 'image' ? "image/*" : "video/*,application/x-quicktimeplayer,video/quicktime"}
      />
    </div>
  );
}
