import React, { useState, useEffect, useRef } from 'react';
import { bancoDeDuvidas } from '../data/duvidasImpostor'; 
import logoImg from '../assets/logo.png';

// Função profissional para embaralhamento 100% aleatório (Fisher-Yates)
const embaralharArray = (arrayOriginal) => {
  const array = [...arrayOriginal];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function DuvidaJogo({ setTelaAtual }) {
  const [setup, setSetup] = useState(JSON.parse(localStorage.getItem('duvida_setup_atual')));
  const [jogadores, setJogadores] = useState([]);
  const [indiceJogador, setIndiceJogador] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [revelado, setRevelado] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false); 
  const [faseJogo, setFaseJogo] = useState('passando_celular'); 
  const [perguntaOriginal, setPerguntaOriginal] = useState('');
  const [perguntaFinalRevelada, setPerguntaFinalRevelada] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    const todosCadastrados = JSON.parse(localStorage.getItem('desconfia_jogadores'));
    const selecionados = todosCadastrados.filter(j => setup.jogadores.includes(j.id));
    
    // 1. Sorteio JUSTO dos infiltrados usando Fisher-Yates
    const shuffledJogadores = embaralharArray(selecionados);
    const impostores = shuffledJogadores.slice(0, setup.impostores);
    
    // 2. Sorteia um bloco aleatório de perguntas
    const blocoSorteado = bancoDeDuvidas[Math.floor(Math.random() * bancoDeDuvidas.length)];
    
    // 3. Sorteio JUSTO das perguntas dentro do bloco
    const perguntasEmbaralhadas = embaralharArray(blocoSorteado.perguntas);
    
    const perguntaParaInocentes = perguntasEmbaralhadas[0];
    const perguntaParaInfiltrados = perguntasEmbaralhadas[1];

    setPerguntaOriginal(perguntaParaInocentes); 
    
    // 4. Distribui as perguntas para os jogadores
    const jogadoresComFuncao = selecionados.map(j => {
      const eImpostor = impostores.find(i => i.id === j.id) !== undefined;
      
      return {
        ...j,
        eImpostor,
        perguntaExibida: eImpostor ? perguntaParaInfiltrados : perguntaParaInocentes
      };
    });

    setJogadores(jogadoresComFuncao);
    localStorage.setItem('duvida_rodada_atual', JSON.stringify(jogadoresComFuncao));
  }, []);

  const iniciarPressao = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setProgresso(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setRevelado(true);
          setTimeout(() => setPodeAvancar(true), 800); 
          return 100;
        }
        return prev + 20; 
      });
    }, 100);
  };

  const pararPressao = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setProgresso(0);
  };

  const proximoJogador = () => {
    if (!podeAvancar) return;

    setRevelado(false);
    setProgresso(0);
    setPodeAvancar(false);
    
    if (indiceJogador < jogadores.length - 1) {
      setIndiceJogador(indiceJogador + 1);
    } else {
      setFaseJogo('revelacao_pergunta');
    }
  };

  if (jogadores.length === 0) return null;

  const jogadorAtual = jogadores[indiceJogador];

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px', gap: '24px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" />
        <h1 className="title rules-title" style={{ marginBottom: '0px' }}>DÚVIDA</h1>
        
        {faseJogo === 'passando_celular' ? (
          <>
            <div className="game-status-box" style={{ width: '100%', textAlign: 'center' }}>
              <p className="status-text" style={{ fontSize: '12px'}}>PASSE O CELULAR PARA:</p>
            </div>

            {!revelado ? (
              <button 
                className="hold-btn"
                onTouchStart={iniciarPressao} onTouchEnd={pararPressao} onTouchCancel={pararPressao}
                onMouseDown={iniciarPressao} onMouseUp={pararPressao} onMouseLeave={pararPressao} 
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px' }}
              >
                <div style={{ fontSize: '72px' }}>{jogadorAtual.avatar}</div>
                <div style={{ fontSize: '16px', color: '#00ccff', fontFamily: '"Press Start 2P", cursive', width: '100%', padding: '0 16px', boxSizing: 'border-box', wordWrap: 'break-word', textAlign: 'center', lineHeight: '1.4' }}>
                  {jogadorAtual.nome}
                </div>
                <div style={{ fontSize: '10px', color: '#888888', marginTop: '16px' }}>(SEGURE PARA LER)</div>
                <div className="progress-bar" style={{ width: `${progresso}%` }}></div>
              </button>
            ) : (
              <div className="reveal-box" style={{ marginTop: '0px', width: '100%' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>{jogadorAtual.avatar}</div>
                <p className="status-text" style={{ marginTop: '24px'}}>SUA PERGUNTA É:</p>
                
                <div className="rules-box" style={{ marginTop: '16px', padding: '24px', backgroundColor: '#111', border: '1px solid #333' }}>
                  <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.6', textAlign: 'center', fontWeight: 'bold' }}>
                    {jogadorAtual.perguntaExibida}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {!perguntaFinalRevelada ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '24px' }}>
                <div className="game-status-box" style={{ width: '100%', textAlign: 'center', padding: '24px 16px' }}>
                  <p className="status-text" style={{ color: '#ffcc00', fontSize: '16px' }}>TODOS RESPONDERAM?</p>
                  <p style={{ fontSize: '12px', color: '#fff', fontFamily: '"Press Start 2P", cursive', marginTop: '16px', lineHeight: '1.6' }}>
                    Coloque o celular no centro da mesa. Quando estiverem prontos, revelem a pergunta!
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '24px' }}>
                <p className="status-text" style={{ marginBottom: '0px', color: '#00ffaa' }}>A PERGUNTA ORIGINAL ERA:</p>
                
                <div className="rules-box" style={{ width: '100%', backgroundColor: '#111', padding: '32px 24px', borderRadius: '16px', border: '2px solid #00ffaa' }}>
                  <p style={{ fontSize: '18px', color: '#ffffff', lineHeight: '1.6', textAlign: 'center', fontWeight: 'bold' }}>
                    "{perguntaOriginal}"
                  </p>
                </div>
                
                <p style={{ fontSize: '10px', color: '#888', fontFamily: '"Press Start 2P", cursive', marginTop: '0px', lineHeight: '1.5', textAlign: 'center' }}>
                  Quem deu a resposta mais absurda?
                </p>
              </div>
            )}
          </>
        )}
      </div> 

      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        
        {faseJogo === 'passando_celular' && revelado && (
          <button 
            className="game-card start-btn" 
            onClick={proximoJogador} 
            style={{ backgroundColor: podeAvancar ? '#00ccff' : '#555555', opacity: podeAvancar ? 1 : 0.5, transition: 'all 0.3s' }}
          >
            <h2 style={{ color: '#000000', fontSize: '14px' }}>OK, ENTENDI</h2>
          </button>
        )}

        {faseJogo !== 'passando_celular' && !perguntaFinalRevelada && (
          <button 
            className="game-card start-btn" 
            onClick={() => setPerguntaFinalRevelada(true)} 
            style={{ backgroundColor: '#00ffaa' }}
          >
            <h2 style={{ color: '#000000', fontSize: '14px' }}>REVELAR PERGUNTA</h2>
          </button>
        )}

        {faseJogo !== 'passando_celular' && perguntaFinalRevelada && (
          <button 
            className="game-card start-btn" 
            onClick={() => setTelaAtual('duvida-votacao')} 
            style={{ backgroundColor: '#ff0055' }}
          >
            <h2 style={{ color: '#ffffff', fontSize: '14px' }}>IR PARA VOTAÇÃO</h2>
          </button>
        )}

      </div>
    </div>
  );
}

export default DuvidaJogo;