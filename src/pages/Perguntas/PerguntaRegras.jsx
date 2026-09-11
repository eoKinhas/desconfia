import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import logoImg from '../../assets/logo.png';
import { bancoDeDuvidas } from '../../data/duvidasImpostor';
import Jogadores from '../../components/Jogadores';

// Puxa todos os temas únicos do banco de dados
const temasDisponiveis = [...new Set(bancoDeDuvidas.map(item => item.tema))];

function PerguntaRegras({ setTelaAtual }) {
  const [qtdImpostores, setQtdImpostores] = useState(1);
  const [jogadoresCadastrados, setJogadoresCadastrados] = useState([]);
  const [jogadoresSelecionados, setJogadoresSelecionados] = useState([]);
  const [temasSelecionados, setTemasSelecionados] = useState(temasDisponiveis);
  const [alerta, setAlerta] = useState(null);
  const [ordemJogadores, setOrdemJogadores] = useState([]);

  useEffect(() => {
    // Carrega todos os jogadores válidos cadastrados no app
    const jogadoresSalvos = localStorage.getItem('desconfia_jogadores');
    let listaCadastrados = [];
    if (jogadoresSalvos) {
      try {
        listaCadastrados = JSON.parse(jogadoresSalvos);
      } catch (e) {
        listaCadastrados = [];
      }
    }
    setJogadoresCadastrados(listaCadastrados);

    const idsValidos = new Set(listaCadastrados.map(j => j.id));

    // Busca as configurações da última partida de Dúvida
    const setupSalvo = localStorage.getItem('duvida_setup_atual');
    if (setupSalvo) {
      try {
        const setup = JSON.parse(setupSalvo);

        const selecionadosLimpos = (setup.jogadores || []).filter(id => idsValidos.has(id));
        setJogadoresSelecionados(selecionadosLimpos);

        setQtdImpostores(setup.impostores || 1);

        // Valida se os temas salvos realmente existem no banco atual
        const temasValidos = (setup.temas || []).filter(t => temasDisponiveis.includes(t));
        if (temasValidos.length > 0) {
          setTemasSelecionados(temasValidos);
        } else {
          setTemasSelecionados(temasDisponiveis); // Se não houver válidos, seleciona todos por padrão
        }

        const ordemSalvaLimpa = (setup.ordem || []).filter(id => idsValidos.has(id));
        const idsJaNaOrdem = new Set(ordemSalvaLimpa);
        const novosJogadores = listaCadastrados
          .map(j => j.id)
          .filter(id => !idsJaNaOrdem.has(id));

        setOrdemJogadores([...ordemSalvaLimpa, ...novosJogadores]);
      } catch (e) {
        setJogadoresSelecionados([]);
        setTemasSelecionados(temasDisponiveis);
        setOrdemJogadores(listaCadastrados.map(j => j.id));
      }
    } else {
      setJogadoresSelecionados([]);
      setTemasSelecionados(temasDisponiveis);
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

  const toggleTema = (tema) => {
    // Usa o estado funcional para garantir leitura em tempo real
    setTemasSelecionados((prevTemas) => {
      const jaSelecionado = prevTemas.includes(tema);
      
      if (jaSelecionado) {
        // Se for o ÚLTIMO tema restante, bloqueia a desmarcação
        if (prevTemas.length <= 1) {
          setAlerta("PELO MENOS UM TEMA DEVE FICAR SELECIONADO!");
          return prevTemas;
        }
        return prevTemas.filter(t => t !== tema);
      } else {
        return [...prevTemas, tema];
      }
    });
  };

  const aumentarImpostores = () => {
    if (jogadoresSelecionados.length < 3) {
      setAlerta("SELECIONE QUEM VAI JOGAR PRIMEIRO (MÍNIMO 3)!");
      return;
    }
    const maxImpostores = Math.floor(jogadoresSelecionados.length / 2);
    if (qtdImpostores < maxImpostores) {
      setQtdImpostores(qtdImpostores + 1);
    } else {
      setAlerta(`PARA ${jogadoresSelecionados.length} JOGADORES, O LIMITE É DE ${maxImpostores} INFILTRADO(S).`);
    }
  };

    const iniciarPartida = () => {
    // Filtra apenas temas válidos antes de validar o tamanho
    const temasValidos = temasSelecionados.filter(t => temasDisponiveis.includes(t));

    if (!temasValidos || temasValidos.length === 0) {
      setAlerta("SELECIONE PELO MENOS UM TEMA PARA JOGAR!");
      return;
    }

    if (jogadoresSelecionados.length < 3) {
      setAlerta("SELECIONE PELO MENOS 3 JOGADORES!");
      return;
    }
    
    const maxImpostores = Math.floor(jogadoresSelecionados.length / 2);
    if (qtdImpostores > maxImpostores) {
      setAlerta(`O NÚMERO DE INFILTRADOS DEVE SER NO MÁXIMO A METADE DOS JOGADORES (${maxImpostores}).`);
      return;
    }
    
    const setupPartida = {
      jogadores: jogadoresSelecionados,
      ordem: ordemJogadores,
      impostores: qtdImpostores,
      temas: temasValidos
    };
    
    localStorage.setItem('duvida_setup_atual', JSON.stringify(setupPartida));
    setTelaAtual('duvida-jogo');
  };

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '16px', gap: '24px' }}>
        
        <img src={logoImg} alt="Logo Desconfia" className="app-logo-small" />
        <h1 className="reveal-text" style={{ fontSize: '35px', color: '#9d00ff', fontFamily: '"Press Start 2P", cursive', marginBottom: '2px' }}>PERGUNTAS</h1>

        {/* CAIXA DE REGRAS DO NOVO JOGO */}
        <div className="rules-box" style={{ width: '100%' }}>
          <p><strong>REGRAS:</strong></p>
          <p>Todos receberão a mesma pergunta, exceto o(s) infiltrado(s), que receberão uma pergunta maluca!</p>
          <p>Cada um responde em voz alta.</p>
          <p>A pergunta original é revelada e vocês devem votar em quem deu a resposta mais suspeita!</p>
        </div>

        <div className="game-status-box" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div>
             <p className="status-text" style={{ marginBottom: '8px', color: '#fff' }}>QTD. INFILTRADOS:</p>
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                <button className="toggle-btn" style={{ width: '40px' }} onClick={() => setQtdImpostores(Math.max(1, qtdImpostores - 1))}>-</button>
                <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '16px', color: '#00ccff' }}>{qtdImpostores}</span>
                <button className="toggle-btn" style={{ width: '40px' }} onClick={aumentarImpostores}>+</button>
             </div>
          </div>
        </div>

        {/* SELEÇÃO DE TEMAS */}
        <div className="game-status-box" style={{ padding: '16px', width: '100%' }}>
          <p className="status-text" style={{ marginBottom: '12px', color: '#fff' }}>TEMAS DA PARTIDA:</p>
          <div className="avatar-selector" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {temasDisponiveis.map(tema => {
              const selecionado = temasSelecionados.includes(tema);
              return (
                <div 
                  key={tema} 
                  className={`player-chip ${selecionado ? 'selecionado' : ''}`}
                  onClick={() => toggleTema(tema)}
                  style={{ padding: '8px 12px', borderRadius: '8px', height: 'auto', flexDirection: 'row' }}
                >
                  <span style={{ fontSize: '10px' }}>{tema.toUpperCase()}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Jogadores
          jogadoresCadastrados={jogadoresCadastrados}
          ordem={ordemJogadores}
          selecionados={jogadoresSelecionados}
          onChangeOrdem={setOrdemJogadores}
          onToggleSelecionado={toggleJogador}
          onAbrirConfig={() => {
            localStorage.setItem('duvida_setup_atual', JSON.stringify({
              jogadores: jogadoresSelecionados,
              ordem: ordemJogadores,
              impostores: qtdImpostores,
              temas: temasSelecionados
            }));
            setTelaAtual('configuracoes');
          }}
          titulo="QUEM VAI JOGAR?"
        />

      </div>

      {/* RODAPÉ FIXO */}
      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        <button className="game-card start-btn" onClick={iniciarPartida}>
          <h2>INICIAR PARTIDA</h2>
        </button>
        <button className="back-btn" onClick={() => setTelaAtual('home')}>VOLTAR</button>
      </div>

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

export default PerguntaRegras;