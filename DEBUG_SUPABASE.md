# Debug - Tabela já existe mas retorna 404

Se a tabela já foi criada mas você ainda recebe erro 404, verifique os seguintes pontos:

## 1. Verificar Políticas RLS (Row Level Security)

O erro 404 pode ocorrer se as políticas RLS estão bloqueando o acesso. Verifique:

1. Acesse o Supabase Dashboard
2. Vá em **Authentication** → **Policies**
3. Selecione a tabela `videos`
4. Verifique se existe uma política que permite SELECT público

**SQL para criar política de leitura pública:**

```sql
-- Se a política não existir, crie:
CREATE POLICY "Permitir leitura pública de vídeos"
  ON videos FOR SELECT
  USING (true);
```

**Ou desabilite RLS temporariamente para teste:**

```sql
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;
```

⚠️ **Atenção:** Desabilitar RLS não é recomendado para produção, apenas para debug.

## 2. Verificar Nome da Tabela

Certifique-se de que o nome da tabela está exatamente como `videos` (plural, minúsculo).

Para verificar:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

## 3. Verificar Variáveis de Ambiente

Abra o console do navegador (F12) e verifique os logs:

- ✅ Deve aparecer: `🔧 Configuração Supabase:` com URL e Key parcialmente visíveis
- ❌ Se aparecer `NÃO CONFIGURADO`, as variáveis não estão sendo carregadas

**Solução:**
1. Verifique se o arquivo `.env` está na raiz do projeto
2. Verifique se as variáveis começam com `VITE_`
3. **Reinicie o servidor** após criar/editar o `.env`

## 4. Verificar Estrutura da Tabela

Execute no SQL Editor do Supabase:

```sql
-- Verificar estrutura da tabela
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'videos';

-- Verificar se há dados
SELECT COUNT(*) FROM videos;
```

## 5. Testar Query Diretamente

Teste a query diretamente no Supabase:

1. Vá em **Table Editor** → `videos`
2. Tente visualizar os dados
3. Se conseguir ver os dados aqui, o problema é na aplicação

## 6. Verificar Logs Detalhados

Com as melhorias feitas, o console agora mostra logs detalhados:

- `🔍 Buscando vídeos do Supabase...` - Início da busca
- `✅ Vídeos carregados com sucesso: X vídeos` - Sucesso
- `❌ Erro do Supabase:` - Detalhes do erro (code, message, details, hint)

**Erros comuns e soluções:**

| Código | Significado | Solução |
|--------|-------------|---------|
| `PGRST116` | Tabela não encontrada | Verificar nome da tabela |
| `42501` | Permissão negada (RLS) | Criar política de leitura pública |
| `404` | Recurso não encontrado | Verificar URL do Supabase |

## 7. Teste Manual da API

Teste diretamente no navegador (substitua pela sua URL e chave):

```
https://SEU_PROJETO.supabase.co/rest/v1/videos?select=*&apikey=SUA_CHAVE_ANON
```

Se retornar dados JSON, a tabela e políticas estão OK.
Se retornar 404, há problema com a tabela ou políticas.

## Checklist Rápido

- [ ] Tabela `videos` existe no Supabase
- [ ] Política RLS permite SELECT público
- [ ] Arquivo `.env` existe na raiz
- [ ] Variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` configuradas
- [ ] Servidor reiniciado após configurar `.env`
- [ ] Console mostra logs de configuração do Supabase
- [ ] Teste manual da API retorna dados

## Próximos Passos

1. Abra o console do navegador (F12)
2. Recarregue a página
3. Verifique os logs que começam com 🔧, 🔍, ✅ ou ❌
4. Compartilhe os logs de erro para diagnóstico mais preciso





