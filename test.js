var data = {
    "folders": 
      {
        "id":"1",
        "name": "Dökümanlar",
        "childs": [
          {
            "id":"2",
            "name": "Employees",
            "childs": [
              {
                "id":"3",
                "name": "Reports"
              },
              {
                "id":"4",
                "name": "Employee Maint."
              }
            ]
          },
          {
            "id":"5",
            "name": "Company Maintenance"
          },
          {
            "id":"6",
            "name": "Human Resources"
          }
        ]
      }
    
  }
  
  var str="";
  function dondur(gelen){
    str += '<li>'+gelen.name;
    if (gelen.hasOwnProperty('childs')) {
    str += '<ul>';
        gelen.childs.map(x=> dondur(x));
    str += '</ul>';
      }
    str += '</li>';
    return str;
    }
    
    console.log(dondur(data.folders, ""));