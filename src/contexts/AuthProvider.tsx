import React, { useEffect, useState } from "react";
import { supabase } from "../utilities/supabaseClient";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription?.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
