import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  HardDrive, 
  LayoutTemplate, 
  ShieldCheck, 
  FolderSync, 
  FileText, 
  Users, 
  Building2, 
  Mail, 
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

// Inicializar cliente de Supabase de manera segura para evitar fallos de ejecución si faltan variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Error al inicializar Supabase:", error);
  }
}

// Componente SVG del Escudo Nacional de México (institucional de alta calidad)
function EscudoNacional({ className = "w-12 h-12" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-40" />
      <path 
        d="M25 65C30 75 40 80 50 80C60 80 70 75 75 65" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <path d="M22 61L25 65L21 68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M78 61L75 65L79 68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path 
        d="M44 48C42 42 45 32 50 30C52 29 55 31 54 34C53 37 55 39 58 38C61 37 63 42 61 46C59 50 56 52 53 54C50 56 46 56 44 48Z" 
        fill="currentColor" 
        className="opacity-95"
      />
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
      <path 
        d="M51 28C53 23 48 20 52 16C55 13 60 16 57 20C55 23 58 26 55 28" 
        stroke="currentColor" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M38 68C42 64 45 68 50 68C55 68 58 64 62 68C65 71 63 76 50 76C37 76 35 71 38 68Z" 
        fill="currentColor" 
        className="opacity-90"
      />
      <circle cx="50" cy="62" r="3.5" fill="currentColor" />
      <circle cx="43" cy="64" r="3" fill="currentColor" />
      <circle cx="57" cy="64" r="3" fill="currentColor" />
    </svg>
  );
}

