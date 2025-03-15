// components/UsernamePopup.tsx

import { useState, useEffect } from "react";

const UsernamePopup = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // Check if the username is already in localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setIsPopupVisible(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSaveUsername = () => {
    localStorage.setItem("username", username);
    setIsPopupVisible(false);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
      {isPopupVisible && (
        <div style={popupStyle}>
          <div style={popupContentStyle}>
            <h3>Set Username</h3>
            <input
              type="text"
              value={username}
              onChange={handleInputChange}
              style={inputStyle}
            />
            <button onClick={handleSaveUsername} style={buttonStyle}>
              Save
            </button>
            <button onClick={handleClosePopup} style={buttonStyle}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const popupStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popupContentStyle: React.CSSProperties = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  width: "300px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px",
  margin: "5px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "white",
};

export default UsernamePopup;
