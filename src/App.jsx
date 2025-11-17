import React, { useState, useEffect } from "react"; // Importing React with hooks useState & useEffect
import "./App.css"; // Importing stylesheet for App component
import Navbar from "./Components/Navbar"; // Navbar component
import Editor from "@monaco-editor/react"; // Monaco Editor for code editing
import Select, { useStateManager } from "react-select"; // Dropdown menu for language selection
import { GoogleGenAI } from "@google/genai"; // Google GenAI API client for AI-powered code review/fix
import ReactMarkdown from "react-markdown"; // To render AI response in markdown format
import { PacmanLoader } from "react-spinners"; // Loading spinner while waiting for AI response
import ParticlesBackground from "./Components/ParticlesBackground"; // Animated particle background

function App() {
  const [theme, setTheme] = useState("dark"); // State for current theme (dark/light)

  const toggleTheme = () => {
    // Function to toggle theme
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  useEffect(() => {
    document.body.className = theme; // Apply theme as body class whenever it changes
  }, [theme]);

  // Language options for dropdown menu
  const options = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "ruby", label: "Ruby" },
    { value: "php", label: "PHP" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "rust", label: "Rust" },
    { value: "dart", label: "Dart" },
    { value: "scala", label: "Scala" },
    { value: "r", label: "R" },
    { value: "perl", label: "Perl" },
    { value: "haskell", label: "Haskell" },
    { value: "elixir", label: "Elixir" },
    { value: "clojure", label: "Clojure" },
    { value: "shell", label: "Shell" },
  ];

  // Custom styling for dropdown (dark mode theme)
  const darkStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#1f1f1f",
      borderColor: state.isFocused ? "#4a90e2" : "#1f1f1f",
      boxShadow: state.isFocused ? "0 0 0 1px #4a90e2" : "none",
      "&:hover": {
        borderColor: "#4a90e2",
      },
      color: "#fff",
      width: "200%",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#2c2c2c",
      color: "#fff",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#444" : "#2c2c2c",
      color: state.isSelected ? "#4a90e2" : "#fff",
      "&:active": {
        backgroundColor: "#555",
      },
      width: "100%",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
      width: "100%",
    }),
    input: (base) => ({
      ...base,
      color: "#fff",
      width: "100%",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#aaa",
      width: "100%",
    }),
  };

  const [code, setCode] = useState(""); // State to store user-entered code

  const ai = new GoogleGenAI({
    apiKey: "YOUR_API_KEY_HERE", // Google GenAI API key
  });

  const [loading, setLoading] = useState(false); // State for loader
  const [response, setResponse] = useState(""); // State to store AI-generated response

  // Function to review code using AI
  async function reviewCode() {
    setResponse(""); // Reset previous response
    setLoading(true); // Show loader
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I’m sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

1️⃣ A quality rating: Bad, Good, Better and Best.
2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.
3️⃣ A clear explanation of what the code does, step by step.
4️⃣ A list of any potential bugs or logical errors, if found.
5️⃣ Identification of syntax errors or runtime errors, if present.
6️⃣ Solutions and recommendations on how to fix each identified issue. {in the best possible syntax and proper gaps in between }

Analyze it like a senior developer reviewing a pull request.

Code: ${code}`,
    });
    setResponse(response.text); // Store AI response
    setLoading(false); // Hide loader
  }

  // Function to fix code using AI
  async function fixCode() {
    setResponse(""); // Reset response
    setLoading(true); // Show loader
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a senior software engineer. 
I will give you some code written in ${selectedOption.value}. 
Please do the following:
1. Fix all syntax, logical, or runtime errors.
2. Optimize the code for performance and readability.
3. Return the improved and working version of the code only — no explanations.

Code:
${code}`,
    });
    setResponse(response.text); // Store AI response
    setLoading(false); // Hide loader
  }

  const [selectedOption, setSelectedOption] = useState(
    options[0] ?? { value: "javascript", label: "JavaScript" } // Default selected language is JavaScript
  );

  return (
    <>
      <Navbar toggleTheme={toggleTheme} currentTheme={theme} />{" "}
      {/* Navbar with theme toggle */}
      <ParticlesBackground theme={theme} /> {/* Background effect */}
      <div className="main">
        <div className="left">
          <div className="tabs">
            <Select
              value={selectedOption} // Current selected language
              onChange={(e) => {
                setSelectedOption(e); // Update language
              }}
              options={options} // All available languages
              styles={darkStyles} // Dark mode styles
            />
            <div className="btn">
              <button
                onClick={() => {
                  if (code === "") {
                    alert("Please enter the code first!"); // Alert if no code entered
                  } else {
                    fixCode(); // Call AI fix function
                  }
                }}
                className="btnNormal"
              >
                Fix Code
              </button>
              <button
                onClick={() => {
                  if (code === "") {
                    alert("Please enter the code first!"); // Alert if no code entered
                  } else {
                    reviewCode(); // Call AI review function
                  }
                }}
                className="btnNormal"
              >
                Review
              </button>
            </div>
          </div>

          <Editor
            className="editor"
            height="75vh" // Editor height
            theme={theme === "dark" ? "vs-dark" : "light"} // Sync editor with app theme
            language={selectedOption.value} // Editor language (from dropdown)
            value={code} // User code
            onChange={(e) => {
              setCode(e); // Update code state
            }}
            options={{
              fontFamily: "Fira Code, Consolas, 'Courier New', monospace", // Font for editor
              fontLigatures: true,
              fontSize: 16,
              suggest: {
                maxVisibleSuggestions: 80,
              },
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
              wordBasedSuggestions: true,
              renderLineHighlight: "all",
              renderWhitespace: "all",
              minimap: { enabled: false }, // Disable minimap
              fixedOverflowWidgets: true, // Fix rendering issue
            }}
          />
        </div>

        <div className="right">
          <div className="topTab">
            <p>Response :</p> {/* Response section */}
          </div>
          {loading && ( // Show loader while AI processes
            <PacmanLoader
              size={20}
              color={theme === "dark" ? "#ffffffff" : "#000000ff"}
            />
          )}
          <ReactMarkdown>{response}</ReactMarkdown> {/* Render AI response */}
        </div>
      </div>
    </>
  );
}

export default App; // Export App component
