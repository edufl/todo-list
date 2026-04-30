# 📝 To-Do List App

Um aplicativo de lista de tarefas desenvolvido com React, com foco em CRUD, persistência de dados e organização de estado.

---

## 🚀 Funcionalidades

✅ CRUD completo — Criar, visualizar, editar e deletar tarefas
🎯 Prioridades — Alta 🔴, Média 🟡, Baixa 🟢 e Nenhuma ⚪
💾 Persistência — Dados salvos automaticamente no localStorage
☑️ Marcar como concluída — Tarefa riscada ao ser completada
✏️ Edição inline — Duplo clique no texto para editar
🔍 Filtros — Visualize Todas, Pendentes ou Concluídas
📱 Responsivo — Funciona em desktop e mobile 

---

## 🎥 Demonstração

https://github.com/user-attachments/assets/603463d5-dcbd-46c8-ba3b-869273b2bc10

---
## 📋 Como usar
```bash
| Ação                  | Como fazer                                                         |
| --------------------- | ----------------------------------------------------------------   |
| ➕ Adicionar tarefa    | Digite no campo e pressione **Enter** ou clique em **Adicionar** |
| 🎯 Definir prioridade | Escolha antes de adicionar ou altere depois                       |
| ☑️ Concluir tarefa    | Clique no checkbox                                                |
| ✏️ Editar tarefa      | Edite diretamente no campo de texto                               |
| ❌ Deletar tarefa      | Clique no botão "✕"                                              |
| 🔍 Filtrar tarefas    | Use os botões: Todas, Alta, Média, Baixa, Nenhuma                 |
```

## 🎨 Sistema de prioridades
```bash
| Prioridade | Cor      | Descrição         |
| ---------- | -------- | ----------------- |
| 🔴 Alta    | Vermelho | Urgente           |
| 🟡 Média   | Laranja  | Importante        |
| 🟢 Baixa   | Verde    | Pode esperar      |
| ⚪ Nenhuma  | Cinza    | Sem classificação |
```
---

## 🛠️ Tecnologias utilizadas

React.js — Biblioteca de UI
useState — Gerenciamento de estado local
useEffect — Efeitos colaterais (persistência, foco)
localStorage — Persistência dos dados no navegador
CSS puro — Estilização sem dependências externas

---

## 📂 Estrutura do projeto
```bash
src/
├── index.js         # não alterado
├── App.js           # Componente principal com toda a lógica React
├── App.css          # Estilos com design de aquarela chinesa
└── assets/
    └── fundo.jpg    # Imagem de fundo (paisagem em aquarela)
```
---

## ⚙️ Como rodar o projeto
```bash
# Clonar repositório
git clone https://github.com/edufl/todo-list

# Entrar na pasta
cd todo-list

# Instalar dependências
npm install

# Rodar projeto
npm start
```

---

## 👨‍💻 Autor

Desenvolvido por **edufl**
