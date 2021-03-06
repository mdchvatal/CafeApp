/**
 * Created by Tony Byrd on 5/10/18.
 */

var rp = require('request-promise');
var List = require('prompt-list');



// Greeting print out
console.log("Hi welcome to the CafeApp");


// prompt the user for input
// make call out to openWhisk


function GetTopMenu() {
  console.log("Before api call")
  var url = "http://localhost:3000/api/Menus/topMenu"
  rp(url)
    .then(function(Menu) {
      return Menu.Menus
})
}

var orderTicket = {};
var fullTicket = []; //array of orderTickets
var subTotal = 0;

//======================= Menu Definitions ================================

var topMenu = new List({
  name: 'topMenu',
  message: 'Select one of the following',
    // choices may be defined as an array or a function that returns an array
  choices: ["Cafeteria", "Starbucks", "Catering", {
    "name": "Merchandise",
    "disabled": "Temporarily unavailable"
  }]
});


var starbucksMenu = new List({
  name: 'starbucksMenu',
  message: 'what would you like to order?',
    // choices may be defined as an array or a function that returns an array
  choices: ["Coffee", "Cold Drinks/Iced Coffee", "Food", {
    "name": "Merchandise",
    "disabled": "Temporarily unavailable"
  }, ]
});


var coffeeDrinks = new List({
  name: 'coffeeDrinks',
  message: 'Choose your Booster',
    // choices may be defined as an array or a function that returns an array
  choices: ["Coffee","Caramel Machiato", "Dark Mocha", "White Mocha","Americano", "Latte",
            "Vanilla Latte", "Cappucino", "Hot Chocolate","Espresso Shots","Tazo Tea", ]
});

var coldDrinks = new List({
  name: 'coldDrinks',
  message: 'Choose your Booster',
    // choices may be defined as an array or a function that returns an array
  choices: ["Iced Coffee","Iced Caramel Machiato", "Iced Dark Mocha", "Iced White Mocha","Iced Americano", "Iced Latte",
            "Iced Vanilla Latte", "Frappuccino", "Smoothies","Iced Tazo Tea", ]
});

var starbucksFood = new List({
  name: 'starbucksFood',
  message: 'what would you like to order?',
    // choices may be defined as an array or a function that returns an array
  choices: ["Muffins", "Breakfast Sandwich", "Scone","Bagel", "Coffee Cake","Parfait", "Fruit Cup","Eggs","Chips",
     "Biscotti","Coffee Bites","Kind Bar","Candy","Luna Bar","Lunch Combo","Gum","Mints","Shortbread Cookies",
        "Cookies","String Cheese",]
});

var cafeMenu = new List({
  name: 'cafeMenu',
  message: 'Choose One of the following',
    // choices may be defined as an array or a function that returns an array
  choices: ["Flame Grill"," Butcher and Bakery", "Hot Line", "Entree","Salad Bar", "Chips","Beverages","Candy",
     ]
});

var drinkSize = new List({
  name: 'drinkSize',
  message: 'What size would you like?',
    // choices may be defined as an array or a function that returns an array
  choices: ["Tall", "Grande", "Venti", {
    "name": "Trienta",
    "disabled": "Temporarily unavailable"
  }]
});

var coldDrinkSize = new List({
  name: 'coldDrinkSize',
  message: 'What size would you like?',
    // choices may be defined as an array or a function that returns an array
  choices: [ "Grande", "Venti", {
    "name": "Tall",
    "disabled": "Temporarily unavailable"
  }]
});

var syrupMenu = new List({
  name: 'syrupMenu',
  message: 'Would you like to add syrup?',
    // choices may be defined as an array or a function that returns an array
  choices: [ "No syrup", "Vanilla","Sugarfree Vanilla","Caramel","Hazel Nut","Toffee Nut","Cinnamon Dolce",
      "Sugarfree Cinnamon Dolce","Classic","Peppermint"]
});

var shotPrompt = new List({
  name: 'shotPrompt',
  message: 'Would you like an extra shot of expresso?',
    // choices may be defined as an array or a function that returns an array
  choices: [ "No thanks", "1", "2", "Dave style"]
});

//======================= Menu RunTimes ================================
topFunction();

