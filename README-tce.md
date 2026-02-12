# 🚀 GAS-Status-Code-Toolbar

![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Tampermonkey](https://img.shields.io/badge/requires-Tampermonkey-orange.svg)
![Monaco Editor](https://img.shields.io/badge/editor-Monaco-blueviolet.svg)

> Enhance the Google Apps Script Editor (Monaco-based) with a powerful floating developer toolbar.

---

# 🇺🇸 English Version

## 📑 Table of Contents

- 📌 Overview
- 🧠 Technical Architecture
- ⚙️ Monaco Editor Integration
- 🚀 Installation
- 🛠 Usage
- 🏗 Architecture Diagram
- 💡 Innovation
- 🔮 Future Roadmap
- 🤝 Contributing
- 📄 License

---

##  📌 Overview

**GAS-Status-Code-Toolbar** is a userscript that extends the **Google Apps Script** Editor by injecting a floating developer toolbar with snippet management and advanced code manipulation.

The Google Apps Script Editor is powered by:

🔗 **Monaco Editor**
https://github.com/microsoft/monaco-editor

The same engine used in Visual Studio Code.

---

## 🧠 Technical Architecture

The script operates exclusively at the browser UI layer.

Execution flow:

1. Detects `script.google.com`
2. Waits for Monaco initialization
3. Injects custom toolbar elements
4. Hooks into keyboard events
5. Uses Monaco APIs to modify the active model

It does not modify Google Apps Script runtime.

---

## ⚙️ Monaco Editor Integration

### 📌 Access Active Editor
```javascript
const editor = monaco.editor.getEditors()[0];
const model = editor.getModel();
```

### 📌 Insert Snippet Programmatically
```javascript
editor.executeEdits("toolbar", [{
  range: editor.getSelection(),
  text: snippetCode,
  forceMoveMarkers: true
}]);
```

### 📌 Listen for Changes
```javascript
editor.onDidChangeModelContent((event) => {
  console.log("Code changed", event);
});
```

### 📌 Retrieve Selected Text
```javascript
const selectedCode = model.getValueInRange(editor.getSelection());
```

## 🚀 Installation

### 1️⃣ Install Tampermonkey

https://www.tampermonkey.net/

Compatíble:

- Chrome
- Edge
- Firefox
- Brave

### 2️⃣ Install Script
Install the `.user.js` file from the repository.

### 3️⃣ Open

https://script.google.com/

Toolbar loads automatically.

![Toolbar](https://github.com/user-attachments/assets/838f921c-225c-4cdc-bf3c-167100b487aa)


## 🏗 Architecture Diagram

```
flowchart TD
    A[Browser Loads script.google.com] --> B[Monaco Editor Initializes]
    B --> C[Tampermonkey Executes Userscript]
    C --> D[Toolbar Injected into DOM]
    D --> E[Keyboard Event Listeners]
    E --> F[Monaco API Interaction]
    F --> G[Text Model Modified]

```

## 💡 Innovation

- Extends Monaco without official plugins
- Introduces snippet persistence
- Enables structured code automation
- Improves productivity without backend modification

## 🔮 Future Roadmap

- Cloud sync
- GitHub Gist integration
- Advanced logging panel
- Multi-project snippet management
- Monaco plugin abstraction layer

## 🤝 Contributing

Pull Requests são bem-vindos.

1. Fork
2. ranch
3. Commit
4. Pull Request



## 📄 License

GPL-3.0 License
