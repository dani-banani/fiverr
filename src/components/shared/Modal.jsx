function Modal({ open, onClose, title, children }) {
    if (!open) return null;
  
    return (
      <div className="modal-overlay open">
        <div className="modal">
          <div className="modal-head">
            <h2>{title}</h2>
  
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
  
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  }
  
  export default Modal;