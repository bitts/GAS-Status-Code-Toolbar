# 🚀 GAS-Status-Code-Toolbar

![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Tampermonkey](https://img.shields.io/badge/requires-Tampermonkey-orange.svg)
![Monaco Editor](https://img.shields.io/badge/editor-Monaco-blueviolet.svg)

> Enhance the Google Apps Script Editor (Monaco-based) with a powerful floating developer toolbar.

---

# 🇧🇷 Versão em Português

## 📑 Índice

- 📌 Visão Geral
- 🧠 Arquitetura Técnica
- ⚙️ Integração com Monaco Editor
- 🚀 Instalação
- 🛠 Como Utilizar
- 🏗 Diagrama de Arquitetura
- 💡 Inovação
- 🔮 Roadmap Futuro
- 🤝 Contribuição
- 📄 Licença

---

## 📌 Visão Geral

O **GAS-Status-Code-Toolbar** é um userscript que estende o **Google Apps Script Editor**, adicionando uma barra de ferramentas flutuante com gerenciamento de snippets, atalhos personalizados e manipulação programática de código.

O editor moderno do Google Apps Script é construído sobre o:

🔗 **Monaco Editor**  
https://github.com/microsoft/monaco-editor

O mesmo motor utilizado pelo Visual Studio Code.

---

## 🧠 Arquitetura Técnica

O script atua exclusivamente na camada de interface do navegador.

Ele:

1. Detecta o carregamento da URL `script.google.com`
2. Aguarda a inicialização do Monaco Editor
3. Injeta componentes HTML/CSS personalizados
4. Conecta-se à instância ativa do Monaco
5. Intercepta eventos de teclado
6. Manipula diretamente o modelo de texto

Nenhuma modificação é feita no runtime do Google Apps Script.

---

## ⚙️ Integração com Monaco Editor

O Monaco Editor expõe APIs robustas que permitem controle total do modelo de texto.

O GAS-Status-Code-Toolbar utiliza recursos como:

### 📌 Acesso ao Editor Ativo

```javascript
const editor = monaco.editor.getEditors()[0];
const model = editor.getModel();
```

### 📌 Inserção de Código Programática

```javascript
editor.executeEdits("toolbar", [{
  range: editor.getSelection(),
  text: snippetCode,
  forceMoveMarkers: true
}]);
```

### 📌 Monitoramento de Alterações

```javascript
editor.onDidChangeModelContent((event) => {
  console.log("Code changed", event);
});
```

### 📌 Captura de Seleção

```javascript
const selectedCode = model.getValueInRange(editor.getSelection());
```

## 🚀 Instalação

### 1️⃣ Instale o Tampermonkey

https://www.tampermonkey.net/

Compatível com:

- Chrome
- Edge
- Firefox
- Brave

### 2️⃣ Instale o Script

Abra o arquivo:

https://github.com/bitts/GAS-Status-Code-Toolbar/blob/main/GAS-Status-Code-Toolbar.user.js

Clique em Raw → confirme a instalação.

### 3️⃣ Abra o Google Apps Script

https://script.google.com/

A toolbar será carregada automaticamente.

![Toolbar](https://github.com/user-attachments/assets/838f921c-225c-4cdc-bf3c-167100b487aa)]


## 🛠 Como Utilizar

- 💾 Salvar seleção atual como snippet
- 📂 Inserir snippet salvo na posição do cursor
- ⌨️ Configurar atalhos (Ctrl + Alt + tecla)
- 📍 Arrastar e reposicionar a toolbar

As configurações são persistidas via localStorage.

## 🏗 Diagrama de Arquitetura

```
flowchart TD
    A[Browser Loads script.google.com] --> B[Monaco Editor Initializes]
    B --> C[Tampermonkey Executes Userscript]
    C --> D[Toolbar Injected into DOM]
    D --> E[Keyboard Event Listeners]
    E --> F[Monaco API Interaction]
    F --> G[Text Model Modified]

```


## 💡 Inovação

Embora não altere o backend do Apps Script, o projeto:

- 🔥 Expande funcionalidades do Monaco sem plugins oficiais
- 🚀 Introduz gerenciamento nativo de snippets
- 🧠 Permite manipulação avançada do modelo de código
- ⚡ Melhora drasticamente produtividade

## 🔮 Roadmap Futuro

- Sincronização em nuvem de snippets
- Integração com GitHub Gist
- Sistema de templates dinâmicos
- Log viewer integrado
- Compatibilidade com outros editores baseados em Monaco

## 🤝 Contribuição

Pull Requests são bem-vindos.

1. Fork
2. ranch
3. Commit
4. Pull Request

## 📄 Licença

GPL-3.0 License
