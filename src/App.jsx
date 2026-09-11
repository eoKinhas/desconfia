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
import TierListRegras from './pages/TierList/TierListRegras';
import TierListJogo from './pages/TierList/TierListJogo';
import TierListDebate from './pages/TierList/TierListDebate';
import TierListTwist from './pages/TierList/TierListTwist';
import TierListResultado from './pages/TierList/TierListResultado';

function App() {
  const [telaAtual, setTelaAtual] = useState('home');
  const [telaAnterior, setTelaAnterior] = useState('home');

  const navegarPara = (novaTela) => {
    setTelaAnterior(telaAtual);
    setTelaAtual(novaTela);
  };

  const getClasseTema = () => {
    if (telaAtual.startsWith('impostor')) return 'tema-impostor';
    if (telaAtual.startsWith('sintonia')) return 'tema-sintonia';
    if (telaAtual.startsWith('duvida'))   return 'tema-perguntas';
    if (telaAtual.startsWith('dicas'))    return 'tema-dicas';
    if (telaAtual.startsWith('tierlist')) return 'tema-tierlist';
    if (telaAtual.startsWith('cores'))    return 'tema-cores';
    return 'tema-padrao';
  };

  return (
    <div className={`app-container bg-teste-pixels ${getClasseTema()}`}>
      <div className="tv-glass-overlay">
        <span className="osd-text top-left">CH 03</span>
        <span className="osd-text top-right">STEREO</span>
        <span className="osd-text bottom-left">▶ PLAY</span>
        <span className="osd-text bottom-right blink">12:00</span>
      </div>

      {/* RENDERIZAÇÃO DOS COMPONENTES */}
      {telaAtual === 'home' && <Home setTelaAtual={navegarPara} />}
      {telaAtual === 'sintonia-regras' && <SintoniaRegras setTelaAtual={navegarPara} />}
      {telaAtual === 'sintonia-jogo' && <SintoniaJogo setTelaAtual={navegarPara} />}
      {telaAtual === 'configuracoes' && <Configuracoes setTelaAtual={navegarPara} telaRetorno={telaAnterior} />}
      {telaAtual === 'impostor-regras' && <ImpostorRegras setTelaAtual={navegarPara} />}
      {telaAtual === 'impostor-jogo' && <ImpostorJogo setTelaAtual={navegarPara} />}
      {telaAtual === 'impostor-votacao' && <ImpostorVotacao setTelaAtual={navegarPara} />}
      {telaAtual === 'duvida-regras' && <PerguntaRegras setTelaAtual={navegarPara} />}
      {telaAtual === 'duvida-jogo' && <PerguntaJogo setTelaAtual={navegarPara} />}
      {telaAtual === 'duvida-votacao' && <PerguntaVotacao setTelaAtual={navegarPara} />}
      {telaAtual === 'cores-regras' && <CoresRegras setTelaAtual={navegarPara} />}
      {telaAtual === 'cores-jogo' && <CoresJogo setTelaAtual={navegarPara} />}
      {telaAtual === 'dicas-jogo' && <DicasJogo setTelaAtual={navegarPara} />}
      {telaAtual === 'dicas-regras' && <DicasRegras setTelaAtual={navegarPara} />}
      {telaAtual === 'tierlist-regras' && <TierListRegras setTelaAtual={navegarPara} />}
      {telaAtual === 'tierlist-jogo' && <TierListJogo setTelaAtual={navegarPara} />}
      {telaAtual === 'tierlist-debate' && <TierListDebate setTelaAtual={navegarPara} />}
      {telaAtual === 'tierlist-twist' && <TierListTwist setTelaAtual={navegarPara} />}
      {telaAtual === 'tierlist-resultado' && <TierListResultado setTelaAtual={navegarPara} />}
    </div>
  );
}

export default App;