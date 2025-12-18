## Croma Outdoor

Croma Outdoor é uma plataforma web que moderniza a vitrine e a gestão de espaços publicitários em Araguari/MG. O projeto é construído com **Next.js 16 (App Router)** e **TypeScript**, eliminando os envios manuais de planilhas e PDFs. A arquitetura foi desenhada para operar com **custo fixo zero**, combinando **Vercel (free tier)** para hospedagem e **Supabase** para banco PostgreSQL, autenticação e armazenamento de imagens.

### Destaques do Produto

- **Mapa interativo** usando **Leaflet + OpenStreetMap**, evitando taxas da Google Maps API e garantindo alta performance.
- **Mobile First**: a listagem de pontos é otimizada para celular, enquanto o mapa completo é priorizado para telas desktop.
- **Compressão automática de imagens** no painel admin para manter o uso do storage gratuito sustentável no longo prazo.
- **Fluxo comercial direto**: o anunciante seleciona faces e gera orçamento via WhatsApp, sem checkout complexo.
- **Calendário por bi-semanas**: disponibilidade dos outdoors é controlada via campo de data alinhado ao padrão do mercado.
- **SEO local**: URLs amigáveis e conteúdo bilíngue garantem destaque nas buscas por mídia exterior em Araguari.

### Arquitetura e Tecnologias

| Camada | Detalhes |
| --- | --- |
| Frontend | Next.js App Router, React 19, TypeScript, Tailwind CSS 4 (modo CSS), Leaflet. |
| Infraestrutura | Vercel (hosting free tier) + Supabase (PostgreSQL, Auth, Storage). |
| Mapas | Leaflet com tiles do OpenStreetMap, marcadores customizados e futura integração com CRUD de faces. |
| Internacionalização | i18next + react-i18next com dicionários `pt` e `en`. |

### Estrutura de Pastas

- `src/app/`: entrypoints do App Router (marketing em `src/app/(site)`, painel em `src/app/admin`, layout + shell compartilhados).
- `src/lib/i18n.tsx`: provedor e hooks de idioma consumidos por todo o app.
- `src/locales/`: JSONs traduzidos que alimentam o i18n.
- `public/assets/brand/`: identidades oficiais servidas via `/assets/brand/*`.

### Fluxo do Usuário

1. Visitante navega pelo site e visualiza a vitrine de outdoors, com destaque para mapa e listas filtradas.
2. Seleciona pontos de interesse e aciona o CTA para gerar orçamento via WhatsApp.
3. Time interno mantém disponibilidade e materiais através do painel admin (rota separada no App Router), com upload comprimido de imagens e integração segura com Supabase.

### Desenvolvimento

```bash
npm install
npm run dev
```

- Ambiente local roda em `http://localhost:3000`.
- O App Router separa rotas públicas (`src/app/(site)/**`) da área administrativa (`src/app/admin`).
- O uso de TypeScript ponta-a-ponta garante tipagem consistente com o schema do Supabase, facilitando manutenção e extensões futuras.

### Próximos Passos

- Integrar CRUD completo de outdoors e campanhas ao mapa Leaflet.
- Implementar autenticação do admin baseada nos recursos do Supabase.
- Automatizar geração de propostas e dashboards de desempenho.

### Itens pendentes (placeholders)

1. **Conteúdo definitivo**: revisar os arquivos de dicionário em `locales/pt.json` e `locales/en.json` para trocar todo o copy demonstrativo por textos finais (headline, estatísticas, cards e CTA) e alinhar números reais de inventário.
2. **Identidade visual**: substituir cartões genéricos das seções em `src/app/(site)/sections` por fotografias reais ou renders, e garantir que o logo final em `public/assets/brand/croma_logo.png` está em alta resolução e com versões otimizadas (PNG/WebP) para desktop e mobile.
3. **Biblioteca de imagens**: organizar o diretório `public/assets/` com nomes padronizados, adicionando variações responsivas e metadados ALT específicos para cada uso.
4. **Mapa dinâmico**: trocar o marcador estático em `src/app/(site)/sections/LeafletMapInner.tsx` por dados vindos do futuro backend (Supabase), exibindo faces, filtros e fotos reais diretamente no Leaflet.
5. **Painel admin funcional**: evoluir `src/app/admin/page.tsx` de mock para dashboard com formulários, upload para Supabase Storage, autenticação e controle de disponibilidade.
6. **Fluxo comercial**: conectar o CTA em `CallToAction.tsx` a mensagens pré-formatadas no WhatsApp e registrar leads em uma tabela (ou webhook) para acompanhamento interno.
7. **SEO e analytics**: incluir metadados definitivos (title, description, OG) e eventos GA/GTM que monitorem interações com mapa, CTA e idioma.
8. **Acessibilidade e QA**: validar contrastes definidos em `src/app/globals.css`, estados de foco, navegação por teclado e criar smoke tests básicos para os componentes principais.

> Com esta base, o projeto entrega para a Croma Outdoor uma solução profissional, escalável e de baixíssimo custo operacional.
