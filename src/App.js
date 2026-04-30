import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// ─── Ícone SVG de clipe metálico ────────────────────────────────────────────
const ClipIcon = () => (
  <svg className="clip" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="0" width="40" height="12" rx="6" fill="#b0b8c1" stroke="#8a9099" strokeWidth="1.5"/>
    <rect x="18" y="4" width="24" height="6" rx="3" fill="#d0d8e0" stroke="#9aa0a8" strokeWidth="1"/>
    <rect x="14" y="10" width="32" height="22" rx="3" fill="#c8d0d8" stroke="#8a9099" strokeWidth="1.5"/>
    <rect x="20" y="14" width="20" height="4" rx="2" fill="#e0e8f0" stroke="#aab0b8" strokeWidth="0.8"/>
    <rect x="22" y="20" width="16" height="3" rx="1.5" fill="#e0e8f0" stroke="#aab0b8" strokeWidth="0.8"/>
  </svg>
);

// ─── Configuração de prioridades ─────────────────────────────────────────────
const PRIORITIES = [
  { value: "Alta",    label: "Alta",    color: "#c0392b" },
  { value: "Média",   label: "Média",   color: "#c8860a" },
  { value: "Baixa",   label: "Baixa",   color: "#2e7d5e" },
  { value: "Nenhuma", label: "Nenhuma", color: "#aaaaaa" },
];

// ─── Filtros de tarefas ──────────────────────────────────────────────────────
const FILTERS = ["Todas", "Pendentes", "Concluídas"];

