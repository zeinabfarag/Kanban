import { useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { RootState } from "../../redux/store";
import { createPortal } from "react-dom";
import {
  addColumn,
  setActiveColumn,
  setColumns,
  setActiveCard,
  deactivate,
  moveCard,
} from "../../redux/boardSlice";
import Column from "../Column";
import Card from "../Card";
import { ImPlus as AddIcon } from "react-icons/im";
import {
  DndContext,
  DragStartEvent,
  DragOverlay,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

import "./styles.scss";

const Board = () => {
  const columns = useAppSelector((state: RootState) => state.board.columns);
  const cards = useAppSelector((state: RootState) => state.board.cards);

  const dispatch = useAppDispatch();

  const columnIds = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      dispatch(setActiveColumn({ id: event.active.id }));
      return;
    }

    if (event.active.data.current?.type === "Card") {
      dispatch(setActiveCard({ id: event.active.id }));
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    dispatch(deactivate());
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === active.id
      );
      const overColumnIndex = columns.findIndex((col) => col.id === over.id);
      const newColumns = arrayMove(columns, activeColumnIndex, overColumnIndex);
      dispatch(setColumns({ columns: newColumns }));
    }
  };
  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const isActiveACard = active.data.current?.type === "Card";
      const isOverACard = over.data.current?.type === "Card";

      if (!isActiveACard) return;

      if (isActiveACard && isOverACard) {
        const overIndex = cards.findIndex((card) => card.id === over.id);

        dispatch(
          moveCard({
            cardId: active.id,
            targetColumnId: over.data.current?.card?.columnId,
            targetIndex: overIndex,
          })
        );
      }
      const isOverAColumn = over.data.current?.type === "Column";

      if (isActiveACard && isOverAColumn) {
        dispatch(
          moveCard({
            cardId: active.id,
            targetColumnId: over.id,
            targetIndex: cards.findIndex((card) => card.id === over.id),
          })
        );
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const activeColumn = columns.find((col) => !!col.isActive);
  const activeCard = cards.find((card) => !!card.isActive);

  return (
    <div className="board">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="board__box">
          <div className="board__columns">
            <SortableContext items={columnIds}>
              {columns.map((column) => (
                <Column key={column.id} column={column} />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => dispatch(addColumn())}
            className="board__button"
          >
            <AddIcon /> Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && <Column column={activeColumn} />}
            {activeCard && <Card card={activeCard} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default Board;
