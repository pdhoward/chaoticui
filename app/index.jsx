/* eslint import/no-unresolved:0 global-require:0 */
import 'babel-polyfill';
import App from './app';
import { render } from 'react-dom';
import React from 'react';
import 'react-toolbox/lib/commons';
import { AppContainer } from 'react-hot-loader';

const rootElement = document.getElementById('content');

render(<AppContainer><App /></AppContainer>, rootElement);

if (module.hot) {
    module.hot.accept('./app', () => {
        const NextApp = require('./app').default;
        render(<AppContainer><NextApp /></AppContainer>, rootElement);
    });
}
