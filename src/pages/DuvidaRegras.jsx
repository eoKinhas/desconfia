import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import logoImg from '../assets/logo.png';

function DuvidaRegras({ setTelaAtual }) {
  const [qtdImpostores, setQtdImpostores] = useState(1);
  const [jogadoresCadastrados, setJogadoresCadastrados] = useState([]);
  const [jogadoresSelecionados, setJogadoresSelecionados] = useState([]);
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    const salvos = localStorage.getItem('desconfia_jogadores');
    if (salvos) {
      setJogadoresCadastrados(JSON.parse(salvos));
      setJogadoresSelecionados([]);
    }
  }, []);

  const toggleJogador = (id) => {
    if (jogadoresSelecionados.includes(id)) {
      setJogadoresSelecionados(jogadoresSelecionados.filter(jId => jId !== id));
    } else {
      setJogadoresSelecionados([...jogadoresSelecionados, id]);
    }
  };

  const aumentarImpostores = () => {
    if (jogadoresSelecionados.length < 3) {
      setAlerta("SELECIONE QUEM VAI JOGAR PRIMEIRO (MÍNIMO 3)!");
      return;
    }
    const maxImpostores = Math.floor(jogadoresSelecionados.length / 2);
    if (qtdImpostores < maxImpostores) {
      setQtdImpostores(qtdImpostores + 1);
    } else {
      setAlerta(`PARA ${jogadoresSelecionados.length} JOGADORES, O LIMITE É DE ${maxImpostores} IMPOSTOR(ES).`);
    }
  };

  const iniciarPartida = () => {
    if (jogadoresSelecionados.length < 3) {
      setAlerta("SELECIONE PELO MENOS 3 JOGADORES!");
      return;
    }
    
    const maxImpostores = Math.floor(jogadoresSelecionados.length / 2);
    if (qtdImpostores > maxImpostores) {
      setAlerta(`O NÚMERO DE IMPOSTORES DEVE SER NO MÁXIMO A METADE DOS JOGADORES (${maxImpostores}).`);
      return;
    }
    
    const setupPartida = {
      jogadores: jogadoresSelecionados,
      impostores: qtdImpostores
    };
    // Salva na memória exclusiva do jogo Dúvida
    localStorage.setItem('duvida_setup_atual', JSON.stringify(setupPartida));
    
    setTelaAtual('duvida-jogo');
  };

  return (
    <div className="rules-screen page-transition">
      <img src={logoImg} alt="Logo Desconfia" className="app-logo" />
      <h1 className="title rules-title" style={{ marginBottom: '8px' }}>DÚVIDA</h1>

      {/* CAIXA DE REGRAS DO NOVO JOGO */}
      <div className="rules-box">
        <p><strong>REGRAS:</strong></p>
        <p>Todos receberão a mesma pergunta, exceto o(s) infiltrado(s), que receberão uma pergunta maluca!</p>
        <p>Cada um responde em voz alta.</p>
        <p>A pergunta original é revelada e vocês devem votar em quem deu a resposta mais suspeita!</p>
      </div>

      <div className="game-status-box" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
           <p className="status-text" style={{ marginBottom: '8px', color: '#fff' }}>QTD. INFILTRADOS:</p>
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
              <button className="toggle-btn" style={{ width: '40px' }} onClick={() => setQtdImpostores(Math.max(1, qtdImpostores - 1))}>-</button>
              <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '16px', color: '#00ccff' }}>{qtdImpostores}</span>
              <button className="toggle-btn" style={{ width: '40px' }} onClick={aumentarImpostores}>+</button>
           </div>
        </div>
      </div>

      <div className="game-status-box" style={{ padding: '16px' }}>
        <p className="status-text" style={{ marginBottom: '12px', color: '#fff' }}>QUEM VAI JOGAR?</p>
        
        {jogadoresCadastrados.length === 0 ? (
          <p style={{ fontSize: '10px', color: '#ff0055', fontFamily: '"Press Start 2P", cursive' }}>Vá na engrenagem e cadastre jogadores!</p>
        ) : (
          <div className="avatar-selector">
            {jogadoresCadastrados.map(jogador => {
              const selecionado = jogadoresSelecionados.includes(jogador.id);
              return (
                <div 
                  key={jogador.id} 
                  className={`player-chip ${selecionado ? 'selecionado' : ''}`}
                  onClick={() => toggleJogador(jogador.id)}
                >
                  <span style={{ fontSize: '16px' }}>{jogador.avatar}</span>
                  <span>{jogador.nome}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button className="game-card start-btn" onClick={iniciarPartida}>
          <h2>INICIAR PARTIDA</h2>
        </button>
        <button className="back-btn" onClick={() => setTelaAtual('home')}>VOLTAR</button>
      </div>

      {alerta && createPortal(
        <div className="modal-overlay">
          <div className="modal-box">
            <p style={{ color: '#ffcc00' }}>{alerta}</p>
            <button className="modal-btn btn-sim" onClick={() => setAlerta(null)}>OK</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default DuvidaRegras;