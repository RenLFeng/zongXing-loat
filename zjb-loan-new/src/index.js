import dva from 'dva';
import './index.css';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/user').default);
app.model(require('./models/login').default);
app.model(require('./models/account').default);
app.model(require('./models/safeCenter').default);
app.model(require('./models/mineLoan').default);
// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');


export default app._store;