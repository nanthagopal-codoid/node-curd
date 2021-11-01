const express = require('express');
const app = express();
const port = 4000;

const products = require('./data');

app.listen(port, () => {
    console.log('server is running on ', port);
});

app.get('/api/products', (req, res) => {
    onlyProducts = products.map((item) => {
        return {
            name: item.name,
            price: item.price
        };
    });
    res.json(onlyProducts);
});



