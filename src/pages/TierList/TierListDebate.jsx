import { useState, useEffect } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const getItemId = (s) => (s.jogadorId ? String(s.jogadorId) : s.sugestaoTexto);

function ItemPendente({ s, id, isSelected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { sugestao: s },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 100 : undefined,
    position: isDragging ? 'relative' : undefined,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`tier-input-box tier-item-pendente ${isSelected ? 'selecionado' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(s);
      }}
    >
      {s.sugestaoTexto}
    </div>
  );
}

function ItemTier({ s, id, isSelected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { sugestao: s },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 100 : undefined,
    position: isDragging ? 'relative' : undefined,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`tier-item ${isSelected ? 'selecionado' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(s);
      }}
    >
      {s.sugestaoTexto}
    </div>
  );
}

function DroppableTierRow({ rank, itemSelecionado, onMoverParaRank, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: rank,
  });

  return (
    <div
      ref={setNodeRef}
      className={`tier-row rank-${rank} ${itemSelecionado ? 'pulsar-alvo' : ''}`}
      onClick={() => onMoverParaRank(rank)}
      style={{
        filter: isOver ? 'brightness(1.2)' : 'none',
        transition: 'filter 0.15s ease',
      }}
    >
      <div className="tier-row-label">{rank}</div>
      <div className="tier-row-content">
        {children}
      </div>
    </div>
  );
}

function DroppablePendentesArea({ itemSelecionado, onMoverParaRank, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'pendentes',
  });

  return (
    <div
      ref={setNodeRef}
      onClick={() => {
        if (itemSelecionado && itemSelecionado.rankAtual !== null) {
          onMoverParaRank(null);
        }
      }}
      style={{
        marginTop: '32px',
        width: '100%',
        filter: isOver ? 'brightness(1.2)' : 'none',
        transition: 'filter 0.15s ease',
      }}
    >
      <p style={{ fontSize: '13px', color: '#ffcc00', fontFamily: '"Press Start 2P", cursive', textAlign: 'center', marginBottom: '16px' }}>
        SUGESTÕES DA RODA:
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%' }}>
        {children}
      </div>
    </div>
  );
}

function TierListDebate({ setTelaAtual }) {
  const [setup] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tierlist_setup_atual')) || {};
    } catch {
      return {};
    }
  });
  const [sugestoes, setSugestoes] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  useEffect(() => {
    const salvas = JSON.parse(localStorage.getItem('tierlist_sugestoes')) || [];
    const sugestoesIniciais = salvas.map(s => ({ ...s, rankAtual: null }));
    setSugestoes(sugestoesIniciais);
  }, []);

  const selecionarItem = (sugestao) => {
    const idS = getItemId(sugestao);
    const idSel = itemSelecionado ? getItemId(itemSelecionado) : null;
    if (idSel === idS) {
      setItemSelecionado(null);
    } else {
      setItemSelecionado(sugestao);
    }
  };

  const moverParaRank = (rank) => {
    if (!itemSelecionado) return;

    setSugestoes(prev =>
      prev.map(s => {
        const idAtual = getItemId(s);
        const idSel = getItemId(itemSelecionado);
        return idAtual === idSel ? { ...s, rankAtual: rank } : s;
      })
    );
    setItemSelecionado(null); 
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const rankDestino = over.id === 'pendentes' ? null : over.id;

    setSugestoes(prev =>
      prev.map(s => {
        const idAtual = getItemId(s);
        return idAtual === active.id ? { ...s, rankAtual: rankDestino } : s;
      })
    );
    setItemSelecionado(null);
  };

  const detectarColisao = (args) => {
    const pointer = pointerWithin(args);
    if (pointer.length > 0) return pointer;
    return rectIntersection(args);
  };

  const ranks = ['S', 'A', 'B', 'C', 'F'];
  const sugestoesPendentes = sugestoes.filter(s => s.rankAtual === null);
  const todasPosicionadas = sugestoesPendentes.length === 0;

  return (
    <div className="rules-screen page-transition" style={{ height: '100%', paddingBottom: '0' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '16px' }}>

        <div style={{ textAlign: 'center', marginBottom: '16px', marginTop: '8px' }}>
          <h1 className="reveal-text" style={{ fontSize: '20px', color: '#ff5500' }}>DEBATE</h1>
          <p style={{ fontSize: '10px', color: '#888', fontFamily: '"Press Start 2P", cursive', marginTop: '12px', lineHeight: '1.4' }}>
            {itemSelecionado ? 'TOQUE NA LINHA DE DESTINO' : 'ARRASTE OU TOQUE EM UM ITEM PARA MOVER'}
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={detectarColisao}
          onDragEnd={handleDragEnd}
        >
          {/* GRADE DA TIER LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {ranks.map(rank => (
              <DroppableTierRow
                key={rank}
                rank={rank}
                itemSelecionado={itemSelecionado}
                onMoverParaRank={moverParaRank}
              >
                {sugestoes.filter(s => s.rankAtual === rank).map(s => {
                  const id = getItemId(s);
                  const isSelected = itemSelecionado && getItemId(itemSelecionado) === id;
                  return (
                    <ItemTier
                      key={id}
                      id={id}
                      s={s}
                      isSelected={isSelected}
                      onSelect={selecionarItem}
                    />
                  );
                })}
              </DroppableTierRow>
            ))}
          </div>

          <DroppablePendentesArea
            itemSelecionado={itemSelecionado}
            onMoverParaRank={moverParaRank}
          >
            {sugestoesPendentes.map(s => {
              const id = getItemId(s);
              const isSelected = itemSelecionado && getItemId(itemSelecionado) === id;
              return (
                <ItemPendente
                  key={id}
                  id={id}
                  s={s}
                  isSelected={isSelected}
                  onSelect={selecionarItem}
                />
              );
            })}
          </DroppablePendentesArea>
        </DndContext>

      </div>

      {/* BOTÃO PARA A PRÓXIMA FASE */}
      <div className="action-buttons" style={{ marginTop: 'auto', paddingBottom: '24px', width: '100%' }}>
        <button
          className="game-card start-btn"
          disabled={!todasPosicionadas}
          onClick={() => {
            localStorage.setItem('tierlist_debate_final', JSON.stringify(sugestoes));
            if (setup?.modo === 'twist') {
              setTelaAtual('tierlist-twist');
            } else {
              localStorage.setItem('tierlist_twist_final', JSON.stringify(sugestoes));
              setTelaAtual('tierlist-resultado');
            }
          }}
          style={{
            backgroundColor: todasPosicionadas ? '#ffcc00' : '#555555',
            opacity: todasPosicionadas ? 1 : 0.5,
            transition: 'all 0.3s'
          }}
        >
          <h2 style={{ color: '#ffffff', fontSize: '14px' }}>
            {setup?.modo === 'twist' ? 'IR PARA O TWIST' : 'REVELAR RESULTADO'}
          </h2>
        </button>
      </div>
    </div>
  );
}

export default TierListDebate;