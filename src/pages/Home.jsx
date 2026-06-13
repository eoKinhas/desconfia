import React from 'react';
import logoImg from '../assets/logo.png';

function Home({ setTelaAtual }) {
  return (
    <div className="page-transition">
      <header className="header">
        <div className="logo-title">
          <img src={logoImg} alt="Logo Desconfia" className="app-logo" />
        </div>
        <button className="settings-btn" onClick={() => setTelaAtual('configuracoes')}>⚙️</button>
      </header>

      <main className="main-content">
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
  );
}

export default Home;