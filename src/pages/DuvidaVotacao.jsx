import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';

function DuvidaVotacao({ setTelaAtual }) {
  const [jogadores, setJogadores] = useState([]);
  const [setup, setSetup] = useState({});
  const [votos, setVotos] = useState({});
  const [revelado, setRevelado] = useState(false);

  useEffect(() => {
    // Busca as configurações salvas especificamente na partida de Dúvida
    const setupSalvo = JSON.parse(localStorage.getItem('duvida_setup_atual'));
    const rodadaSalva = JSON.parse(localStorage.getItem('duvida_rodada_atual'));
    
    if (setupSalvo && rodadaSalva) {
      setSetup(setupSalvo);
      setJogadores(rodadaSalva);
      
      // Inicia o contador de votos de todo mundo com 0
      const votosIniciais = {};
      rodadaSalva.forEach(j => { votosIniciais[j.id] = 0 });
      setVotos(votosIniciais);
    }
  }, []);

  // Lógica de limite de votos
  const totalVotosGastos = Object.values(votos).reduce((acc, curr) => acc + curr, 0);
  const maxVotosGlobal = jogadores.length * (setup.impostores || 1);
  const votosRestantes = maxVotosGlobal - totalVotosGastos;

  const adicionarVoto = (id) => {
    if (votosRestantes <= 0) return; // Não pode gastar mais votos que o limite global
    if (votos[id] >= jogadores.length) return; // Limite de segurança por jogador

    setVotos({ ...votos, [id]: votos[id] + 1 });
  };

  const removerVoto = (id) => {
    if (votos[id] > 0) {
      setVotos({ ...votos, [id]: votos[id] - 1 });
    }
  };

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px', gap: '16px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo" />
        <h1 className="title rules-title" style={{ fontSize: '18px', marginBottom: '0px' }}>VOTAÇÃO</h1>

        <div className="game-status-box" style={{ padding: '16px', width: '100%' }}>
           <p className="status-text" style={{ color: '#ffcc00' }}>QUEM DEU A RESPOSTA SUSPEITA?</p>
           <p style={{ fontSize: '10px', color: '#fff', fontFamily: '"Press Start 2P", cursive', marginTop: '12px', lineHeight: '1.4' }}>
              VOTOS RESTANTES: <span style={{ color: '#00ccff' }}>{votosRestantes}</span>
           </p>
        </div>

        {/* Removido o maxHeight fixo para a lista crescer com a tela */}
        <div className="player-list-container" style={{ paddingRight: '0', marginBottom: '0', width: '100%' }}>
          {jogadores.map(jogador => {
            // Destaca visualmente quem era o Infiltrado após revelar
            const ehImpostorRevelado = revelado && jogador.eImpostor;
            const ehInocenteRevelado = revelado && !jogador.eImpostor;

            return (
              <div 
                key={jogador.id} 
                className="player-item" 
                style={{ 
                  flexDirection: 'column', 
                  gap: '8px',
                  borderColor: ehImpostorRevelado ? '#ff0055' : (ehInocenteRevelado ? '#00ffaa' : '#333333'),
                  backgroundColor: ehImpostorRevelado ? '#220000' : '#111111'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <div className="player-info">
                    <span className="player-avatar">{jogador.avatar}</span>
                    <span className="player-name" style={{ color: ehImpostorRevelado ? '#ff0055' : '#fff' }}>
                      {jogador.nome}
                    </span>
                  </div>
                  
                  {/* Controles de Voto só aparecem antes da revelação */}
                  {!revelado && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button className="toggle-btn" style={{ padding: '8px', width: '32px' }} onClick={() => removerVoto(jogador.id)}>-</button>
                      <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '14px', color: '#00ccff' }}>{votos[jogador.id]}</span>
                      <button className="toggle-btn" style={{ padding: '8px', width: '32px' }} onClick={() => adicionarVoto(jogador.id)}>+</button>
                    </div>
                  )}

                  {/* Depois de revelar, mostramos o papel do jogador */}
                  {revelado && (
                    <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px', color: ehImpostorRevelado ? '#ff0055' : '#00ffaa' }}>
                      {ehImpostorRevelado ? 'INFILTRADO' : 'INOCENTE'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div> {/* FIM RECHEIO DINÂMICO */}

      {/* RODAPÉ FIXO DE AÇÕES */}
      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        {!revelado ? (
          <button 
            className="game-card start-btn" 
            onClick={() => setRevelado(true)}
            style={{ backgroundColor: '#ffcc00' }}
          >
            <h2 style={{ color: '#000000', fontSize: '14px' }}>REVELAR INFILTRADO</h2>
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
            <button 
              className="game-card start-btn" 
              onClick={() => setTelaAtual('duvida-regras')}
              style={{ backgroundColor: '#00ffaa', flex: 1, padding: '16px 8px' }}
            >
              <h2 style={{ color: '#000000', fontSize: '12px' }}>JOGAR NOVAMENTE</h2>
            </button>
            
            <button 
              className="game-card start-btn" 
              onClick={() => setTelaAtual('home')}
              style={{ backgroundColor: '#00ccff', flex: 1, padding: '16px 8px' }}
            >
              <h2 style={{ color: '#000000', fontSize: '12px' }}>SAIR</h2>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default DuvidaVotacao;