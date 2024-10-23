import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient"; // Ensure this points to your Supabase client setup
import bcrypt from "bcryptjs";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // on app load, check if there's a user session in local storage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      const now = new Date().getTime();
      const sessionDuration = now - storedUser.loginAt;

      // Check if session is still valid (1 day = 86400000 milliseconds)
      if (sessionDuration < 86400000) {
        setUser(storedUser);
      } else {
        // Session expired, clear local storage
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Signup function
  const signUp = async (name, email, password) => {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const { data, error } = await supabase
      .from("teachers")
      .insert([{ name, email, password_hash: hashedPassword }])
      .select(); // Add .select() to return the inserted data

    if (error) {
      throw new Error("Signup failed: " + error.message);
    }

    if (!data || data.length === 0) {
      throw new Error("No user data returned from signup.");
    }

    const userData = { ...data[0], loginAt: new Date().getTime() }; // Add loginAt here
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store session in localStorage
  };

  // Login function
  const signIn = async (email, password) => {
    const { data, error } = await supabase
      .from("teachers")
      .select("id, name, email, password_hash")
      .eq("email", email)
      .single(); // Using single to get one record

    if (error) {
      throw new Error("Login failed: " + error.message);
    }

    if (!data) {
      throw new Error("User not found.");
    }

    const isValidPassword = bcrypt.compareSync(password, data.password_hash);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      loginAt: new Date().getTime(), // Save timestamp of signIn
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store session in localStorage
  };

  // Reset password function
  const resetPassword = async (email, newPassword) => {
    const { data, error } = await supabase
      .from("teachers")
      .select("id")
      .eq("email", email)
      .single();

    if (error || !data) {
      throw new Error("User not found.");
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    const { error: updateError } = await supabase
      .from("teachers")
      .update({ password_hash: hashedPassword })
      .eq("id", data.id);

    if (updateError) {
      throw new Error("Failed to update password.");
    }

    return "Password has been reset successfully.";
  };

  // Logout function
  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, signUp, signIn, signOut, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
