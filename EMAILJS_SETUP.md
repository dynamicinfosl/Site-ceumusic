# Configuração do EmailJS para Formulário de Contato

Este guia explica como configurar o EmailJS para que o formulário de contato envie emails reais.

## Passo a Passo

### 1. Criar conta no EmailJS

1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Faça login na sua conta

### 2. Criar um Serviço de Email

1. No dashboard, vá em **Email Services**
2. Clique em **Add New Service**
3. Escolha seu provedor de email (Gmail, Outlook, etc.)
4. Siga as instruções para conectar sua conta de email
5. Anote o **Service ID** que será gerado

### 3. Criar um Template de Email

1. No dashboard, vá em **Email Templates**
2. Clique em **Create New Template**
3. Use o seguinte template como base:

```
Assunto: Nova Mensagem de Contato - {{subject}}

Olá,

Você recebeu uma nova mensagem através do formulário de contato do site Céu Music.

Detalhes:
- Nome: {{from_name}}
- Email: {{from_email}}
- Telefone: {{phone}}
- Assunto: {{subject}}

Mensagem:
{{message}}

---
Esta mensagem foi enviada automaticamente através do formulário de contato.
```

4. Configure os campos do template:
   - `{{from_name}}` - Nome do remetente
   - `{{from_email}}` - Email do remetente
   - `{{phone}}` - Telefone
   - `{{subject}}` - Assunto
   - `{{message}}` - Mensagem

5. Configure o email de destino:
   - No campo "To Email", coloque: `contato@ceumusicbr.com`
   - Ou use uma variável se quiser flexibilidade

6. Anote o **Template ID** que será gerado

### 4. Obter a Public Key

1. No dashboard, vá em **Account** > **General**
2. Encontre a seção **API Keys**
3. Copie sua **Public Key**

### 5. Configurar no Projeto

1. Crie um arquivo `.env` na raiz do projeto (baseado no `.env.example`)
2. Preencha as variáveis:

```env
VITE_EMAILJS_SERVICE_ID=seu_service_id_aqui
VITE_EMAILJS_TEMPLATE_ID=seu_template_id_aqui
VITE_EMAILJS_PUBLIC_KEY=sua_public_key_aqui
```

3. Reinicie o servidor de desenvolvimento (`npm run dev`)

### 6. Testar

1. Acesse a página de contato
2. Preencha o formulário
3. Envie uma mensagem de teste
4. Verifique se o email chegou na caixa de entrada configurada

## Limites do Plano Gratuito

- 200 emails por mês
- Suporte a templates básicos
- Ideal para sites pequenos/médios

## Solução de Problemas

### Email não está sendo enviado

1. Verifique se as credenciais no `.env` estão corretas
2. Verifique se o servidor foi reiniciado após adicionar as variáveis
3. Abra o console do navegador (F12) e verifique se há erros
4. Verifique se o serviço de email está ativo no dashboard do EmailJS

### Erro de autenticação

1. Verifique se o serviço de email está conectado corretamente
2. Tente reconectar o serviço no dashboard do EmailJS

### Erro 400 (Bad Request)

Este erro geralmente indica problema com as credenciais ou configuração do template:

1. **Verifique as credenciais no arquivo `.env`:**
   - Service ID deve começar com `service_` (ex: `service_mjv7a3b`)
   - Template ID deve começar com `template_` (ex: `template_abc123`)
   - Public Key deve ser uma string longa de caracteres
   - **IMPORTANTE:** Reinicie o servidor após alterar o `.env` (`npm run dev`)

2. **Verifique se o template está configurado corretamente:**
   - As variáveis no template devem corresponder exatamente: `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{subject}}`, `{{message}}`
   - O campo "To Email" deve estar preenchido com `contato@ceumusicbr.com`
   - O campo "From Email" deve estar configurado

3. **Verifique no console do navegador (F12):**
   - Veja a mensagem de erro completa
   - Verifique se as variáveis estão sendo carregadas (não devem aparecer "YOUR_SERVICE_ID")

4. **Teste no dashboard do EmailJS:**
   - Vá em "Email Templates" → Seu template → "Test it"
   - Tente enviar um email de teste diretamente do dashboard

## Suporte

Para mais informações, consulte a [documentação oficial do EmailJS](https://www.emailjs.com/docs/).

