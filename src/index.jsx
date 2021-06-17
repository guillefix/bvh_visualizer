/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 07:54:30
 * @modify date 2018-08-26 07:54:30
 * @desc [Init React app. Attach to DOM.]
*/


import ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader';
// AppContainer is a necessary wrapper component for HMR

import App from './react/pages/Main';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('App'),
  );
};

render(App);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./', () => {
    console.info('-------Re-render React app aaaa-----');
    render(App);
  });
}
