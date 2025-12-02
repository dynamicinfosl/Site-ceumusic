# Migração para Supabase - Documentação

Este projeto foi migrado da API do YouTube para o Supabase para gerenciar vídeos.

## Configuração do Supabase

### 1. Criar projeto no Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Crie um novo projeto
3. Anote a URL do projeto e a chave anônima (anon key)

### 2. Criar tabela de vídeos

Execute o seguinte SQL no SQL Editor do Supabase:

```sql
-- Criar tabela de vídeos
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  song TEXT,
  youtube_id TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT,
  views TEXT,
  published_at TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índice para ordenação
CREATE INDEX idx_videos_order ON videos("order");

-- Habilitar Row Level Security (RLS)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública de vídeos"
  ON videos FOR SELECT
  USING (true);

-- Política para permitir inserção/atualização apenas para usuários autenticados (opcional)
-- CREATE POLICY "Permitir inserção para usuários autenticados"
--   ON videos FOR INSERT
--   WITH CHECK (auth.role() = 'authenticated');
```

### 3. Inserir dados de exemplo

```sql
INSERT INTO videos (title, artist, song, youtube_id, thumbnail_url, duration, views, is_featured, "order") VALUES
  ('Salva-vidas', 'Alex Lúcio', 'Salva-vidas', 'bdLeReQbtgY', NULL, '3:45', '271K', true, 1),
  ('Final Feliz', 'No Santuário', 'Final Feliz feat Geziel Lima', 'XWBgmBsxkk4', NULL, '4:12', '1.8M', true, 2),
  ('Louva na Graça', 'Na Graça', 'Louva na Graça', '5bvgSlZamBo', NULL, '5:20', '45K', true, 3),
  ('Milagres de Deus', 'Debora Lopes', 'Milagres de Deus', 'V1hYFBtdxm8', NULL, '3:58', '233K', true, 4);
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

## Estrutura da Tabela

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único do vídeo (gerado automaticamente) |
| `title` | TEXT | Título completo do vídeo |
| `artist` | TEXT | Nome do artista |
| `song` | TEXT | Nome da música (opcional) |
| `youtube_id` | TEXT | ID do vídeo no YouTube |
| `thumbnail_url` | TEXT | URL da thumbnail (opcional, usa thumbnail do YouTube se não fornecido) |
| `duration` | TEXT | Duração do vídeo (ex: "3:45") |
| `views` | TEXT | Número de visualizações (ex: "271K") |
| `published_at` | TIMESTAMPTZ | Data de publicação |
| `is_featured` | BOOLEAN | Se o vídeo está em destaque |
| `order` | INTEGER | Ordem de exibição (menor número aparece primeiro) |
| `created_at` | TIMESTAMPTZ | Data de criação do registro |
| `updated_at` | TIMESTAMPTZ | Data da última atualização |

## Arquivos Modificados

- ✅ `src/utils/supabase.ts` - Cliente Supabase
- ✅ `src/utils/videos.ts` - Funções para buscar vídeos do Supabase
- ✅ `src/pages/home/components/HeroSection.tsx` - Atualizado para usar Supabase
- ✅ `src/pages/home/components/VideosSection.tsx` - Atualizado para usar Supabase
- 📦 `src/utils/youtube.ts` - Arquivo antigo (pode ser removido)

## Benefícios da Migração

1. **Sem limites de cota**: Não há mais limites de requisições diárias como na API do YouTube
2. **Controle total**: Você gerencia quais vídeos aparecem no site
3. **Performance**: Consultas mais rápidas e cacheável
4. **Flexibilidade**: Pode adicionar campos customizados facilmente
5. **CMS**: Pode criar um painel administrativo para gerenciar vídeos

## Próximos Passos

1. Configurar autenticação no Supabase (se necessário)
2. Criar painel administrativo para gerenciar vídeos
3. Adicionar mais campos à tabela conforme necessário
4. Implementar cache se necessário

