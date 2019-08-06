module.exports = {
    
    getProjectSize: function (size) {
        if(size == "Small") {
        return [ 0, 90 ];
        } else if (size == "Medium") {
        return [ 90, 200 ];
        } else if (size == "Large") {
        return [ 200, 9999 ];
        } else {
        return [ 0, 9999 ];
        }
    },
    getBuildingTypes: function (buildingTypes) {
      var res = [];
      
      if (buildingTypes == undefined){
          return res;
      }
    
      var length = buildingTypes.length;
      for (let i = 0; i < length; i++) {
          if (buildingTypes[i] == "Null" ) {
            res.push( { buildingType: null});
          } else {
            res.push( { buildingType: buildingTypes[i]});

          }
      }
      
      return res;
    }
  };

