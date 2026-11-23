import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import App from './App';
import './styles.css';
import './learning-path.css';
import './sandbox.css';
import './tasks.css';
import './explain.css';
import './baukasten.css';
// Schriften des Baukastens, selbst ausgeliefert (keine Verbindung zu Google Fonts).
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/400-italic.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import './chapter/chapter.css';
import './chapter/s01/s01.css';
import './chapter/s02/s02.css';
import './chapter/s03/s03.css';
import './chapter/s05/s05.css';
import './chapter/s06/s06.css';
import './chapter/s07/s07.css';
import './chapter/s08/s08.css';
import './chapter/s09/s09.css';
import './chapter/s10/s10.css';
import './chapter/s11/s11.css';
// Stile der Bereiche (src/explain/areas/<bereich>.css) laden sich von selbst; siehe src/explain/AUTHORING.md.
import.meta.glob('./explain/areas/*.css', { eager: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><ReactFlowProvider><App /></ReactFlowProvider></React.StrictMode>,
);
