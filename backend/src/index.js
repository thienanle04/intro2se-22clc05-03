const express = require('express');
const dotenv = require('dotenv')
dotenv.config()
const app = express();
const port = process.env.PORT || 3000;
const handlebars = require('express-handlebars');
const path = require('path');


// Tạo instance Handlebars và đăng ký helper
const hbs = handlebars.create({
  helpers: {
    eq(a, b) {
      return a == b;
    },
  },
});

// Sử dụng middleware để phục vụ tệp tĩnh
app.use(express.static(path.join(__dirname, '../public')));

// Thiết lập template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Kết nối đến database
const connectToDb = require('./config/db/db.js');
connectToDb();

// url
app.get('/', (req, res) => {
  res.render('login');
});

app.get('/login', (req, res) => {
  res.render('login');
});




// Sử dụng middleware
const morgan = require('morgan');
app.use(morgan('dev'));

const cors = require('cors');
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRouter = require('./router/userRouter.js');
const authRouter = require('./router/authRouter.js');
const bookRouter = require('./router/bookRouter.js');
const swaggerDocs = require('./swagger.js');
swaggerDocs(app, port);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/books', bookRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
