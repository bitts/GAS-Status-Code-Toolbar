
Click **Raw** and Tampermonkey will prompt installation.

Confirm and enable it.

---

## 🚀 Usage

1. Open any project in the Google Apps Script Editor:  
   https://script.google.com/

2. The toolbar will load automatically.

3. Use it to:
   - 💾 Save code snippets
   - 📂 Reuse saved blocks
   - ⚙️ Configure shortcut keys

---

## ⚙️ Technical Overview

The modern Google Apps Script Editor is built on top of the **Monaco Editor**, the same open-source editor that powers **Visual Studio Code**:

🔗 https://github.com/microsoft/monaco-editor

Monaco provides:

- Syntax highlighting
- IntelliSense
- Smart autocomplete
- Code diagnostics
- Advanced text model handling

The **GAS-Status-Code-Toolbar** leverages this architecture to extend the editor interface.

### 🔍 How the Script Interacts with Monaco

The userscript:

- Detects when `script.google.com` loads
- Waits for Monaco to initialize in the DOM
- Injects custom HTML toolbar elements
- Hooks into keyboard events
- Interacts with the active editor instance to:
  - Capture selected code
  - Insert snippets at the cursor position
  - Programmatically modify the text model

Because Monaco exposes its editor instance in the page context, the script can safely access the active model (`editor.getModel()`) and apply controlled edits.

### 🧠 Execution Flow

1. Browser loads the Google Apps Script Editor.
2. Monaco Editor initializes.
3. Tampermonkey executes GAS-Status-Code-Toolbar.
4. The toolbar is injected into the interface.
5. Keyboard events are captured.
6. Text modifications are applied directly to Monaco’s model.

Important:

> The script does **not modify the Google Apps Script runtime**.
> It operates strictly at the browser UI layer, extending Monaco’s behavior.

This makes the solution safe, non-invasive, and fully reversible (simply disable the script in Tampermonkey).

---

## 📷 Visual Demo

Example toolbar interface reference:  
![Toolbar](https://github.com/user-attachments/assets/838f921c-225c-4cdc-bf3c-167100b487aa)

*(Illustrative images for UI context.)*

---

## 💡 Innovation

The project:

- 🚀 Boosts development productivity
- 📂 Introduces built-in snippet management
- ⌨️ Enables shortcut-driven workflow
- 🧩 Extends functionality without official API changes

---

## 🔮 Future Possibilities

- Cloud snippet synchronization
- Import/export settings
- GitHub Gist integration
- Advanced logging interface
- Compatibility with other Monaco-based editors

---

## 🛠 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a branch
3. Submit a Pull Request

---

## 📄 License

Released under the **GPL-3.0 License**.
