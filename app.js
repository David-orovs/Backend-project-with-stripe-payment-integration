const express = require('express');
const stripe = require("stripe")("sk_test_1eCSmJTsYJAMMWG3Wag7hgxd00SOzye1KL");
// const keys = require('./config/keys');
const bodyParser = require('body-parser');
const path = require("path");
const expressHandlerbars = require('express-handlebars');
const app = express();
// Handlebars Middleware
app.set("views ", path.join(__dirname, "/views/"));
app.engine("hbs", expressHandlerbars({
    extname : "hbs",
    defaultLayout : "main",
    layoutsDir: __dirname + "/views/layouts"
})); 
app.set("view engine", "hbs")
app.get("/", function(req, res){
  res.render("index")
})

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Set Static Folder for images
app.use(express.static(`${__dirname}/public`));


// Charge Route
app.post('/charge', (req, res) => {
  const amount = 2500;
  
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'Web Development Ebook',
    currency: 'usd',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
}); 