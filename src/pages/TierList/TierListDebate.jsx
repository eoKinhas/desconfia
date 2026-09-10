import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/logo.png';

function TierListDebate({ setTelaAtual }) {
  const [sugestoes, setSugestoes] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const [itemArrastado, setItemArrastado] = useState(null);

  const handleDragStart = (e, sugestao) => {
    setItemArrastado(sugestao);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, rank) => {
    e.preventDefault();
    if (itemArrastado) {
      const novasSugestoes = sugestoes.map(s =>
        s.sugestaoTexto === itemArrastado.sugestaoTexto ? { ...s, rankAtual: rank } : s
      );
      setSugestoes(novasSugestoes);
      setItemArrastado(null);
      setItemSelecionado(null);
    }
  };

  useEffect(() => {
    // Puxa as sugestões digitadas na fase anterior
    const salvas = JSON.parse(localStorage.getItem('tierlist_sugestoes')) || [];
    const sugestoesIniciais = salvas.map(s => ({ ...s, rankAtual: null }));
    setSugestoes(sugestoesIniciais);
  }, []);

  // Lógica de Tocar e Selecionar
  const selecionarItem = (sugestao) => {
    if (itemSelecionado && itemSelecionado.sugestaoTexto === sugestao.sugestaoTexto) {
      setItemSelecionado(null); // Desmarca se tocar novamente
    } else {
      setItemSelecionado(sugestao);
    }
  };

  // Lógica de Mover para a Linha
  const moverParaRank = (rank) => {
    if (!itemSelecionado) return;

    const novasSugestoes = sugestoes.map(s =>
      s.sugestaoTexto === itemSelecionado.sugestaoTexto ? { ...s, rankAtual: rank } : s
    );
    setSugestoes(novasSugestoes);
    setItemSelecionado(null); 
  };

  const ranks = ['S', 'A', 'B', 'C', 'F'];
  const sugestoesPendentes = sugestoes.filter(s => s.rankAtual === null);
  const todasPosicionadas = sugestoesPendentes.length === 0;

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '16px' }}>

        <div style={{ textAlign: 'center', marginBottom: '16px', marginTop: '8px' }}>
          <h1 className="reveal-text" style={{ fontSize: '20px', color: '#ff5500' }}>DEBATE</h1>
          <p style={{ fontSize: '13px', color: '#888', fontFamily: '"Press Start 2P", cursive', marginTop: '12px' }}>
            {itemSelecionado ? 'TOQUE NA LINHA DE DESTINO' : 'TOQUE EM UM ITEM PARA MOVER'}
          </p>
        </div>

        {/* GRADE DA TIER LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          {ranks.map(rank => (
            <div
              key={rank}
              className={`tier-row rank-${rank} ${itemSelecionado ? 'pulsar-alvo' : ''}`}
              onClick={() => moverParaRank(rank)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, rank)}
            >
              <div className="tier-row-label">{rank}</div>
              <div className="tier-row-content">
                {sugestoes.filter(s => s.rankAtual === rank).map((s, idx) => (
                  <div
                    key={idx}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, s)}
                    className={`tier-item ${itemSelecionado?.sugestaoTexto === s.sugestaoTexto ? 'selecionado' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      selecionarItem(s);
                    }}
                  >
                    {s.sugestaoTexto}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ITENS PENDENTES (Formato Cartão Escuro) */}
        <div style={{ marginTop: '32px', width: '100%' }}>
          <p style={{ fontSize: '13px', color: '#ffcc00', fontFamily: '"Press Start 2P", cursive', textAlign: 'center', marginBottom: '16px' }}>
            SUGESTÕES DA RODA:
          </p>
          
          {/* NOVO CONTAINER: Grid forçando 2 colunas exatas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%' }}>
            {sugestoesPendentes.map((s, idx) => (
              <div
                key={idx}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, s)}
                className={`tier-input-box tier-item-pendente ${itemSelecionado?.sugestaoTexto === s.sugestaoTexto ? 'selecionado' : ''}`}
                onClick={() => selecionarItem(s)}
              >
                {s.sugestaoTexto}
              </div>
            ))}
          </div>
          
        </div>

      </div>

      {/* BOTÃO PARA A PRÓXIMA FASE */}
      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        <button
          className="game-card start-btn"
          disabled={!todasPosicionadas}
          onClick={() => {
            localStorage.setItem('tierlist_debate_final', JSON.stringify(sugestoes));
            setTelaAtual('tierlist-twist');
          }}
          style={{
            backgroundColor: todasPosicionadas ? '#ffcc00' : '#555555',
            opacity: todasPosicionadas ? 1 : 0.5,
            transition: 'all 0.3s'
          }}
        >
          <h2 style={{ color: '#ffffff', fontSize: '14px' }}>IR PARA O TWIST</h2>
        </button>
      </div>
    </div>
  );
}

export default TierListDebate;