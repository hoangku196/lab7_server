var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var hbs = require('express-handlebars');
var path = require('path');
var db = require('mongoose');
var _PORT = 8888;
var methodOverride = require('method-override');

app.use(methodOverride('_method'));

//Link mongo
var mongoDB = 'mongodb+srv://hoangku196:Asdwasdw123@cluster0.wy1wn.mongodb.net/test';
var schema = db.Schema;
db.connect(mongoDB, {
		useNewUrlParser: true,
		useUnifiedTopology: true
},function(){
	console.log('Connect MongoDB success');
});

app.engine('.hbs', hbs({
	extname: 'hbs',
	defaultLayout: 'index',
	layoutsDir: 'views/layouts',
	partialsDir: 'views/partials'
}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static('public'));

//config multer
var storageConfig = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, "./public/uploads");
	},
	filename: function(req, file, callback){
		callback(null, req.body.name + path.extname(file.originalname));
	}
});
var upload = multer({
	storage: storageConfig
});

var collection = 'product';
var product = new schema({
	name: String,
	price: Number,
	describe: String,
	img: String
});

var collection1 = 'student'
var student = new schema({
	name: String,
	number: Number,
	address: String
});


app.get('/', function(req, res){
	res.render('index_form');
});
app.get('/list', function(req, res){
	var list = db.model(collection, product, 'products');
	var check = list.find({}, function(err, data){
		res.render('list_form', {
			data: data,
			helpers: {
				index_item: function(value){
					return parseInt(value) + 1;
				}
			}
		});	
	}).lean();
});
app.get('/update', function(req, res){
	var list = db.model(collection, product, 'products');
	var check = list.find({}, function(err, data){
		res.render('update_form', {
			data: data,
			helpers: {
				index_item: function(value){
					return parseInt(value) + 1;
				}
			}
		})
	}).lean();
});
app.put('/update/:id?', upload.single('myFile'), function(req, res){
	var update = db.model(collection, product, 'products');
	var check = update.updateOne({_id: req.params.id}, {
		name: req.body.name,
		price: req.body.price,
		describe: req.body.describe,
		img: req.file.filename
	}, function(err){
		res.redirect('/list');
	});
});

app.post('/upload',upload.single('myFile') ,function(req, res){
	var add = db.model(collection, product);
	var check = add({
		name: req.body.name,
		price: req.body.price,
		describe: req.body.describe,
		img: req.file.filename
	}).save(function(err){
		res.redirect('/');
	});
	
	//console.log(req.file);
	//res.send('Success');
});

app.get('/delete', function(req, res){
	res.render('delete_form');
});
app.delete('/list/:id?', function(req, res){
	var deleteItem = db.model(collection, product, 'products');
	var check = deleteItem.deleteOne({_id: req.params.id}, function(err){
		res.redirect('/list');
	});
});

app.get('/listProduct', function(req, res){
	var list = db.model(collection, product, 'products');
	var check = list.find({}, function(err, data){
		res.send(data);	
	}).lean();
});

app.get('/deleteProduct', function(req, res){
	var id_delete = req.query.id;
	var deleteItem = db.model(collection, product, 'products');
	var check = deleteItem.deleteOne({_id: id_delete}, function(err){
		if(err == null)
			res.send('Xoa thanh cong');
		else
			res.send('Xoa khong thanh cong');
	});
});

app.use(bodyParser.json());
app.post('/insertUser', function(req, res){
	console.log(req.body.name);
});

app.listen(_PORT, function(){
	console.log('Server is on port ' + _PORT);
});
















































