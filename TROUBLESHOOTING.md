# Solução de Problemas - Integração Supabase

## Erros Comuns e Soluções

### 1. Erro 404 - Tabela não encontrada

**Erro no console:**
```
Failed to load resource: .../videos?... 404
Erro ao buscar vídeos do Supabase: Tabela "videos" não encontrada
```

**Solução:**
A tabela `videos` ainda não foi criada no seu projeto Supabase. Siga estes passos:

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Execute o SQL abaixo:

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
```

5. Insira alguns vídeos de exemplo:

```sql
INSERT INTO videos (title, artist, song, youtube_id, duration, views, is_featured, "order") VALUES
  ('Salva-vidas', 'Alex Lúcio', 'Salva-vidas', 'bdLeReQbtgY', '3:45', '271K', true, 1),
  ('Final Feliz', 'No Santuário', 'Final Feliz feat Geziel Lima', 'XWBgmBsxkk4', '4:12', '1.8M', true, 2),
  ('Louva na Graça', 'Na Graça', 'Louva na Graça', '5bvgSlZamBo', '5:20', '45K', true, 3),
  ('Milagres de Deus', 'Debora Lopes', 'Milagres de Deus', 'V1hYFBtdxm8', '3:58', '233K', true, 4);
```

### 2. Variáveis de ambiente não configuradas

**Erro no console:**
```
Variáveis de ambiente do Supabase não configuradas
Supabase não configurado
```

**Solução:**
1. Crie um arquivo `.env` na raiz do projeto (se não existir)
2. Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

3. **IMPORTANTE:** Reinicie o servidor de desenvolvimento após criar/editar o arquivo `.env`:
   ```bash
   # Pare o servidor (Ctrl+C) e inicie novamente
   npm run dev
   ```

**Onde encontrar as credenciais:**
- Acesse [Supabase Dashboard](https://app.supabase.com)
- Selecione seu projeto
- Vá em **Settings** → **API**
- Copie:
  - **Project URL** → `VITE_SUPABASE_URL`
  - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 3. Warning sobre múltiplas instâncias do Supabase

**Warning no console:**
```
Multiple GoTrueClient instances detected
```

**Status:** ✅ **CORRIGIDO** - O código agora usa um padrão singleton para evitar múltiplas instâncias.

### 4. Erro de conexão

**Erro no console:**
```
Erro de conexão. Verifique sua conexão com a internet
```

**Soluções:**
1. Verifique sua conexão com a internet
2. Verifique se as credenciais do Supabase estão corretas
3. Verifique se o projeto Supabase está ativo (não pausado)
4. Verifique se há problemas no Supabase: [status.supabase.com](https://status.supabase.com)

## Checklist de Configuração

- [ ] Projeto criado no Supabase
- [ ] Tabela `videos` criada no Supabase
- [ ] Política RLS configurada para leitura pública
- [ ] Pelo menos um vídeo inserido na tabela
- [ ] Arquivo `.env` criado na raiz do projeto
- [ ] Variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` configuradas
- [ ] Servidor reiniciado após configurar `.env`

## Testando a Configuração

Após seguir todos os passos:

1. Reinicie o servidor: `npm run dev`
2. Abra o console do navegador (F12)
3. Verifique se não há erros 404
4. Os vídeos devem aparecer na página inicial

## Ainda com problemas?

1. Verifique o console do navegador para mensagens de erro específicas
2. Verifique o Network tab para ver as requisições ao Supabase
3. Verifique se a tabela existe no Supabase (Table Editor)
4. Verifique se as políticas RLS estão corretas