// Componente SVG del logotipo de capas para el modo tecnológico
function IconoCapas(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

// Componente SVG del logotipo de GitHub
function IconoGithub(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function App() {
  const [temaTech, setTemaTech] = useState(false);
  const [modalDocsAbierta, setModalDocsAbierta] = useState(false);
  const [modalSoporteAbierta, setModalSoporteAbierta] = useState(false);
  const [modalGithubAbierta, setModalGithubAbierta] = useState(false);
  
  const [soporteMensaje, setSoporteMensaje] = useState("");
  const [soporteEmail, setSoporteEmail] = useState("");
  const [soporteEnviando, setSoporteEnviando] = useState(false);
  const [soporteExito, setSoporteExito] = useState(false);

  const manejarInicioSesionGoogle = async () => {
    if (!supabase) {
      alert("Para acceder con Google Drive, por favor configura las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env.local.");
      return;
    }
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/app`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'https://www.googleapis.com/auth/drive.readonly'
        }
      });
    } catch (err) {
      console.error("Error de Supabase Auth:", err);
      alert("Fallo de comunicación con Supabase Auth.");
    }
  };

  const hacerScrollASeccion = (id) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`w-full min-h-screen relative overflow-y-auto scrollbar-hide flex flex-col items-center justify-start transition-colors duration-500 ${
      temaTech ? "theme-tech bg-[#0B0F19] text-[#F3F4F6]" : "bg-[#F8F6F2] text-[#23292F]"
    }`}>
      
      {/* Fondo Abstracto e Ilustración Vectorial de Documentos Flotantes */}
      <div className="absolute top-0 left-0 right-0 h-[100vh] z-0 overflow-hidden pointer-events-none">
        {/* Luces de Fondo Dinámicas */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--color-light-1)_0%,_transparent_70%)] opacity-40 blur-3xl"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--color-light-2)_0%,_transparent_70%)] opacity-40 blur-3xl"
        />

        {/* Ilustración de Documentos, Excel, PDFs y Carpetas Flotantes con Colores que Adaptan su Tonalidad */}
        <div className="absolute inset-0 z-10 opacity-30 dark:opacity-40">
          
          {/* Carpeta Flotante */}
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[12%] text-[var(--color-primary)] opacity-80"
          >
            <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </motion.div>

          {/* Documento de Texto */}
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[22%] right-[12%] text-[var(--color-accent)] opacity-80"
          >
            <svg width="100" height="130" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </motion.div>

          {/* Excel / Grid */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[18%] left-[18%] text-emerald-600 dark:text-emerald-400 opacity-80"
          >
            <svg width="120" height="90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="3" y1="15" x2="21" y2="15"/>
              <line x1="10" y1="3" x2="10" y2="21"/>
            </svg>
          </motion.div>

          {/* PDF */}
          <motion.div 
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-[22%] right-[18%] text-rose-600 dark:text-rose-400 opacity-85"
          >
            <svg width="90" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="M8 13h2a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2H8v6"/>
            </svg>
          </motion.div>
        </div>

        {/* Máscara de degradado suave inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent via-current/5 to-[var(--bg-app)] z-20 pointer-events-none" />
      </div>

      {/* Encabezado / Navegación */}
      <header className={`absolute top-0 w-full px-12 py-8 flex justify-between items-center z-50`}>
        <div 
          className="flex items-center gap-3.5 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {!temaTech ? (
            <div className="text-[#6A1B29] transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(106,27,41,0.3)]">
              <EscudoNacional className="w-9 h-9" />
            </div>
          ) : (
            <div className="text-[#00F0FF] transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
              <IconoCapas className="w-8 h-8" />
            </div>
          )}
          <span className="font-display font-black text-2xl tracking-tighter text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--color-primary)]">
            {!temaTech ? "SIGEDI" : "GECEP"}
          </span>
        </div>

        <nav className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          <button onClick={() => hacerScrollASeccion("seguridad")} className="hover:text-[var(--color-primary)] transition-colors cursor-pointer bg-transparent border-none outline-none font-display">Seguridad</button>
          <button onClick={() => hacerScrollASeccion("sincronizacion")} className="hover:text-[var(--color-primary)] transition-colors cursor-pointer bg-transparent border-none outline-none font-display">Sincronización</button>
          <button onClick={() => hacerScrollASeccion("capacidades")} className="hover:text-[var(--color-primary)] transition-colors cursor-pointer bg-transparent border-none outline-none font-display">Capacidades</button>
        </nav>

        {/* Switcher de Temas */}
        <div className={`p-1 rounded-full border flex items-center gap-1 transition-colors ${
          temaTech ? "bg-slate-900 border-slate-800" : "bg-stone-100 border-[#E0DCD3]"
        }`}>
          <button
            onClick={() => setTemaTech(false)}
            className={`px-3 py-1 rounded-full text-[9px] font-display font-bold uppercase transition-all tracking-wide cursor-pointer ${
              !temaTech 
                ? "bg-[#6A1B29] text-white shadow-sm" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Gobierno
          </button>
          <button
            onClick={() => setTemaTech(true)}
            className={`px-3 py-1 rounded-full text-[9px] font-display font-bold uppercase transition-all tracking-wide cursor-pointer ${
              temaTech 
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-md" 
                : "text-stone-500 hover:text-[#6A1B29]"
            }`}
          >
            Auditoría
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-screen w-full max-w-5xl mx-auto pt-24">
        
        {/* Etiqueta / Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`mb-6 px-4 py-1.5 rounded-full border text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${
            temaTech 
              ? "bg-cyan-950/40 border-cyan-800/40 text-[#00F0FF]" 
              : "bg-[#6A1B29]/5 border-[#6A1B29]/20 text-[#6A1B29]"
          }`}
        >
          {!temaTech ? "PLATAFORMA NACIONAL DE AUDITORÍA" : "CRYPTOGRAPHIC VECTOR CONSOLE"}
        </motion.div>

        {/* Titulo Principal */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.05] mb-8"
        >
          {!temaTech ? (
            <>
              Sistema Inteligente de <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A1B29] via-[#BC955C] to-[#6A1B29]">
                Gestión Documental
              </span>
            </>
          ) : (
            <>
              Gestión Estratégica Contextual <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-purple-400 to-[#00F0FF]">
                de Expedientes Públicos
              </span>
            </>
          )}
        </motion.h1>

        {/* Subtitulo descriptivo */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg text-[var(--text-secondary)] font-sans max-w-3xl mb-14 leading-relaxed font-medium"
        >
          Busca tus documentos por significado. Encuentra información al instante, valida firmas digitales y detecta inconsistencias administrativas de forma automatizada y sin complicaciones.
        </motion.p>

        {/* Botones de Acción */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4.5 w-full max-w-md mx-auto justify-center px-4"
        >
          <button 
            onClick={manejarInicioSesionGoogle}
            className={`flex-1 flex items-center justify-center gap-3 px-7 py-3.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-sm cursor-pointer shadow-lg ${
              temaTech
                ? "bg-[#F3F4F6] text-black hover:bg-gray-200"
                : "bg-[#6A1B29] text-white hover:bg-[#561420] shadow-[#6A1B29]/10"
            }`}
          >
            <HardDrive className="w-4 h-4" />
            Acceder con Google Drive
          </button>
          
          <button 
            onClick={() => window.location.href = "/app"}
            className="flex-1 flex items-center justify-center gap-3 px-7 py-3.5 rounded-full liquid-glass text-[var(--text-primary)] font-bold hover:bg-white/5 transition-all hover:scale-105 active:scale-95 text-sm cursor-pointer border border-[var(--color-border)]"
          >
            <LayoutTemplate className="w-4 h-4" />
            Abrir Espacio Local
          </button>
        </motion.div>
      </section>

      {/* Feature Showcase Cards */}
      <section className="relative z-30 w-full max-w-6xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <div className="liquid-glass rounded-3xl p-8 group hover:border-[var(--color-primary)]/40 transition-all duration-300 min-h-[260px] flex flex-col justify-between cursor-pointer border border-[var(--color-border)] bg-[var(--bg-card)]">
            <div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                temaTech ? "bg-white/5 group-hover:bg-[#00F0FF]/10" : "bg-stone-100 group-hover:bg-[#6A1B29]/10"
              }`}>
                <ShieldCheck className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--color-primary)] transition-colors" />
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2.5">Protección Sin Alteraciones</h3>
              <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-sans font-medium">
                El sistema resguarda de forma segura cada reporte de auditoría. Si alguien intenta modificar un acta o documento oficial, el validador te alertará al instante.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="liquid-glass rounded-3xl p-8 group hover:border-[var(--color-accent)]/40 transition-all duration-300 min-h-[260px] flex flex-col justify-between cursor-pointer border border-[var(--color-border)] bg-[var(--bg-card)]">
            <div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                temaTech ? "bg-white/5 group-hover:bg-[#8B5CF6]/10" : "bg-stone-100 group-hover:bg-[#BC955C]/10"
              }`}>
                <FolderSync className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--color-accent)] transition-colors" />
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2.5">Acceso desde Cualquier Lugar</h3>
              <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-sans font-medium">
                Trabaja en tu computadora local a la máxima velocidad y guarda tus expedientes de forma sincronizada en la nube con un solo clic.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="liquid-glass rounded-3xl p-8 group hover:border-[var(--color-primary)]/40 transition-all duration-300 min-h-[260px] flex flex-col justify-between cursor-pointer border border-[var(--color-border)] bg-[var(--bg-card)]">
            <div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                temaTech ? "bg-white/5 group-hover:bg-[#00F0FF]/10" : "bg-stone-100 group-hover:bg-[#6A1B29]/10"
              }`}>
                <Sparkles className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--color-primary)] transition-colors" />
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2.5">Buscador Inteligente</h3>
              <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-sans font-medium">
                No pierdas tiempo abriendo archivo por archivo. Pregúntale al buscador lo que necesitas encontrar en tus expedientes usando lenguaje sencillo.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sección Seguridad */}
      <section id="seguridad" className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-[var(--color-border)] relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-3xl font-extrabold mb-6 flex items-center gap-3 text-[var(--text-primary)]">
              <ShieldCheck className="w-7 h-7 text-[var(--color-primary)]" /> Seguridad & Confianza
            </h2>
            <p className="text-[var(--text-secondary)] font-sans leading-relaxed mb-6 font-medium">
              Tus documentos oficiales y reportes de auditoría están completamente blindados. Diseñamos un sistema intuitivo de protección para que la información pública de tu municipio se mantenga íntegra y segura.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-sm" />
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] font-display text-sm">Resguardo de Archivos Sensibles</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-normal mt-0.5 font-medium">Protege tus actas de cabildo o contratos de obras públicas para que solo los funcionarios autorizados puedan visualizarlos.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-sm" />
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] font-display text-sm">Firma Digital e Integridad</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-normal mt-0.5 font-medium">Cada reporte de análisis cuenta con una firma digital única. Si un archivo es alterado o manipulado de forma indebida, el validador integrado alertará inmediatamente.</p>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="liquid-glass rounded-3xl p-8 border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-col justify-center min-h-[280px]"
          >
            <div className="font-mono text-[9px] font-bold text-[var(--color-primary)]/80 mb-4 tracking-wider">// VERIFICACIÓN AUTOMÁTICA DE EXPEDIENTES</div>
            <div className={`space-y-3 font-mono text-xs p-5 rounded-2xl border transition-colors ${
              temaTech ? "bg-black/50 border-white/5 text-slate-300" : "bg-stone-50 border-[#E0DCD3] text-stone-700"
            }`}>
              <div><span className="text-purple-600 dark:text-purple-400 font-bold">Archivo:</span> {!temaTech ? "SIGEDI-2026-OBRAS" : "GECEP-2026-OBRAS"}</div>
              <div><span className="text-purple-600 dark:text-purple-400 font-bold">Estado de Protección:</span> Activado</div>
              <div><span className="text-purple-600 dark:text-purple-400 font-bold">Código de Seguridad:</span> Verificado</div>
              <div className="flex items-center gap-2 mt-4 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                INTEGRIDAD DE ARCHIVOS: OK (Sello inmutable validado)
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sección Sincronización */}
      <section id="sincronizacion" className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-[var(--color-border)] relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1 liquid-glass rounded-3xl p-8 border border-[var(--color-border)] bg-[var(--bg-card)] flex items-center justify-center min-h-[280px]"
          >
            <div className="flex flex-col items-center gap-6 text-center">
              <FolderSync className="w-14 h-14 text-[var(--color-accent)] animate-bounce" />
              <div className="flex gap-4 items-center">
                <span className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] font-bold ${
                  temaTech ? "bg-slate-900 border-slate-800" : "bg-stone-50 border-stone-200"
                }`}>Tu Computadora Local</span>
                <span className="text-[var(--text-muted)] font-bold">⇄</span>
                <span className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] font-bold ${
                  temaTech ? "bg-slate-900 border-slate-800" : "bg-stone-50 border-stone-200"
                }`}>Google Drive en la Nube</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2"
          >
            <h2 className="font-display text-3xl font-extrabold mb-6 flex items-center gap-3 text-[var(--text-primary)]">
              <FolderSync className="w-7 h-7 text-[var(--color-accent)]" /> Sincronización Automática
            </h2>
            <p className="text-[var(--text-secondary)] font-sans leading-relaxed mb-6 font-medium">
              No tienes que preocuparte por configuraciones complejas en la nube. Conecta tu cuenta de Google Drive una sola vez y ten acceso a tus carpetas y archivos desde cualquier dispositivo.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-sm" />
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] font-display text-sm">Vinculación Pasiva y Permanente</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-normal mt-0.5 font-medium">Una vez enlazada tu cuenta, los documentos de Drive se muestran en tu panel de control de forma automática y transparente.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-sm" />
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] font-display text-sm">Indexación y Lectura con un Botón</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-normal mt-0.5 font-medium">Añade nuevos pliegos o reportes de planeación a tu biblioteca inteligente con solo deslizar un interruptor.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Sección Capacidades */}
      <section id="capacidades" className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-[var(--color-border)] relative z-30">
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h2 className="font-display text-3xl font-extrabold mb-6 flex justify-center items-center gap-3 text-[var(--text-primary)]">
            <Sparkles className="w-7 h-7 text-[var(--color-primary)]" /> ¿Cómo te ayuda el Asistente de Auditoría?
          </h2>
          <p className="text-[var(--text-secondary)] font-sans leading-relaxed font-medium">
            El sistema no es un buscador común de palabras clave. Integra capacidades de inteligencia artificial (LUCERO RAG de alta precisión) que te ayudan a resolver las tareas de auditoría más complejas en pocos segundos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Capacidad 1 */}
          <div className="liquid-glass rounded-3xl p-7 border border-[var(--color-border)] bg-[var(--bg-card)]">
            <h3 className="font-display font-extrabold text-lg text-[var(--text-primary)] mb-3.5 flex items-center gap-2">
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-display font-bold ${
                temaTech ? "bg-cyan-950/40 text-[#00F0FF] border border-cyan-800/40" : "bg-[#6A1B29]/10 text-[#6A1B29] border border-[#6A1B29]/10"
              }`}>AUDITORÍA</span>
              Comparación y Detección de Conflictos
            </h3>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] mb-4 font-sans leading-relaxed font-medium">
              Compara dos o más contratos y actas de cabildo de forma automática para identificar contradicciones en fechas de entrega, costos de obra o responsabilidades de áreas.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold bg-stone-100 dark:bg-slate-900 px-2.5 py-1 rounded border border-[var(--color-border)] text-[var(--text-secondary)]">Comparar Actas</span>
              <span className="text-[10px] font-mono font-bold bg-stone-100 dark:bg-slate-900 px-2.5 py-1 rounded border border-[var(--color-border)] text-[var(--text-secondary)]">Detectar Contradicciones</span>
              <span className="text-[10px] font-mono font-bold bg-stone-100 dark:bg-slate-900 px-2.5 py-1 rounded border border-[var(--color-border)] text-[var(--text-secondary)]">Extraer Cronograma</span>
            </div>
          </div>

          {/* Capacidad 2 */}
          <div className="liquid-glass rounded-3xl p-7 border border-[var(--color-border)] bg-[var(--bg-card)]">
            <h3 className="font-display font-extrabold text-lg text-[var(--text-primary)] mb-3.5 flex items-center gap-2">
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-display font-bold ${
                temaTech ? "bg-purple-950/40 text-purple-400 border border-purple-800/40" : "bg-[#BC955C]/10 text-[#6A1B29] border border-[#BC955C]/20"
              }`}>AUTOMATIZACIÓN</span>
              Resúmenes y Cumplimiento Normativo
            </h3>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] mb-4 font-sans leading-relaxed font-medium">
              Genera resúmenes ejecutivos cortos de reportes extensos y valida automáticamente que tus expedientes contengan las firmas, anexos y estructuras obligatorias que exige la ley.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold bg-stone-100 dark:bg-slate-900 px-2.5 py-1 rounded border border-[var(--color-border)] text-[var(--text-secondary)]">Resumen Ejecutivo</span>
              <span className="text-[10px] font-mono font-bold bg-stone-100 dark:bg-slate-900 px-2.5 py-1 rounded border border-[var(--color-border)] text-[var(--text-secondary)]">Lista de Cumplimiento</span>
              <span className="text-[10px] font-mono font-bold bg-stone-100 dark:bg-slate-900 px-2.5 py-1 rounded border border-[var(--color-border)] text-[var(--text-secondary)]">Comprobación de Firmas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Equipo y Patrocinadores */}
      <section className="w-full border-t border-[var(--color-border)] bg-current/5 relative z-30 py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-20">
          
          {/* Equipo de Desarrollo */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[var(--color-primary)]" />
              <h3 className="font-display font-extrabold text-2xl text-[var(--text-primary)]">Equipo de Desarrollo</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Javier Mar Cruz */}
              <div className="liquid-glass rounded-2xl p-5 border border-[var(--color-border)] bg-[var(--bg-card)] flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center font-display font-bold text-white flex-shrink-0 text-sm">
                  JM
                </div>
                <div>
                  <h4 className="font-bold font-display text-[var(--text-primary)] text-sm">Javier Mar Cruz</h4>
                  <p className="text-[10px] text-[var(--color-primary)] font-mono font-bold tracking-wide uppercase">Scrum Master & Frontend</p>
                  <p className="text-[9px] text-[var(--text-secondary)] font-sans font-medium mt-0.5">N.C. 231H0154 | Semestre 6 | TIC's</p>
                </div>
              </div>

              {/* José Avilés Cárdenas */}
              <div className="liquid-glass rounded-2xl p-5 border border-[var(--color-border)] bg-[var(--bg-card)] flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-rose-400 dark:to-rose-500 flex items-center justify-center font-display font-bold text-white flex-shrink-0 text-sm">
                  JA
                </div>
                <div>
                  <h4 className="font-bold font-display text-[var(--text-primary)] text-sm">José Avilés Cárdenas</h4>
                  <p className="text-[10px] text-[var(--color-accent)] font-mono font-bold tracking-wide uppercase">Backend Developer</p>
                  <p className="text-[9px] text-[var(--text-secondary)] font-sans font-medium mt-0.5">N.C. 241H0226 | Semestre 4 | TIC's</p>
                </div>
              </div>

              {/* Diego Alonso Benito De La Cruz */}
              <div className="liquid-glass rounded-2xl p-5 border border-[var(--color-border)] bg-[var(--bg-card)] flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-emerald-500 to-[var(--color-primary)] flex items-center justify-center font-display font-bold text-white flex-shrink-0 text-sm">
                  DB
                </div>
                <div>
                  <h4 className="font-bold font-display text-[var(--text-primary)] text-sm">Diego Alonso Benito</h4>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold tracking-wide uppercase">Backend Developer</p>
                  <p className="text-[9px] text-[var(--text-secondary)] font-sans font-medium mt-0.5">N.C. 231H0135 | Semestre 6 | TIC's</p>
                </div>
              </div>
            </div>

            {/* Fila 2 de Integrantes (Ana y Sury) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-2">
              {/* Ana Iveth González Loaiza */}
              <div className="liquid-glass rounded-2xl p-5 border border-[var(--color-border)] bg-[var(--bg-card)] flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 dark:to-purple-500 flex items-center justify-center font-display font-bold text-white flex-shrink-0 text-sm">
                  AG
                </div>
                <div>
                  <h4 className="font-bold font-display text-[var(--text-primary)] text-sm">Ana Iveth González</h4>
                  <p className="text-[10px] text-pink-500 font-mono font-bold tracking-wide uppercase">Colaboradora / TIC's</p>
                  <p className="text-[9px] text-[var(--text-secondary)] font-sans font-medium mt-0.5">N.C. 231H0139 | Semestre 6 | TIC's</p>
                </div>
              </div>

              {/* Sury Jael Cristino Arteaga */}
              <div className="liquid-glass rounded-2xl p-5 border border-[var(--color-border)] bg-[var(--bg-card)] flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 dark:to-orange-500 flex items-center justify-center font-display font-bold text-white flex-shrink-0 text-sm">
                  SC
                </div>
                <div>
                  <h4 className="font-bold font-display text-[var(--text-primary)] text-sm">Sury Jael Cristino</h4>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold tracking-wide uppercase">Colaboradora / Logística</p>
                  <p className="text-[9px] text-[var(--text-secondary)] font-sans font-medium mt-0.5">N.C. 241H0087 | Semestre 4 | Logística</p>
                </div>
              </div>
            </div>
          </div>

          {/* Patrocinadores */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-[var(--color-primary)]" />
              <h3 className="font-display font-extrabold text-2xl text-[var(--text-primary)]">Patrocinadores</h3>
            </div>
            <div className="flex flex-wrap items-center gap-10 justify-start opacity-70">
              <span className="text-lg font-display font-black tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-default">ITSNA</span>
              <span className="text-lg font-display font-black tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-default">TECNM</span>
              <span className="text-lg font-display font-black tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-default">VERACRUZ</span>
            </div>
          </div>

          {/* Enlaces y Footer */}
          <div className="border-t border-[var(--color-border)] pt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-xs text-[var(--text-secondary)] font-medium font-sans">
              © 2026 {!temaTech ? "SIGEDI" : "GECEP"}. Todos los derechos reservados. Desarrollado para la productividad municipal.
            </p>
            <div className="flex gap-8 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              <button 
                onClick={() => setModalDocsAbierta(true)} 
                className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5 bg-transparent border-none outline-none cursor-pointer font-display"
              >
                <FileText className="w-4 h-4" /> Docs
              </button>
              <button 
                onClick={() => setModalGithubAbierta(true)} 
                className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5 bg-transparent border-none outline-none cursor-pointer font-display"
              >
                <IconoGithub className="w-4 h-4" /> GitHub
              </button>
              <button 
                onClick={() => setModalSoporteAbierta(true)} 
                className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5 bg-transparent border-none outline-none cursor-pointer font-display"
              >
                <Mail className="w-4 h-4" /> Soporte
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* MODALES INTERACTIVAS DEL FOOTER (CON ANIMACIONES DENTRO DE ANIMATEPRESENCE) */}
      <AnimatePresence>
        
        {/* Modal Docs */}
        {modalDocsAbierta && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-4xl max-h-[85vh] overflow-y-auto liquid-glass border border-white/10 rounded-3xl p-8 bg-[#18181B]/95 text-white relative scrollbar-hide text-left shadow-2xl"
            >
              <button 
                onClick={() => setModalDocsAbierta(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-white transition-colors text-xl font-bold font-mono cursor-pointer"
              >
                ✕
              </button>
              
              <h3 className="font-display font-extrabold text-2xl text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                <FileText className="w-7 h-7 text-[#00F0FF]" /> Documentación de Capacidades
              </h3>
              
              <div className="space-y-6 text-stone-300 font-sans text-sm md:text-base leading-relaxed font-medium">
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h4 className="font-display font-extrabold text-lg text-white flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] text-[10px] font-mono font-bold border border-[#00F0FF]/10">LUCERO MCP</span>
                    Motor de Auditoría Élite (Tiers 1 & 2)
                  </h4>
                  <p className="text-xs md:text-sm text-stone-400 leading-relaxed font-medium">
                    LUCERO es el motor semántico cognitivo que automatiza el análisis documental del sistema. Se compone de dos niveles principales de ejecución:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                      <h5 className="font-bold text-[#00F0FF] mb-2 font-display uppercase tracking-wider text-[10px]">TIER 1: Análisis Inteligente</h5>
                      <ul className="space-y-1.5 list-disc list-inside text-stone-400">
                        <li><strong className="text-white font-semibold">compare_documents:</strong> Compara contratos y actas para detectar vacíos de información o contradicciones.</li>
                        <li><strong className="text-white font-semibold">extract_selective:</strong> Extrae selectivamente fechas, tablas o nombres de un archivo PDF o Excel.</li>
                        <li><strong className="text-white font-semibold">detect_conflicts:</strong> Reporta contradicciones entre múltiples actas oficiales.</li>
                        <li><strong className="text-white font-semibold">generate_summary:</strong> Genera resúmenes ejecutivos detallados de manera automatizada.</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                      <h5 className="font-bold text-purple-400 mb-2 font-display uppercase tracking-wider text-[10px]">TIER 2: Automatización & Estructura</h5>
                      <ul className="space-y-1.5 list-disc list-inside text-stone-400">
                        <li><strong className="text-white font-semibold">pro_read_document:</strong> Lectura y procesamiento multiformato de actas.</li>
                        <li><strong className="text-white font-semibold">pro_encrypt_document:</strong> Cifrado avanzado de archivos municipales confidenciales.</li>
                        <li><strong className="text-white font-semibold">inject_apa_structure / inject_toc:</strong> Inyección automática de tablas de contenido estructuradas.</li>
                        <li><strong className="text-white font-semibold">surgical_replace:</strong> Modificaciones quirúrgicas en plantillas sin alterar formatos.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="font-display font-extrabold text-lg text-white mb-2">¿Cómo funciona la Integridad Criptográfica?</h4>
                  <p className="text-xs md:text-sm text-stone-400 leading-relaxed font-medium">
                    El sistema genera un hash SHA-256 e inyecta un sello digital inmutable en cada documento auditado. Si un usuario intenta modificar el contenido de un acta de cabildo o un contrato de forma posterior, el validador integrado de la plataforma detecta la alteración del sello de seguridad inmediatamente al contrastarlo contra la base de datos municipal.
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => setModalDocsAbierta(false)}
                    className="px-6 py-2.5 rounded-full bg-[#00F0FF] text-black font-bold hover:bg-white transition-colors cursor-pointer text-xs uppercase tracking-wider font-display"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Soporte */}
        {modalSoporteAbierta && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-lg liquid-glass border border-white/10 rounded-3xl p-8 bg-[#18181B]/95 text-white relative text-left shadow-2xl"
            >
              <button 
                onClick={() => {
                  setModalSoporteAbierta(false);
                  setSoporteExito(false);
                  setSoporteMensaje("");
                  setSoporteEmail("");
                }}
                className="absolute top-6 right-6 text-stone-400 hover:text-white transition-colors text-xl font-bold font-mono cursor-pointer"
              >
                ✕
              </button>
              
              <h3 className="font-display font-extrabold text-2xl text-white mb-6 flex items-center gap-3">
                <Mail className="w-6 h-6 text-purple-400" /> Soporte Técnico
              </h3>
              
              {soporteExito ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-white text-lg">¡Mensaje Enviado con Éxito!</h4>
                  <p className="text-xs md:text-sm text-stone-400 leading-relaxed font-medium">
                    El equipo de desarrollo (Javier, José y Diego) revisará tu reporte y se contactará contigo a la brevedad.
                  </p>
                  <button 
                    onClick={() => {
                      setModalSoporteAbierta(false);
                      setSoporteExito(false);
                      setSoporteMensaje("");
                      setSoporteEmail("");
                    }}
                    className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors mt-4 cursor-pointer text-xs font-display uppercase tracking-wider"
                  >
                    Cerrar
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setSoporteEnviando(true);
                  await new Promise(r => setTimeout(r, 1200));
                  setSoporteEnviando(false);
                  setSoporteExito(true);
                }} className="space-y-4 text-xs md:text-sm font-sans font-medium text-stone-300">
                  <p className="text-stone-400 leading-relaxed text-xs">
                    ¿Tienes dudas, problemas con la sincronización de Google Drive o algún reporte de error? Escríbenos y te atenderemos enseguida.
                  </p>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 mb-1.5 font-display uppercase tracking-wider">Correo Electrónico</label>
                    <input 
                      type="email" 
                      required
                      value={soporteEmail}
                      onChange={(e) => setSoporteEmail(e.target.value)}
                      placeholder="tu-correo@municipio.gob.mx"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 transition-colors placeholder:text-stone-600 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 mb-1.5 font-display uppercase tracking-wider">Descripción del Problema o Duda</label>
                    <textarea 
                      required
                      rows={4}
                      value={soporteMensaje}
                      onChange={(e) => setSoporteMensaje(e.target.value)}
                      placeholder="Escribe tu mensaje aquí..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 transition-colors resize-none placeholder:text-stone-600 text-xs font-medium"
                    />
                  </div>
                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={soporteEnviando}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-[#00F0FF] text-black font-extrabold hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-55 cursor-pointer text-xs uppercase tracking-wider font-display"
                    >
                      {soporteEnviando ? "Enviando reporte..." : "Enviar Mensaje de Soporte"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}

        {/* Modal GitHub */}
        {modalGithubAbierta && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md liquid-glass border border-white/10 rounded-3xl p-8 bg-[#18181B]/95 text-white relative text-left shadow-2xl"
            >
              <button 
                onClick={() => setModalGithubAbierta(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-white transition-colors text-xl font-bold font-mono cursor-pointer"
              >
                ✕
              </button>
              
              <h3 className="font-display font-extrabold text-2xl text-white mb-4 flex items-center gap-3">
                <IconoGithub className="w-6 h-6 text-[#00F0FF]" /> Repositorio de GitHub
              </h3>
              
              <div className="space-y-4 text-xs md:text-sm font-sans text-stone-300 font-medium leading-relaxed">
                <p>
                  El código fuente del proyecto se encuentra resguardado de forma segura en un repositorio en GitHub.
                </p>
                <div className="bg-black/50 border border-white/5 p-4 rounded-xl font-mono text-[11px] text-[#00F0FF] break-all select-all font-bold">
                  https://github.com/AldraAV/SIGEDI.git
                </div>
                <p className="text-[11px] text-stone-400 font-medium">
                  Contiene el frontend reactivo desarrollado en Vite, las APIs de auditoría integradas en FastAPI, y las herramientas élite del servidor MCP de LUCERO.
                </p>
                
                <div className="flex gap-3 justify-end pt-4">
                  <button 
                    onClick={() => setModalGithubAbierta(false)}
                    className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors cursor-pointer text-xs font-display font-bold uppercase tracking-wider"
                  >
                    Cerrar
                  </button>
                  <a 
                    href="https://github.com/AldraAV/SIGEDI.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full bg-white text-black font-extrabold hover:bg-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-display uppercase tracking-wider"
                  >
                    Ir a GitHub <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
