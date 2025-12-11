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
- O App Router separa rotas públicas (`app/(site)/**`) da área administrativa (`app/admin`).
- O uso de TypeScript ponta-a-ponta garante tipagem consistente com o schema do Supabase, facilitando manutenção e extensões futuras.

### Próximos Passos

- Integrar CRUD completo de outdoors e campanhas ao mapa Leaflet.
- Implementar autenticação do admin baseada nos recursos do Supabase.
- Automatizar geração de propostas e dashboards de desempenho.

> Com esta base, o projeto entrega para a Croma Outdoor uma solução profissional, escalável e de baixíssimo custo operacional.
