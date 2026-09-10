import React, { useState, useEffect, useRef } from 'react';
import logoImg from '../../assets/logo.png';

// Algoritmo profissional de embaralhamento (Fisher-Yates)
const embaralharArray = (arrayOriginal) => {
  const array = [...arrayOriginal];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function TierListJogo({ setTelaAtual }) {
  const [setup, setSetup] = useState(JSON.parse(localStorage.getItem('tierlist_setup_atual')));
  const [jogadores, setJogadores] = useState([]);
  const [indiceJogador, setIndiceJogador] = useState(0);
  
  // Estados da mecânica de segurar e revelar
  const [progresso, setProgresso] = useState(0);
  const [revelado, setRevelado] = useState(false);
  const timerRef = useRef(null);

  // Estados das sugestões
  const [sugestaoAtual, setSugestaoAtual] = useState('');
  const [todasSugestoes, setTodasSugestoes] = useState([]);

  useEffect(() => {
    const todosCadastrados = JSON.parse(localStorage.getItem('desconfia_jogadores'));
    const ordemFiltrada = (setup.ordem && setup.ordem.length > 0 ? setup.ordem : setup.jogadores)
      .filter(id => setup.jogadores.includes(id));

    const selecionados = ordemFiltrada
      .map(id => todosCadastrados.find(j => j.id === id))
      .filter(Boolean);
    
    // Embaralha os Ranks. Se houver mais de 5 jogadores, o operador % garante que todos recebam algo.
    const ranksBase = ['S', 'A', 'B', 'C', 'F'];

    // Sorteio 100% aleatório e independente para cada jogador
    const jogadoresComRank = selecionados.map((j) => {
      const rankAleatorio = ranksBase[Math.floor(Math.random() * ranksBase.length)];
      return {
        ...j,
        rank: rankAleatorio
      };
    });

    setJogadores(jogadoresComRank);
  }, []);

  const iniciarPressao = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgresso(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setRevelado(true);
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

  const confirmarSugestao = () => {
    if (sugestaoAtual.trim() === '') return;

    const jogador = jogadores[indiceJogador];
    const novasSugestoes = [...todasSugestoes, {
      jogadorId: jogador.id,
      nome: jogador.nome,
      avatar: jogador.avatar,
      rankSorteado: jogador.rank,
      sugestaoTexto: sugestaoAtual.trim().toUpperCase()
    }];

    if (indiceJogador < jogadores.length - 1) {
      // Prepara a tela para o próximo jogador
      setTodasSugestoes(novasSugestoes);
      setSugestaoAtual('');
      setRevelado(false);
      setProgresso(0);
      setIndiceJogador(indiceJogador + 1);
    } else {
      // Todos jogaram! Salva as sugestões e vai para o debate
      localStorage.setItem('tierlist_sugestoes', JSON.stringify(novasSugestoes));
      setTelaAtual('tierlist-debate'); 
    }
  };

  if (jogadores.length === 0) return null;

  const jogadorAtual = jogadores[indiceJogador];
  const podeConfirmar = sugestaoAtual.trim() !== '';

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" />
        <h1 className="reveal-text" style={{ fontSize: '20px', color: '#ff5500', fontFamily: '"Press Start 2P", cursive', marginBottom: '2px' }}>TIER LIST</h1>
        
        <div style={{ width: '100%', textAlign: 'center', marginBottom: '32px', marginTop: '16px' }}>
          <h1 className="reveal-text" style={{ fontSize: '35px', color: '#ff5500', wordWrap: 'break-word' }}>
            {setup?.tema}
          </h1>
        </div>

        {!revelado ? (
          <>
            <p className="menor-text">
              PASSE O CELULAR PARA:
            </p>

            <button 
              className={`hold-card ${progresso > 0 ? 'pressionando' : ''}`}
              onTouchStart={iniciarPressao} 
              onTouchEnd={pararPressao}
              onTouchCancel={pararPressao}
              onMouseDown={iniciarPressao} 
              onMouseUp={pararPressao}
              onMouseLeave={pararPressao} 
            >
              <div 
                className={`hold-energy-fill ${progresso > 0 ? 'com-borda' : ''}`}
                style={{ height: `${progresso}%` }}
              />

              <div className="avatar-circle-frame">
                <span className="avatar-emoji-centered">{jogadorAtual.avatar}</span>
              </div>

              <div className="hold-player-name">
                {jogadorAtual.nome}
              </div>

              <span className={`hold-status-text ${progresso > 0 ? 'ativo' : ''}`}>
                {progresso > 0 ? `CARREGANDO... ${progresso}%` : '▶ SEGURE PARA VER ◀'}
              </span>
            </button>
          </>
        ) : (
          <div className="reveal-box" style={{ marginTop: '0px', gap: '16px', width: '100%' }}>
            <p className="menor-text">SEU RANK SORTEADO É:</p>
            
            <div 
              className={`rank-box rank-${jogadorAtual.rank}`} 
              style={{ 
                margin: '8px auto', 
                width: '120px', 
                height: '120px', 
                fontSize: '64px' 
              }}
            >
              {jogadorAtual.rank}
            </div>
            
            <p style={{ fontSize: '12px', color: '#888', fontFamily: '"Press Start 2P", cursive', textAlign: 'center', marginTop: '16px', lineHeight: '1.5' }}>
              DIGITE UM ELEMENTO PARA O TEMA:<br/>
            </p>
            
            <textarea 
              className="tier-input-box" 
              value={sugestaoAtual}
              onChange={(e) => setSugestaoAtual(e.target.value)}
              maxLength={60} 
            />
          </div>
        )}

      </div>

      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        {revelado && (
          <button 
            className="game-card start-btn" 
            onClick={confirmarSugestao} 
            disabled={!podeConfirmar}
            style={{ 
              backgroundColor: podeConfirmar ? '#00ccff' : '#555555', 
              opacity: podeConfirmar ? 1 : 0.5,
              transition: 'all 0.3s'
            }}
          >
            <h2 style={{ color: '#fffcfc', fontSize: '14px' }}>CONFIRMAR SUGESTÃO</h2>
          </button>
        )}
      </div>

    </div>
  );
}

export default TierListJogo;