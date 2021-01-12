import express, { urlencoded, json } from 'express';
import session from 'express-session';
import { join } from 'path';
import router from './routes';
import { passportSetup } from './lib/passport';
import db from './models';

const env = process.env.NODE_ENV || 'development';
const { server } = require('../config/' + env);

const app = express();
const { port } = server;

// setup for parsing data
app.use(urlencoded({ extended: true }));
app.use(json());

// Set options for cookie
const cookieObject = {
  secure: false,
  httpOnly: true,
  maxAge: server.cookieTime
};

// express session middleware setup
app.use(session({
  secret: server.cookieSecret,
  resave: false,
  saveUninitialized: false,
  cookie: cookieObject
}));

// setup for passport module
passportSetup(app);

// view engine setup
app.set('view engine', 'ejs');
app.set('views', join(__dirname, '../views'));
app.use(express.static(join(__dirname, '../views/styles')));
app.use(express.static(join(__dirname, '../views/javascript')));

app.use('/', router);

app.locals.loginFailure = false;
app.locals.userType = null;
db.sequelize.sync({force: false});

app.listen(port, () => console.log(`Server is running on port ${port}`));

export default app;
