import { useState } from "react";
import { Card as CardType } from "../../types";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { useAppDispatch } from "../../hooks";
import { deleteCard, editCard } from "../../redux/boardSlice";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./styles.scss";

interface Props {
  card: CardType;
}

const Card = (props: Props) => {
  const { card } = props;
  const [hover, setHover] = useState(false);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setHover(false);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
    disabled: isEditing,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div className="card card__dragging" ref={setNodeRef} style={style} />
    );
  }

  if (isEditing) {
    return (
      <div
        className="card"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <textarea
          autoFocus
          value={card.text}
          placeholder="Task content here"
          onChange={(e) =>
            dispatch(
              editCard({
                id: card.id,
                text: e.target.value,
              })
            )
          }
          onBlur={toggleEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              toggleEdit();
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="card"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setIsEditing(true)}
    >
      {card.text}
      {hover && (
        <button
          className="card__delete"
          onClick={() => dispatch(deleteCard({ id: card.id }))}
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};

export default Card;
