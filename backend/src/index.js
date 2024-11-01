const express = require('express')
const app = express()
const port = 3000

const connectToDb = require('./config/db/db');
connectToDb();

var morgan = require('morgan');
app.use(morgan('dev'));

const cors = require('cors');
app.use(cors());

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const userRouter = require('./router/userRouter.js');
const authRouter = require('./router/authRouter.js');
const uploadRouter = require('./router/cloudinary-upload');
const bookRouter = require('./router/bookRouter.js');
const swaggerDocs = require('./swagger.js');
swaggerDocs(app, port);


app.use('/uploads', uploadRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/books', bookRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})