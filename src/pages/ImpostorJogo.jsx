import React, { useState, useEffect, useRef } from 'react';
import { bancoDePalavras } from '../data/palavrasImpostor';
import logoImg from '../assets/logo.png';

// Função de embaralhamento 100% aleatório (Fisher-Yates)
const embaralharArray = (arrayOriginal) => {
  const array = [...arrayOriginal];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function ImpostorJogo({ setTelaAtual }) {
  const [setup, setSetup] = useState(JSON.parse(localStorage.getItem('impostor_setup_atual')));
  const [jogadores, setJogadores] = useState([]);
  const [indiceJogador, setIndiceJogador] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [revelado, setRevelado] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false); 
  const timerRef = useRef(null);

  useEffect(() => {
    const todosCadastrados = JSON.parse(localStorage.getItem('desconfia_jogadores'));
    const selecionados = todosCadastrados.filter(j => setup.jogadores.includes(j.id));
    
    // Sorteio dos impostores
    const shuffledJogadores = embaralharArray(selecionados);
    const impostores = shuffledJogadores.slice(0, setup.impostores);

    // Filtra os blocos baseados nos temas selecionados na tela de regras
    const blocosFiltrados = bancoDePalavras.filter(bloco => setup.temas.includes(bloco.tema));
    // Se por acaso der erro e vir vazio, usa o banco todo por segurança
    const poolDeBlocos = blocosFiltrados.length > 0 ? blocosFiltrados : bancoDePalavras;

    // Sorteia um bloco aleatório (ex: Bloco 27 de "Casa")
    const blocoSorteado = poolDeBlocos[Math.floor(Math.random() * poolDeBlocos.length)];

    // Sorteio das palavras dentro do bloco escolhido
    const palavrasEmbaralhadas = embaralharArray(blocoSorteado.palavras);

    // Separa as palavras da rodada
    const palavraParaInocentes = palavrasEmbaralhadas[0];
    const palavraParaImpostor = palavrasEmbaralhadas[1];

    const jogadoresComFuncao = selecionados.map(j => {
      const eImpostor = impostores.find(i => i.id === j.id) !== undefined;
      let palavraExibida = '';

      if (eImpostor) {
        // Se for o modo "similar/camaleão", ele ganha a palavra 2. Se for padrão, ganha "IMPOSTOR"
        palavraExibida = setup.modo === 'similar' ? palavraParaImpostor : 'IMPOSTOR';
      } else {
        // Os inocentes sempre recebem a palavra 1
        palavraExibida = palavraParaInocentes;
      }

      return {
        ...j,
        eImpostor,
        palavraExibida
      };
    });

    setJogadores(jogadoresComFuncao);
    localStorage.setItem('impostor_rodada_atual', JSON.stringify(jogadoresComFuncao));
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
      setTelaAtual('impostor-votacao'); 
    }
  };

  if (jogadores.length === 0) return null;

  const jogadorAtual = jogadores[indiceJogador];

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo" />
        <h1 className="title rules-title" style={{ marginBottom: '8px' }}>IMPOSTOR</h1>
        
        <div className="game-status-box" style={{ width: '100%', textAlign: 'center', marginBottom: '24px' }}>
          <p className="status-text" style={{ fontSize: '12px'}}>PASSE O CELULAR PARA:</p>
        </div>

        {!revelado ? (
          <button 
            className="hold-btn"
            onTouchStart={iniciarPressao} 
            onTouchEnd={pararPressao}
            onTouchCancel={pararPressao}
            onMouseDown={iniciarPressao} 
            onMouseUp={pararPressao}
            onMouseLeave={pararPressao} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '12px' 
            }}
          >
            <div style={{ fontSize: '72px' }}>{jogadorAtual.avatar}</div>
            <div style={{ 
              fontSize: '16px', 
              color: '#00ccff', 
              fontFamily: '"Press Start 2P", cursive',
              width: '100%',
              padding: '0 16px',
              boxSizing: 'border-box',
              wordWrap: 'break-word',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              {jogadorAtual.nome}
            </div>
            
            <div style={{ fontSize: '10px', color: '#888888', marginTop: '16px' }}>
              (SEGURE PARA REVELAR)
            </div>
            
            <div className="progress-bar" style={{ width: `${progresso}%` }}></div>
          </button>
        ) : (
          <div className="reveal-box" style={{ marginTop: '0px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>{jogadorAtual.avatar}</div>
            
            <p className="status-text" style={{ marginTop: '24px' }}>SUA PALAVRA É:</p>
            <h1 className="reveal-text">{jogadorAtual.palavraExibida}</h1>
          </div>
        )}

      </div> {/* FECHA RECHEIO DINÂMICO */}

      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        {revelado && (
          <button 
            className="game-card start-btn" 
            onClick={proximoJogador} 
            style={{ 
              backgroundColor: podeAvancar ? '#00ccff' : '#555555', 
              opacity: podeAvancar ? 1 : 0.5,
              transition: 'all 0.3s'
            }}
          >
            <h2 style={{ color: '#000000', fontSize: '14px' }}>OK, PRÓXIMO</h2>
          </button>
        )}
      </div>

    </div>
  );
}

export default ImpostorJogo;