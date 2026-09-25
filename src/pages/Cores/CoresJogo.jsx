import { useState, useEffect } from 'react';
import logoImg from '../../assets/logo.png';
import coresImg from '../../assets/cores-icon.png';

// Geração criptográfica usando HSL com limites perceptivos
const gerarCorAleatoria = () => {
  const valores = new Uint32Array(3);
  window.crypto.getRandomValues(valores);
  return { 
    // Matiz: 0 a 360 graus (espectro completo)
    h: valores[0] % 361, 
    // Saturação: 25% a 100% (elimina cinzas lavados onde o matiz fica imperceptível)
    s: (valores[1] % 76) + 25, 
    // Brilho: 15% a 85% (corta 15% dos extremos escuro/claro, mantendo os 70% do meio)
    l: (valores[2] % 71) + 15 
  };
};

function CoresJogo({ setTelaAtual }) {
  const [faseJogo, setFaseJogo] = useState('preparacao'); // preparacao, memorizacao, recriacao, resultado
  const [tempoRestante, setTempoRestante] = useState(5000);
  
  const [corAlvo, setCorAlvo] = useState({ h: 0, s: 0, l: 0 });
  const [corAtual, setCorAtual] = useState({ h: 180, s: 50, l: 50 });
  const [pontuacao, setPontuacao] = useState(0);
  const [precisoes, setPrecisoes] = useState({ h: 0, s: 0, l: 0 });

  // Efeito do Cronômetro
  useEffect(() => {
    let timer;
    if (faseJogo === 'memorizacao') {
      const tempoFinal = Date.now() + 5000;

      timer = setInterval(() => {
        const agora = Date.now();
        const restante = Math.max(0, tempoFinal - agora);

        setTempoRestante(restante);

        if (restante <= 0) {
          clearInterval(timer);
          setCorAtual(gerarCorAleatoria());
          setFaseJogo('recriacao');
        }
      }, 30);
    }
    return () => clearInterval(timer);
  }, [faseJogo]);

  const iniciarMemorizacao = () => {
    setCorAlvo(gerarCorAleatoria());
    setTempoRestante(5000);
    setFaseJogo('memorizacao');
  };

  const revelarResultado = () => {
    // Distância bruta de cada controle
    const diffH = Math.min(Math.abs(corAlvo.h - corAtual.h), 360 - Math.abs(corAlvo.h - corAtual.h));
    const diffS = Math.abs(corAlvo.s - corAtual.s);
    const diffL = Math.abs(corAlvo.l - corAtual.l);

    // Precisões individuais em porcentagem (0% a 100%)
    const precH = Math.max(0, Math.round((1 - diffH / 180) * 100));
    const precS = Math.max(0, Math.round((1 - diffS / 100) * 100));
    const precL = Math.max(0, Math.round((1 - diffL / 100) * 100));
    
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
    setPrecisoes({ h: precH, s: precS, l: precL });
    setFaseJogo('resultado');
  };

  const proximaRodada = () => {
    setFaseJogo('preparacao');
    setPrecisoes({ h: 0, s: 0, l: 0 });
  };

  const formatarCronometro = (msRestantes) => {
    const totalSegundos = Math.floor(msRestantes / 1000);
    const centesimos = Math.floor((msRestantes % 1000) / 10);

    const centesimosFormatados = String(centesimos).padStart(2, '0');

    return `${totalSegundos}.${centesimosFormatados}`;
  };

  // ESTILOS DINÂMICOS DAS BARRAS
  const fundoHue = 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';
  const fundoSaturacao = `linear-gradient(to right, hsl(${corAtual.h}, 0%, ${corAtual.l}%), hsl(${corAtual.h}, 100%, ${corAtual.l}%))`;
  const fundoBrilho = `linear-gradient(to right, hsl(${corAtual.h}, ${corAtual.s}%, 0%), hsl(${corAtual.h}, ${corAtual.s}%, 50%), hsl(${corAtual.h}, ${corAtual.s}%, 100%))`;

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '8px', gap: '12px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" style={{ marginBottom: '0px' }} />
        
        <p className="invert-text" style={{ color: '#ffea00', fontSize: '16px', textAlign: 'center' }}>
          {faseJogo === 'preparacao' && 'PREPARE-SE PARA MEMORIZAR!'}
          {faseJogo === 'memorizacao' && (
            <>
              <span style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>GRAVE A COR</span>
              <span style={{ fontSize: '34px', color: '#ffea00', textShadow: '4px 4px 0px #000000' }}>
                {formatarCronometro(tempoRestante)}s
              </span>
            </>
          )}
          {faseJogo === 'recriacao' && 'TENTE RECRIAR A COR!'}
          {faseJogo === 'resultado' && `PRECISÃO: ${pontuacao}%`}
        </p>

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
            borderWidth: faseJogo === 'recriacao' ? '0px' : '2px',
            overflow: 'hidden'
          }}>
            {faseJogo === 'preparacao' && <img 
                                            src={coresImg} 
                                            alt="Paleta de Cores" 
                                            className="pixel-icon-paleta" 
                                          />}
            {faseJogo === 'resultado' && <span className="color-label">ORIGINAL</span>}
          </div>

          {/* Caixa da cor adivinhada */}
          <div className="color-display-box" style={{ 
            backgroundColor: `hsl(${corAtual.h}, ${corAtual.s}%, ${corAtual.l}%)`,
            width: faseJogo === 'resultado' ? '50%' : '100%',
            opacity: (faseJogo === 'memorizacao' || faseJogo === 'preparacao') ? 0 : 1,
            position: (faseJogo === 'memorizacao' || faseJogo === 'preparacao') ? 'absolute' : 'relative',
            borderWidth: (faseJogo === 'memorizacao' || faseJogo === 'preparacao') ? '0px' : '2px',
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

        {/* ESTATÍSTICAS DETALHADAS COM BARRAS COMPLETAS E MARCADORES */}
        {faseJogo === 'resultado' && (
          <div className="page-transition" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>
            
            {/* LINHA 1: MATIZ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#ffffff', fontFamily: '"Press Start 2P", cursive', fontSize: '12px' }}>MATIZ</span>
                <span style={{ color: '#ffea00', fontFamily: '"Press Start 2P", cursive', fontSize: '14px', textShadow: '2px 2px 0px #000' }}>
                  {precisoes.h}%
                </span>
              </div>
              
              <div style={{
                width: '100%',
                height: '26px',
                background: fundoHue,
                border: '3px solid #000000',
                boxShadow: '3px 3px 0px #ffffff',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Marcador SUA COR */}
                <div style={{
                  position: 'absolute',
                  left: `calc(4px + (${(corAtual.h / 360) * 100} / 100) * (100% - 8px))`,
                  top: 0,
                  bottom: 0,
                  width: '8px',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '1px 1px 0px #000000',
                  zIndex: 1,
                }} />

                {/* Marcador ALVO (Posição Certa) */}
                <div style={{
                  position: 'absolute',
                  left: `calc(4px + (${(corAlvo.h / 360) * 100} / 100) * (100% - 8px))`,
                  top: 0,
                  bottom: 0,
                  width: '8px',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ffea00',
                  border: '2px solid #000000',
                  boxShadow: '0 0 8px #ffea00',
                  zIndex: 2,
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontFamily: '"Press Start 2P", cursive', marginTop: '2px' }}>
                <span style={{ color: '#ffea00', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ffea00', border: '1px solid #000' }}></span>
                  ALVO: {corAlvo.h}°
                </span>
                <span style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ffffff', border: '1px solid #000' }}></span>
                  SUA: {corAtual.h}°
                </span>
              </div>
            </div>

            {/* LINHA 2: SATURAÇÃO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#ffffff', fontFamily: '"Press Start 2P", cursive', fontSize: '12px' }}>SATURAÇÃO</span>
                <span style={{ color: '#ffea00', fontFamily: '"Press Start 2P", cursive', fontSize: '14px', textShadow: '2px 2px 0px #000' }}>
                  {precisoes.s}%
                </span>
              </div>
              
              <div style={{
                width: '100%',
                height: '26px',
                background: fundoSaturacao,
                border: '3px solid #000000',
                boxShadow: '3px 3px 0px #ffffff',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Marcador SUA COR */}
                <div style={{
                  position: 'absolute',
                  left: `calc(4px + (${corAtual.s} / 100) * (100% - 8px))`,
                  top: 0,
                  bottom: 0,
                  width: '8px',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '1px 1px 0px #000000',
                  zIndex: 1,
                }} />

                {/* Marcador ALVO (Posição Certa) */}
                <div style={{
                  position: 'absolute',
                  left: `calc(4px + (${corAlvo.s} / 100) * (100% - 8px))`,
                  top: 0,
                  bottom: 0,
                  width: '8px',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ffea00',
                  border: '2px solid #000000',
                  boxShadow: '0 0 8px #ffea00',
                  zIndex: 2,
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontFamily: '"Press Start 2P", cursive', marginTop: '2px' }}>
                <span style={{ color: '#ffea00', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ffea00', border: '1px solid #000' }}></span>
                  ALVO: {corAlvo.s}%
                </span>
                <span style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ffffff', border: '1px solid #000' }}></span>
                  SUA: {corAtual.s}%
                </span>
              </div>
            </div>

            {/* LINHA 3: BRILHO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#ffffff', fontFamily: '"Press Start 2P", cursive', fontSize: '12px' }}>BRILHO (LUZ)</span>
                <span style={{ color: '#ffea00', fontFamily: '"Press Start 2P", cursive', fontSize: '14px', textShadow: '2px 2px 0px #000' }}>
                  {precisoes.l}%
                </span>
              </div>
              
              <div style={{
                width: '100%',
                height: '26px',
                background: fundoBrilho,
                border: '3px solid #000000',
                boxShadow: '3px 3px 0px #ffffff',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Marcador SUA COR */}
                <div style={{
                  position: 'absolute',
                  left: `calc(4px + (${corAtual.l} / 100) * (100% - 8px))`,
                  top: 0,
                  bottom: 0,
                  width: '8px',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '1px 1px 0px #000000',
                  zIndex: 1,
                }} />

                {/* Marcador ALVO (Posição Certa) */}
                <div style={{
                  position: 'absolute',
                  left: `calc(4px + (${corAlvo.l} / 100) * (100% - 8px))`,
                  top: 0,
                  bottom: 0,
                  width: '8px',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ffea00',
                  border: '2px solid #000000',
                  boxShadow: '0 0 8px #ffea00',
                  zIndex: 2,
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontFamily: '"Press Start 2P", cursive', marginTop: '2px' }}>
                <span style={{ color: '#ffea00', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ffea00', border: '1px solid #000' }}></span>
                  ALVO: {corAlvo.l}%
                </span>
                <span style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ffffff', border: '1px solid #000' }}></span>
                  SUA: {corAtual.l}%
                </span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* RODAPÉ FIXO DE AÇÕES */}
      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '12px', width: '100%' }}>
        
        {faseJogo === 'preparacao' && (
          <button className="game-card start-btn" onClick={iniciarMemorizacao} style={{ backgroundColor: '#00ccff' }}>
            <h2 style={{ color: '#fffdfd', fontSize: '14px' }}>VER A COR (5s)</h2>
          </button>
        )}

        {faseJogo === 'recriacao' && (
          <button className="game-card start-btn" onClick={revelarResultado} style={{ backgroundColor: '#00ffaa' }}>
            <h2 style={{ color: '#ffffff', fontSize: '14px' }}>COMPARAR CORES</h2>
          </button>
        )}

        {faseJogo === 'resultado' && (
          <button className="game-card start-btn" onClick={proximaRodada} style={{ backgroundColor: '#ffcc00' }}>
            <h2 style={{ color: '#ffffff', fontSize: '14px' }}>PRÓXIMA RODADA</h2>
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