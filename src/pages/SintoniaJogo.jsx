import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import logoImg from '../assets/logo.png';

function SintoniaJogo({ setTelaAtual }) {
  const [faseJogo, setFaseJogo] = useState('preparacao');
  const [anguloPonteiro, setAnguloPonteiro] = useState(90);
  const [alvoCentro, setAlvoCentro] = useState(() => Math.floor(Math.random() * 181)); 
  
  const [extremoEsquerdo, setExtremoEsquerdo] = useState('');
  const [extremoDireito, setExtremoDireito] = useState('');
  const [historicoRodadas, setHistoricoRodadas] = useState([]);
  const [pontosUltimaRodada, setPontosUltimaRodada] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);

  const fecharVisor = () => {
    setFaseJogo('adivinhacao');
    setAnguloPonteiro(90);
  };

  const revelarAlvo = () => {
    const diferenca = Math.abs(alvoCentro - anguloPonteiro);
    let pontos = 0;

    if (diferenca <= 4) pontos = 5; 
    else if (diferenca <= 12) pontos = 3; 
    else if (diferenca <= 24) pontos = 1; 

    setPontosUltimaRodada(pontos);
    setHistoricoRodadas([...historicoRodadas, pontos]);
    setFaseJogo('resultado');
  };

  const proximaRodada = () => {
    const novoAlvo = Math.floor(Math.random() * 181);
    setAlvoCentro(novoAlvo);
    setAnguloPonteiro(90);
    setPontosUltimaRodada(null);
    setFaseJogo('preparacao');
  };

  const resetarJogo = () => {
    const novoAlvo = Math.floor(Math.random() * 181);
    setAlvoCentro(novoAlvo);
    setAnguloPonteiro(90);
    setExtremoEsquerdo('');
    setExtremoDireito('');
    setPontosUltimaRodada(null);
    setHistoricoRodadas([]);
    setFaseJogo('preparacao');
    setConfirmacao(null);
  };

  const executarConfirmacao = () => {
    if (confirmacao === 'sair') setTelaAtual('home');
    if (confirmacao === 'resetar') resetarJogo();
  };

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo" />

        <h1 className="title rules-title" style={{fontSize: '25px', marginBottom: '0px'}}>SINTONIA</h1>
        
        <div className="game-status-box">
           <p className="status-text">
              {faseJogo === 'preparacao' && 'MEMORIZE O ALVO E DÊ A DICA!'}
              {faseJogo === 'adivinhacao' && 'GIRE O PONTEIRO E ADIVINHE!'}
              {faseJogo === 'resultado' && 'RESULTADO DA RODADA!'}
           </p>
        </div>

        <div className="jogo-area" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="velocimetro-container" style={{ maxWidth: '100%' }}>
              <div 
                  className={`velocimetro-fundo ${faseJogo !== 'adivinhacao' ? 'alvo-aberto' : 'alvo-fechado'}`}
                  style={{ '--centro': `${alvoCentro}deg` }} 
              >
                  <div 
                    className="velocimetro-ponteiro" 
                    style={{ transform: `translateX(-50%) rotate(${anguloPonteiro - 90}deg)` }}
                  >
                    <div className="ponteiro-agulha"></div>
                    <div className="ponteiro-base"></div> 
                  </div>
              </div>

              {faseJogo === 'resultado' && (
                  <div className={`pontos-animacao ${pontosUltimaRodada > 0 ? 'ganhou' : 'errou'}`}>
                    {pontosUltimaRodada > 0 ? `+${pontosUltimaRodada}` : '0'}
                  </div>
              )}
            </div>

            <div className="extremos-container" style={{ maxWidth: '100%' }}>
              <input 
                  type="text" className="extremo-input" placeholder="Extremo 1..." 
                  value={extremoEsquerdo} onChange={(e) => setExtremoEsquerdo(e.target.value)}
                  disabled={faseJogo !== 'preparacao'} 
              />
              <input 
                  type="text" className="extremo-input" placeholder="Extremo 2..." 
                  value={extremoDireito} onChange={(e) => setExtremoDireito(e.target.value)}
                  disabled={faseJogo !== 'preparacao'}
              />
            </div>
        </div>

        <div className="controles-jogador" style={{ marginBottom: '16px', width: '100%' }}>
           <input 
             type="range" min="0" max="180" 
             value={anguloPonteiro} onChange={(e) => setAnguloPonteiro(e.target.value)}
             className="retro-slider"
             disabled={faseJogo === 'resultado'} 
           />
        </div>

        <div className="placar-arcade">
           <div className="placar-titulo">PLACAR TOTAL</div>
           <div className="historico-lista">
              {historicoRodadas.length === 0 ? (
                 <span style={{color: '#555'}}>Sem pontos ainda</span>
              ) : (
                 historicoRodadas.map((pts, index) => (
                    <span key={index} className="rodada-badge">R{index + 1}: {pts}pt</span>
                 ))
              )}
           </div>
           <div className="total-display">
              {historicoRodadas.reduce((total, atual) => total + atual, 0)} PONTOS
           </div>
        </div>
      </div>

      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
         
         {faseJogo === 'preparacao' && (
           <button className="game-card start-btn" onClick={fecharVisor} style={{ backgroundColor: '#ff0055' }}>
             <h2 style={{ color: '#ffffff', fontSize: '14px' }}>FECHAR VISOR</h2>
           </button>
         )}

         {faseJogo === 'adivinhacao' && (
           <button className="game-card start-btn" onClick={revelarAlvo} style={{ backgroundColor: '#00ccff' }}>
             <h2 style={{ color: '#000000', fontSize: '14px' }}>REVELAR ALVO</h2>
           </button>
         )}

         {faseJogo === 'resultado' && (
           <button className="game-card start-btn" onClick={proximaRodada} style={{ backgroundColor: '#ffffff' }}>
             <h2 style={{ color: '#000000', fontSize: '14px' }}>PRÓXIMA RODADA</h2>
           </button>
         )}

        <div style={{ display: 'flex', gap: '16px', width: '100%', marginTop: '8px' }}>
          <button className="back-btn" onClick={() => setConfirmacao('resetar')} style={{ flex: 1 }}>RESETAR</button>
          <button className="back-btn" onClick={() => setConfirmacao('sair')} style={{ flex: 1 }}>SAIR</button>
        </div>
      </div>

      {confirmacao && createPortal(
        <div className="modal-overlay">
          <div className="modal-box">
            <p>
              {confirmacao === 'sair' ? 'DESEJA SAIR DA PARTIDA?' : 'ZERAR PLACAR E TEXTOS?'}
            </p>
            <div className="modal-buttons">
              <button className="modal-btn btn-sim" onClick={executarConfirmacao}>SIM</button>
              <button className="modal-btn btn-nao" onClick={() => setConfirmacao(null)}>NÃO</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default SintoniaJogo;