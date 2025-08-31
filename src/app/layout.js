// src/app/layout.js
import { AuthProvider } from "@/components/AuthContext";
import "@/styles/globals.css";

export const metadata = {
  title: "Rainbow Shop",          // Default tab title for all pages
  description: "Welcome to Rainbow Shop", // Default description
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
