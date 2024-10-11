import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient"; // Ensure this points to your Supabase client setup

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // handle auth state changes
  useEffect(() => {
    const session = supabase.auth.getSession();
    setSession(session);
    setLoading(false);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Signup function and i used smtp mail for sending mail
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  // Login function
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Signout function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error;
    setSession(null);
  };

  // Context value
  const value = {
    session,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
