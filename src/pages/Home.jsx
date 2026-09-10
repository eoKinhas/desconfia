import React from 'react';
import logoImg from '../assets/logo.png';
import sintoniaImg from '../assets/sintonia-icon.png';
import impostorImg from '../assets/impostor-icon.png';
import perguntasImg from '../assets/perguntas-icon.png';
import coresImg from '../assets/cores-icon.png';
import dicasImg from '../assets/dicas-icon.png';
import tierlistImg from '../assets/tierlist-icon.png';
import configIcon from '../assets/configuracoes-icon.png';

function Home({ setTelaAtual }) {
  return (
    <div className="page-transition" style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '24px' }}>
        
        <header className="header">
          <div className="logo-title">
            <img src={logoImg} alt="Logo Desconfia" className="app-logo" />
          </div>
          <button className="settings-btn" onClick={() => setTelaAtual('configuracoes')}>
            <img src={configIcon} alt="Configurações" className="settings-icon" />
          </button>
        </header>

        <main className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p className="reveal-text">Escolha seu jogo:</p>

          <div className="cards-container">
             <div className="game-card card-sintonia" onClick={() => setTelaAtual('sintonia-regras')}>
              <div className="card-image-placeholder">
                <img src={sintoniaImg} alt="Sintonia" />
              </div>
              <h2>Sintonia</h2>
            </div>

            <div className="game-card card-impostor" onClick={() => setTelaAtual('impostor-regras')}>
              <div className="card-image-placeholder">
                <img src={impostorImg} alt="Impostor" />
              </div>
              <h2>Impostor</h2>
            </div>

            <div className="game-card card-perguntas" onClick={() => setTelaAtual('duvida-regras')}>
              <div className="card-image-placeholder">
                <img src={perguntasImg} alt="Perguntas" />
              </div>
              <h2>Perguntas</h2>
            </div>

            <div className="game-card card-cores" onClick={() => setTelaAtual('cores-regras')}>
              <div className="card-image-placeholder">
                <img src={coresImg} alt="Cores" />
              </div>
              <h2>Cores</h2>
            </div>

            <div className="game-card card-dicas" onClick={() => setTelaAtual('dicas-regras')}>
              <div className="card-image-placeholder">
                <img src={dicasImg} alt="Dicas" />
              </div>
              <h2>Dicas</h2>
            </div>

            <div className="game-card card-tierlist" onClick={() => setTelaAtual('tierlist-regras')}>
              <div className="card-image-placeholder">
                <img src={tierlistImg} alt="Tier List" />
              </div>
              <h2>Tier List</h2>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default Home;