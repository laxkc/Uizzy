import React from "react";
import { Outlet } from "react-router-dom";
import supabase from "../services/supabaseClient";

// get all quiz data from supabase
const GetAllQuiz = async () => {
  const { data, error } = await supabase.from("quizzes").select("*");
  if (error) {
    console.log("Error fetching quiz data");
  }
  return data;
};

export default GetAllQuiz;
