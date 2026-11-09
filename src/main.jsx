import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './assets/fonts/fonts.css';
import './styles/base.css';
import './styles/menu.css';
import './styles/game.css';

createRoot(document.getElementById('root')).render(<App />);
