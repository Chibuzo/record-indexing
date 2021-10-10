const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');


router.get('/', (req, res) => {
    res.status(200).json({ message: 'An Indexing Project' });
});

router.get('/content', async (req, res, next) => {
    try {
        const { keywords } = req.query;
        const result = await dataService.search(keywords);
        res.json({ result });
    } catch (err) {
        next(err);
    }
});

router.post('/content/:type', async (req, res, next) => {
    try {
        const data_type = req.params.type;
        const result = await dataService.extractData(data_type);
        res.json({ result });
    } catch (err) {
        next(err);
    }
});


module.exports = router;
