import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';
import * as Sentry from '@sentry/browser';
import '@arco-design/web-react/dist/css/arco.css';

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://dcc8b6eb106b43fcbe6385fb491871ad@o1071232.ingest.sentry.io/6068046",
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
  });
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
