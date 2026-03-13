import React from "react";
import { Paste } from "../lib/types";

interface PasteListProps {
  pastes: Paste[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const PasteList: React.FC<PasteListProps> = ({ pastes, onEdit, onDelete }) => {
  return (
    <div className="paste-list">
      {pastes.length === 0 ? (
        <p>No pastes available.</p>
      ) : (
        <ul>
          {pastes.map((paste) => (
            <li key={paste.id} className={`paste-item ${paste.visibility}`}>
              <h3>{paste.title}</h3>
              <p>{paste.content}</p>
              <div className="paste-actions">
                {onEdit ? <button onClick={() => onEdit(paste.id)}>Edit</button> : null}
                {onDelete ? <button onClick={() => onDelete(paste.id)}>Delete</button> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasteList;
