import React, { useState, useEffect, useRef } from 'react';
import logoImg from '../../assets/logo.png';
import { bancoDicas } from '../../data/bancoDicas';

function sortearElemento(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

function DicasJogo({ setTelaAtual }) {
  const [setup] = useState(JSON.parse(localStorage.getItem('dicas_setup_atual')));
  const [pool, setPool] = useState([]);
  const [elementoAtual, setElementoAtual] = useState(null);
  const [qtdDicasReveladas, setQtdDicasReveladas] = useState(0);
  const [rodadaFinalizada, setRodadaFinalizada] = useState(false);

  const [progressoTroca, setProgressoTroca] = useState(0);
  const timerTrocaRef = useRef(null);
  const [semAnimacao, setSemAnimacao] = useState(false);

  useEffect(() => {
    const poolFiltrado = bancoDicas.filter(item => setup.temas.includes(item.tema));
    setPool(poolFiltrado);
    setElementoAtual(sortearElemento(poolFiltrado));
  }, []);

  const proximaDica = () => {
    if (qtdDicasReveladas >= elementoAtual.dicas.length) return;
    setQtdDicasReveladas(qtdDicasReveladas + 1);
  };

  const acertou = () => {
    setRodadaFinalizada(true);
  };

  const proximaRodada = () => {
    setElementoAtual(sortearElemento(pool));
    setQtdDicasReveladas(0);
    setRodadaFinalizada(false);
  };

  const resetarProgresso = () => {
    setSemAnimacao(true);
    setProgressoTroca(0);
    requestAnimationFrame(() => setSemAnimacao(false));
  };

  const trocarElemento = () => {
    const poolSemAtual = pool.filter(item => item.elemento !== elementoAtual.elemento);
    const novoPool = poolSemAtual.length > 0 ? poolSemAtual : pool;
    setElementoAtual(sortearElemento(novoPool));
    setQtdDicasReveladas(0);
  };

  const iniciarTroca = () => {
    if (timerTrocaRef.current) clearInterval(timerTrocaRef.current);
    timerTrocaRef.current = setInterval(() => {
      setProgressoTroca(prev => {
        if (prev >= 100) {
          clearInterval(timerTrocaRef.current);
          timerTrocaRef.current = null;
          trocarElemento();
          resetarProgresso();
          return 100;
        }
        return prev + 25;
      });
    }, 100);
  };

  const pararTroca = () => {
    if (timerTrocaRef.current) {
      clearInterval(timerTrocaRef.current);
      timerTrocaRef.current = null;
    }
    resetarProgresso();
  };

  if (!elementoAtual) return null;

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px', gap: '24px', minHeight: 0 }}>

        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" />
        <h1 className="reveal-text" style={{ fontSize: '35px', color: '#ffea00', fontFamily: '"Press Start 2P", cursive', marginBottom: '2px' }}>DICAS</h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%' }}>
          <div className="game-status-box" style={{ maxWidth: '70%', textAlign: 'center', padding: '12px 16px' }}>
            <h1 className="reveal-text" style={{ fontSize: '24px', margin: 0, lineHeight: '1.4', wordBreak: 'break-word' }}>
              {elementoAtual.elemento}
            </h1>
          </div>

          {!rodadaFinalizada && (
            <button
              onTouchStart={iniciarTroca} onTouchEnd={pararTroca} onTouchCancel={pararTroca}
              onMouseDown={iniciarTroca} onMouseUp={pararTroca} onMouseLeave={pararTroca}
              style={{
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
                padding: '14px 20px',
                background: '#000000',
                border: '2px solid #ff0055',
                borderRadius: '0px',
                color: '#ff0055',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progressoTroca}%`,
                background: '#ffffff',
                transition: semAnimacao ? 'none' : 'width 0.1s linear',
              }} />
              <span style={{ position: 'relative', zIndex: 1 }}>TROCAR</span>
            </button>
          )}
        </div>

        <div className="game-status-box" style={{ width: '100%', padding: '16px', border: '1px solid #ffffff' }}>
          <p
            className={rodadaFinalizada ? 'status-text-acerto' : 'status-text'}
            style={{
              marginBottom: '12px',
              color: rodadaFinalizada ? '#ffc700' : '#fff',
              fontSize: rodadaFinalizada ? '12px' : undefined,
            }}
          >
            {rodadaFinalizada
              ? `ACERTOU! USADAS ${qtdDicasReveladas} DE ${elementoAtual.dicas.length} DICAS`
              : `DICAS (${qtdDicasReveladas}/${elementoAtual.dicas.length} REVELADAS):`}
          </p>

          <div className="player-list-container" style={{ paddingRight: '0', marginBottom: '0', width: '100%', maxHeight: 'none', overflowY: 'visible' }}>
            {elementoAtual.dicas.map((dica, index) => {
              const revelada = index < qtdDicasReveladas;
              const proximaDaFila = index === qtdDicasReveladas;
              return (
                <div
                  key={index}
                  className="player-item"
                  onClick={proximaDica}
                  style={{
                    borderColor: revelada ? '#d4af37' : '#333333',
                    backgroundColor: revelada ? '#1a1a1a' : '#111111',
                    cursor: !rodadaFinalizada ? 'pointer' : 'default',
                    opacity: !revelada && !proximaDaFila ? 0.5 : 1,
                  }}
                >
                  <div className="player-info">
                    <span className="player-avatar" style={{ color: '#00ccff' }}>{index + 1}</span>
                    <span className="player-name" style={{ color: revelada ? '#fff' : '#888', fontSize: '10px' }}>
                      {revelada ? dica : '??????'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        {!rodadaFinalizada ? (
          <button className="game-card start-btn" onClick={acertou}>
            <h2>ACERTOU!</h2>
          </button>
        ) : (
          <button className="game-card start-btn" onClick={proximaRodada}>
            <h2>PRÓXIMA RODADA</h2>
          </button>
        )}
        <button className="back-btn" onClick={() => setTelaAtual('home')}>VOLTAR AO MENU</button>
      </div>
    </div>
  );
}

export default DicasJogo;