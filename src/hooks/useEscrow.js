function useEscrow() {
    const releasePayment = () => {
      console.log("Payment Released");
    };
  
    return { releasePayment };
  }
  
  export default useEscrow;