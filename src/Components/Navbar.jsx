import React from 'react'
import "./Navbar.css"
import { Bot, Sun, Moon } from 'lucide-react';

function Navbar({ toggleTheme, currentTheme }) {
  return (
    <>
      <div className="nav">
        <div className="logo">CodeMedic
          <Bot Landmark size={50} color='#CC66DA'/>
        </div>

        <div onClick={toggleTheme} className="icon">
          {currentTheme === 'dark' ? (
          <Sun size={28} color="#ffffffff" />
        ) : (
          <Moon size={28} color="#ffffffff" />
        )}
        </div>
      </div>
    </>
  )
}

export default Navbar
