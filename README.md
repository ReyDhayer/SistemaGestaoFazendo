# Retail Magic Manager

Sistema de gerenciamento de mesas e áreas para restaurantes.

## Funcionalidades

- Gerenciamento de mesas com arrastar e soltar
- Controle de áreas do restaurante
- Status das mesas em tempo real
- Visualização interativa do layout
- Edição de mesas e áreas
- Sistema de reservas

## Deploy no GitHub Pages

1. Faça fork ou clone este repositório para sua conta GitHub

2. Habilite o GitHub Pages:
   - Vá para "Settings" do seu repositório
   - Na seção "Pages", selecione:
     - Source: "GitHub Actions"
   - Clique em "Save"

3. O deploy será feito automaticamente quando você:
   - Fizer push para a branch main
   - Ou manualmente na aba "Actions"

4. Seu site estará disponível em:
   `https://seu-usuario.github.io/retail-magic-manager/`

## Desenvolvimento Local

1. Clone o repositório
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências
```bash
npm install
```

3. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

4. Para build de produção
```bash
npm run build
```

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- React Router DOM
- React Query
- Lucide Icons 