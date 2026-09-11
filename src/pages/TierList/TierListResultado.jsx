import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/logo.png';

function TierListResultado({ setTelaAtual }) {
  const [setup, setSetup] = useState(null);
  const [sugestoesFinais, setSugestoesFinais] = useState([]);
  const ranks = ['S', 'A', 'B', 'C', 'F'];

  useEffect(() => {
    const setupSalvo = JSON.parse(localStorage.getItem('tierlist_setup_atual'));
    const final = JSON.parse(localStorage.getItem('tierlist_twist_final')) || [];
    setSetup(setupSalvo);
    setSugestoesFinais(final);
  }, []);

  // Cálculo da Sintonia Coletiva da Roda
  const totalItens = sugestoesFinais.length;
  const acertosExatos = sugestoesFinais.filter(s => s.rankSorteado === s.rankAtual).length;
  const porcentagem = totalItens > 0 ? Math.round((acertosExatos / totalItens) * 100) : 0;

  const getMensagemSintonia = () => {
    if (porcentagem === 100) return '★ SINTONIA PERFEITA! ★';
    if (porcentagem >= 60) return 'MUITO BEM! RODA AFINADA!';
    if (porcentagem >= 40) return 'DIVERGÊNCIA DE OPINIÕES!';
    return 'DESCONEXÃO TOTAL NA RODA!';
  };

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '24px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" style={{ marginTop: '8px', marginBottom: '12px' }} />

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h1 className="reveal-text" style={{ fontSize: '35px', color: '#ff5500', fontFamily: '"Press Start 2P", cursive', marginTop: '6px' }}>
            {setup?.tema}
          </h1>
        </div>

        <div className="resultado-placar">
          <p className="resultado-placar-pontos">
            {acertosExatos} / {totalItens} ACERTOS
          </p>
          <p style={{ fontSize: '12px', color: '#ffcc00', fontFamily: '"Press Start 2P", cursive', marginBottom: '8px' }}>
            {porcentagem}%
          </p>
          <p className="resultado-placar-msg">{getMensagemSintonia()}</p>
        </div>

        {/* GRADE FINAL MONTADA PELA RODA */}
        <p style={{ fontSize: '13px', color: '#ffffff', fontFamily: '"Press Start 2P", cursive', marginBottom: '10px', alignSelf: 'flex-start' }}>
          RESULTADO FINAL NA MESA:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginBottom: '24px' }}>
          {ranks.map(rank => (
            <div key={rank} className={`tier-row rank-${rank}`}>
              <div className="tier-row-label" style={{ width: '40px', fontSize: '20px' }}>{rank}</div>
              <div className="tier-row-content">
                {sugestoesFinais.filter(s => s.rankAtual === rank).map((s, idx) => (
                  <div key={idx} className="tier-item">
                    {s.sugestaoTexto}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CARDS DAS SUGESTÕES E OS RANKS REAIS REVELADOS */}
        <p style={{ fontSize: '13px', color: '#ffcc00', fontFamily: '"Press Start 2P", cursive', marginBottom: '8px', alignSelf: 'flex-start' }}>
          O QUE CADA UM SUGERIU:
        </p>

        <div className="revelacao-container">
          {sugestoesFinais.map((s, idx) => {
            const acertou = s.rankSorteado === s.rankAtual;

            return (
              <div key={idx} className={`card-revelacao ${acertou ? 'acertou' : 'errou'}`}>
                {/* Autor */}
                <div className="revelacao-autor">
                  <span className="revelacao-avatar">{s.avatar}</span>
                </div>

                {/* Divisor vertical fino retrô */}
                <div className="player-turn-divider" style={{ height: '30px' }}></div>

                {/* Texto da sugestão e nome do autor */}
                <div className="revelacao-info">
                  <span className="revelacao-texto">{s.sugestaoTexto}</span>
                  <span className="revelacao-nome">POR: {s.nome}</span>
                </div>

                {/* Rank Real Sorteado com ícone de acerto/erro */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div className={`rank-badge-mini rank-${s.rankSorteado}`}>
                    {s.rankSorteado}
                  </div>
                  <span className="revelacao-status-icon" style={{ color: acertou ? '#00ff66' : '#ff0055' }}>
                    {acertou ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* BOTÕES FINAIS */}
      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        <button 
          className="game-card start-btn" 
          onClick={() => setTelaAtual('tierlist-regras')}
          style={{ backgroundColor: '#00ccff' }}
        >
          <h2 style={{ color: '#ffffff', fontSize: '13px' }}>JOGAR NOVAMENTE</h2>
        </button>
        <button className="back-btn" onClick={() => setTelaAtual('home')}>
          MENU PRINCIPAL
        </button>
      </div>
    </div>
  );
}

export default TierListResultado;