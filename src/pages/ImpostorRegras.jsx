import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import logoImg from '../assets/logo.png';
import { bancoDePalavras } from '../data/palavrasImpostor';

const temasDisponiveis = [...new Set(bancoDePalavras.map(item => item.tema))];

function ImpostorRegras({ setTelaAtual }) {
  const [modoJogo, setModoJogo] = useState('padrao');
  const [qtdImpostores, setQtdImpostores] = useState(1);
  const [jogadoresCadastrados, setJogadoresCadastrados] = useState([]);
  const [jogadoresSelecionados, setJogadoresSelecionados] = useState([]);
  const [temasSelecionados, setTemasSelecionados] = useState(temasDisponiveis);
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    const salvos = localStorage.getItem('desconfia_jogadores');
    if (salvos) {
      const parsed = JSON.parse(salvos);
      setJogadoresCadastrados(parsed);
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

  const toggleTema = (tema) => {
    if (temasSelecionados.includes(tema)) {
      setTemasSelecionados(temasSelecionados.filter(t => t !== tema));
    } else {
      setTemasSelecionados([...temasSelecionados, tema]);
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

    if (temasSelecionados.length === 0) {
      setAlerta("SELECIONE PELO MENOS UM TEMA PARA JOGAR!");
      return;
    }
    
    const setupPartida = {
      jogadores: jogadoresSelecionados,
      impostores: qtdImpostores,
      modo: modoJogo,
      temas: temasSelecionados
    };
    localStorage.setItem('impostor_setup_atual', JSON.stringify(setupPartida));
    
    setTelaAtual('impostor-jogo');
  };

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px', gap: '24px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo" />
        <h1 className="title rules-title" style={{ marginBottom: '8px' }}>IMPOSTOR</h1>

        {/* CAIXA DE REGRAS */}
        <div className="rules-box">
          <p><strong>REGRAS:</strong></p>
          <p>Todos receberão uma palavra secreta, exceto o(s) Impostor(es).</p>
          <p>Cada jogador diz uma palavra relacionada ao tema.</p>
          <p>Descubram quem é o impostor antes que ele adivinhe a palavra secreta!</p>
        </div>

        {/* CONFIGURAÇÕES DO MODO DE JOGO */}
        <div className="game-status-box" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* SELETOR DE MODO */}
          <div>
             <p className="status-text" style={{ marginBottom: '8px', color: '#fff' }}>MODO DE JOGO:</p>
             <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className={`toggle-btn ${modoJogo === 'padrao' ? 'ativo' : ''}`}
                  onClick={() => setModoJogo('padrao')}
                >
                  PADRÃO
                </button>
                <button 
                  className={`toggle-btn ${modoJogo === 'similar' ? 'ativo' : ''}`}
                  onClick={() => setModoJogo('similar')}
                >
                  CAMALEÃO
                </button>
             </div>
             <p style={{ fontSize: '8px', color: '#888', marginTop: '8px', fontFamily: '"Press Start 2P", cursive', lineHeight: '1.4' }}>
               {modoJogo === 'padrao' ? '* Impostor não recebe palavra.' : '* Impostor recebe uma palavra parecida (não sabe que é impostor).'}
             </p>
          </div>

          {/* SELETOR DE IMPOSTORES */}
          <div>
             <p className="status-text" style={{ marginBottom: '8px', color: '#fff' }}>QTD. IMPOSTORES:</p>
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                <button className="toggle-btn" style={{ width: '40px' }} onClick={() => setQtdImpostores(Math.max(1, qtdImpostores - 1))}>-</button>
                <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '16px', color: '#00ccff' }}>{qtdImpostores}</span>
                <button className="toggle-btn" style={{ width: '40px' }} onClick={aumentarImpostores}>+</button>
             </div>
          </div>
        </div>

        {/* SELEÇÃO DE TEMAS */}
        <div className="game-status-box" style={{ padding: '16px' }}>
          <p className="status-text" style={{ marginBottom: '12px', color: '#fff' }}>TEMAS DA PARTIDA:</p>
          <div className="avatar-selector" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {temasDisponiveis.map(tema => {
              const selecionado = temasSelecionados.includes(tema);
              return (
                <div 
                  key={tema} 
                  className={`player-chip ${selecionado ? 'selecionado' : ''}`}
                  onClick={() => toggleTema(tema)}
                  style={{ padding: '8px 12px', borderRadius: '8px', height: 'auto', flexDirection: 'row' }}
                >
                  <span style={{ fontSize: '10px' }}>{tema.toUpperCase()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SELEÇÃO DOS JOGADORES PRESENTES */}
        <div className="game-status-box" style={{ padding: '16px', marginBottom: '16px' }}>
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

      </div> {/* FECHA RECHEIO DINÂMICO */}

      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        <button className="game-card start-btn" onClick={iniciarPartida}>
          <h2>INICIAR PARTIDA</h2>
        </button>
        <button className="back-btn" onClick={() => setTelaAtual('home')}>VOLTAR</button>
      </div>

      {/* MODAL DE ALERTA */}
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

export default ImpostorRegras;