const states = require('../../public/json/cities.json');

class citiesCollection{
    getAllCities(res,state){
        let citySet = new Set();
        states.forEach(element => {
            if(element.state.includes(state)){
                citySet.add(element.name);
            }
        });
        res.send(Array.from(citySet).sort());
    }
}

module.exports = new citiesCollection();