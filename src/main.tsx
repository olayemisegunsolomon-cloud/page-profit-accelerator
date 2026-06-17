import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Dynamically integrate Microsoft Clarity tag for heatmaps
const clarityId = (import.meta as any).env.VITE_CLARITY_ID;
if (clarityId) {
  (function(c: any, l: Document, a: string, r: string, i: string, t?: any, y?: any){
    c[a] = c[a] || function(){(c[a].q = c[a].q || []).push(arguments)};
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    if (y && y.parentNode) {
      y.parentNode.insertBefore(t, y);
    }
  })(window, document, "clarity", "script", clarityId);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
