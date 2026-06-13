import React, { useState, useEffect } from 'react';

// Lista de avatares para escolher
const AVATARES_DISPONIVEIS = ['👽', '🤖', '👾', '👻', '🤠', '🕵️', '🦊', '🐱', '🦖', '🦄'];

function Configuracoes({ setTelaAtual }) {
  // Inicializa o estado já buscando da memória do celular!
  const [jogadores, setJogadores] = useState(() => {
    const jogadoresSalvos = localStorage.getItem('desconfia_jogadores');
    return jogadoresSalvos ? JSON.parse(jogadoresSalvos) : [];
  });

  const [novoNome, setNovoNome] = useState('');
  const [avatarSelecionado, setAvatarSelecionado] = useState(AVATARES_DISPONIVEIS[0]);

  // Toda vez que a lista de 'jogadores' mudar, salva automaticamente no celular
  useEffect(() => {
    localStorage.setItem('desconfia_jogadores', JSON.stringify(jogadores));
  }, [jogadores]);

  const adicionarJogador = () => {
    if (novoNome.trim() === '') return; // Não deixa adicionar nome vazio

    const novoJogador = {
      id: Date.now(), // Gera um ID único baseado na hora
      nome: novoNome.trim().toUpperCase(),
      avatar: avatarSelecionado
    };

    setJogadores([...jogadores, novoJogador]);
    setNovoNome(''); // Limpa o campo de texto
  };

  const removerJogador = (idParaRemover) => {
    const listaAtualizada = jogadores.filter(jogador => jogador.id !== idParaRemover);
    setJogadores(listaAtualizada);
  };

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px', gap: '24px' }}>
        
        <h1 className="title rules-title" style={{ fontSize: '28px', marginTop: '16px', marginBottom: '0px' }}>JOGADORES</h1>

        {/* CAIXA DE ADICIONAR NOVO JOGADOR */}
        <div className="game-status-box" style={{ padding: '20px', width: '100%' }}>
          
          <input 
            type="text" 
            className="extremo-input" 
            placeholder="NOME DO JOGADOR" 
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            style={{ width: '100%', marginBottom: '16px', fontSize: '15px' }}
          />

          <p className="status-text" style={{ marginBottom: '8px', fontSize: '13px' }}>ESCOLHA UM AVATAR:</p>
          
          <div className="avatar-selector">
            {AVATARES_DISPONIVEIS.map(avatar => (
              <button 
                key={avatar}
                className={`avatar-btn ${avatarSelecionado === avatar ? 'selecionado' : ''}`}
                onClick={() => setAvatarSelecionado(avatar)}
              >
                {avatar}
              </button>
            ))}
          </div>

          <button 
            className="game-card start-btn" 
            onClick={adicionarJogador} 
            style={{ backgroundColor: '#00ccff', marginTop: '16px', padding: '12px' }}
          >
            <h2 style={{ color: '#000000', fontSize: '12px' }}>+ ADICIONAR</h2>
          </button>
        </div>

        {/* LISTA DOS JOGADORES CADASTRADOS */}
        <div className="player-list-container" style={{ width: '100%', marginBottom: '0' }}>
          {jogadores.length === 0 ? (
            <p className="status-text" style={{ color: '#888', textAlign: 'center' }}>NENHUM JOGADOR CADASTRADO</p>
          ) : (
            jogadores.map(jogador => (
              <div key={jogador.id} className="player-item">
                <div className="player-info">
                  <span className="player-avatar">{jogador.avatar}</span>
                  <span className="player-name">{jogador.nome}</span>
                </div>
                <button className="delete-player-btn" onClick={() => removerJogador(jogador.id)}>X</button>
              </div>
            ))
          )}
        </div>

      </div> {/* FIM RECHEIO DINÂMICO */}

      {/* RODAPÉ FIXO */}
      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        <button className="back-btn" onClick={() => setTelaAtual('home')} style={{ width: '100%' }}>
          VOLTAR AO MENU
        </button>
      </div>

    </div>
  );
}

export default Configuracoes;