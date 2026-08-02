import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/logo.png';
import { temasDicasDisponiveis } from '../../data/bancoDicas';

function DicasRegras({ setTelaAtual }) {
  const [temasSelecionados, setTemasSelecionados] = useState(temasDicasDisponiveis);

  useEffect(() => {
    const setupSalvo = localStorage.getItem('dicas_setup_atual');
    if (setupSalvo) {
      const setup = JSON.parse(setupSalvo);
      if (setup.temas && setup.temas.length > 0) {
        setTemasSelecionados(setup.temas);
      }
    }
  }, []);

  const toggleTema = (tema) => {
    if (temasSelecionados.includes(tema)) {
      setTemasSelecionados(temasSelecionados.filter(t => t !== tema));
    } else {
      setTemasSelecionados([...temasSelecionados, tema]);
    }
  };

  const iniciarPartida = () => {
    if (temasSelecionados.length === 0) return;
    localStorage.setItem('dicas_setup_atual', JSON.stringify({ temas: temasSelecionados }));
    setTelaAtual('dicas-jogo');
  };

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px', gap: '24px' }}>

        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" />
        <h1 className="title rules-title">DICAS</h1>

        <div className="rules-box" style={{ width: '100%' }}>
          <p><strong>REGRAS:</strong></p>
          <p>O host (quem segura o celular) vê um elemento secreto e uma lista de dicas, da mais fácil para a mais difícil.</p>
          <p>Os jogadores pedem a próxima dica em sequência. O host revela e lê em voz alta.</p>
          <p>Quem adivinhar o elemento primeiro ganha — quanto menos dicas usadas, melhor!</p>
        </div>

        <div className="game-status-box" style={{ padding: '16px', width: '100%' }}>
          <p className="status-text" style={{ marginBottom: '12px', color: '#fff' }}>TEMAS DA PARTIDA:</p>
          <div className="avatar-selector" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {temasDicasDisponiveis.map(tema => {
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

      </div>

      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        <button className="game-card start-btn" onClick={iniciarPartida}>
          <h2>INICIAR PARTIDA</h2>
        </button>
        <button className="back-btn" onClick={() => setTelaAtual('home')}>VOLTAR</button>
      </div>
    </div>
  );
}

export default DicasRegras;