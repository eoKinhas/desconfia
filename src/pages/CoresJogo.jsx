import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';

// Geração criptográfica usando HSL
const gerarCorAleatoria = () => {
  const valores = new Uint32Array(3);
  window.crypto.getRandomValues(valores);
  return { 
    h: valores[0] % 361, 
    s: valores[1] % 101, 
    l: valores[2] % 101 
  };
};

function CoresJogo({ setTelaAtual }) {
  const [faseJogo, setFaseJogo] = useState('preparacao'); // preparacao, memorizacao, recriacao, resultado
  const [tempoRestante, setTempoRestante] = useState(5);
  
  const [corAlvo, setCorAlvo] = useState({ h: 0, s: 0, l: 0 });
  const [corAtual, setCorAtual] = useState({ h: 180, s: 50, l: 50 });
  const [pontuacao, setPontuacao] = useState(0);

  // Efeito do Cronômetro
  useEffect(() => {
    let timer;
    if (faseJogo === 'memorizacao' && tempoRestante > 0) {
      timer = setInterval(() => {
        setTempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (faseJogo === 'memorizacao' && tempoRestante === 0) {
      // Começa o jogador em uma posição totalmente aleatória para não dar dicas!
      setCorAtual(gerarCorAleatoria());
      setFaseJogo('recriacao');
    }
    return () => clearInterval(timer);
  }, [faseJogo, tempoRestante]);

  const iniciarMemorizacao = () => {
    setCorAlvo(gerarCorAleatoria());
    setTempoRestante(5);
    setFaseJogo('memorizacao');
  };

  const revelarResultado = () => {
    // Distância bruta de cada controle
    const diffH = Math.min(Math.abs(corAlvo.h - corAtual.h), 360 - Math.abs(corAlvo.h - corAtual.h));
    const diffS = Math.abs(corAlvo.s - corAtual.s);
    const diffL = Math.abs(corAlvo.l - corAtual.l);
    
    // Se a cor alvo é quase preta (L perto de 0), quase branca (L perto de 100) ou cinza (S perto de 0), o matiz importa menos.
    const fatorLuz = 1 - (Math.abs(50 - corAlvo.l) / 50); 
    const fatorSaturacao = corAlvo.s / 100;
    const pesoH = fatorLuz * fatorSaturacao;
    
    // Normalizamos os erros para a escala decimal (0 a 1)
    const erroH = (diffH / 180) * pesoH; 
    const erroS = diffS / 100;
    const erroL = diffL / 100;
    
    // Distância Euclidiana (Teorema de Pitágoras em 3D)
    const distancia = Math.sqrt(erroH * erroH + erroS * erroS + erroL * erroL);
    
    // A distância máxima teórica do algoritmo (raiz quadrada de 1^2 + 1^2 + 1^2)
    const maxDistancia = Math.sqrt(3); 
    
    // Cálculo final da precisão
    const precisaoDecimal = 1 - (distancia / maxDistancia);
    const precisao = Math.max(0, Math.floor(precisaoDecimal * 100));
    
    setPontuacao(precisao);
    setFaseJogo('resultado');
  };

  const proximaRodada = () => {
    setFaseJogo('preparacao');
  };

  // ESTILOS DINÂMICOS DAS BARRAS
  const fundoHue = 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';
  const fundoSaturacao = `linear-gradient(to right, hsl(${corAtual.h}, 0%, ${corAtual.l}%), hsl(${corAtual.h}, 100%, ${corAtual.l}%))`;
  const fundoBrilho = `linear-gradient(to right, hsl(${corAtual.h}, ${corAtual.s}%, 0%), hsl(${corAtual.h}, ${corAtual.s}%, 50%), hsl(${corAtual.h}, ${corAtual.s}%, 100%))`;

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '8px', gap: '12px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" style={{ marginBottom: '0px' }} />
        
        {/* CAIXA DE STATUS SUPERIOR */}
        <div className="game-status-box" style={{ width: '100%', textAlign: 'center', padding: '10px' }}>
          <p className="status-text" style={{ fontSize: '10px', color: '#ffcc00' }}>
            {faseJogo === 'preparacao' && 'PREPARE-SE PARA MEMORIZAR!'}
            {faseJogo === 'memorizacao' && `GRAVE A COR: ${tempoRestante}s`}
            {faseJogo === 'recriacao' && 'TENTE RECRIAR A COR!'}
            {faseJogo === 'resultado' && `PRECISÃO: ${pontuacao}%`}
          </p>
        </div>

        {/* ÁREA DA COR ANIMADA */}
        <div style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: faseJogo === 'resultado' ? '16px' : '0px',
          margin: '0',
          position: 'relative',
          height: '300px', 
          transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}>
          
          {/* Caixa de memorização */}
          <div className="color-display-box" style={{ 
            backgroundColor: faseJogo === 'preparacao' ? '#111111' : `hsl(${corAlvo.h}, ${corAlvo.s}%, ${corAlvo.l}%)`,
            width: faseJogo === 'resultado' ? '50%' : '100%',
            opacity: faseJogo === 'recriacao' ? 0 : 1,
            position: faseJogo === 'recriacao' ? 'absolute' : 'relative',
            borderWidth: faseJogo === 'recriacao' ? '0px' : '6px',
            overflow: 'hidden'
          }}>
            {faseJogo === 'preparacao' && <span style={{ fontSize: '64px' }}>🎨</span>}
            {faseJogo === 'resultado' && <span className="color-label">ORIGINAL</span>}
          </div>

          {/* Caixa da cor adivinhada */}
          <div className="color-display-box" style={{ 
            backgroundColor: `hsl(${corAtual.h}, ${corAtual.s}%, ${corAtual.l}%)`,
            width: faseJogo === 'resultado' ? '50%' : '100%',
            opacity: (faseJogo === 'memorizacao' || faseJogo === 'preparacao') ? 0 : 1,
            position: (faseJogo === 'memorizacao' || faseJogo === 'preparacao') ? 'absolute' : 'relative',
            borderWidth: (faseJogo === 'memorizacao' || faseJogo === 'preparacao') ? '0px' : '6px',
            overflow: 'hidden'
          }}>
            {faseJogo === 'resultado' && <span className="color-label">SUA COR</span>}
          </div>

        </div>

        {/* CONTROLES DESLIZANTES HSL COM FUNDO DINÂMICO */}
        {faseJogo === 'recriacao' && (
          <div className="page-transition" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}>
            
            <div className="slider-group">
              <label style={{ color: '#ffffff', fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>COR (MATIZ)</label>
              <input type="range" min="0" max="360" value={corAtual.h} 
                     onChange={(e) => setCorAtual({ ...corAtual, h: Number(e.target.value) })}
                     className="retro-slider" style={{ background: fundoHue, marginTop: '4px' }} />
            </div>

            <div className="slider-group">
              <label style={{ color: '#ffffff', fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>SATURAÇÃO</label>
              <input type="range" min="0" max="100" value={corAtual.s} 
                     onChange={(e) => setCorAtual({ ...corAtual, s: Number(e.target.value) })}
                     className="retro-slider" style={{ background: fundoSaturacao, marginTop: '4px' }} />
            </div>

            <div className="slider-group">
              <label style={{ color: '#ffffff', fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>BRILHO (LUZ)</label>
              <input type="range" min="0" max="100" value={corAtual.l} 
                     onChange={(e) => setCorAtual({ ...corAtual, l: Number(e.target.value) })}
                     className="retro-slider" style={{ background: fundoBrilho, marginTop: '4px' }} />
            </div>
            
          </div>
        )}

      </div>

      {/* RODAPÉ FIXO DE AÇÕES */}
      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '12px', width: '100%' }}>
        
        {faseJogo === 'preparacao' && (
          <button className="game-card start-btn" onClick={iniciarMemorizacao} style={{ backgroundColor: '#00ccff' }}>
            <h2 style={{ color: '#000000', fontSize: '14px' }}>VER A COR (5s)</h2>
          </button>
        )}

        {faseJogo === 'recriacao' && (
          <button className="game-card start-btn" onClick={revelarResultado} style={{ backgroundColor: '#00ffaa' }}>
            <h2 style={{ color: '#000000', fontSize: '14px' }}>COMPARAR CORES</h2>
          </button>
        )}

        {faseJogo === 'resultado' && (
          <button className="game-card start-btn" onClick={proximaRodada} style={{ backgroundColor: '#ffcc00' }}>
            <h2 style={{ color: '#000000', fontSize: '14px' }}>PRÓXIMA RODADA</h2>
          </button>
        )}

        {faseJogo !== 'memorizacao' && (
           <button className="back-btn" onClick={() => setTelaAtual('home')} style={{ marginTop: '8px', padding: '8px' }}>VOLTAR AO MENU</button>
        )}

      </div>
    </div>
  );
}

export default CoresJogo;