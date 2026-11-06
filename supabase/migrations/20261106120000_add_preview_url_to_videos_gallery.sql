-- Clipe nativo exibido ao passar o mouse nos cards da galeria de vídeos.
alter table public.videos_gallery add column if not exists preview_url text;
