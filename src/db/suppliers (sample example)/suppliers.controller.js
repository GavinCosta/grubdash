const suppliersService = require("./suppliers.service.js");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("supplier_name", "supplier_email");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary.js")

//controller can be used to take in services and pass relevant info (req.body, params, query) and return json

const VALID_PROPERTIES = [
    "supplier_name",
    "supplier_address_line_1",
    "supplier_address_line_2",
    "supplier_city",
    "supplier_state",
    "supplier_zip",
    "supplier_phone",
    "supplier_email",
    "supplier_notes",
    "supplier_type_of_goods",
  ];
  
  function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
  
    const invalidFields = Object.keys(data).filter(
      (field) => !VALID_PROPERTIES.includes(field)
    );
  
    if (invalidFields.length) {
      return next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(", ")}`,
      });
    }
    next();
  }

  /** async await exists validator
   * 
   * async function supplierExists(req,res,next) {
   * const supplier = await suppliersService.read(req.params.supplierId)
   * if(supplier) {
   * res.locals.supplier = supplier
   * return next()
   * }
   * next({status: 404, message: `Supplier cannot be found`})
   * }
   */

  function supplierExists(req, res, next) {
    suppliersService
      .read(req.params.supplierId)
      .then((supplier) => {
        if (supplier) {
          res.locals.supplier = supplier;
          return next();
        }
        next({ status: 404, message: `Supplier cannot be found.` });
      })
      .catch(next);
  }
//create
  function create(req, res, next) {
    suppliersService
      .create(req.body.data)
      .then((data) => res.status(201).json({ data }))
      .catch(next);
  }

  //async await create
  // async function create(req,res) {
  //   const data = await suppliersService.create(req.body.data)
  //   res.status(201).json({data});
  // }


//update
  function update(req,res,next) {
    const updatedSupplier = {
      ...req.body.data,
      supplier_id: res.locals.supplier.supplier_id,
    };
    suppliersService
      .update(updatedSupplier)
      .then((data) => res.json({data}))
      .catch(next)
  }

  //async await update
  async function update(req,res) {
    const updatedSupplier = {
      ...req.body.data, supplier_id: res.locals.supplier.supplier_id,
    };
    const data = await suppliersService.updated(updatedSupplier);
    res.json({data})
  }
 
  function destroy(req,res,next) {
    suppliersService
      .delete(res.locals.supplier.supplier_id)
      .then(() => res.sendStatus(204))
      .catch(next)
  }

  //asynbc await destroy
  async function destroy(req, res) {
    const supplier = res.locals;
    await suppliersService.delete(supplier.supplier_id);
    res.sendStatus(204);
  }

  //async await - list (try/catch error handling)
async function list(req, res) {
  try {
    const data = await suppliersService.list();
    res.json({data})
  } catch(error) {
    next(error);
  }
}


  module.exports = {
    list: asyncErrorBoundary(list),
   create: [hasOnlyValidProperties, hasRequiredProperties, create],
   update: [supplierExists, hasOnlyValidProperties, hasRequiredProperties, update],
   delete: [supplierExists, destroy]
  };