import { useState } from "react";
import { Link, Element } from "react-scroll";
import { useAuth } from "../../context/AuthContext"; // Import the AuthContext
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LoginSignupSection = () => {
  const { signUp, signIn } = useAuth(); // Removed role
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formType, setFormType] = useState("login"); // Track whether the user is logging in or signing up
  const [submissionError, setSubmissionError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add simple validation
    if (!formData.email || !formData.password) {
      setSubmissionError("Please fill in all fields.");
      return;
    }
    setSubmissionError("");

    try {
      if (formType === "signup") {
        await signUp(formData.email, formData.password);
        navigate("/teacher"); // Redirect to the dashboard after signup
      } else {
        await signIn(formData.email, formData.password);
        navigate("/teacher"); // Redirect to the dashboard after login
      }
    } catch (err) {
      setSubmissionError(err.message);
    }
  };

  return (
    <Element name="login / sign up" className="py-24 bg-gray-100">
      <div id="login / signup" className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Login / Sign Up
        </h2>

        {/* Form Structure */}
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto transition-transform duration-300 ease-in-out">
          <h3 className="text-2xl font-semibold mb-4">
            {formType === "signup" ? "Sign Up" : "Login"}
          </h3>
          {submissionError && (
            <p className="text-red-500 mb-4">{submissionError}</p>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition duration-200"
            >
              {formType === "signup" ? "Sign Up" : "Login"}
            </button>
            {formType === "login" && (
              <Link to="#" className="block text-indigo-600 mt-4 hover:underline">
                Forgot Password?
              </Link>
            )}
            <button
              type="button"
              onClick={() =>
                setFormType((prev) => (prev === "login" ? "signup" : "login"))
              }
              className="block text-indigo-600 mt-2 hover:underline"
            >
              {formType === "login"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </form>
        </div>
      </div>
    </Element>
  );
};

export default LoginSignupSection;
