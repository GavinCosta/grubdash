const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

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
    if (Number.isInteger(Number(price)) && Number(price) > 0) {
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
    console.log(newDish)
    dishes.push(newDish)
    res.status(201).json({data: newDish})
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
}