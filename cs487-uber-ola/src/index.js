import React from 'react';
import { render } from 'react-snapshot';
import './index.css';
import App from './App';

render(<App />, document.getElementById('root'));

if (module.hot){
    module.hot.accept()
}

