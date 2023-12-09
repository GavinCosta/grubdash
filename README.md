# Grubdash Backend

Welcome to the Grubdash backend! This project serves as the backend for an online food ordering system. Below, you'll find essential information about the project structure, routes, and data sets.

## Project Structure

The project is organized into several files, each responsible for a specific aspect of the application.

### Orders Handlers (`orders.controller.js`)

This file contains the handlers for orders, including functions for listing, creating, reading, updating, and deleting orders. Notable functions include:

- `list`: Lists all orders.
- `create`: Validates and creates a new order.
- `read`: Retrieves a specific order by ID.
- `update`: Updates an existing order based on the provided data.
- `destroy`: Deletes an order by ID.

### Orders Router (`orders.router.js`)

The router file sets up the routes for orders, linking to the corresponding controller functions. Routes include:

- `GET /orders`: List all orders.
- `POST /orders`: Create a new order.
- `GET /orders/:orderId`: Read a specific order.
- `PUT /orders/:orderId`: Update a specific order.
- `DELETE /orders/:orderId`: Delete a specific order.

### Dishes Handlers (`dishes.controller.js`)

Similar to the orders controller, this file contains handlers for dishes, including functions for listing, creating, reading, updating, and deleting dishes.

### Dishes Router (`dishes.router.js`)

The router for dishes sets up routes for listing, creating, reading, updating, and deleting dishes.

### Next ID Generator (`nextId.js`)

A utility function for generating unique IDs for new orders and dishes.

## Data Sets

### Orders Data (`orders-data.js`)

An array containing sample order data, including details such as ID, delivery information, status, and dishes. This serves as the initial dataset for orders.

### Dishes Data (`dishes-data.js`)

Similar to orders data, this array contains sample dish data, including ID, name, description, price, and image URL. This data serves as the initial dataset for dishes.

## Installation and Setup

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the server using `npm start`.

## Testing

The project includes tests to ensure the correctness of the handlers and routes. You can run tests using `npm test`.

## Contributing

If you'd like to contribute to the Grubdash backend, please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

Thank you for using Grubdash! If you have any questions or concerns, feel free to reach out to the maintainers.
