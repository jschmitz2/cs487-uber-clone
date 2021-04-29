/* Data types */ 

/* Stages
 * Stages are referenced as an integer.  
 * Rather than making a table, it's easier to just treat the int as an ID with predetermined values. 
*/

stages = {
    0: "Route is created, but not taken.",
    1: "Route is taken by the user.",
    2: "Driver is assigned to the route.",
    3: "Driver arrives at user source."
}

/* Route object 
 * 
 * This object will be provided as JSON body from the backend, and returned and parsed by the frontend. 
 * Make fields optional as needed. 
*/ 

route = {
    "id": "ID of the created route",
    "src": "Source",
    "dest": "Destination",
    "riders": "Number of riders. Int.",
    "token": "User token",
    "price": "Price of the created route",
    "dist_trip": "Distance of the created route",
    "time_trip": "Time of the created route",
    "status": 0, // Integer representing stage. See "Stages" informaiton. 
    "driver": "Driver name", // 'null' when driver isn't assigned
    "dist_src": "Distance the driver must drive to get to source",
    "time_src": "Driving time to source for driver"
}

// Required methods

function submitRoute(newRoute) {
    /* 
     * Add a new route to the database, with stage 0. 
     * Arguments: 
     * src: String representing start point. 
     * dest: String representing end point.
     * token: String. The user's token.  
     * 
     * Expected behavior: 
     * Create a new route ID with the provided information, tied to the user. 
     * Return a built "route" object.
     * 
     * The route will now circulate in a queue, and offered to different drivers. 
     */ 
    return newRoute; 
}

function getRouteById(userRouteId) {
    /* Given an ID, find a route. 
     * Build the completed and updated route object, and return. 
     * This will be polled as a lifecycle method to update a progress bar, 
     * so when a driver claims a route this should be built in a way to get that info. 
     */ 
   return userRouteId;
}

function getDriverRoutes(token, latitude, longitude, seats) {
    /* Get all routes that a driver with a given token can claim. 
     * 
     * Identify the driver based on their token. 
     * Search for all routes that have a status of 1 (submitted, not claimed). 
     * Filter the routes based on the number of passengers in them. 
     * Calculate a distance and time to those routes using the latitude and longitude provided.
     * Build up "route" object with that information for each route, and return them all. 
     */ 
    return
}

function driverClaimRoute(token, userRouteId) { 
    /* Given a provided token and userRouteId, claim the route for the driver. 
     * 
     * Set the status to 2, and mark the driver ID as being taken for it. 
     */ 
    return
}

function getRiderInfo(token) {
    /* Return all rides a user's taken. 
     * Statistics can be calculated on the frontend. 
     */ 
    return 
}

function getDriverInfo(token) {
    /* Return all rides a driver's driven. 
     * Statistics can be calculated on the frontend. 
     */ 
    return
}

// Copy the user login and registration methods, along with all the token models. 
// There might be a way to use request cookies to pull token automatically instead of stuffing it into 
// data types, but this works for now. 