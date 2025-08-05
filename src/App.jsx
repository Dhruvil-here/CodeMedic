import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Editor from "@monaco-editor/react";
import Select, { useStateManager } from "react-select";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { PacmanLoader } from "react-spinners";
import { Pointer, TextCursor } from "lucide-react";

function App() {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };
  useEffect(() => {
    document.body.className = theme; // sets class="dark" or class="light"
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
      width: "200%",
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

  const [code, setCode] = useState("");

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyDsXVaOlB6dETIGx5tGJeO_rQWQ0RaJ1U8",
  });

  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState("");

  async function reviewCode() {
    setResponse("");
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I’m sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

1️⃣ A quality rating: Better, Good, Normal, or Bad.
2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.
3️⃣ A clear explanation of what the code does, step by step.
4️⃣ A list of any potential bugs or logical errors, if found.
5️⃣ Identification of syntax errors or runtime errors, if present.
6️⃣ Solutions and recommendations on how to fix each identified issue. {in the best possible syntax and proper gaps in between }

Analyze it like a senior developer reviewing a pull request.

Code: ${code}`,
    });
    setResponse(response.text);
    setLoading(false);
  }

  async function fixCode() {
    setResponse("");
    setLoading(true);
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
    setResponse(response.text);
    setLoading(false);
  }

  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <>
      <Navbar toggleTheme={toggleTheme} currentTheme={theme} />
      <div className="main">
        <div className="left">
          <div className="tabs">
            <Select
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e);
              }}
              options={options}
              styles={darkStyles}
            />
            <div className="btn">
              <button
                onClick={() => {
                  if (code === "") {
                    alert("Please enter the code first!");
                  } else {
                    fixCode();
                  }
                }}
                className="btnNormal"
              >
                Fix Code
              </button>
              <button
                onClick={() => {
                  if (code === "") {
                    alert("Please enter the code first!");
                  } else {
                    reviewCode();
                  }
                }}
                className="btnNormal"
              >
                Review
              </button>
            </div>
          </div>
          <Editor
            height="100%"
            theme={theme === "dark" ? "vs-dark" : "light"}
            language={selectedOption.value}
            value={code}
            onChange={(e) => {
              setCode(e);
            }}
          />
          ;
        </div>

        <div className="right">
          <div className="topTab">
            <p>Response</p>
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
