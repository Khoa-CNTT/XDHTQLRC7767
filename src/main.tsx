import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
// Nếu sử dụng Ant Design v4
// import 'antd/dist/antd.css';
// Nếu sử dụng Ant Design v5
import 'antd/dist/reset.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
