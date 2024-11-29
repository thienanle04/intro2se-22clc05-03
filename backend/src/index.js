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
const connectToDb = require('./config/db/db');
connectToDb();

// url
app.get('/', (req, res) => {
  res.render('login');
});

app.get('/user', (req, res) => {
  const users = [
    {
      name: "John Michael",
      email: "john@creative-tim.com",
      position: {
        title: "Manager",
        department: "Organization"
      },
      status: "User",
      joinDate: "23/04/18",
      image: "../assets/img/team-2.jpg"
    },
    {
      name: "Alexa Liras",
      email: "alexa@creative-tim.com",
      position: {
        title: "Programator",
        department: "Developer"
      },
      status: "User",
      joinDate: "11/01/19",
      image: "../assets/img/team-3.jpg"
    },
    {
      name: "Laurent Perrier",
      email: "laurent@creative-tim.com",
      position: {
        title: "Executive",
        department: "Projects"
      },
      status: "User",
      joinDate: "19/09/17",
      image: "../assets/img/team-4.jpg"
    },
    {
      name: "Michael Levi",
      email: "michael@creative-tim.com",
      position: {
        title: "Programator",
        department: "Developer"
      },
      status: "User",
      joinDate: "24/12/08",
      image: "../assets/img/team-3.jpg"
    },
    {
      name: "Richard Gran",
      email: "richard@creative-tim.com",
      position: {
        title: "Manager",
        department: "Executive"
      },
      status: "User",
      joinDate: "04/10/21",
      image: "../assets/img/team-2.jpg"
    },
    {
      name: "Miriam Eric",
      email: "miriam@creative-tim.com",
      position: {
        title: "Programator",
        department: "Developer"
      },
      status: "User",
      joinDate: "14/09/20",
      image: "../assets/img/team-4.jpg"
    }
  ]

  res.render('user', { users });
})

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