function App() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("todo-tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Nenhuma");
  const [filter, setFilter] = useState("Todas");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("Nenhuma");
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  // ── Persistência com localStorage ─────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ── Foco automático no input ───────────────────────────────────────────────
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ── CRUD: Criar ───────────────────────────────────────────────────────────
  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false,
      priority: priority,
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };
    setTasks((prev) => [newTask, ...prev]);
    setInput("");
    setPriority("Nenhuma");
    inputRef.current?.focus();
  };

  // ── CRUD: Toggle concluída ─────────────────────────────────────────────────
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // ── CRUD: Editar ──────────────────────────────────────────────────────────
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditPriority(task.priority || "Nenhuma");
  };

  const confirmEdit = (id) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, text: trimmed, priority: editPriority } : t
      )
    );
    setEditingId(null);
    setEditText("");
    setEditPriority("Nenhuma");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditPriority("Nenhuma");
  };

  // ── CRUD: Deletar ─────────────────────────────────────────────────────────
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // ── Filtros ───────────────────────────────────────────────────────────────
  const filteredTasks = tasks.filter((t) => {
    if (filter === "Pendentes") return !t.completed;
    if (filter === "Concluídas") return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  // ── Enter / Escape ────────────────────────────────────────────────────────
  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") action();
    if (e.key === "Escape") cancelEdit();
  };

  // ── Helper: pegar config de prioridade ───────────────────────────────────
  const getPriority = (val) =>
    PRIORITIES.find((p) => p.value === val) || PRIORITIES[3];

  return (
    <div className="app-bg">
      {/* Overlay de névoa */}
      <div className="mist-overlay" />

      {/* ── Clipboard ────────────────────────────────────────────────────── */}
      <div className="clipboard-wrapper">
        <div className="clipboard">

          {/* Clipe metálico */}
          <div className="clip-holder">
            <ClipIcon />
          </div>

          {/* Papel dentro do clipboard */}
          <div className="paper">

            {/* Título */}
            <div className="paper-header">
              <h1 className="title">
                <span className="title-icon">☯</span>
                lista de tarefas
              </h1>
              {totalCount > 0 && (
                <p className="subtitle">
                  {completedCount}/{totalCount} tarefas concluídas
                </p>
              )}
            </div>

            {/* Input + seletor de prioridade */}
            <div className={`input-row ${shake ? "shake" : ""}`}>
              <input
                ref={inputRef}
                className="task-input"
                type="text"
                placeholder="Adicionar nova tarefa..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addTask)}
                maxLength={120}
              />
              <button className="btn-add" onClick={addTask} title="Adicionar">
                <span>+</span>
              </button>
            </div>

            {/* Seletor de prioridade para nova tarefa */}
            <div className="priority-selector">
              <span className="priority-label">Prioridade:</span>
              <div className="priority-options">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    className={`priority-btn ${priority === p.value ? "selected" : ""}`}
                    style={{
                      "--p-color": p.color,
                    }}
                    onClick={() => setPriority(p.value)}
                  >
                    <span className="p-dot" style={{ background: p.color }} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros */}
            {tasks.length > 0 && (
              <div className="filters">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`filter-btn ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            {/* Lista de tarefas */}
            <ul className="task-list">
              {filteredTasks.length === 0 && (
                <li className="empty-state">
                  {tasks.length === 0
                    ? "✦ Nenhuma tarefa ainda. Comece agora!"
                    : "Nenhuma tarefa nesta categoria."}
                </li>
              )}

              {filteredTasks.map((task) => {
                const pConfig = getPriority(task.priority || "Nenhuma");
                return (
                  <li
                    key={task.id}
                    className={`task-item ${task.completed ? "done" : ""}`}
                  >
                    {/* Barra lateral colorida de prioridade */}
                    <span
                      className="priority-bar"
                      style={{ background: pConfig.color }}
                      title={`Prioridade: ${pConfig.label}`}
                    />

                    {/* Checkbox */}
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                      />
                      <span className="custom-check">
                        {task.completed && <span className="check-mark">✓</span>}
                      </span>
                    </label>

                    {/* Texto / Edição inline */}
                    {editingId === task.id ? (
                      <div className="edit-wrapper">
                        <input
                          className="edit-input"
                          value={editText}
                          autoFocus
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, () => confirmEdit(task.id))}
                          maxLength={120}
                        />
                        {/* Seletor de prioridade na edição */}
                        <div className="edit-priority-row">
                          {PRIORITIES.map((p) => (
                            <button
                              key={p.value}
                              className={`priority-btn ${editPriority === p.value ? "selected" : ""}`}
                              style={{ "--p-color": p.color }}
                              onClick={() => setEditPriority(p.value)}
                            >
                              <span className="p-dot" style={{ background: p.color }} />
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span
                        className="task-text"
                        onDoubleClick={() => !task.completed && startEdit(task)}
                        title={task.completed ? "" : "Clique duplo para editar"}
                      >
                        {task.text}
                      </span>
                    )}

                    {/* Badge de prioridade (visível quando não é Nenhuma) */}
                    {task.priority && task.priority !== "Nenhuma" && editingId !== task.id && (
                      <span
                        className="priority-badge"
                        style={{ color: pConfig.color, borderColor: `${pConfig.color}55`, background: `${pConfig.color}12` }}
                      >
                        {pConfig.label}
                      </span>
                    )}

                    {/* Ações */}
                    <div className="task-actions">
                      {editingId === task.id ? (
                        <>
                          <button className="btn-icon confirm" onClick={() => confirmEdit(task.id)} title="Confirmar">✓</button>
                          <button className="btn-icon cancel" onClick={cancelEdit} title="Cancelar">✕</button>
                        </>
                      ) : (
                        <>
                          {!task.completed && (
                            <button className="btn-icon edit" onClick={() => startEdit(task)} title="Editar">✎</button>
                          )}
                          <button className="btn-icon delete" onClick={() => deleteTask(task.id)} title="Deletar">✕</button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Rodapé */}
            {completedCount > 0 && (
              <div className="paper-footer">
                <button className="btn-clear" onClick={clearCompleted}>
                  Limpar concluídas ({completedCount})
                </button>
              </div>
            )}

          </div>{/* /paper */}
        </div>{/* /clipboard */}
      </div>{/* /clipboard-wrapper */}
    </div>
  );
}

export default App;