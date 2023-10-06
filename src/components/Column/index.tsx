import { useState, useMemo } from "react";
import { Column as ColumnType } from "../../types";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { deleteColumn, editColumn, addCard } from "../../redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import Card from "../Card";
import { AiFillPlusCircle as PlusIcon } from "react-icons/ai";

import "./styles.scss";

interface Props {
  column: ColumnType;
}

const Column = (props: Props) => {
  const { column } = props;
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const cards = useAppSelector((state) => state.board.cards);

  const cardIds = useMemo(() => {
    return cards.map((card) => card.id);
  }, [cards]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: isEditing,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div className="column column__dragging" ref={setNodeRef} style={style} />
    );
  }

  return (
    <div className="column" ref={setNodeRef} style={style}>
      <div
        className="column__header"
        onClick={() => setIsEditing(true)}
        {...attributes}
        {...listeners}
      >
        <div />
        <div className="column__title">
          {isEditing ? (
            <input
              onChange={(e) =>
                dispatch(editColumn({ id: column.id, title: e.target.value }))
              }
              value={column.title}
              autoFocus
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditing(false);
                }
              }}
            />
          ) : (
            column.title
          )}
        </div>
        <button onClick={() => dispatch(deleteColumn({ id: column.id }))}>
          <DeleteIcon />
        </button>
      </div>
      <div className="column__content">
        <SortableContext items={cardIds}>
          {cards
            .filter((card) => card.columnId === column.id)
            .map((card) => (
              <Card key={card.id} card={card} />
            ))}
        </SortableContext>
      </div>
      <button
        className="column__footer"
        onClick={() => dispatch(addCard({ columnId: column.id }))}
      >
        <PlusIcon /> Add task
      </button>
    </div>
  );
};

export default Column;
