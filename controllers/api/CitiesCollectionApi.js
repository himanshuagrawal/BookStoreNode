const express = require('express');

const router = express.Router();

const city = require('../../db/js/CitiesCollectionOperation');

router.get('/getCities',function(request,response){
    city.getAllCities(response,request.query.state);
});

module.exports = router;