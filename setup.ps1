# Este script configura o ambiente de desenvolvimento para o projeto FileFlow.

# 1. Definir a política de execução para permitir a execução de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# 2. Instalar as dependências de desenvolvimento
Write-Output "Instalando dependências de desenvolvimento..."
npm install --save-dev electron typescript ts-loader @types/react @types/react-dom

# 3. Instalar as dependências do projeto
Write-Output "Instalando dependências do projeto..."
npm install react react-dom

# 4. Criar a estrutura de diretórios
Write-Output "Criando estrutura de diretórios..."
mkdir src
mkdir src\main
mkdir src\renderer
mkdir src\renderer\components

# 5. Criar arquivos de configuração e iniciais
Write-Output "Criando arquivos de configuração..."
"{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}" | Out-File -FilePath tsconfig.json -Encoding utf8

"module.exports = {
  entry: "./src/renderer/index.tsx",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      { test: /.tsx?$/, loader: "ts-loader" }
    ]
  }
}" | Out-File -FilePath webpack.config.js -Encoding utf8

"import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

ReactDOM.render(<App />, document.getElementById("root"));" | Out-File -FilePath src/renderer/index.tsx -Encoding utf8

"import React from "react";

const App = () => {
  return <h1>Hello from React!</h1>;
};

export default App;" | Out-File -FilePath src/renderer/components/App.tsx -Encoding utf8

"const { app, BrowserWindow } = require("electron");

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});" | Out-File -FilePath src/main/main.js -Encoding utf8

"<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>FileFlow</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="../dist/bundle.js"></script>
  </body>
</html>" | Out-File -FilePath index.html -Encoding utf8


Write-Output "Configuração concluída! Execute 'npm start' para iniciar a aplicação."
