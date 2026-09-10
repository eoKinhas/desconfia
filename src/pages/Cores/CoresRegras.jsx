import React from 'react';
import logoImg from '../../assets/logo.png';

function CoresRegras({ setTelaAtual }) {
  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px', gap: '24px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" />
        <h1 
          className="reveal-text" 
          style={{ 
            fontSize: '35px', 
            fontFamily: '"Press Start 2P", cursive', 
            marginBottom: '2px',
            background: 'linear-gradient(135deg, #fbff00 10%, #00ff66 55%, #00ccff 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(3px 3px 0px #ffffff)',
            lineHeight: '1.3',
            paddingTop: '8px',
            paddingBottom: '4px',
            display: 'inline-block'
          }}
        >
          CORES
        </h1>

        {/* CAIXA DE REGRAS */}
        <div className="rules-box" style={{ width: '100%' }}>
          <p><strong>REGRAS:</strong></p>
          <p>Uma cor aleatória vai preencher a tela por 5 segundos.</p>
          <p>Memorize-a com muita atenção!</p>
          <p>Em seguida, a cor sumirá e você deverá usar os controles para tentar recriar a cor exata. Quão boa é a sua memória visual?</p>
        </div>

      </div> {/* FECHA RECHEIO DINÂMICO */}

      {/* RODAPÉ FIXO */}
      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        <button 
          className="game-card start-btn" 
          onClick={() => setTelaAtual('cores-jogo')}
          style={{ backgroundColor: '#00ccff' }}
        >
          <h2>ESTAMOS PRONTOS!</h2>
        </button>
        <button className="back-btn" onClick={() => setTelaAtual('home')}>VOLTAR AO MENU</button>
      </div>
    </div>
  );
}

export default CoresRegras;