import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import logoImg from '../../assets/logo.png';
import Jogadores from '../../components/Jogadores';
import trocarIcon from '../../assets/trocar-icon.png';

// Lista de temas sugeridos para ajudar a criatividade da roda
const sugestoesTemas = [
  "COMIDAS",
  "SÉRIES DE TV",
  "FILMES",
  "ANIMES",
  "JOGOS",
  "FRANQUIAS",
  "BANDAS OU CANTORES",
  "RESTAURANTES",
  "MARCAS DE CARRO",
  "DOCES / SOBREMESAS",
  "DESENHOS",
  "MATÉRIAS DA ESCOLA"
];

function TierListRegras({ setTelaAtual }) {
  const [jogadoresCadastrados, setJogadoresCadastrados] = useState([]);
  const [jogadoresSelecionados, setJogadoresSelecionados] = useState([]);
  const [ordemJogadores, setOrdemJogadores] = useState([]);
  const [alerta, setAlerta] = useState(null);
  
  // Estados para o controle dos Temas
  const [indiceTema, setIndiceTema] = useState(0);
  const [temaAtual, setTemaAtual] = useState(sugestoesTemas[0]);

  useEffect(() => {
    // Carrega todos os jogadores cadastrados no app usando o localStorage
    const salvos = localStorage.getItem('desconfia_jogadores');
    let listaCadastrados = [];
    if (salvos) {
      listaCadastrados = JSON.parse(salvos);
      setJogadoresCadastrados(listaCadastrados);
    }

    // Busca as configurações da última partida de Tier List
    const setupSalvo = localStorage.getItem('tierlist_setup_atual');
    if (setupSalvo) {
      const setup = JSON.parse(setupSalvo);
      setJogadoresSelecionados(setup.jogadores || []);
      
      if (setup.ordem && setup.ordem.length > 0) {
        setOrdemJogadores(setup.ordem);
      } else {
        setOrdemJogadores(listaCadastrados.map(j => j.id));
      }
    } else {
      setJogadoresSelecionados([]);
      setOrdemJogadores(listaCadastrados.map(j => j.id));
    }
  }, []);

  const toggleJogador = (id) => {
    if (jogadoresSelecionados.includes(id)) {
      setJogadoresSelecionados(jogadoresSelecionados.filter(jId => jId !== id));
    } else {
      setJogadoresSelecionados([...jogadoresSelecionados, id]);
    }
  };

  // Avança para a próxima sugestão de tema e limpa o campo personalizado
  const proximoTema = () => {
    const proximoIndice = (indiceTema + 1) % sugestoesTemas.length;
    setIndiceTema(proximoIndice);
    setTemaAtual(sugestoesTemas[proximoIndice]);
  };

  const iniciarPartida = () => {
    if (jogadoresSelecionados.length < 3) {
      setAlerta("SELECIONE PELO MENOS 3 JOGADORES!");
      return;
    }
    
    // Usa o temaAtual unificado ou cai de volta para a sugestão caso o usuário tenha apagado tudo
    const temaFinal = temaAtual.trim() !== '' ? temaAtual.trim().toUpperCase() : sugestoesTemas[indiceTema];

    const setupPartida = {
      jogadores: jogadoresSelecionados,
      ordem: ordemJogadores,
      tema: temaFinal
    };
    
    // Salva na memória do celular para a próxima vez
    localStorage.setItem('tierlist_setup_atual', JSON.stringify(setupPartida));
    
    setTelaAtual('tierlist-jogo');
  };

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px', gap: '24px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" />
        <h1 className="reveal-text" style={{ fontSize: '35px', color: '#ff5500', fontFamily: '"Press Start 2P", cursive', marginBottom: '2px' }}>TIER LIST</h1>

        {/* CAIXA DE REGRAS */}
        <div className="rules-box">
          <p style={{ fontSize: '18px' }}><strong>REGRAS:</strong></p>
          <p>Cada jogador receberá secretamente um Rank:</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '14px 0 20px 0' }}>
            {['S', 'A', 'B', 'C', 'F'].map((rank) => (
              <div key={rank} className={`rank-badge-mini rank-${rank}`}>
                {rank}
              </div>
            ))}
          </div>

          <p>Você deve sugerir um elemento que mereça estar nesse rank.</p>
          <p>O grupo debate para organizar a lista final sem saber quem sugeriu o quê!</p>
        </div>

        {/* SELEÇÃO DO TEMA */}
        <div className="game-status-box" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <p className="status-text" style={{ color: '#ffffff', fontSize: '12px' }}>TEMA DA PARTIDA:</p>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
            <input 
              type="text" 
              className="tema-input-retro"
              value={temaAtual}
              onChange={(e) => setTemaAtual(e.target.value)}
              placeholder="DIGITE UM TEMA..."
              maxLength={35}
            />

            {/* Botão sem caixa, apenas com a imagem */}
            <button 
              className="tema-btn-random" 
              onClick={proximoTema}
              title="Trocar Sugestão"
            >
              <img src={trocarIcon} alt="Trocar Tema" className="tema-icon-img" />
            </button>
          </div>

          <span style={{ fontSize: '8px', color: '#777777', fontFamily: '"Press Start 2P", cursive', textAlign: 'center' }}>
            * TOQUE NO NOME PARA EDITAR
          </span>
        </div>

        {/* SELEÇÃO DOS JOGADORES PRESENTES */}
        <Jogadores
          jogadoresCadastrados={jogadoresCadastrados}
          ordem={ordemJogadores}
          selecionados={jogadoresSelecionados}
          onChangeOrdem={setOrdemJogadores}
          onToggleSelecionado={toggleJogador}
          titulo="QUEM VAI JOGAR?"
        />

      </div>

      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        <button className="game-card start-btn" onClick={iniciarPartida}>
          <h2>INICIAR PARTIDA</h2>
        </button>
        <button className="back-btn" onClick={() => setTelaAtual('home')}>VOLTAR</button>
      </div>

      {/* MODAL DE ALERTA */}
      {alerta && createPortal(
        <div className="modal-overlay">
          <div className="modal-box">
            <p style={{ color: '#ffcc00' }}>{alerta}</p>
            <button className="modal-btn btn-sim" onClick={() => setAlerta(null)}>OK</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default TierListRegras;