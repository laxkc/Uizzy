import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";
import supabase from "../services/supabaseClient.js";

// const supabase = createClient(
//   "http://localhost:8000",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE"
// );

const Test = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data, error } = await supabase.from("teachers").select("*");
        if (error) {
          throw error;
        }
        setTeachers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Teachers</h1>
      <ul>
        {teachers.map((teacher) => (
          <div key={teacher.id}>
            <li>{teacher.name}</li>
            <li>{teacher.email}</li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Test;