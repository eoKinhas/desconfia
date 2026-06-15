import { useState } from 'react';
import './App.css';

import Home from './pages/Home';
import SintoniaRegras from './pages/SintoniaRegras';
import SintoniaJogo from './pages/SintoniaJogo';
import Configuracoes from './pages/Configuracoes';
import ImpostorRegras from './pages/ImpostorRegras';
import ImpostorJogo from './pages/ImpostorJogo';
import ImpostorVotacao from './pages/ImpostorVotacao';
import DuvidaRegras from './pages/DuvidaRegras';
import DuvidaJogo from './pages/DuvidaJogo';
import DuvidaVotacao from './pages/DuvidaVotacao';
import CoresRegras from './pages/CoresRegras';
import CoresJogo from './pages/CoresJogo';

function App() {
  const [telaAtual, setTelaAtual] = useState('home');

  return (
    <div className="app-container">
      <div className="tv-glass-overlay">
        <span className="osd-text top-left">CH 03</span>
        <span className="osd-text top-right">STEREO</span>
        <span className="osd-text bottom-left">▶ PLAY</span>
        <span className="osd-text bottom-right blink">12:00</span>
      </div>

      {/* RENDERIZAÇÃO DOS COMPONENTES */}
      {telaAtual === 'home' && <Home setTelaAtual={setTelaAtual} />}
      {telaAtual === 'sintonia-regras' && <SintoniaRegras setTelaAtual={setTelaAtual} />}
      {telaAtual === 'sintonia-jogo' && <SintoniaJogo setTelaAtual={setTelaAtual} />}
      {telaAtual === 'configuracoes' && <Configuracoes setTelaAtual={setTelaAtual} />}
      {telaAtual === 'impostor-regras' && <ImpostorRegras setTelaAtual={setTelaAtual} />}
      {telaAtual === 'impostor-jogo' && <ImpostorJogo setTelaAtual={setTelaAtual} />}
      {telaAtual === 'impostor-votacao' && <ImpostorVotacao setTelaAtual={setTelaAtual} />}
      {telaAtual === 'duvida-regras' && <DuvidaRegras setTelaAtual={setTelaAtual} />}
      {telaAtual === 'duvida-jogo' && <DuvidaJogo setTelaAtual={setTelaAtual} />}
      {telaAtual === 'duvida-votacao' && <DuvidaVotacao setTelaAtual={setTelaAtual} />}
      {telaAtual === 'cores-regras' && <CoresRegras setTelaAtual={setTelaAtual} />}
      {telaAtual === 'cores-jogo' && <CoresJogo setTelaAtual={setTelaAtual} />}
      
    </div>
  );
}

export default App;