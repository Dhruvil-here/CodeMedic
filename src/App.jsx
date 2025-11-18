import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import ReactMarkdown from "react-markdown";
import { PacmanLoader } from "react-spinners";
import ParticlesBackground from "./Components/ParticlesBackground";

function App() {
  const [theme, setTheme] = useState("dark");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

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
      "&:active": { backgroundColor: "#555" },
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

  const [selectedOption, setSelectedOption] = useState(
    options[0] || { value: "javascript", label: "JavaScript" }
  );

  // ===========================
  // 🔥 REVIEW CODE (OpenAI Backend)
  // ===========================
  async function reviewCode() {
    if (!code.trim()) {
      alert("Please enter the code first!");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: selectedOption.value,
        }),
      });

      const data = await res.json();
      setResponse(data.text || "No response from server.");
    } catch (err) {
      console.error(err);
      setResponse("Error: Could not connect to backend.");
    }

    setLoading(false);
  }

  // ===========================
  // 🔥 FIX CODE (OpenAI Backend)
  // ===========================
  async function fixCode() {
    if (!code.trim()) {
      alert("Please enter the code first!");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: selectedOption.value,
        }),
      });

      const data = await res.json();
      setResponse(data.text || "No response from server.");
    } catch (err) {
      console.error(err);
      setResponse("Error: Could not connect to backend.");
    }

    setLoading(false);
  }

  return (
    <>
      <Navbar toggleTheme={toggleTheme} currentTheme={theme} />
      <ParticlesBackground theme={theme} />
      <div className="main">
        <div className="left">
          <div className="tabs">
            <Select
              value={selectedOption}
              onChange={setSelectedOption}
              options={options}
              styles={darkStyles}
            />
            <div className="btn">
              <button
                onClick={fixCode}
                className="btnNormal"
              >
                Fix Code
              </button>
              <button
                onClick={reviewCode}
                className="btnNormal"
              >
                Review
              </button>
            </div>
          </div>

          <Editor
            className="editor"
            height="75vh"
            theme={theme === "dark" ? "vs-dark" : "light"}
            language={selectedOption.value}
            value={code}
            onChange={setCode}
            options={{
              fontFamily: "Fira Code, Consolas, 'Courier New', monospace",
              fontLigatures: true,
              fontSize: 16,
              minimap: { enabled: false },
              renderLineHighlight: "all",
              quickSuggestions: true,
            }}
          />
        </div>

        <div className="right">
          <div className="topTab">
            <p>Response :</p>
          </div>
          {loading && (
            <PacmanLoader
              size={20}
              color={theme === "dark" ? "#ffffffff" : "#000000ff"}
            />
          )}
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      </div>
    </>
  );
}

export default App;
