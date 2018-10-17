var express = require('express');
var pgp = require('pg-promise')();
var db = pgp('postgres://ozqwehggwyivsx:3ed71a3488c8e66c9507a970d068ae587a89d4b087ac9dcb454b037848f38b06@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d13670itu2g6eo?ssl=true');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/about', function (req, res) {
    var name = 'CHAWEEWAN SOOKWAN';
    var hobbies = ['Music', 'Movie', 'Programming'];
    var bdate = '06/01/1998';
    res.render('pages/about', { fullname: name, hobbies: hobbies, bdate: bdate });
});

app.get('/products', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from products';

    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/products', { products: data });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});


app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "select * from products where id =" + pid;
    db.any(sql)
        .then(function (data) {
            res.render('pages/product_edit', { product: data[0] });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

app.get('/addproducts', function (req, res) {
    res.render('pages/addproducts');
});

app.get('/addusers', function (req, res) {
    res.render('pages/addusers');
});

app.get('/users', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from users';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from users';

    if (id) {
        sql += ' where id =' + id;
    }

    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users_edit', { users: data[0] });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});


app.get('/index', function (req, res) {
    res.render('pages/index');
});

app.post('/products/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products set title =${title},price = ${price} where id = ${id}`;
    // db.none
    res.redirect('/products');
    console.log('UPDATE:' + sql);
});

app.post('/users/update', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `update users set email =${email},password = ${password} where id = ${id}`;
    // db.none
    console.log('UPDATE:' + sql);
    res.redirect('/users');
    
});


var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});