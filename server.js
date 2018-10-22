var express = require('express');
var pgp = require('pg-promise')();
var db = pgp('postgres://ozqwehggwyivsx:3ed71a3488c8e66c9507a970d068ae587a89d4b087ac9dcb454b037848f38b06@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d13670itu2g6eo?ssl=true');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
//home page
app.get('/', function (req, res) {
    res.render('pages/index');
});
app.get('/index', function (req, res) {
    res.render('pages/index');
});


//About Page
app.get('/about', function (req, res) {
    var name = 'CHAWEEWAN SOOKWAN';
    var hobbies = ['Music', 'Movie', 'Programming'];
    var bdate = '06/01/1998';
    res.render('pages/about', { fullname: name, hobbies: hobbies, bdate: bdate });
});


//Products Data
app.get('/products', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from products order by id';

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
    var sql = "select * from products where id =" + pid + " order by id";
    db.any(sql)
        .then(function (data) {
            res.render('pages/product_edit', { product: data[0] });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});
//add data
app.get('/addproducts', function (req, res) {
    res.render('pages/addproducts');
});
//update data
app.post('/products/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products set title = '${title}',price = '${price}' where id = '${id}' `;
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});
//add product
app.post('/products/complete', function (req, res) {
    var title = req.body.title;
    var price = req.body.price;
    var created_at = req.body.created_at;
    var tags = req.body.tags;
    var sql = `insert into products  (title,price,created_at,tags) VALUES('${title}',${price},'${created_at}','{${tags}}')`;
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products');
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});
//delete data
app.get('/product/delete/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "delete from products where id =" + pid;
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products');
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});


//Users Data
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
//add data
app.get('/addusers', function (req, res) {
    res.render('pages/addusers');
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
//update user
app.post('/users/update', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `update users set email ='${email}',password = '${password}' where id = '${id}'`;
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//delete data
app.get('/users/delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = "delete from users where id =" + id;
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});
//add users
app.post('/users/complete', function (req, res) {
    var currentdate = new Date();
    //2011-03-16 22:03:00+07
    var timestamp = currentdate.getTime();
    console.log(currentdate);
    var datetime = currentdate.getFullYear() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds() 
        // + currentdate.getTimezoneOffset();
    var email = req.body.email;
    var password = req.body.password;
    var sql = `insert into users (email,password,created_at) VALUES('${email}','${password}','${datetime}');`;
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

//Purchase Data
app.get('/purchase', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from purchases';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/purchase', { purchase: data });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//add data
app.get('/addpurchase', function (req, res) {
    res.render('pages/addpurchase');
});
app.get('/purchase/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from purchases';

    if (id) {
        sql += ' where id =' + id;
    }

    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/purchase_edit', { purchase: data[0] });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//update purchase
app.post('/purchase/update', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var address = req.body.address;
    var state = req.body.state;
    var zipcode = req.body.zipcode;
    var user_id = req.body.user_id;


    var sql = `update purchases set name ='${name}',address = '${address}',state = '${state}',zipcode = '${zipcode}',user_id = '${user_id}' where id = '${id}'`;
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/purchase');
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//delete data
app.get('/purchase/delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = "delete from purchases where id =" + id;
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/purchase');
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});
//add purchase
app.post('/purchase/complete', function (req, res) {
    var currentdate = new Date();
    var timestamp = currentdate.getTime();
    console.log(currentdate);
    var datetime = currentdate.getFullYear() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds() 
    var name = req.body.name;
    var address = req.body.address;
    var state = req.body.state;
    var zipcode = req.body.zipcode;
    var user_id = req.body.user_id;
    var sql = `insert into purchases (created_at,name,address,state,zipcode,user_id)  VALUES('${datetime}','${name}','${address}','${state}','${zipcode}','${user_id}');`;
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/purchase');
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

//report purchase
app.get('/pcitem', function (req, res) {
    var sql = 'SELECT purchase_items.purchase_id ,purchases.name ,purchase_items.price ,purchase_items.quantity , purchase_items.price*purchase_items.quantity AS Total FROM purchase_items INNER JOIN purchases ON purchase_items.purchase_id = purchases.id;';
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/pcitem', { totalpurchase: data });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//report contact
app.get('/contact', function (req, res) {
    var sql = 'SELECT users.id,purchases.name,purchases.address,purchases.state,purchases.zipcode ,users.email FROM users INNER JOIN purchases ON users.id= purchases.user_id order by id ;';
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/contact', { contact: data });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//Run App
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});