import { FiBarChart2 } from "react-icons/fi";
import "./EmptyState.css";

export default function EmptyState({
  title,
  description,
  action,
}) {
  return (
    <div className="empty-state">

      <div className="empty-icon">
        <FiBarChart2 />
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      {action}

    </div>
  );
}