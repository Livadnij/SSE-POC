import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ width: "500px", justifySelf: "center" }}>{children}</div>
  );
};

export default Layout;
