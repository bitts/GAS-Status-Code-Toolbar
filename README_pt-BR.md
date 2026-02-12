
Clique em **Raw** e o Tampermonkey oferecerá a instalação automaticamente.

Confirme a instalação.

---

## 🚀 Como Utilizar

1. Abra qualquer projeto no **Google Apps Script Editor**  
   https://script.google.com/

2. A barra será carregada automaticamente.

3. Utilize os botões para:
   - 💾 Salvar blocos de código
   - 📂 Recuperar snippets salvos
   - ⚙️ Configurar atalhos personalizados

---

## ⚙️ Funcionamento Técnico

O Google Apps Script Editor moderno é construído sobre o **Monaco Editor**, o mesmo editor open-source utilizado no **Visual Studio Code**:

🔗 https://github.com/microsoft/monaco-editor

O Monaco é responsável por:

- Realce de sintaxe (syntax highlighting)
- Autocompletar inteligente
- IntelliSense
- Diagnóstico de erros
- Sistema avançado de edição baseado em modelos

O **GAS-Status-Code-Toolbar** atua diretamente sobre essa estrutura.

### 🔍 Como o Script Interage com o Monaco Editor

O userscript:

- Detecta o carregamento do editor na página (`script.google.com`)
- Aguarda a inicialização do Monaco Editor no DOM
- Injeta elementos HTML personalizados na interface
- Adiciona listeners de teclado integrados ao sistema de eventos do Monaco
- Interage com a instância ativa do editor para:
  - Capturar o conteúdo selecionado
  - Inserir snippets no cursor atual
  - Manipular texto programaticamente

Como o Monaco expõe sua instância global no contexto da página, é possível acessar o modelo ativo (`editor.getModel()`) e aplicar alterações de forma segura e controlada.

### 🧠 Arquitetura de Funcionamento

1. O navegador carrega o Google Apps Script Editor.
2. O Monaco Editor é inicializado.
3. O Tampermonkey executa o GAS-Status-Code-Toolbar.
4. O script injeta a toolbar na interface.
5. Eventos de teclado e ações do usuário são interceptados.
6. As alterações são aplicadas diretamente no modelo do Monaco.

Importante destacar:

> O script **não altera o runtime do Google Apps Script**.
> Ele opera exclusivamente na camada de interface do navegador, estendendo o comportamento do Monaco Editor.

Essa abordagem torna o projeto seguro, não invasivo e totalmente reversível (basta desativar o script no Tampermonkey).

---

## 📷 Demonstração Visual

Exemplos ilustrativos de toolbar flutuante:

Exemplo de interface com toolbar customizada:  
![Toolbar](https://github.com/user-attachments/assets/838f921c-225c-4cdc-bf3c-167100b487aa)

*(Imagens ilustrativas para contextualização visual.)*

---

## 💡 Inovação

Embora não altere o funcionamento interno do Google Apps Script, o projeto:

- 🚀 Melhora significativamente a produtividade
- 📂 Introduz gerenciamento de snippets direto no editor
- ⌨️ Permite automação via atalhos personalizados
- 🧩 Expande funcionalidades sem depender de APIs oficiais

---

## 🔮 Possíveis Aplicações Futuras

- Sincronização de snippets na nuvem
- Exportação/importação de configurações
- Integração com GitHub Gist
- Logs avançados de execução
- Compatibilidade com outros editores baseados em Monaco

---

## 🛠 Contribuindo

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch
3. Envie um Pull Request

Sugestões e melhorias são sempre incentivadas.

---

## 📄 Licença

Distribuído sob a licença **GPL-3.0**.

