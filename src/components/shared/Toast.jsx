function Toast({ message }) {
    return (
      <div className="toast">
        <div className="toast-icon">✓</div>
        <div>{message}</div>
      </div>
    );
  }
  
  export default Toast;