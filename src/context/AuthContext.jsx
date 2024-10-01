import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient"; // Ensure this points to your Supabase client setup

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // State to hold the user's role
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to the authentication state change
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(false);

        if (session?.user) {
          await fetchUserRole(session.user.id);
        }
      }
    );

    // Check for existing session on component mount
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        await fetchUserRole(session.user.id);
      }
      setLoading(false);
    };

    checkSession();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchUserRole = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setRole(data.role);
  };

  const signUp = async (email, password, name, role) => {
    const { user, session, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw new Error(error.message);

    // Insert the user info into the users table
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ id: user.id, email, name, role }]);

    if (insertError) throw new Error(insertError.message);

    setUser(user);
    setRole(role);
  };

  const signIn = async (email, password) => {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    await fetchUserRole(user.id);
    setUser(user);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, role, loading, error, signUp, signIn, signOut }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
