const path = require("path");
const dishesService = require('./dishes.service')
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));
/**
 * function list(req,res,next) {
 * dishesService
 *  .list()
 *  .then((data) => res.json({data}))
 * .catch(next)
 * }
 */
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
//create, read, update, list
function list(req, res, next) {
    res.json({data: dishes})
}
//need validatorFor(prop) check for valid name, description, price, image url
/**-name is missing/empty
 * -description empty/missing
 * -price missing/ > 0 / not an integer
 * -image_url missing/empty
 */
function validateInteger(req,res,next) {
    const {price} = req.body.data
    const numericInteger = Number(price)
    if (!isNaN(numericInteger) && Number.isInteger(price) && numericInteger > 0) {
        next()
    } else {
        next({
            status: 400,
            message: 'Dish must have a price that is an integer greater than 0'
        })
    }
}


function validatorFor(prop, propMessage) {
    return function (req,res,next) {
        // console.log(prop)
        if (req.body.data[prop]) {
            next()
        } else {
            // console.log(propMessage, '********************')
            next({
                status: 400,
                message: `${propMessage}`
            })
        }
    }
}


function create(req, res, next) {
    const {data: {id, name, description, price, image_url} = {}} = req.body
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,
    }
    // console.log(newDish)
    dishes.push(newDish)
    res.status(201).json({data: newDish})
}

function validateIdExists(req, res, next) {
    const { dishId } = req.params
    const foundDish = dishes.find((dish) => dish.id === dishId)
    if (foundDish){
        res.locals.dish = foundDish
        res.locals.dishId = dishId
        next()
    } else {
        next({
            status: 404,
            message: `Dish does not exist: ${dishId}.`
        })
    }
}

function validateIdMatches(req, res, next) {
    const {data: {id} = {}} = req.body
    const dishId = res.locals.dishId
    if (dishId === id || !id) {
        next()
    } else {
        next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
        })
    }
}

function read(req, res, next) {
    const foundDish = res.locals.dish
    res.json({data: foundDish})
}

function update(req, res, next) {
    const dish = res.locals.dish
    const {data: {id, name, description, price, image_url} = {}} = req.body
    dish.name = name
    dish.description = description
    dish.price = price
    dish.image_url = image_url
    res.status(200).json({data: dish})
}



module.exports = {
    list,
    create: [
        validatorFor('name', 'Dish must include a name'),
        validatorFor('description', 'Dish must include a description'),
        validatorFor('price', 'Dish must include a price'),
        validatorFor('image_url', 'Dish must include a image_url'),
        validateInteger, 
        create
        ],
    read: [validateIdExists, read],
    update: [
        validateIdExists, 
        validateIdMatches, 
        validatorFor('name', 'Dish must include a name'),
        validatorFor('description', 'Dish must include a description'),
        validatorFor('price', 'Dish must include a price'),
        validatorFor('image_url', 'Dish must include a image_url'),
        validateInteger,
        update
    ]
}