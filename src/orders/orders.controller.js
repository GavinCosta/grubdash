const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res, next) {
  res.json({ data: orders });
}

function validatorFor(prop, propMessage) {
  console.log("validatorFor");
  return function (req, res, next) {
    // console.log(prop)
    if (req.body.data[prop]) {
      next();
    } else {
      // console.log(propMessage, '********************')
      next({
        status: 400,
        message: `${propMessage}`,
      });
    }
  };
}

function validateDishesArrayExists(req, res, next) {
  const { dishes } = req.body.data;
  const currentDish = orders.find((dish) => dish.id === dishes[0].id);
  if (currentDish) {
    res.locals.orderId = currentDish.id;
    res.locals.orderDish = currentDish;
    next();
  } else {
    next({
      status: 404,
      message: `Dish does not exist: ${res.locals.orderId}.`,
    });
  }
}

function validateInteger(req, res, next) {
  const { dishes } = req.body.data;
  const id = res.locals.orderId;
  const quantity = dishes[0].quantity;

  if (!isNaN(quantity) && Number.isInteger(quantity) && quantity > 0) {
    next();
  } else {
    next({
      status: 400,
      message: `Dish ${id} must have a quantity that is an integer greater than 0`,
    });
  }
}

function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };

  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function read(req, res, next) {
    const {data} = req.body
}

module.exports = {
  list,
  create: [
    validatorFor("deliverTo", "Order must include a deliverTo"),
    validatorFor("mobileNumber", "Order must include a mobileNumber"),
    validatorFor("dishes", "Order must include a dish"),
    validateInteger,
    validateDishesArrayExists,
    create,
  ],
};
