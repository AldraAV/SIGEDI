import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, 
  FileText, 
  FolderOpen, 
  ChevronRight, 
  Sparkles, 
  Database, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  ShieldCheck, 
  UploadCloud, 
  FileSpreadsheet, 
  AlertOctagon, 
  ArrowRight,
  Eye,
  Settings,
  HelpCircle,
  Clock,
  Terminal,
  Activity,
  Cpu
} from "lucide-react";
import "./App.css";

// Endpoint base del backend FastAPI
const BACKEND_URL = "http://localhost:8000";

// Componente SVG del Escudo Nacional de México (simplificado e institucional de alta calidad)
function EscudoNacional({ className = "w-12 h-12" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-40" />
      {/* Laurel y Encino (Guirnalda inferior) */}
      <path 
        d="M25 65C30 75 40 80 50 80C60 80 70 75 75 65" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <path d="M22 61L25 65L21 68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M78 61L75 65L79 68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Águila Parada sobre el Nopal */}
      <path 
        d="M44 48C42 42 45 32 50 30C52 29 55 31 54 34C53 37 55 39 58 38C61 37 63 42 61 46C59 50 56 52 53 54C50 56 46 56 44 48Z" 
        fill="currentColor" 
        className="opacity-95"
      />
      {/* Alas del águila */}
      <path 
        d="M52 32C56 22 66 18 72 20C74 21 72 27 68 30C64 33 60 34 56 35" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M48 34C42 25 32 22 26 25C24 26 27 31 31 34C35 37 40 38 44 38" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
      {/* Serpiente */}
      <path 
        d="M51 28C53 23 48 20 52 16C55 13 60 16 57 20C55 23 58 26 55 28" 
        stroke="currentColor" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Nopal y Glifo de la Laguna */}
      <path 
        d="M38 68C42 64 45 68 50 68C55 68 58 64 62 68C65 71 63 76 50 76C37 76 35 71 38 68Z" 
        fill="currentColor" 
        className="opacity-90"
      />
      {/* Cactus pencas */}
      <circle cx="50" cy="62" r="3.5" fill="currentColor" />
      <circle cx="43" cy="64" r="3" fill="currentColor" />
      <circle cx="57" cy="64" r="3" fill="currentColor" />
    </svg>
  );
}

