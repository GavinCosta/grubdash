//higher order function for handling async errors

///////Promise resolved .then/.catch method
// function asyncErrorBoundary(delegate, defaultStatus) {
//     return (request, response, next) => {
//       Promise.resolve()
//         //guarantees catch method even if delegate isnt async
//         .then(() => delegate(request, response, next))
//         .catch((error = {}) => {
//           const { status = defaultStatus, message = error } = error;
//           next({
//             status,
//             message,
//           });
//         });
//     };
//   }

  function asyncErrorBoundary(delegate, defaultStatus) {
    return (req, res, next) => {
      //anonnymous function that makes our middleware function async 
      (async () => {
        try {
          //await controller function
          await delegate(req,res,next);
        } catch(error) {
          const {status = defaultStatus, message = error} = error;
          next({
            status,
            message
          });
        }
        //call that function ()
      })()
    };
  }

  //function will be called in module.exports with syntax like:
  // list: asyncErrorBoundary(list)
  
  module.exports = asyncErrorBoundary;