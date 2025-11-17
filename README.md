# SecuroServ GTA Assets Dashboard

Interface web estática (HTML + CSS + JS puros) que simula o painel SecuroServ para acompanhar patrimônio, veículos, coleções e negócios de renda do GTA Online.

## Pré-requisitos

- Node.js 18+ (apenas para subir o servidor local opcional)
- Nenhuma dependência npm externa — o projeto roda offline.

## Como rodar no desktop

1. **Instalar dependências** (não há pacotes para baixar, mas este passo mantém o `package-lock` sincronizado):
   ```bash
   npm install
   ```
2. **Executar o servidor estático**:
   ```bash
   npm start
   ```
3. Abra `http://localhost:3000` no navegador. O painel inclui:
   - Login temático SecuroServ com animação pós-autenticação
   - Navegação em abas (Status, Imóveis, Veículos, Coleções, Negócios, Adicionar)
   - Cards com fotos, notas e renda/h agregado em tempo real
   - Formulário “Adicionar” para cadastrar novos ativos, negócios e imagens via URL

### Como testar no celular

1. Garanta que o computador e o celular estejam **na mesma rede Wi-Fi**.
2. Descubra o IP local da máquina onde o servidor está rodando (ex.: `ipconfig` no Windows ou `ifconfig`/`ip a` no macOS/Linux). Suponha que seja `192.168.0.42`.
3. Inicie o servidor normalmente (`npm start`). O Node já escuta em `0.0.0.0`, então basta abrir no celular o endereço `http://192.168.0.42:3000`.
4. Adicione o atalho do navegador à tela inicial do celular para ter uma experiência de “app” mobile.

## Destaques visuais

- Emblema completo do SecuroServ (triângulo em tons de vermelho + olho estilizado + tipografia cinza arredondada).
- Animação de varredura após clicar em **Log in**, simulando o handshake SecuroServ.
- Layout mobile-first com abas fixas e cartões que exibem fotos (via URLs) dos imóveis, veículos e coleções cadastrados.

## Testes

Os testes automatizados conferem os cálculos principais (net worth e renda por hora) e podem ser executados com:
```bash
npm test
```

## Estrutura

```
public/
  index.html     # layout base
  styles.css     # tema SecuroServ
  data.js        # mock inicial dos ativos + labels
  metrics.js     # cálculos reutilizáveis
  app.js         # login, abas, renderização e formulário de cadastro
server.js         # servidor HTTP minimalista
scripts/run-tests # smoke tests dos cálculos
```
