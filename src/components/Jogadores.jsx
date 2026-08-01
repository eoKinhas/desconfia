import React from 'react';
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
        background: ativo ? 'rgba(0,204,255,0.1)' : 'rgba(255,255,255,0.05)',
        border: ativo ? '1px solid #00ccff' : '1px solid transparent',
        padding: '8px 12px',
        borderRadius: '8px',
        fontFamily: '"Press Start 2P", cursive',
    }}
    {...attributes}
    >
    <div
        onClick={() => onToggle(id)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, cursor: 'pointer' }}
    >
        <span style={{ fontSize: '10px', fontFamily: '"Press Start 2P", cursive' }}>
        {ativo ? `${index + 1}. ` : ''}{jogador?.avatar} {jogador?.nome}
        </span>
    </div>
    <span
        {...listeners}
        style={{ fontSize: '16px', color: '#888', padding: '4px 8px', touchAction: 'none', cursor: 'grab' }}
    >
        ≡
    </span>
    </div>
  );
}

function Jogadores({ jogadoresCadastrados, ordem, selecionados, onChangeOrdem, onToggleSelecionado, titulo = 'QUEM VAI JOGAR?' }) {
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

  return (
    <div className="game-status-box" style={{ padding: '16px', marginBottom: '16px', width: '100%' }}>
      <p className="status-text" style={{ marginBottom: '12px', color: '#fff' }}>{titulo}</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ordem} strategy={verticalListSortingStrategy}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(() => {
            const ordemAtivos = ordem.filter(id => selecionados.includes(id));
            return ordem.map((id) => {
                const jogador = jogadoresCadastrados.find(j => j.id === id);
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
            });
            })()}
        </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default Jogadores;