function topFunction(){
  topMenu.run()
    .then(function(answer) {
        //console.log(answer);
        if(answer === "Starbucks" ){
          starbucksFunction()
        }
    })

}
function starbucksFunction(){
  starbucksMenu.run()
    .then(function(answer) {
        //console.log(answer);
        if(answer === "Coffee" ){
          coffeeDrinks.run()
            .then(function(answer) {
              handleDrinks(answer, "hot")
            })
        }
        if(answer === "Cold Drinks/Iced Coffee" ){
          coldDrinks.run()
            .then(function(answer) {
              handleDrinks(answer, "cold")
            })
        }
        if(answer === "Food" ){
          starbucksFood.run()
            .then(function(answer) {
              console.log(answer)
            })
        }
    })

}
// Main program flow



//flow for the Starbucks menu


//======================= Helper Functions ================================
function handleDrinks (drinkName, drinkType) {

  orderTicket.itemName = "";
  orderTicket.itemName = drinkName;

  if (drinkType === "hot") {
     drinkSize.run()
       .then(function(answer) {
         orderTicket.itemSize = answer
         checkout()
    })
  } else {
     coldDrinkSize.run()
      .then(function(answer) {
        orderTicket.itemSize = answer
        checkout()
    })
  }

  orderTicket.syrup = false
  if (drinkName === "Coffee" || drinkName === "Iced Coffee") {
     syrupMenu.run()
       .then(function(answer) {
         orderTicket.syrup = true
       })
  }

  orderTicket.extraShot = false
  if (drinkName !== "Hot Chocolate" && drinkName !== "Tazo Tea" && drinkName !== "Iced Tazo Tea") {
     shotPrompt.run()
       .then(function(answer) {
         orderTicket.shot = answer
       })
  }

}



//======================= Checkout ================================

function checkout () {

  paymentSystem()
  console.log("subTotal = ", subTotal)
  var tax = subTotal*.0475
  console.log("tax = ", tax.toFixed(2))
  var total = subTotal + tax
  console.log("Your total is: ", total.toFixed(2))  //using toFixed(2) to limit the total to 2 decimal places

  //TODO prompt user if they would like to make another order
  // push the orderTicket into fullTicket
  // will have to loop over the fullTicket to calculate the full subtotal

}

//======================= Payment System ================================

function paymentSystem () {

   //TODO Set subtotal to actual prices

   if (orderTicket.syrup) {
     subTotal += 0.60
   }



    switch(orderTicket.itemName) {
        case "Coffee":
            if (orderTicket.itemSize === "Tall") {
             subTotal += 1.58
            } else if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Caramel Machiato":
            if (orderTicket.itemSize === "Tall") {
             subTotal += 1.57
            } else if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Dark Mocha":
            if (orderTicket.itemSize === "Tall") {
             subTotal += 1.57
            } else if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "White Mocha":
            if (orderTicket.itemSize === "Tall") {
             subTotal += 1.57
            } else if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Americano":
            if (orderTicket.itemSize === "Tall") {
             subTotal += 1.57
            } else if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Latte":
            if (orderTicket.itemSize === "Tall") {
             subTotal += 1.57
            } else if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Vanilla Latte":
            if (orderTicket.itemSize === "Tall") {
             subTotal += 1.57
            } else if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Cappucino":
            if (orderTicket.itemSize === "Tall") {
             subTotal += 1.57
            } else if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Hot Chocolate":
            if (orderTicket.itemSize === "Tall") {
             subTotal += 1.57
            } else if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Espresso Shots":
            if (orderTicket.itemSize === "Tall") {
             subTotal += 1.57
            } else if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Tazo Tea":
            if (orderTicket.itemSize === "Tall") {
             subTotal += 1.57
            } else if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Iced Coffee":
            if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Iced Caramel Machiato":
            if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Iced Dark Mocha":
            if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Iced White Mocha":
            if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Iced Americano":
            if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Iced Latte":
            if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Iced Vanilla Latte":
            if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Frappuccino":
            if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Smoothies":
            if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        case "Iced Tazo Tea":
            if (orderTicket.itemSize === "Grande") {
             subTotal += 2.15
            } else {
             subTotal += 2.50
            }
            break;
        default:
            console.log("Invalid drink type")
    }
}

