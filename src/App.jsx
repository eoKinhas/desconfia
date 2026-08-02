import { useState } from 'react';
import './App.css';

import Home from './pages/Home';
import SintoniaRegras from './pages/Sintonia/SintoniaRegras';
import SintoniaJogo from './pages/Sintonia/SintoniaJogo';
import Configuracoes from './pages/Configuracoes';
import ImpostorRegras from './pages/Impostor/ImpostorRegras';
import ImpostorJogo from './pages/Impostor/ImpostorJogo';
import ImpostorVotacao from './pages/Impostor/ImpostorVotacao';
import PerguntaRegras from './pages/Perguntas/PerguntaRegras';
import PerguntaJogo from './pages/Perguntas/PeguntaJogo';
import PerguntaVotacao from './pages/Perguntas/PerguntaVotacao';
import CoresRegras from './pages/Cores/CoresRegras';
import CoresJogo from './pages/Cores/CoresJogo';
import DicasJogo from './pages/Dicas/DicasJogo';
import DicasRegras from './pages/Dicas/DicasRegras';

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
      {telaAtual === 'duvida-regras' && <PerguntaRegras setTelaAtual={setTelaAtual} />}
      {telaAtual === 'duvida-jogo' && <PerguntaJogo setTelaAtual={setTelaAtual} />}
      {telaAtual === 'duvida-votacao' && <PerguntaVotacao setTelaAtual={setTelaAtual} />}
      {telaAtual === 'cores-regras' && <CoresRegras setTelaAtual={setTelaAtual} />}
      {telaAtual === 'cores-jogo' && <CoresJogo setTelaAtual={setTelaAtual} />}
      {telaAtual === 'dicas-jogo' && <DicasJogo setTelaAtual={setTelaAtual} />}
      {telaAtual === 'dicas-regras' && <DicasRegras setTelaAtual={setTelaAtual} />}

      
    </div>
  );
}

export default App;