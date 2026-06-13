import React, { useState, useEffect } from 'react';

// Lista de avatares paraescolher
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
    <div className="rules-screen page-transition">
      <h1 className="title rules-title" style={{ fontSize: '28px', marginBottom: '16px' }}>JOGADORES</h1>

      {/* CAIXA DE ADICIONAR NOVO JOGADOR */}
      <div className="game-status-box" style={{ padding: '20px' }}>
        
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
      <div className="player-list-container">
        {jogadores.length === 0 ? (
          <p className="status-text" style={{ color: '#888' }}>NENHUM JOGADOR CADASTRADO</p>
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

      {/* BOTÃO VOLTAR */}
      <button className="back-btn" onClick={() => setTelaAtual('home')} style={{ marginTop: 'auto' }}>
        VOLTAR AO MENU
      </button>
    </div>
  );
}

export default Configuracoes;