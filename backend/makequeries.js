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
          return [{id: {$exists: true}}];
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
    },
    getSearch: function (search) {
      if (search == undefined || search == ''){
        return [{id: {$exists: true}}];
      }
      return [ {projectID: {$regex: ".*" + search + ".*", $options: 'i'}}, {name: {$regex: ".*" + search + ".*", $options: 'i'}}];
    },
    getArea: function (area) {
      if (area == undefined) {
        return [0, 999999];
      }
      return [area[0], area[1]];
    }
  };

