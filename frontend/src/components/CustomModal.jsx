import "./CustomModal.css";

function CustomModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  danger = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="modal-buttons">

          <button
            className="cancel-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className={
              danger
                ? "danger-button"
                : "success-button"
            }
            onClick={onConfirm}
          >
            {confirmText}
          </button>

        </div>

      </div>
    </div>
  );
}

export default CustomModal;
