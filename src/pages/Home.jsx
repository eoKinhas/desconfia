import React from 'react';
import logoImg from '../assets/logo.png';

function Home({ setTelaAtual }) {
  return (
    <div className="page-transition" style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '24px' }}>
        
        <header className="header">
          <div className="logo-title">
            <img src={logoImg} alt="Logo Desconfia" className="app-logo" />
          </div>
          <button className="settings-btn" onClick={() => setTelaAtual('configuracoes')}>⚙️</button>
        </header>

        <main className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p className="subtitle">Escolha seu jogo:</p>

          <div className="cards-container">
            <div className="game-card" onClick={() => setTelaAtual('sintonia-regras')}>
              <div className="card-image-placeholder">🎛️</div>
              <h2>Sintonia</h2>
            </div>

            <div className="game-card" onClick={() => setTelaAtual('impostor-regras')}>
              <div className="card-image-placeholder">🔪</div>
              <h2>Impostor</h2>
            </div>

            <div className="game-card" onClick={() => setTelaAtual('duvida-regras')}>
              <div className="card-image-placeholder">🎭</div>
              <h2>Dúvidas</h2>
            </div>

            <div className="game-card">
              <div className="card-image-placeholder">🐺</div>
              <h2>...</h2>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default Home;