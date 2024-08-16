const express = require('express');
const Article = require('../models/article');
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});

router.get('/edit/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.render('articles/edit', { article: article });
    } catch (error) {
        console.error('Error fetching article:', error.message);
        res.redirect('/');
    }
});

router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (article == null) {
            res.redirect('/');
        } else {
            res.render('articles/show', { article: article });
        }
    } catch (error) {
        console.error('Error fetching article by slug:', error.message);
        res.redirect('/');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting article:', error.message);
        res.redirect('/');
    }
});

// Route to create a new article
router.post('/', async (req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });

    try {
        article = await article.save();
        res.redirect(`/articles/${article.slug}`);
    } catch (e) {
        console.error('Error saving article:', e.message);
        res.render('articles/new', { article: article });
    }
});

// Route to update an existing article
router.put('/:id', async (req, res) => {
    try {
        let article = await Article.findById(req.params.id);
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;

        article = await article.save();
        res.redirect(`/articles/${article.slug}`);
    } catch (e) {
        console.error('Error updating article:', e.message);
        res.render('articles/edit', { article: article });
    }
});

module.exports = router;
