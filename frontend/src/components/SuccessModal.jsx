import "./SuccessModal.css";
import { FiCheckCircle } from "react-icons/fi";

function SuccessModal({
  isOpen,
  title,
  message,
  buttonText,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="success-overlay">

      <div className="success-modal">

        <div className="success-icon">
          <FiCheckCircle />
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <button
          className="success-btn"
          onClick={onClose}
        >
          {buttonText}
        </button>

      </div>

    </div>
  );
}

export default SuccessModal;
