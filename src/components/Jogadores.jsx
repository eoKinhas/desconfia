import React from 'react';
import configIcon from '../assets/configuracoes-icon.png';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function ItemArrastavel({ id, jogador, index, ativo, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : (ativo ? 1 : 0.4),
  };

  return (
     <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: ativo ? 'rgba(0, 204, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
        border: ativo ? '3px solid #00ccff' : '3px solid #2a2a2a',
        borderRadius: '0px',
        padding: '10px 12px',
        fontFamily: '"Press Start 2P", cursive',
      }}
      {...attributes}
    >
      <div
        onClick={() => onToggle(id)}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }}
      >
        {ativo && (
          <span style={{ fontSize: '11px', color: '#00ccff', minWidth: '18px' }}>
            {index + 1}.
          </span>
        )}

        <span style={{ 
          fontSize: '24px', 
          lineHeight: 1, 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transform: 'translateY(-6px)'
        }}>
          {jogador?.avatar}
        </span>

        <span style={{ fontSize: '13px', color: '#ffffff', wordBreak: 'break-word' }}>
          {jogador?.nome}
        </span>
      </div>

      {/* ÍCONE DE ARRASTAR */}
      <span
        {...listeners}
        style={{ fontSize: '20px', color: '#888', padding: '4px 8px', touchAction: 'none', cursor: 'grab' }}
      >
        ≡
      </span>
    </div>
  );
}

function Jogadores({ 
  jogadoresCadastrados = [], 
  ordem = [], 
  selecionados = [], 
  onChangeOrdem, 
  onToggleSelecionado, 
  onAbrirConfig,
  titulo = 'QUEM VAI JOGAR?' 
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  if (!ordem || ordem.length === 0) return null;

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ordem.indexOf(active.id);
    const newIndex = ordem.indexOf(over.id);
    onChangeOrdem(arrayMove(ordem, oldIndex, newIndex));
  };

  // Filtra apenas os IDs que realmente existem entre os cadastrados
  const idsCadastrados = new Set(jogadoresCadastrados.map(j => j.id));
  const ordemValida = ordem.filter(id => idsCadastrados.has(id));
  const ordemAtivos = ordemValida.filter(id => selecionados.includes(id));

  return (
    <div className="game-status-box" style={{ padding: '16px', marginBottom: '16px', width: '100%' }}>
      {/* CABEÇALHO COM TÍTULO E BOTÃO DE CONFIGURAÇÃO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <p className="status-text" style={{ color: '#fff', margin: 0 }}>{titulo}</p>
        {onAbrirConfig && (
          <button 
            type="button"
            onClick={onAbrirConfig}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              outline: 'none'
            }}
          >
            <img 
              src={configIcon} 
              alt="Cadastrar Jogadores" 
              style={{ width: '24px', height: '24px', objectFit: 'contain', imageRendering: 'pixelated' }} 
            />
          </button>
        )}
      </div>

      {/* LISTA ARRASTÁVEL DE JOGADORES OU AVISO SE VAZIO */}
      {jogadoresCadastrados.length === 0 ? (
        <p style={{ color: '#888', fontSize: '10px', textAlign: 'center', fontFamily: '"Press Start 2P", cursive', lineHeight: '1.6' }}>
          NENHUM JOGADOR CADASTRADO.<br />TOQUE NA ENGRENAGEM PARA CADASTRAR!
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ordemValida} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ordemValida.map((id) => {
                const jogador = jogadoresCadastrados.find(j => j.id === id);
                if (!jogador) return null;

                const ativo = selecionados.includes(id);
                const indexAtivo = ordemAtivos.indexOf(id);

                return (
                  <ItemArrastavel
                    key={id}
                    id={id}
                    jogador={jogador}
                    index={indexAtivo}
                    ativo={ativo}
                    onToggle={onToggleSelecionado}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

export default Jogadores;