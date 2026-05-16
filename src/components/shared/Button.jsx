function Button({ children, variant = "primary", small, full, ...props }) {
    return (
      <button
        className={`btn btn-${variant} ${small ? "btn-sm" : ""} ${
          full ? "btn-full" : ""
        }`}
        {...props}
      >
        {children}
      </button>
    );
  }
  
  export default Button;