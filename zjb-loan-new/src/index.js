import "babel-polyfill";
import dva from 'dva';
import './index.css';
import onErrorHandle from './onError';
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('fetch-ie8');
require('babel-polyfill');
// 1. Initialize
const app = dva({
  onError(err, dispatch) {
    onErrorHandle(err, dispatch);
  },
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/user').default);
app.model(require('./models/login').default);
app.model(require('./models/account').default);
app.model(require('./models/safeCenter').default);
app.model(require('./models/mineLoan').default);
app.model(require('./models/personal').default);
// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');


export default app._store;