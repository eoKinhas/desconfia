import React from 'react';
import logoImg from '../assets/logo.png';

function SintoniaRegras({ setTelaAtual }) {
  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo" />
        
        <h1 className="title rules-title" style={{ marginBottom: '16px' }}>SINTONIA</h1>
        
        <div className="rules-box">
          <p><strong>REGRAS:</strong></p>
          <p>1. O aplicativo sorteará uma marcação oculta na meia-lua.</p>
          <p>2. Um jogador vê a marcação, define os dois extremos (ex: Frio / Quente) e dá UMA dica.</p>
          <p>3. Os outros jogadores discutem e tentam adivinhar girando o ponteiro para a posição correta baseados na dica!</p>
        </div>
        
      </div>

      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px' }}>
        <button className="game-card start-btn" onClick={() => setTelaAtual('sintonia-jogo')}>
          <h2>ESTAMOS PRONTOS!</h2>
        </button>

        <button className="back-btn" onClick={() => setTelaAtual('home')}>
          VOLTAR
        </button>
      </div>
    </div>
  );
}

export default SintoniaRegras;