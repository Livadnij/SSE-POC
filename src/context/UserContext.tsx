import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface UserContextType {
  username: string | null;
  setUsername: (name: string | null) => void;
}

// Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);

  // Load username from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Save username to localStorage when it changes
  const updateUsername = (name: string | null) => {
    if (name) {
      localStorage.setItem("username", name);
    } else {
      localStorage.removeItem("username");
    }
    setUsername(name);
  };

  return (
    <UserContext.Provider value={{ username, setUsername: updateUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to Use Context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
