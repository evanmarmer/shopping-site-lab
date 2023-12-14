import express from 'express';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import session from 'express-session';
import users from './users.json' assert { type: 'json' };
import stuffedAnimalData from './stuffed-animal-data.json' assert { type: 'json' };

const app = express();
const port = '8000';

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

function getAnimalDetails(animalId) {
  return stuffedAnimalData[animalId];
}

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/all-animals', (req, res) => {
  res.render('all-animals.html.njk', { animals: Object.values(stuffedAnimalData) });
});

app.get('/animal-details/:animalId', (req, res) => {
  //need to get ot ID that was passed in
  let animalId = req.params.animalId
  console.log(req.params)
  //using that Id i need to find obj that matches in list of obj
  let animalObj = stuffedAnimalData[animalId]
  //when i have that obj make it value of animal property in code below


  res.render('animal-details.html.njk', { animal: animalObj });
});

app.get('/add-to-cart/:animalId', (req, res) => {
  console.log(req.params)
  let animalName = req.params.animalId
  // TODO: Finish add to cart functionality
  // The logic here should be something like:
  // - check if a "cart" exists in the session, and create one (an empty
  // object keyed to the string "cart") if not
  if(req.session.cart) {
    if(req.session.cart[animalName]){
      req.session.cart[animalName]++
    }else{
      req.session.cart[animalName] = 1
    }
  }else{
    req.session.cart = {}
    req.session.cart[animalName] = 1
  }
  console.log(req.session.cart)
  // - check if the desired animal id is in the cart, and if not, put it in
  // - increment the count for that animal id by 1

  // - redirect the user to the cart page
  res.redirect('/cart')
});

app.get('/cart', (req, res) => {

  // TODO: Display the contents of the shopping cart.

  // The logic here will be something like:

  // - get the cart object from the session
  let cart = req.session.cart
  // - create an array to hold the animals in the cart, and a variable to hold the total
  // cost of the order
  let animalsArr = []
  let orderTotal = 0
  for(let animal in cart){
    animalsArr.push()

    // - loop over the cart object, and for each animal id:
    //   - get the animal object by calling getAnimalDetails
    let currentAnimalDetails = getAnimalDetails(animal)
    //   - compute the total cost for that type of animal
    let currentAnimalTotalCost = cart[animal] * currentAnimalDetails.price
    //   - add this to the order total
    orderTotal = orderTotal + currentAnimalTotalCost
    //   - add quantity and total cost as properties on the animal object
    currentAnimalDetails.subtotal = currentAnimalTotalCost
    currentAnimalDetails.quantity = cart[animal]
    //   - add the animal object to the array created above
    animalsArr.push(currentAnimalDetails)
  }
  // - pass the total order cost and the array of animal objects to the template

  // Make sure your function can also handle the case where no cart has
  // been added to the session

  res.render('cart.html.njk', {animals: animalsArr, orderTotal: orderTotal});
});

app.get('/checkout', (req, res) => {
  // Empty the cart.
  req.session.cart = {};
  res.redirect('/all-animals');
});

app.get('/login', (req, res) => {
  // TODO: Implement this
  res.send('Login has not been implemented yet!');
});

app.post('/process-login', (req, res) => {
  // TODO: Implement this
  res.send('Login has not been implemented yet!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}...`);
});
