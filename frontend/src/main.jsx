import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/store';
import { Provider } from 'react-redux';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


createRoot(document.getElementById('root')).render(
  <StrictMode>
       <Provider store={store}>
            <App />
       </Provider>
  </StrictMode>,
)
