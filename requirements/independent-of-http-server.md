# Indepentent of http server

This project should not be coupled to any http server library like express, hapi, fastify.
The change of http server should require low effort.

## Http server features

1. Register a middleware
2. Register a route
   1. With query params
   2. With named params
   3. With body
   4. With headers
3. Listen to http requests
