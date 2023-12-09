const path = require("path");

const ordersService = require("./orders.service")


// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res, next) {
  res.json({ data: orders });
}

/**
 * list with knex
 *  
 *  function list(req,res,next) {
 * ordersService
 *  .list()
 *  .then(data => res.json({date}))
 *  .catch(next)
 * }
 * 
 * validate orderExists
 * 
 * function orderExists(req, res, next) {
    ordersService
    .read(req.params.orderId)
    .then((order) => {
      if (order) {
        res.locals.order = order;
        return next();
      }
      next({ status: 404, message: `Order cannot be found.` });
    })
    .catch(next);
}
 *  function read(req,res) {
     const {order: data} = res.locals
     res.json({data})
 }
 */

function validatorFor(prop, propMessage) {
  return function (req, res, next) {
    if (req.body.data[prop]) {
      next();
    } else {
      next({
        status: 400,
        message: `${propMessage}`,
      });
    }
  };
}

function validateDelivered(req,res,next) {
    const {status} = req.body.data
    if (status === "delivered" || status === "preparing") {
        next({
            status: 400,
            message: "A delivered order cannot be changed"
        })
    }
  next
}

function validateDishesArrayExists(req, res, next) {
  const { dishes } = req.body.data;

  // Check if dishes is an array and has at least one item
  if (Array.isArray(dishes) && dishes.length > 0) {
    next();
  } else {
    next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }
}

function validateInteger(req, res, next) {
  const { dishes } = req.body.data;

  if (Array.isArray(dishes) && dishes.length > 0) {
    for (const dish of dishes) {
      const { id, quantity } = dish;

      if (quantity === undefined || quantity === null) {
        next({
          status: 400,
          message: `Dish ${id} must have a quantity`,
        });
      }

      if (!isNaN(quantity) && Number.isInteger(quantity) && quantity > 0) {
        continue;
      } else {
        next({
          status: 400,
          message: `Dish ${id} must have a valid quantity that is an integer greater than 0`,
        });
        next();
      }
    }

    next();
  } else {
    next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }
}

function validateOrderExists(req, res, next) {
  const { orderId } = req.params;
  const currentOrder = orders.find((order) => order.id === orderId);
  if (currentOrder) {
    res.locals.order = currentOrder;
    next();
  } else {
    next({
      status: 404,
      message: `Order with id ${orderId} doesnt exist`,
    });
  }
}

function validateIdMatches(req, res, next) {
  const currentOrder = res.locals.order;
//   console.log(currentOrder.id, "XXXXXXXXXXXXXXXXXXXX")
  const {data} = req.body;
//   console.log(data.id, "***************")
  if (data.id && data.id !== currentOrder.id) {
    next({
        status: 400,
        message: `Current order id ${currentOrder.id} doesnt match updated id ${data.id}`,
      });
  } else {
    next()
  }
}

function validateOrderIsPending(req, res, next) {
  const currentOrder = res.locals.order;
  if (currentOrder.status === "pending") {
    next();
  } else {
    next({
      status: 400,
      message: "An order cannot be deleted unless it is pending.",
    });
  }
}

function validateStatus(req, res, next) {
    const currentOrder = res.locals.order;
    // console.log(currentOrder, "*************")
    if (currentOrder.status === "delivered") {
      next({
          status: 400,
          message: "A delivered order cannot be changed",
        });
      }
    next();
  }
  
  function validateUpdatedStatus(req,res,next) {
    const {data} = req.body
    // console.log(data.status, "xxxxxxxxxxxxxxxxxxxxxxxxxx")
    if (data.status === "preparing" || data.status === "pending" || data.status === "out-for-delivery" || data.status === "delivered") {
        next()
    } else {
        next({
            status: 400,
            message: "invalid status"
        })
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
  const currentOrder = res.locals.order;
  res.json({ data: currentOrder });
}

function update(req, res, next) {
  const currentOrder = res.locals.order;
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  currentOrder.deliverTo = deliverTo;
  currentOrder.mobileNumber = mobileNumber;
  currentOrder.status = status;
  currentOrder.dishes = dishes;
  res.status(200).json({ data: currentOrder });
}

function destroy(req, res, next) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);
  const deletedOrder = orders.splice(index, 1);
  res.status(204).send();
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
  read: [validateOrderExists, read],
  update: [
    validateOrderExists,
    validateStatus,
    validatorFor("deliverTo", "Order must include a deliverTo"),
    validatorFor("mobileNumber", "Order must include a mobileNumber"),
    validatorFor("dishes", "Order must include a dish"),
    validatorFor("status", "Order must have a status of pending, preparing, out-for-delivery, delivered"),
    validateDishesArrayExists,
    validateInteger,
    validateIdMatches,
    validateUpdatedStatus,
    update,
  ],
  destroy: [validateOrderExists, validateOrderIsPending, destroy],
};
