import { useState, useEffect } from "react";

function App() {
  const [tarefa, setTarefa] = useState("");
  const [prioridade, setPrioridade] = useState("media"); // 'baixa', 'media', 'alta'
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [textoEditado, setTextoEditado] = useState("");
  const [filtro, setFiltro] = useState("todas");

  const [lista, setLista] = useState(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
  });

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(lista));
  }, [lista]);

  function adicionarTarefa() {
    if (!tarefa.trim()) return;
    setLista([...lista, { texto: tarefa, concluida: false, prioridade }]);
    setTarefa("");
    setPrioridade("media");
  }

  function removerTarefa(index) {
    setLista(lista.filter((_, i) => i !== index));
  }

  function toggleTarefa(index) {
    setLista(
      lista.map((item, i) =>
        i === index ? { ...item, concluida: !item.concluida } : item
      )
    );
  }

  function iniciarEdicao(index) {
    setEditandoIndex(index);
    setTextoEditado(lista[index].texto);
    setPrioridade(lista[index].prioridade);
  }

  function salvarEdicao(index) {
    setLista(
      lista.map((item, i) =>
        i === index ? { ...item, texto: textoEditado, prioridade } : item
      )
    );
    setEditandoIndex(null);
    setTextoEditado("");
    setPrioridade("media");
  }

  const listaFiltrada = lista.filter((item) => {
    if (filtro === "concluidas") return item.concluida;
    if (filtro === "pendentes") return !item.concluida;
    return true;
  });

  const total = lista.length;
  const concluidas = lista.filter((t) => t.concluida).length;
  const pendentes = total - concluidas;

  const coresPrioridade = {
    baixa: "#28a745",
    media: "#FFC107",
    alta: "#E94E77",
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>📝 To-Do List</h1>

        {/* Contadores */}
        <div style={styles.contadores}>
          <div style={{ ...styles.contadorBadge, background: "#4A90E2" }}>
            Total <span style={styles.badge}>{total}</span>
          </div>
          <div style={{ ...styles.contadorBadge, background: "#28a745" }}>
            Concluídas <span style={styles.badge}>{concluidas}</span>
          </div>
          <div style={{ ...styles.contadorBadge, background: "#FFC107", color: "#000" }}>
            Pendentes <span style={styles.badge}>{pendentes}</span>
          </div>
        </div>

        {/* Input */}
        <div style={styles.inputArea}>
          <input
            style={styles.input}
            placeholder="Digite uma tarefa..."
            value={tarefa}
            onChange={(e) => setTarefa(e.target.value)}
          />
          <select
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
            style={styles.select}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
          <button style={styles.addButton} onClick={adicionarTarefa}>
            +
          </button>
        </div>

        {/* Filtros */}
        <div style={styles.filtros}>
          <button
            onClick={() => setFiltro("todas")}
            style={{
              ...styles.filtroButton,
              background: filtro === "todas" ? "#007bff" : "#ccc",
              color: filtro === "todas" ? "#fff" : "#000",
            }}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltro("concluidas")}
            style={{
              ...styles.filtroButton,
              background: filtro === "concluidas" ? "#28a745" : "#ccc",
              color: filtro === "concluidas" ? "#fff" : "#000",
            }}
          >
            Concluídas
          </button>
          <button
            onClick={() => setFiltro("pendentes")}
            style={{
              ...styles.filtroButton,
              background: filtro === "pendentes" ? "#ffc107" : "#ccc",
              color: filtro === "pendentes" ? "#000" : "#000",
            }}
          >
            Pendentes
          </button>
        </div>

        {/* Lista */}
        <ul style={styles.lista}>
          {listaFiltrada.map((item, index) => (
            <li
              key={index}
              style={{
                ...styles.item,
                borderLeft: `6px solid ${coresPrioridade[item.prioridade]}`,
                background: item.concluida ? "#e0f7e9" : "#f7f9fa",
                transform: item.concluida ? "scale(1.02)" : "scale(1)",
                transition: "all 0.2s ease"
              }}
            >
              {editandoIndex === index ? (
                <input
                  value={textoEditado}
                  onChange={(e) => setTextoEditado(e.target.value)}
                  style={styles.input}
                />
              ) : (
                <span
                  style={{
                    textDecoration: item.concluida ? "line-through" : "none",
                    color: item.concluida ? "#888" : "#000",
                  }}
                >
                  {item.texto}
                </span>
              )}
              <div style={styles.actions}>
                <button
                  style={{
                    ...styles.checkButton,
                    background: item.concluida ? "#555" : "#28a745",
                  }}
                  onClick={() => toggleTarefa(index)}
                >
                  ✔
                </button>
                {editandoIndex === index ? (
                  <button style={styles.saveButton} onClick={() => salvarEdicao(index)}>
                    💾
                  </button>
                ) : (
                  <button style={styles.editButton} onClick={() => iniciarEdicao(index)}>
                    ✏️
                  </button>
                )}
                <button style={styles.deleteButton} onClick={() => removerTarefa(index)}>
                  ✖
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center", paddingTop: 50, fontFamily: "Arial, sans-serif", background: "#f0f4f8", minHeight: "100vh" },
  container: { background: "#fff", padding: 25, borderRadius: 15, width: 500, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", marginBottom: 20, color: "#4A90E2" },
  inputArea: { display: "flex", gap: 10, marginBottom: 20 },
  input: { flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ccc", outline: "none" },
  select: { padding: 10, borderRadius: 10, border: "1px solid #ccc", cursor: "pointer" },
  addButton: { padding: "10px 18px", borderRadius: 10, border: "none", background: "#4A90E2", color: "#fff", fontSize: 20, cursor: "pointer", transition: "0.2s" },
  filtros: { display: "flex", justifyContent: "space-between", marginBottom: 20 },
  filtroButton: { flex: 1, padding: "8px 0", margin: "0 5px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 500, transition: "0.2s" },
  contadores: { display: "flex", justifyContent: "space-between", marginBottom: 20 },
  contadorBadge: { flex: 1, margin: "0 5px", padding: "10px 0", borderRadius: 12, color: "#fff", fontWeight: "bold", textAlign: "center", boxShadow: "0 3px 6px rgba(0,0,0,0.1)" },
  badge: { marginLeft: 8, background: "#fff", color: "#000", padding: "2px 8px", borderRadius: 12, fontWeight: "bold" },
  lista: { listStyle: "none", padding: 0 },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, borderRadius: 10, marginBottom: 10, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  actions: { display: "flex", gap: 5 },
  checkButton: { border: "none", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontWeight: "bold", transition: "0.2s" },
  editButton: { background: "#F5A623", border: "none", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontWeight: "bold", transition: "0.2s" },
  saveButton: { background: "#50E3C2", border: "none", padding: "6px 10px", borderRadius: 8, cursor: "pointer", color: "#fff", transition: "0.2s" },
  deleteButton: { background: "#E94E77", border: "none", padding: "6px 10px", borderRadius: 8, cursor: "pointer", color: "#fff", transition: "0.2s" },
};

export default App;