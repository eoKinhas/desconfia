import React, { useState, useEffect, useRef } from 'react';
import { bancoDePalavras } from '../../data/palavrasImpostor';
import logoImg from '../../assets/logo.png';

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
    const ordemFiltrada = (setup.ordem && setup.ordem.length > 0 ? setup.ordem : setup.jogadores)
      .filter(id => setup.jogadores.includes(id));

    const selecionados = ordemFiltrada
      .map(id => todosCadastrados.find(j => j.id === id))
      .filter(Boolean);
    
    // Sorteio dos impostores
    const shuffledJogadores = embaralharArray(selecionados);
    const impostores = shuffledJogadores.slice(0, setup.impostores);

    // Filtra os blocos baseados nos temas selecionados na tela de regras
    const blocosFiltrados = bancoDePalavras.filter(bloco => setup.temas.includes(bloco.tema));
    const poolDeBlocos = blocosFiltrados.length > 0 ? blocosFiltrados : bancoDePalavras;

    // Sorteia um bloco aleatório
    const blocoSorteado = poolDeBlocos[Math.floor(Math.random() * poolDeBlocos.length)];

    // Sorteio das palavras dentro do bloco escolhido
    const palavrasEmbaralhadas = embaralharArray(blocoSorteado.palavras);

    const palavraParaInocentes = palavrasEmbaralhadas[0];
    const palavraParaImpostor = palavrasEmbaralhadas[1];

    const jogadoresComFuncao = selecionados.map(j => {
      const eImpostor = impostores.find(i => i.id === j.id) !== undefined;
      let palavraExibida = '';

      if (eImpostor) {
        palavraExibida = setup.modo === 'similar' ? palavraParaImpostor : 'IMPOSTOR';
      } else {
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
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px', gap: '24px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" />
        <h1 className="reveal-text" style={{ fontSize: '35px', color: '#ff003c', fontFamily: '"Press Start 2P", cursive', marginBottom: '2px' }}>IMPOSTOR</h1>
        
        {/* TEXTO SOLTO SEM CAIXA */}
        <p className="menor-text">
          PASSE O CELULAR PARA:
        </p>

        {/* CARD UNIFICADO EXPANSÍVEL */}
        <div 
          className={`hold-card ${progresso > 0 && !revelado ? 'pressionando' : ''} ${revelado ? 'revelado' : ''}`}
          onTouchStart={!revelado ? iniciarPressao : undefined}
          onTouchEnd={!revelado ? pararPressao : undefined}
          onTouchCancel={!revelado ? pararPressao : undefined}
          onMouseDown={!revelado ? iniciarPressao : undefined}
          onMouseUp={!revelado ? pararPressao : undefined}
          onMouseLeave={!revelado ? pararPressao : undefined}
        >
          {/* Efeito de energia no fundo enquanto segura */}
          {!revelado && (
            <div 
              className={`hold-energy-fill ${progresso > 0 ? 'com-borda' : ''}`}
              style={{ height: `${progresso}%` }}
            />
          )}

          {/* Avatar com a moldura circular perfeitamente centralizado */}
          <div className="avatar-circle-frame">
            <span className="avatar-emoji-centered">{jogadorAtual.avatar}</span>
          </div>

          {/* Nome do jogador */}
          <div className="hold-player-name">
            {jogadorAtual.nome}
          </div>

          {/* Alterna entre instrução e a Palavra Revelada */}
          {!revelado ? (
            <span className={`hold-status-text ${progresso > 0 ? 'ativo' : ''}`}>
              {progresso > 0 ? `CARREGANDO... ${progresso}%` : '▶ SEGURE PARA VER ◀'}
            </span>
          ) : (
            <>
              <span className="card-pergunta-label">SUA PALAVRA É:</span>
              <p 
                style={{
                  fontFamily: '"Press Start 2P", cursive',
                  fontSize: '24px',
                  color: jogadorAtual.palavraExibida === 'IMPOSTOR' ? '#ff003c' : '#00ccff',
                  textShadow: '2px 2px 0px #ffffff',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                  padding: '8px 10px 0 10px',
                  lineHeight: '1.4'
                }}
              >
                {jogadorAtual.palavraExibida}
              </p>
            </>
          )}
        </div>

      </div>

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
            <h2 style={{ color: '#fcfcfc', fontSize: '14px' }}>OK, PRÓXIMO</h2>
          </button>
        )}
      </div>

    </div>
  );
}

export default ImpostorJogo;