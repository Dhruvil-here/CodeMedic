import React from 'react' // Importing React
import "./Navbar.css" // Importing styles for Navbar
import { Bot, Sun, Moon } from 'lucide-react'; // Importing icons from lucide-react

// Navbar component
// Props:
// - toggleTheme: function to switch between dark/light mode
// - currentTheme: the current theme (dark or light)

function Navbar({ toggleTheme, currentTheme }) {
  return (
    <> 
      {/* Navigation bar container */}
      <div className="nav">
        
        {/* Logo section */}
        <div className="logo">
          CodeMedic
          {/* Bot icon (branding) */}
          <Bot Landmark size={50} color='#00ADB5'/>
        </div>

        {/* Theme toggle button */}
        <div onClick={toggleTheme} className="icon">
          {/* Show Sun icon if theme = dark, otherwise Moon */}
          {currentTheme === 'dark' ? (
            <Sun size={28} color="yellow" />
          ) : (
            <Moon size={28} color="black" />
          )}
        </div>
      </div>
    </>
  )
}

// Exporting Navbar
export default Navbar   
