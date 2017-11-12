var axios = require('axios');

class GridApi {
    static fetchFilmData(data){
        return axios.get(`https://swapi.co/api/${data}/`)
        .then(function (response) {
            return response;
          })
          .catch(function (error) {
            return error;
          });
    }
    static fetchPeopleData(data){
        return axios.get(data)
        .then(function (response) {
            return response;
          })
          .catch(function (error) {
            return error;
          });
    }
}
module.exports = GridApi;
  
