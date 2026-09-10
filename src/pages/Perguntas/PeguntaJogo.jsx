import React, { useState, useEffect, useRef } from 'react';
import { bancoDeDuvidas } from '../../data/duvidasImpostor'; 
import logoImg from '../../assets/logo.png';

// Função de embaralhamento
const embaralharArray = (arrayOriginal) => {
  const array = [...arrayOriginal];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function PerguntaJogo({ setTelaAtual }) {
  const [setup, setSetup] = useState(JSON.parse(localStorage.getItem('duvida_setup_atual')));
  const [jogadores, setJogadores] = useState([]);
  const [indiceJogador, setIndiceJogador] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [revelado, setRevelado] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false); 
  const [faseJogo, setFaseJogo] = useState('passando_celular'); 
  const [perguntaOriginal, setPerguntaOriginal] = useState('');
  const [perguntaFinalRevelada, setPerguntaFinalRevelada] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    const todosCadastrados = JSON.parse(localStorage.getItem('desconfia_jogadores'));
    const ordemFiltrada = (setup.ordem && setup.ordem.length > 0 ? setup.ordem : setup.jogadores)
      .filter(id => setup.jogadores.includes(id));

    const selecionados = ordemFiltrada
      .map(id => todosCadastrados.find(j => j.id === id))
      .filter(Boolean);
    
    // Sorteia os infiltrados
    const shuffledJogadores = embaralharArray(selecionados);
    const impostores = shuffledJogadores.slice(0, setup.impostores);
    
    // Filtra os blocos pelos temas escolhidos
    const temasFiltrados = setup.temas || bancoDeDuvidas.map(b => b.tema);
    const blocosDisponiveis = bancoDeDuvidas.filter(bloco => temasFiltrados.includes(bloco.tema));
    
    // Sorteia um bloco/tema aleatório
    const blocoSorteado = blocosDisponiveis[Math.floor(Math.random() * blocosDisponiveis.length)];
    
    // Verificar Perguntas repetidas
    const LIMITE_RODADAS_COOLDOWN = 8;

    let historicoRodadas = JSON.parse(localStorage.getItem('duvida_historico_recente') || '[]');
    let perguntasBloqueadas = historicoRodadas.flat();

    let perguntasDisponiveis = blocoSorteado.perguntas.filter(p => !perguntasBloqueadas.includes(p));

    // Se o tema tiver poucas perguntas e faltar opções (< 2),
    // ele vai soltando as rodadas mais antigas até liberar pelo menos 2 perguntas
    while (perguntasDisponiveis.length < 2 && historicoRodadas.length > 0) {
      historicoRodadas.shift(); // Libera a rodada mais antiga
      perguntasBloqueadas = historicoRodadas.flat();
      perguntasDisponiveis = blocoSorteado.perguntas.filter(p => !perguntasBloqueadas.includes(p));
    }

    // Se por acaso o banco tiver menos de 2 perguntas no total, usa o bloco todo como emergência
    if (perguntasDisponiveis.length < 2) {
      perguntasDisponiveis = [...blocoSorteado.perguntas];
    }

    // Embaralha as perguntas disponíveis
    const perguntasEmbaralhadas = embaralharArray(perguntasDisponiveis);
    const perguntaParaInocentes = perguntasEmbaralhadas[0];
    const perguntaParaInfiltrados = perguntasEmbaralhadas[1];

    // Adiciona a rodada atual ao histórico e limita a 8 rodadas
    const novoHistorico = [...historicoRodadas, [perguntaParaInocentes, perguntaParaInfiltrados]];
    if (novoHistorico.length > LIMITE_RODADAS_COOLDOWN) {
      novoHistorico.shift(); // Remove a 1ª rodada (que agora completou 8 partidas de descanso)
    }
    localStorage.setItem('duvida_historico_recente', JSON.stringify(novoHistorico));

    setPerguntaOriginal(perguntaParaInocentes); 
    
    // Distribuição para os jogadores
    const jogadoresComFuncao = selecionados.map(j => {
      const eImpostor = impostores.find(i => i.id === j.id) !== undefined;
      return {
        ...j,
        eImpostor,
        perguntaExibida: eImpostor ? perguntaParaInfiltrados : perguntaParaInocentes
      };
    });

    setJogadores(jogadoresComFuncao);
    localStorage.setItem('duvida_rodada_atual', JSON.stringify(jogadoresComFuncao));
  }, []);

  const iniciarPressao = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setProgresso(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setRevelado(true);
          setTimeout(() => setPodeAvancar(true), 800); 
          return 100;
        }
        return prev + 20; 
      });
    }, 100);
  };

  const pararPressao = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setProgresso(0);
  };

  const proximoJogador = () => {
    if (!podeAvancar) return;

    setRevelado(false);
    setProgresso(0);
    setPodeAvancar(false);
    
    if (indiceJogador < jogadores.length - 1) {
      setIndiceJogador(indiceJogador + 1);
    } else {
      setFaseJogo('revelacao_pergunta');
    }
  };

  if (jogadores.length === 0) return null;

  const jogadorAtual = jogadores[indiceJogador];

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px', gap: '24px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" />
        <h1 className="reveal-text" style={{ fontSize: '35px', color: '#9d00ff', fontFamily: '"Press Start 2P", cursive', marginBottom: '2px' }}>PERGUNTAS</h1>
        
        {faseJogo === 'passando_celular' ? (
          <>
            <p className="menor-text">
              PASSE O CELULAR PARA:
            </p>

            <div 
              className={`hold-card ${progresso > 0 && !revelado ? 'pressionando' : ''} ${revelado ? 'revelado' : ''}`}
              onTouchStart={!revelado ? iniciarPressao : undefined}
              onTouchEnd={!revelado ? pararPressao : undefined}
              onTouchCancel={!revelado ? pararPressao : undefined}
              onMouseDown={!revelado ? iniciarPressao : undefined}
              onMouseUp={!revelado ? pararPressao : undefined}
              onMouseLeave={!revelado ? pararPressao : undefined}
            >
              {!revelado && (
                <div 
                  className={`hold-energy-fill ${progresso > 0 ? 'com-borda' : ''}`}
                  style={{ height: `${progresso}%` }}
                />
              )}

              <div className="avatar-circle-frame">
                <span className="avatar-emoji-centered">{jogadorAtual.avatar}</span>
              </div>

              <div className="hold-player-name">
                {jogadorAtual.nome}
              </div>

              {!revelado ? (
                <span className={`hold-status-text ${progresso > 0 ? 'ativo' : ''}`}>
                  {progresso > 0 ? `CARREGANDO... ${progresso}%` : '▶ SEGURE PARA LER ◀'}
                </span>
              ) : (
                <>
                  <span className="card-pergunta-label">SUA PERGUNTA É:</span>
                  <p className="card-pergunta-texto">
                    {jogadorAtual.perguntaExibida}
                  </p>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            {!perguntaFinalRevelada ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '24px' }}>
                <div className="game-status-box" style={{ width: '100%', textAlign: 'center', padding: '24px 16px' }}>
                  <p className="status-text" style={{ color: '#ffcc00', fontSize: '16px' }}>TODOS RESPONDERAM?</p>
                  <p style={{ fontSize: '12px', color: '#fff', fontFamily: '"Press Start 2P", cursive', marginTop: '16px', lineHeight: '1.6' }}>
                    Coloque o celular no centro da mesa. Quando estiverem prontos, revelem a pergunta!
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '24px' }}>
                <p className="status-text" style={{ marginBottom: '0px', color: '#00ffaa' }}>A PERGUNTA ORIGINAL ERA:</p>
                
                <div className="rules-box" style={{ width: '100%', backgroundColor: '#111', padding: '32px 24px', borderRadius: '16px', border: '2px solid #00ffaa' }}>
                  <p style={{ fontSize: '18px', color: '#ffffff', lineHeight: '1.6', textAlign: 'center', fontWeight: 'bold' }}>
                    "{perguntaOriginal}"
                  </p>
                </div>
                
                <p style={{ fontSize: '10px', color: '#888', fontFamily: '"Press Start 2P", cursive', marginTop: '0px', lineHeight: '1.5', textAlign: 'center' }}>
                  Quem deu a resposta mais absurda?
                </p>
              </div>
            )}
          </>
        )}
      </div> 

      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        
        {faseJogo === 'passando_celular' && revelado && (
          <button 
            className="game-card start-btn" 
            onClick={proximoJogador} 
            style={{ backgroundColor: podeAvancar ? '#00ccff' : '#555555', opacity: podeAvancar ? 1 : 0.5, transition: 'all 0.3s' }}
          >
            <h2 style={{ color: '#ffffff', fontSize: '14px' }}>OK, ENTENDI</h2>
          </button>
        )}

        {faseJogo !== 'passando_celular' && !perguntaFinalRevelada && (
          <button 
            className="game-card start-btn" 
            onClick={() => setPerguntaFinalRevelada(true)} 
            style={{ backgroundColor: '#00ffaa' }}
          >
            <h2 style={{ color: '#ffffff', fontSize: '14px' }}>REVELAR PERGUNTA</h2>
          </button>
        )}

        {faseJogo !== 'passando_celular' && perguntaFinalRevelada && (
          <button 
            className="game-card start-btn" 
            onClick={() => setTelaAtual('duvida-votacao')} 
            style={{ backgroundColor: '#ff0055' }}
          >
            <h2 style={{ color: '#ffffff', fontSize: '14px' }}>IR PARA VOTAÇÃO</h2>
          </button>
        )}

      </div>
    </div>
  );
}

export default PerguntaJogo;