import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/logo.png';
import setaCimaImg from '../../assets/cima-icon.png';
import setaBaixoImg from '../../assets/baixo-icon.png';

function TierListTwist({ setTelaAtual }) {
  const [setup, setSetup] = useState(JSON.parse(localStorage.getItem('tierlist_setup_atual')));
  const [jogadores, setJogadores] = useState([]);
  const [indiceJogador, setIndiceJogador] = useState(0);
  const [sugestoes, setSugestoes] = useState([]);

  // Salva o estado da grade no início do turno para permitir desfazer se quiser
  const [backupTurno, setBackupTurno] = useState([]);

  // Estados da Ação do Twist
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [movimentoFeito, setMovimentoFeito] = useState(false);

  const ranks = ['S', 'A', 'B', 'C', 'F'];

  useEffect(() => {
    const todosCadastrados = JSON.parse(localStorage.getItem('desconfia_jogadores')) || [];
    const ordemFiltrada = (setup.ordem && setup.ordem.length > 0 ? setup.ordem : setup.jogadores)
      .filter(id => setup.jogadores.includes(id));
    
    const selecionados = ordemFiltrada.map(id => todosCadastrados.find(j => j.id === id)).filter(Boolean);
    setJogadores(selecionados);

    // Puxa a grade montada na tela de debate
    const gradeFinal = JSON.parse(localStorage.getItem('tierlist_debate_final')) || [];
    setSugestoes(gradeFinal);
    setBackupTurno(gradeFinal);
  }, []);

  const jogadorAtual = jogadores[indiceJogador];

  const selecionarItem = (sugestao) => {
    // Bloqueia se já moveu neste turno ou se o elemento pertence ao próprio jogador
    if (movimentoFeito || (jogadorAtual && sugestao.jogadorId === jogadorAtual.id)) return;
    
    if (itemSelecionado && itemSelecionado.sugestaoTexto === sugestao.sugestaoTexto) {
      setItemSelecionado(null);
    } else {
      setItemSelecionado(sugestao);
    }
  };

  const moverItem = (direcao) => {
    if (!itemSelecionado) return;

    const indexAtual = ranks.indexOf(itemSelecionado.rankAtual);
    const novoIndex = direcao === 'up' ? indexAtual - 1 : indexAtual + 1;

    if (novoIndex >= 0 && novoIndex < ranks.length) {
      const novoRank = ranks[novoIndex];
      
      const novasSugestoes = sugestoes.map(s =>
        s.sugestaoTexto === itemSelecionado.sugestaoTexto ? { ...s, rankAtual: novoRank } : s
      );
      
      setSugestoes(novasSugestoes);
      setMovimentoFeito(true);
      setItemSelecionado(null);
    }
  };

  const desfazerMovimento = () => {
    setSugestoes(backupTurno);
    setMovimentoFeito(false);
    setItemSelecionado(null);
  };

  const passarTurno = () => {
    if (indiceJogador < jogadores.length - 1) {
      setIndiceJogador(indiceJogador + 1);
      setMovimentoFeito(false);
      setItemSelecionado(null);
      setBackupTurno(sugestoes); // Atualiza o ponto de restauração para o próximo jogador
    } else {
      localStorage.setItem('tierlist_twist_final', JSON.stringify(sugestoes));
      setTelaAtual('tierlist-resultado'); 
    }
  };

  if (!jogadorAtual || jogadores.length === 0) return null;

  const podeSubir = itemSelecionado && ranks.indexOf(itemSelecionado.rankAtual) > 0;
  const podeDescer = itemSelecionado && ranks.indexOf(itemSelecionado.rankAtual) < ranks.length - 1;

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" style={{ marginTop: '8px', marginBottom: '16px' }} />

        {/* CARD RETRÔ DO JOGADOR (100% QUADRADO, FUNDO PRETO, BORDA BRANCA E DIVISOR) */}
        <div className="player-turn-card">
          <div className="player-turn-avatar">
            {jogadorAtual.avatar}
          </div>

          <div className="player-turn-divider"></div>

          <div className="player-turn-info">
            <span className="player-turn-label">SUA VEZ:</span>
            <span className="player-turn-name">{jogadorAtual.nome}</span>
          </div>
        </div>

        {/* INSTRUÇÕES */}
        <div style={{ textAlign: 'center', marginBottom: '16px', width: '100%' }}>
          <p style={{ fontSize: '10px', color: '#888888', fontFamily: '"Press Start 2P", cursive', marginTop: '6px', lineHeight: '1.4' }}>
            Mude 1 item de posição ou mantenha a lista como está.
          </p>
          <p style={{ fontSize: '9px', color: '#666666', fontFamily: '"Press Start 2P", cursive', marginTop: '4px' }}>
            (Sua sugestão está bloqueada)
          </p>
        </div>

        {/* GRADE DA TIER LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          {ranks.map(rank => (
            <div key={rank} className={`tier-row rank-${rank}`}>
              <div className="tier-row-label" style={{ width: '40px', fontSize: '20px' }}>{rank}</div>
              <div className="tier-row-content">
                {sugestoes.filter(s => s.rankAtual === rank).map((s, idx) => {
                  const ehDoJogador = s.jogadorId === jogadorAtual.id;
                  return (
                    <div
                      key={idx}
                      className={`tier-item ${itemSelecionado?.sugestaoTexto === s.sugestaoTexto ? 'selecionado' : ''} ${ehDoJogador ? 'bloqueado' : ''}`}
                      onClick={() => selecionarItem(s)}
                    >
                      {s.sugestaoTexto}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CONTROLES DE MOVIMENTO */}
        {!movimentoFeito && itemSelecionado && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
            
            {/* BOTÃO SUBIR */}
            <button 
              className="toggle-btn" 
              onClick={() => moverItem('up')} 
              disabled={!podeSubir}
              style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#000000',
                border: '3px solid #ffffff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: podeSubir ? 1 : 0.2,
                cursor: podeSubir ? 'pointer' : 'not-allowed'
              }}
            >
              <img 
                src={setaCimaImg} 
                alt="Subir" 
                style={{ width: '28px', height: '28px', objectFit: 'contain', imageRendering: 'pixelated' }} 
              />
            </button>

            {/* BOTÃO DESCER */}
            <button 
              className="toggle-btn" 
              onClick={() => moverItem('down')} 
              disabled={!podeDescer}
              style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#000000',
                border: '3px solid #ffffff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: podeDescer ? 1 : 0.2,
                cursor: podeDescer ? 'pointer' : 'not-allowed'
              }}
            >
              <img 
                src={setaBaixoImg} 
                alt="Descer" 
                style={{ width: '28px', height: '28px', objectFit: 'contain', imageRendering: 'pixelated' }} 
              />
            </button>

          </div>
        )}

        {movimentoFeito && (
          <div className="twist-feedback-container">
            <p className="twist-status-sucesso">
              ITEM REPOSICIONADO!
            </p>
            <button 
              className="twist-btn-desfazer"
              onClick={desfazerMovimento}
            >
              DESFAZER MUDANÇA
            </button>
          </div>
        )}

      </div>

      {/* BOTÃO PARA PASSAR O TURNO (SEMPRE HABILITADO / OPCIONAL) */}
      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        <button 
          className="game-card start-btn" 
          onClick={passarTurno} 
          style={{ 
            backgroundColor: movimentoFeito ? '#00ccff' : '#ffcc00',
            transition: 'all 0.2s'
          }}
        >
          <h2 style={{ color: '#fffcfc', fontSize: '13px' }}>
            {movimentoFeito ? 'CONFIRMAR ALTERAÇÃO' : 'MANTER COMO ESTÁ'}
          </h2>
        </button>
      </div>
    </div>
  );
}

export default TierListTwist;