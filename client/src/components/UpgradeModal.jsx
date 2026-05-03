function UpgradeModal({ show, onClose }) {
  if (!show) return null;

  const handleUpgrade = () => {
    // 💰 Simulate payment success
    localStorage.setItem("isPremiumUser", "true");

    alert("🎉 Payment Successful! Premium Unlocked.");

    onClose();
    window.location.reload(); // refresh UI
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      
      <div style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        width: "300px",
        textAlign: "center"
      }}>
        
        <h2>💰 Upgrade to Premium</h2>

        <p>Unlock all levels and practice without limits.</p>

        <h3 style={{ color: "#4CAF50" }}>₹99/month</h3>

        <button
          style={{
            padding: "10px",
            width: "100%",
            marginTop: "10px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px"
          }}
          onClick={handleUpgrade}
        >
          Upgrade Now
        </button>

        <button
          style={{
            marginTop: "10px",
            background: "none",
            border: "none",
            color: "gray",
            cursor: "pointer"
          }}
          onClick={onClose}
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

export default UpgradeModal;