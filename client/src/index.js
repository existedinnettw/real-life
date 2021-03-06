import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux'
import store from 'state/store'

//temporary no strictmode
/*  <React.StrictMode>
    <App />
  </React.StrictMode>,*/
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
