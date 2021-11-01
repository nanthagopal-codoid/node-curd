const express = require('express');
const app = express();
const port = 4000;

const products = require('./data');

app.listen(port, () => {
    console.log('server is running on ', port);
});

// middleware function which execute every request
const logger = (req, res, next) => {
    console.log('url', req.url);
    console.log('routing parameters', req.params.productID);
    console.log('query strings', req.query);

    next();
    // res.send('default page');
};

// app.use('/api/', logger);
app.use([express.json(), express.urlencoded({ extended: true })]);


// get products
app.get('/api/products', (req, res) => {
    // console.log('ip address', req.ip);
    // console.log('host name', req.hostname);
    // console.log('protocol', req.protocol);
    // console.log('original Url', req.originalUrl);
    onlyProducts = products.map((item) => {
        return {
            id: item.id,
            name: item.name,
            price: item.price
        };
    });
    res.json(onlyProducts);
});
// passing url params
app.get('/api/products/:productID', (req, res) => {
    const id = Number(req.params.productID);
    const product = products.find(item => {
        return item.id === id;
    });
    res.json(product);
});

// passing query params
app.get('/api/product/query/', (req, res) => {
    const name = req.query.name.toLowerCase();
    let product = products.filter(item => {
        return item.name.toLowerCase().includes(name);
    });
    console.log(product);
    if (product.length) {
        return res.json(product);
    }
    else res.status(404).send('page not found');

});

// post products
app.post('/api/products/', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price,
        releaseDate: new Date().toISOString().slice(0, 10)
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// update products
app.put('/api/products/:productID', (req, res) => {
    const id = Number(req.params.productID);
    // check req prod id with prod id 
    const index = products.findIndex(item => {
        return item.id === id;
    });
    // if no prod id matches , return status code 404
    if (index === -1) {
        return res.status(404).send('product not found');
    }
    // else update product with incoming data 
    const updatedProduct = {
        id: products[index].id,
        name: req.body.name,
        price: req.body.price,
        releaseDate: new Date().toISOString().slice(0, 10)
    };
    products[index] = updatedProduct;

    // send updated prod
    res.status(200).json({ status: 'success', message: 'product updated', data: updatedProduct });
});

// delete products
app.delete('/api/products/:productID', (req, res) => {
    // get req prod id
    const id = Number(req.params.productID);
    // check req prod id with prod id 
    const index = products.findIndex(item => {
        return item.id === id;
    });
    // if no prod id matches , return status code 404
    if (index === -1) {
        return res.status(404).send('product not found');
    }
    // else remove prod with matched id
    console.log(products.splice(index, 1));
    // send remaining prod
    res.status(200).json({ status: 'success', message: 'product deleted', data: products });

});


