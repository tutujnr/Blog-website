const express = require('express');
const articleRouter = require('./routes/articles');
const Article = require('./models/article');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();

mongoose.connect('mongodb://localhost:27017/Langat', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.set('views', './views');  
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    res.render('articles/index', { articles: articles });
  } catch (err) {
    console.error('Error fetching articles', err);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/articles', articleRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
