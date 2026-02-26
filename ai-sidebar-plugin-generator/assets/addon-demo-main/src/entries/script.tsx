import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { initScript } from 'dingtalk-docs-cool-app';

function App() {
  useEffect(() => {
    // 在开发环境中使用正确的URL指向编译后的script.code.js文件
    initScript({ 
      scriptUrl: new URL(`${window.location.origin}/static/js/script.code.js`, window.location.href) 
    });
  }, []);
  
  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root_script') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
