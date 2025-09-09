import { StrictMode } from 'react' // Importing StrictMode from React to highlight potential issues in the app during development
import { createRoot } from 'react-dom/client' // Importing createRoot from react-dom/client to render the React application into the DOM

import App from './App.jsx' // Importing the main App component which serves as the root of the project

// Creating the root for the React app and rendering the App component inside it
// StrictMode is used here to activate additional checks and warnings in development
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