export default function App() {
  const [temaTech, setTemaTech] = useState(false);
  const [documentosIndexados, setDocumentosIndexados] = useState([]);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [cargandoDocumentos, setCargandoDocumentos] = useState(false);
  const [cargandoSubida, setCargandoSubida] = useState(false);
  const [dragActivo, setDragActivo] = useState(false);
  const [mensajeSubida, setMensajeSubida] = useState(null);
  const [enfoqueAuditoria, setEnfoqueAuditoria] = useState("general");
  const [cargandoAuditoria, setCargandoAuditoria] = useState(false);
  const [resultadoAuditoria, setResultadoAuditoria] = useState(null);
  const [consultaBusqueda, setConsultaBusqueda] = useState("");
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);
  const [estadoBackend, setEstadoBackend] = useState("activo");

  const fileInputRef = useRef(null);

  // Cargar documentos reales del backend
  const cargarDocumentos = async () => {
    setCargandoDocumentos(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/documentos`);
      if (res.ok) {
        const data = await res.json();
        const docs = data.documentos || [];
        setDocumentosIndexados(docs);
        if (docs.length > 0 && !documentoSeleccionado) {
          setDocumentoSeleccionado(docs[0]);
        }
      }
    } catch (e) {
      console.error("Error al conectar con backend:", e);
    } finally {
      setCargandoDocumentos(false);
    }
  };

  // Verificar la salud del backend FastAPI
  const verificarSalud = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/`);
      if (res.ok) {
        setEstadoBackend("activo");
      } else {
        setEstadoBackend("inactivo");
      }
    } catch {
      setEstadoBackend("inactivo");
    }
  };

  useEffect(() => {
    verificarSalud();
    cargarDocumentos();
    // Checar salud cada 10 segundos
    const interval = setInterval(verificarSalud, 10000);
    return () => clearInterval(interval);
  }, []);

  // Ingesta de archivos
  const manejarSubida = async (archivo) => {
    setCargandoSubida(true);
    setMensajeSubida(null);
    try {
      const formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("origen", "sigedi_web");

      const res = await fetch(`${BACKEND_URL}/api/indexar`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setMensajeSubida({ 
          tipo: "exito", 
          texto: `Documento "${archivo.name}" cargado y vectorizado exitosamente.` 
        });
        await cargarDocumentos();
        if (data && data.id) {
          setDocumentoSeleccionado({
            id: data.id,
            titulo: archivo.name,
            contenido_crudo: data.contenido_crudo || "",
            hash_sha256: data.hash_sha256 || "N/A"
          });
        }
      } else {
        setMensajeSubida({ tipo: "error", texto: "El backend rechazó el archivo. Intenta de nuevo." });
      }
    } catch (err) {
      setMensajeSubida({ tipo: "error", texto: "Fallo de conexión de red con el servidor." });
    } finally {
      setCargandoSubida(false);
      setTimeout(() => setMensajeSubida(null), 5000);
    }
  };

  const alHacerDrag = (e) => {
    e.preventDefault();
    setDragActivo(e.type === "dragover");
  };

  const alSoltar = (e) => {
    e.preventDefault();
    setDragActivo(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      manejarSubida(e.dataTransfer.files[0]);
    }
  };

  const alSeleccionarManual = (e) => {
    if (e.target.files && e.target.files[0]) {
      manejarSubida(e.target.files[0]);
    }
  };

  // Auditoría Avanzada Real
  const ejecutarAuditoria = async () => {
    if (!documentoSeleccionado) return;
    setCargandoAuditoria(true);
    setResultadoAuditoria(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auditar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          documento_id: documentoSeleccionado.id, 
          enfoque: enfoqueAuditoria 
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResultadoAuditoria(data);
      } else {
        setResultadoAuditoria({ 
          error: "Fallo al auditar. Asegúrate de configurar la api_key en el backend." 
        });
      }
    } catch (err) {
      setResultadoAuditoria({ error: "Error de red al consultar el motor cognitivo de auditoría." });
    } finally {
      setCargandoAuditoria(false);
    }
  };

  // Consulta RAG
  const ejecutarConsultaRAG = async (e) => {
    e.preventDefault();
    if (!consultaBusqueda.trim()) return;
    setCargandoBusqueda(true);
    setResultadoBusqueda(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/consulta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          consulta: consultaBusqueda, 
          limite: 3 
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResultadoBusqueda(data);
      } else {
        setResultadoBusqueda({ error: "Fallo de respuesta del buscador semántico vectorizado." });
      }
    } catch (err) {
      setResultadoBusqueda({ error: "Error de red al consultar el motor vectorial." });
    } finally {
      setCargandoBusqueda(false);
    }
  };

  const obtenerIcono = (nombre) => {
    const ext = nombre.split('.').pop()?.toLowerCase();
    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
    return <FileText className="w-5 h-5 text-rose-700 dark:text-rose-400" />;
  };

  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col transition-colors duration-500 ${temaTech ? "theme-tech bg-[#0B0F19]" : "bg-[#F8F6F2]"}`}>
      
      {/* HEADER SUPERIOR */}
      <header className={`w-full px-8 py-4 flex items-center justify-between border-b transition-colors ${
        temaTech 
          ? "bg-slate-900/60 border-slate-800 backdrop-blur-md" 
          : "bg-white border-[#E0DCD3] shadow-sm"
      }`}>
        <div className="flex items-center gap-4">
          {!temaTech ? (
            <div className="text-[#6A1B29]">
              <EscudoNacional className="w-11 h-11" />
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <Cpu className="w-6 h-6 text-[#00F0FF]" />
            </div>
          )}
          
          <div>
            <h1 className="font-display font-extrabold text-lg tracking-wide flex items-center gap-2 m-0 text-[var(--text-primary)]">
              SIGEDI
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                temaTech 
                  ? "bg-cyan-950/60 border-cyan-700/40 text-[#00F0FF]" 
                  : "bg-[#6A1B29]/10 border-[#6A1B29]/20 text-[#6A1B29]"
              }`}>
                {temaTech ? "AUDITORÍA DIGITAL" : "PLATAFORMA NACIONAL"}
              </span>
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-wider font-semibold opacity-70 mt-0.5 text-[var(--text-secondary)]">
              {temaTech ? "Cryptographic Vector Audit Console" : "Sistema de Gestión y Diagnóstico Inmutable de Expedientes"}
            </p>
          </div>
        </div>

        {/* CONTROLES / THEME SWITCHER */}
        <div className="flex items-center gap-4">
          {/* Indicador de Salud del Backend */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-mono font-semibold transition-colors ${
            temaTech 
              ? "bg-slate-900/80 border-slate-800 text-slate-300" 
              : "bg-stone-100 border-[#E0DCD3] text-stone-700"
          }`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                estadoBackend === 'activo' ? 'bg-emerald-400' : 'bg-rose-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                estadoBackend === 'activo' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}></span>
            </span>
            <span>BACKEND: {estadoBackend.toUpperCase()}</span>
          </div>

          {/* Switch de Tema de Dos Estados */}
          <div className={`p-1 rounded-full border flex items-center gap-1 ${
            temaTech ? "bg-slate-900 border-slate-800" : "bg-stone-100 border-[#E0DCD3]"
          }`}>
            <button
              onClick={() => setTemaTech(false)}
              className={`px-3 py-1 rounded-full text-[10px] font-display font-bold uppercase transition-all tracking-wide ${
                !temaTech 
                  ? "bg-[#6A1B29] text-white shadow-sm" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Gobierno
            </button>
            <button
              onClick={() => setTemaTech(true)}
              className={`px-3 py-1 rounded-full text-[10px] font-display font-bold uppercase transition-all tracking-wide ${
                temaTech 
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-lg" 
                  : "text-stone-500 hover:text-[#6A1B29]"
              }`}
            >
              Auditoría
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL LAYOUT ASIMÉTRICO */}
      <div className="flex-1 flex overflow-hidden w-full">
        
        {/* PANEL IZQUIERDO: EXTRACCIÓN Y DOCUMENTOS */}
        <aside className={`w-[36%] border-r flex flex-col h-full flex-shrink-0 transition-colors ${
          temaTech ? "bg-slate-950/40 border-slate-900" : "bg-white border-[#E0DCD3]"
        }`}>
          
          {/* INGESTA */}
          <div className={`p-6 border-b transition-colors ${temaTech ? "border-slate-900" : "border-[#E0DCD3] bg-stone-50/50"}`}>
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider mb-3 text-[var(--text-secondary)] flex items-center gap-2">
              <UploadCloud className={`w-4 h-4 ${temaTech ? "text-[#00F0FF]" : "text-[#6A1B29]"}`} />
              Indexar Expediente Municipal
            </h2>

            <div
              onDragOver={alHacerDrag}
              onDragLeave={alHacerDrag}
              onDrop={alSoltar}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center ${
                dragActivo 
                  ? "border-[var(--color-primary)] bg-[var(--color-accent-light)]" 
                  : "border-stone-300 dark:border-slate-800 hover:border-[var(--color-primary)] hover:bg-stone-50/60 dark:hover:bg-slate-900/20"
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={alSeleccionarManual} 
                className="hidden" 
                accept=".pdf,.docx,.xlsx,.xls,.txt,.csv"
              />
              
              <div className={`p-3 rounded-full border transition-colors mb-2 ${
                temaTech ? "bg-slate-900 border-slate-800" : "bg-stone-100 border-[#E0DCD3]"
              }`}>
                <UploadCloud className={`w-6 h-6 transition-transform duration-300 ${
                  cargandoSubida ? 'animate-bounce text-[var(--color-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--color-primary)] group-hover:scale-110'
                }`} />
              </div>
              
              <p className="text-xs font-bold text-[var(--text-primary)]">
                {cargandoSubida ? "Analizando y vectorizando..." : "Arrastra un documento o haz clic"}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] mt-1 max-w-xs leading-normal">
                Formatos: PDF, EXCEL (XLSX/CSV), WORD o TXT. Extrae embeddings y firma SHA-256.
              </p>
            </div>

            <AnimatePresence>
              {mensajeSubida && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-3 p-3 rounded-xl border text-[11px] leading-normal flex items-start gap-2 ${
                    mensajeSubida.tipo === 'exito' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {mensajeSubida.tipo === 'exito' ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertOctagon className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  <span>{mensajeSubida.texto}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LISTA DE ARCHIVOS */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[var(--color-accent)]" />
                Expedientes Indexados ({documentosIndexados.length})
              </h3>
              <button
                onClick={cargarDocumentos}
                disabled={cargandoDocumentos}
                className="text-[var(--text-muted)] hover:text-[var(--color-primary)] p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-slate-900 transition-colors"
                title="Refrescar lista"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${cargandoDocumentos ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {cargandoDocumentos && documentosIndexados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-mono text-[var(--text-muted)]">Leyendo registros...</span>
              </div>
            ) : documentosIndexados.length === 0 ? (
              <div className={`border rounded-2xl p-8 text-center transition-colors ${
                temaTech ? "bg-slate-900/10 border-slate-900" : "bg-stone-50 border-[#E0DCD3]"
              }`}>
                <FileText className="w-8 h-8 text-[var(--text-muted)]/40 mx-auto mb-2" />
                <p className="text-xs font-semibold text-[var(--text-primary)]">No hay expedientes cargados.</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">Sube un documento oficial para iniciar el diagnóstico.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {documentosIndexados.map((doc) => {
                  const seleccionado = documentoSeleccionado?.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setDocumentoSeleccionado(doc)}
                      className={`group border rounded-2xl p-3.5 transition-all duration-300 cursor-pointer text-left ${
                        seleccionado 
                          ? temaTech 
                            ? "bg-cyan-950/10 border-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.05)]"
                            : "bg-[#6A1B29]/5 border-[#6A1B29] shadow-sm"
                          : "border-stone-200 dark:border-slate-800/80 bg-[var(--bg-card)] hover:border-[var(--color-primary)]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl border transition-colors ${
                          seleccionado 
                            ? "bg-white/80 dark:bg-slate-900 border-current/25" 
                            : "bg-stone-50 dark:bg-slate-900/50 border-stone-200 dark:border-slate-800"
                        }`}>
                          {obtenerIcono(doc.titulo)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-xs font-bold truncate ${
                              seleccionado ? 'text-[var(--color-primary)]' : 'text-[var(--text-primary)]'
                            }`}>
                              {doc.titulo}
                            </h4>
                            {seleccionado && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-sm" />
                            )}
                          </div>
                          
                          <p className="text-[9px] font-mono text-[var(--text-muted)] mt-1 truncate">
                            HASH: {doc.hash_sha256 ? doc.hash_sha256.substring(0, 14) : "FIRMADO"}...
                          </p>
                          <p className="text-[10px] text-[var(--text-secondary)] font-medium mt-1 leading-normal line-clamp-2">
                            {doc.contenido_crudo}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FIRMA DE PIE SIDEBAR */}
          <div className={`p-5 border-t text-center flex flex-col items-center justify-center space-y-1 transition-colors ${
            temaTech ? "border-slate-900 bg-slate-950/60" : "border-[#E0DCD3] bg-stone-50"
          }`}>
            <span className="text-[8px] font-mono uppercase tracking-widest text-[var(--text-muted)]">Sistema Nacional de Auditoría</span>
            <span className="text-[10px] font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <ShieldCheck className={`w-4 h-4 ${temaTech ? "text-[#00F0FF]" : "text-[#BC955C]"}`} /> 
              Cripto-Auditoría Inmutable
            </span>
          </div>

        </aside>

        {/* PANEL DERECHO: DIAGNÓSTICO Y CONSULTA */}
        <main className={`flex-1 flex flex-col h-full transition-colors ${
          temaTech ? "bg-[#0B0F19]/40" : "bg-[#F3F1EB]"
        }`}>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            
            {/* HERRAMIENTA DE AUDITORÍA */}
            <section className={`border rounded-3xl p-6 transition-all duration-300 ${
              temaTech 
                ? "bg-slate-900/20 border-slate-800/80 shadow-2xl" 
                : "bg-white border-[#E0DCD3] shadow-sm"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">Procedimiento de Diagnóstico</h3>
                  <p className="text-sm font-bold mt-1 text-[var(--text-primary)]">
                    {documentoSeleccionado 
                      ? `Analizar: ${documentoSeleccionado.titulo}` 
                      : "Seleccione un expediente de la izquierda"}
                  </p>
                </div>
                
                {documentoSeleccionado && (
                  <button
                    onClick={ejecutarAuditoria}
                    disabled={cargandoAuditoria}
                    className={`px-5 py-2.5 rounded-xl font-display font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                      temaTech
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-black hover:opacity-90 active:scale-95 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                        : "bg-[#6A1B29] text-white hover:bg-[#561420] active:scale-95 shadow-md"
                    }`}
                  >
                    {cargandoAuditoria ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Auditando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Ejecutar Auditoría
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Selector de Enfoques */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { id: "general", titulo: "Análisis General", desc: "Alertas y riesgos globales", activeColor: "border-[#6A1B29] text-[#6A1B29] bg-[#6A1B29]/5 dark:border-[#00F0FF] dark:text-[#00F0FF] dark:bg-cyan-950/20" },
                  { id: "sobrecostos", titulo: "Financiero / Costos", desc: "Sobrecostos y desvíos", activeColor: "border-[#13322B] text-[#13322B] bg-[#13322B]/5 dark:border-emerald-400 dark:text-emerald-400 dark:bg-emerald-950/20" },
                  { id: "bienestar", titulo: "Programas Sociales", desc: "Padrones y duplicados", activeColor: "border-[#BC955C] text-[#BC955C] bg-[#BC955C]/5 dark:border-purple-400 dark:text-purple-400 dark:bg-purple-950/20" },
                  { id: "legal", titulo: "Legal / Licitación", desc: "Incumplimiento de pliegos", activeColor: "border-rose-700 text-rose-700 bg-rose-500/5 dark:border-rose-400 dark:text-rose-400 dark:bg-rose-950/20" }
                ].map((enf) => {
                  const activo = enfoqueAuditoria === enf.id;
                  return (
                    <button
                      key={enf.id}
                      onClick={() => setEnfoqueAuditoria(enf.id)}
                      className={`border rounded-2xl p-3.5 text-left transition-all duration-300 cursor-pointer ${
                        activo 
                          ? `${enf.activeColor} scale-[1.01] font-bold` 
                          : "border-stone-200 dark:border-slate-800/80 hover:border-stone-300 dark:hover:border-slate-700 hover:bg-stone-50/50 dark:hover:bg-slate-900/10"
                      }`}
                    >
                      <span className="text-xs font-bold block">{enf.titulo}</span>
                      <span className="text-[9px] text-[var(--text-muted)] block mt-1 leading-normal font-medium">{enf.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* CONSOLA DE RESULTADOS DE AUDITORÍA */}
              <div className="bg-[#15151A] rounded-2xl overflow-hidden shadow-2xl relative min-h-[220px] text-white">
                
                {cargandoAuditoria && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-mono text-[var(--color-primary)] animate-pulse">LUCERO procesando heurísticas de control gubernamental...</p>
                  </div>
                )}

                {!resultadoAuditoria && !cargandoAuditoria && (
                  <div className="p-10 text-center flex flex-col items-center justify-center min-h-[220px]">
                    <AlertTriangle className="w-10 h-10 text-stone-600 mb-3" />
                    <p className="text-xs text-stone-400 max-w-md leading-relaxed">
                      Consola de control en espera. Seleccione un expediente del panel izquierdo, defina el enfoque del diagnóstico y pulse <strong>Ejecutar Auditoría</strong> para iniciar.
                    </p>
                  </div>
                )}

                {resultadoAuditoria && (
                  <div className="divide-y divide-white/5">
                    
                    {/* Header Reporte */}
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.01]">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-[var(--color-accent)]" />
                        <div>
                          <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block">Certificado Criptográfico Oficial</span>
                          <h4 className="text-xs font-bold text-white mt-0.5">REPORTE FEDERAL DE AUDITORÍA CONTEXTUAL</h4>
                        </div>
                      </div>

                      {resultadoAuditoria.nivel_riesde && (
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-stone-500">RIESGO:</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-extrabold tracking-wider border ${
                            resultadoAuditoria.nivel_riesde.toLowerCase() === 'critico' || resultadoAuditoria.nivel_riesde.toLowerCase() === 'alto'
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                              : resultadoAuditoria.nivel_riesde.toLowerCase() === 'medio'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          }`}>
                            {resultadoAuditoria.nivel_riesde.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Cuerpo Reporte */}
                    <div className="p-5 bg-black/10">
                      {resultadoAuditoria.error ? (
                        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-400 text-xs font-mono">
                          {resultadoAuditoria.error}
                        </div>
                      ) : (
                        <div className="text-xs text-stone-300 leading-relaxed font-sans whitespace-pre-wrap">
                          {resultadoAuditoria.hallazgos}
                        </div>
                      )}
                    </div>

                    {/* Footer con Firma e Inmutabilidad */}
                    {resultadoAuditoria.hash_reporte && (
                      <div className="p-4 bg-black/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[9px] font-mono text-stone-500">
                        <span className="truncate max-w-md">
                          REGISTRO SHA-256: <strong className="text-stone-300 select-all">{resultadoAuditoria.hash_reporte}</strong>
                        </span>
                        <span className="text-emerald-500 font-bold flex items-center gap-1 flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> DIAGNÓSTICO FIRMADO
                        </span>
                      </div>
                    )}

                  </div>
                )}

              </div>
            </section>

            {/* ASISTENTE RAG SEMÁNTICO */}
            <section className={`border rounded-3xl p-6 transition-all duration-300 ${
              temaTech 
                ? "bg-slate-900/20 border-slate-800/80 shadow-2xl" 
                : "bg-white border-[#E0DCD3] shadow-sm"
            }`}>
              <div className="mb-4">
                <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-[var(--color-accent)] animate-pulse" />
                  Búsqueda Semántica Vectorial (RAG)
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  Consulta de datos de alta precisión. El sistema busca fragmentos semánticos en Supabase mediante embeddings de Cohere.
                </p>
              </div>

              <form onSubmit={ejecutarConsultaRAG} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-all duration-500"></div>
                <div className="relative flex items-center bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800/80 rounded-2xl overflow-hidden focus-within:border-[var(--color-primary)] transition-all">
                  <Search className="w-4 h-4 ml-4 text-[var(--text-muted)]" />
                  <input 
                    type="text" 
                    value={consultaBusqueda}
                    onChange={(e) => setConsultaBusqueda(e.target.value)}
                    placeholder="Ej: ¿Cuáles son las observaciones respecto a las facturas y pliegos de pavimentación?" 
                    className="w-full bg-transparent border-none text-[var(--text-primary)] px-4 py-4 outline-none placeholder:text-[var(--text-muted)]/50 text-xs font-sans"
                  />
                  <button 
                    type="submit"
                    disabled={cargandoBusqueda || !consultaBusqueda.trim()}
                    className={`mr-3 px-5 py-2 rounded-xl font-display font-bold text-xs hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 ${
                      temaTech
                        ? "bg-[#00F0FF] text-black"
                        : "bg-[#6A1B29] text-white"
                    }`}
                  >
                    {cargandoBusqueda ? (
                      <>
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        Consultar
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <AnimatePresence>
                {resultadoBusqueda && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 space-y-4"
                  >
                    {resultadoBusqueda.error ? (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono">
                        {resultadoBusqueda.error}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className={`rounded-2xl p-5 border transition-all ${
                          temaTech 
                            ? "bg-cyan-950/5 border-cyan-800/40 text-slate-300 shadow-md" 
                            : "bg-stone-50 border-[#E0DCD3] text-stone-800 shadow-sm"
                        }`}>
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-[var(--color-primary)] animate-pulse" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--color-primary)]">Respuesta Basada en Evidencia Real</span>
                          </div>
                          <p className="text-xs leading-relaxed font-medium whitespace-pre-wrap font-sans">
                            {resultadoBusqueda.respuesta_ia}
                          </p>
                        </div>

                        {resultadoBusqueda.fragmentos && resultadoBusqueda.fragmentos.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[8px] font-mono text-[var(--text-muted)] uppercase tracking-widest block font-bold">Evidencias Vectoriales Extraídas</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {resultadoBusqueda.fragmentos.map((frag, idx) => (
                                <div key={idx} className={`rounded-2xl p-3.5 border flex flex-col justify-between space-y-3 transition-colors ${
                                  temaTech 
                                    ? "bg-slate-900/10 border-slate-900" 
                                    : "bg-white border-[#E0DCD3] shadow-xs"
                                }`}>
                                  <p className="text-[10px] leading-relaxed text-[var(--text-secondary)] font-medium font-sans line-clamp-4">
                                    "{frag.fragmento}"
                                  </p>
                                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-slate-800/80 text-[8px] font-mono">
                                    <span className="text-[var(--text-muted)] font-semibold">Similitud</span>
                                    <span className={`font-bold ${temaTech ? "text-[#00F0FF]" : "text-[#6A1B29]"}`}>
                                      {(frag.similitud * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </section>

          </div>

          {/* PIE DE PAGINA CON LOGOS */}
          <footer className={`p-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors ${
            temaTech ? "bg-slate-950/60 border-slate-900" : "bg-white border-[#E0DCD3] shadow-inner"
          }`}>
            
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Database className="w-4 h-4" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider">SIGEDI v2.1.0 — PLATAFORMA DE AUDITORÍA MUNICIPAL</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Documentación del Proceso:</span>
              
              {/* PDF Logo */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 transition-all duration-300 group">
                <svg className="w-6 h-6 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2c.55 0 1-.45 1-1s-.45-1-1-1H9V9h3c.55 0 1-.45 1-1s-.45-1-1-1H8v10h3c.55 0 1-.45 1-1s-.45-1-1-1zm4.5-3c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5H13v10h1.5v-4h1zm-1.5-3h1v1.5h-1V10zm5.5 5c0 .83-.67 1.5-1.5 1.5h-2.5V7H19c.83 0 1.5.67 1.5 1.5v6.5zm-1.5-5h-1v3.5h1V10z"/>
                </svg>
                <div className="flex flex-col text-left">
                  <span className="text-[8px] font-mono text-rose-500 font-bold uppercase tracking-wider leading-none">Portable</span>
                  <span className="text-[9px] font-sans text-[var(--text-primary)] font-extrabold leading-none mt-1">INFORMES PDF</span>
                </div>
              </div>

              {/* Excel Logo */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 transition-all duration-300 group">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
                <div className="flex flex-col text-left">
                  <span className="text-[8px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider leading-none">Spreadsheet</span>
                  <span className="text-[9px] font-sans text-[var(--text-primary)] font-extrabold leading-none mt-1">CÁLCULO EXCEL</span>
                </div>
              </div>

            </div>

          </footer>

        </main>

      </div>

    </div>
  );
}
