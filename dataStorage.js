 function Module(script){
	script = (script).toString();
	script = script.substring(script.indexOf("{")+1, script.length-1);
	var run = new Function(script);
	this.execute = run;
	this.main = (run());
  this.refresh = function() {
    this.main = (run());
  }
	this.import = function(property, data){
		this.main[property] = data;
	}
	this.export = function(property){
		return this.main[property];
	}
}

includes = function(string) {
	if (this.split(string).join("")==string) {
		return false;
	} else {
		return true;
	}
}
function getBaseURL() {
    var url = window.location.href;
    return url.replace("?", "") !== url ? url.substring(0, url.indexOf("?")) : url;
}
//Submit form data to the URL (GET method)
function submitForm(form) {
    var URL = getBaseURL() + "?";
    for (var key in form) {
        URL += key + "=" + form[key] + "&";
    }
    URL = encodeURIComponent(URL.substring(0, URL.length - 1));
    window.open(URL, "_self");
}
function getFormValues(ids) { //returns an object of form elements with the IDs as property names.
    ids = ids.split(",");
    var response = {};
    for (var i = 0; i < ids.length; i++) {
        response[ids[i]] = document.getElementById(ids[i]).value;
    }
    return response;
}
function getWholeForm(form) { //returns an object of form elements with names (or IDs) as property names and the values of the elements as the values of the properties.
        var response = {};
        var elements = document.getElementById(form).elements;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].tagName == "INPUT" || elements[i].tagName == "SELECT" || elements[i].tagName == "TEXTAREA") {
                var backup = elements[i].tagName + Math.floor(Math.random() * 500);
                var title = elements[i].name != "" ? elements[i].name : (elements[i].id != "" ? elements[i].id : backup);
                response[title] = elements[i].value;
            }
        }
        return response;
    }
    //Example: validateForm(getWholeForm("myform"),["password==passwordConfirm","email.includes('@')"]);
function validateForm(Form, expressions) { // the expressions parameter is an array of expressions as strings. In order to grab values from the form use the folowwing syntax: Form.PROPERTY
    var valid;
    if (Form !== null && Form !== undefined) {
        for (var i = 0; i < expressions.length; i++) {
            if (eval(expressions[i])) {
                valid = true;
                continue;
            } else {
                valid = false;
                break;
            }
        }
        return valid;
    }
}
var storageSystem = (function(){
	function cloneObject(THIS, TOTHIS) { //copies the properties of another object to another
	  for (var prop in THIS) {
	    TOTHIS[prop] = THIS[prop];
	  }
	}
	function ExpirationSystem(name) {
  	this.name = name;
  	if (localStorage.getItem(name)==null) {
  		var setup = new Array();
  		localStorage.setItem(name,JSON.stringify(setup));
  	}
  	this.debug = false;
  	//Add an element and assign a value (which must be an object)
  	this.add = function(value) {
  		var rows = JSON.parse(localStorage.getItem(this.name));
  		rows.push(value);
  		localStorage.setItem(this.name, JSON.stringify(rows));
  		if(this.debug===true){console.log(this.name+" -> add: Object successfully added!");}
  	};
  	//Change a specific property of an element where a property equals a certain value: where BY equals "user4" set TITLE to "hello there"
  	this.edit = function(whereThis,equalsThis,setThis,ToThis) {
  		var rows = JSON.parse(localStorage.getItem(this.name));
  		if (rows.length>0){
  			for (var i = 0; i < rows.length; i++) {
  				var row = rows[i];
  				if (row[whereThis]==equalsThis) {
  					if(this.debug===true){console.log(this.name+" -> edit: Object before - ");console.log(row);}
  					row[setThis]=ToThis;
  					if(this.debug===true){console.log(this.name+" -> edit: Object after - ");console.log(row);}
  					rows[i] = row;
  					if(this.debug===true){console.log(this.name+" -> edit: Object saved!");}
  				}
  			}
  			localStorage.setItem(this.name, JSON.stringify(rows));
  		} else {
  			if(this.debug===true){console.log(this.name+" -> edit: No objects are stored!");}
  		}
  	};

  	//Remove an element where a specific property equals a certian value
  	this.remove = function(whereThis,equalsThis) {
  		var rows = JSON.parse(localStorage.getItem(this.name));
  		if (rows.length>0){
  			for (var i = 0; i < rows.length; i++) {
  				var row = rows[i];
  			    if (row[whereThis]==equalsThis) {
  			    	if(this.debug===true){console.log(this.name+" -> remove: Object matched for removal -");console.log(row);}
  			    	rows.splice(i,1);
  			    	if(this.debug===true){console.log(this.name+" -> remove: Object deleted!");}
  			    }
  			}
  			localStorage.setItem(this.name, JSON.stringify(rows));
  		} else {
  			if(this.debug===true){console.log(this.name+" -> remove: No objects are stored!");}
  		}
  	};

  	//Return an element as an object where a property equals a value
  	this.get = function(whereThis,equalsThis) {
  		var rows = JSON.parse(localStorage.getItem(this.name));
  		for (var i = 0; i < rows.length; i++) {
  			var row = rows[i];
  			if (row[whereThis]==equalsThis) {
  				if(this.debug===true){console.log(this.name+" -> get: Object found! ");console.log(row);}
  				return row;
  			}
  		}
  		if(this.debug===true){console.log(this.name+" -> get: Object not found!");}
  		if (rows.length<1&&this.debug===true){
  			console.log(this.name+" -> get: No objects, with the property of "+whereThis+", matched "+equalsThis);
  		}
  		return null;
  	};

  	//Return an array of all the elements as objects
  	this.listAll = function() {
  		var rows = JSON.parse(localStorage.getItem(this.name));
  		if (rows.length<1&&this.debug===true) {
  			console.log(this.name+" -> listAll: There are no stored objects to return!");
  		}
  		if(this.debug===true){console.log(this.name+" -> listAll: Objects were found!");console.log(rows);}
  		return rows;
  	};

  	//Return an array of elements as objects that all have a specific property that is equal to a certain value
  	this.search = function(whereThis,equalsThis) {
  		var result = new Array();
  		var rows = JSON.parse(localStorage.getItem(this.name));
  		for (var i = 0; i < rows.length; i++) {
  			var row = rows[i];
  			if (row[whereThis]==equalsThis) {
  				if(this.debug===true){console.log(this.name+" -> search: Object matched - ");console.log(row);}
  				result.push(row);
  			}
  		}
  		if (result.length<1&&this.debug===true) {
  			console.log(this.name+" -> search: No objects, with the property of "+whereThis+", matched "+equalsThis);
  		}
  		if(this.debug===true){console.log(this.name+" -> search: Final result - ");console.log(result);}
  		return result;
  	};
  	this.filter = function(evaluations) {
  		var data = JSON.parse(localStorage.getItem(this.name)),
  		    result = new Array(), check = null;
          for (var i = 0; i < data.length; i++) {
              var row = data[i];
              for (var x = 0; x < evaluations.length; x++) {
              if (eval(evaluations[x].split("object").join("row"))) {
                  check = true;
                  if (this.debug) {
                      console.log("Passed: "+evaluations[x].split("object").join("row"));
                  }
                  continue;
              } else {
                  check = false;
                  if (this.debug) {
                      console.log("Failed: "+evaluations[x].split("object").join("row"));
                  }
                  break;
              }
              }
              if (check==true) {
              result.push(row);
              }
          }
          if (result.length < 1) {
              return false;
          }
          return result;
  	};
  }
  var expirations = new ExpirationSystem("Expirations");

  function LocalStorageEngine(name, expiration) {
  	//init
    this.name = name;
  	if (localStorage.getItem(name)==null) {
  		var setup = new Array();
  		localStorage.setItem(name,JSON.stringify(setup));
  	}
    if (expiration) {
        if (expirations.get("name", name) == null) {
            expirations.add({
                name: name,
                date: new Date(),
                days: expiration
            });
        }
        var date1 = new Date(expirations.get("name", name).date);
        var date2 = new Date();
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var daysDiff = Math.ceil(timeDiff / (1000 * 3600 *24));
        if (daysDiff > expirations.get("name", name).days) {
            localStorage.setItem(this.name, JSON.stringify([]));
        }
    }
  	this.debug = false;
    //End of init

  	//Add an element and assign a value (which must be an object)
  	this.add = function(value) {
  		var rows = JSON.parse(localStorage.getItem(this.name));
  		rows.push(value);
  		localStorage.setItem(this.name, JSON.stringify(rows));
  		if(this.debug===true){console.log(this.name+" -> add: Object successfully added!");}
  	};
  	//Change a specific property of an element where a property equals a certain value: where BY equals "user4" set TITLE to "hello there"
  	this.edit = function(whereThis,equalsThis,setThis,ToThis) {
  		var rows = JSON.parse(localStorage.getItem(this.name));
  		if (rows.length>0){
  			for (var i = 0; i < rows.length; i++) {
  				var row = rows[i];
  				if (row[whereThis]==equalsThis) {
  					if(this.debug===true){console.log(this.name+" -> edit: Object before - ");console.log(row);}
  					row[setThis]=ToThis;
  					if(this.debug===true){console.log(this.name+" -> edit: Object after - ");console.log(row);}
  					rows[i] = row;
  					if(this.debug===true){console.log(this.name+" -> edit: Object saved!");}
  				}
  			}
  			localStorage.setItem(this.name, JSON.stringify(rows));
  		} else {
  			if(this.debug===true){console.log(this.name+" -> edit: No objects are stored!");}
  		}
  	};

  	//Remove an element where a specific property equals a certian value
  	this.remove = function(whereThis,equalsThis) {
  		var rows = JSON.parse(localStorage.getItem(this.name));
  		if (rows.length>0){
  			for (var i = 0; i < rows.length; i++) {
  				var row = rows[i];
  			    if (row[whereThis]==equalsThis) {
  			    	if(this.debug===true){console.log(this.name+" -> remove: Object matched for removal -");console.log(row);}
  			    	rows.splice(i,1);
  			    	if(this.debug===true){console.log(this.name+" -> remove: Object deleted!");}
  			    }
  			}
  			localStorage.setItem(this.name, JSON.stringify(rows));
  		} else {
  			if(this.debug===true){console.log(this.name+" -> remove: No objects are stored!");}
  		}
  	};

  	//Return an element as an object where a property equals a value
  	this.get = function(whereThis,equalsThis) {
  		var rows = JSON.parse(localStorage.getItem(this.name));
  		for (var i = 0; i < rows.length; i++) {
  			var row = rows[i];
  			if (row[whereThis]==equalsThis) {
  				if(this.debug===true){console.log(this.name+" -> get: Object found! ");console.log(row);}
  				return row;
  			}
  		}
  		if(this.debug===true){console.log(this.name+" -> get: Object not found!");}
  		if (rows.length<1&&this.debug===true){
  			console.log(this.name+" -> get: No objects, with the property of "+whereThis+", matched "+equalsThis);
  		}
  		return null;
  	};

  	//Return an array of all the elements as objects
  	this.listAll = function() {
  		var rows = JSON.parse(localStorage.getItem(this.name));
  		if (rows.length<1&&this.debug===true) {
  			console.log(this.name+" -> listAll: There are no stored objects to return!");
  		}
  		if(this.debug===true){console.log(this.name+" -> listAll: Objects were found!");console.log(rows);}
  		return rows;
  	};

  	//Return an array of elements as objects that all have a specific property that is equal to a certain value
  	this.where = function(whereThis,equalsThis) {
  		var result = new Array();
  		var rows = JSON.parse(localStorage.getItem(this.name));
  		for (var i = 0; i < rows.length; i++) {
  			var row = rows[i];
  			if (row[whereThis]==equalsThis) {
  				if(this.debug===true){console.log(this.name+" -> search: Object matched - ");console.log(row);}
  				result.push(row);
  			}
  		}
  		if (result.length<1&&this.debug===true) {
  			console.log(this.name+" -> search: No objects, with the property of "+whereThis+", matched "+equalsThis);
  		}
  		if(this.debug===true){console.log(this.name+" -> search: Final result - ");console.log(result);}
  		return result;
  	};
  	this.filter = function(evaluations) {
  		var data = JSON.parse(localStorage.getItem(this.name)),
  		    result = new Array(), check = null;
          for (var i = 0; i < data.length; i++) {
              var row = data[i];
              for (var x = 0; x < evaluations.length; x++) {
              if (eval(evaluations[x].split("object").join("row"))) {
                  check = true;
                  if (this.debug) {
                      console.log("Passed: "+evaluations[x].split("object").join("row"))
                  }
                  continue;
              } else {
                  check = false;
                  if (this.debug) {
                      console.log("Failed: "+evaluations[x].split("object").join("row"))
                  }
                  break;
              }
              }
              if (check==true) {
              result.push(row);
              }
          }
          if (result.length < 1) {
              return false;
          }
          return result;
  	};
  	this.debugFunction = function(func,parameters,oops,catchAs) {
  	  	if(oops!==undefined&&catchAs!==undefined){
  	    	try{
  	    		this[func](parameters);
  	    	}
  	    	catch(catchAs){
  	      		oops();
  	    	}
  	    } else{
  	    	try{
  	      		this[func](parameters);
  	    	}
  	    	catch(err){
  	      		console.log(err);
  	    	}
  	  	}
  	}
  }
  function SessionStorageEngine(name, expiration) {
      //init
  	this.name = name;
  	if (sessionStorage.getItem(name)==null) {
  		var setup = new Array();
  		sessionStorage.setItem(name,JSON.stringify(setup));
  	}
    if (expiration) {
        if (expirations.get("name", name) == null) {
            expirations.add({
                name: name,
                date: new Date(),
                days: expiration
            });
        }
        var date1 = new Date(expirations.get("name", name).date);
        var date2 = new Date();
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var daysDiff = Math.ceil(timeDiff / (1000 * 3600 *24));
        if (daysDiff > expirations.get("name", name).days) {
            localStorage.setItem(this.name, JSON.stringify([]));
        }
    }
  	this.debug = false;
    //End of init

  	//Add an element and assign a value (which must be an object)
  	this.add = function(value) {
  		var rows = JSON.parse(sessionStorage.getItem(this.name));
  		rows.push(value);
  		sessionStorage.setItem(this.name, JSON.stringify(rows));
  		if(this.debug===true){console.log(this.name+" -> add: Object successfully added!");}
  	};
  	//Change a specific property of an element where a property equals a certain value: where BY equals "user4" set TITLE to "hello there"
  	this.edit = function(whereThis,equalsThis,setThis,ToThis) {
  		var rows = JSON.parse(sessionStorage.getItem(this.name));
  		if (rows.length>0){
  			for (var i = 0; i < rows.length; i++) {
  				var row = rows[i];
  				if (row[whereThis]==equalsThis) {
  					if(this.debug===true){console.log(this.name+" -> edit: Object before - ");console.log(row);}
  					row[setThis]=ToThis;
  					if(this.debug===true){console.log(this.name+" -> edit: Object after - ");console.log(row);}
  					rows[i] = row;
  					if(this.debug===true){console.log(this.name+" -> edit: Object saved!");}
  				}
  			}
  			sessionStorage.setItem(this.name, JSON.stringify(rows));
  		} else {
  			if(this.debug===true){console.log(this.name+" -> edit: No objects are stored!");}
  		}
  	};

  	//Remove an element where a specific property equals a certian value
  	this.remove = function(whereThis,equalsThis) {
  		var rows = JSON.parse(sessionStorage.getItem(this.name));
  		if (rows.length>0){
  			for (var i = 0; i < rows.length; i++) {
  				var row = rows[i];
  			    if (row[whereThis]==equalsThis) {
  			    	if(this.debug===true){console.log(this.name+" -> remove: Object matched for removal -");console.log(row);}
  			    	rows.splice(i,1);
  			    	if(this.debug===true){console.log(this.name+" -> remove: Object deleted!");}
  			    }
  			}
  			sessionStorage.setItem(this.name, JSON.stringify(rows));
  		} else {
  			if(this.debug===true){console.log(this.name+" -> remove: No objects are stored!");}
  		}
  	};

  	//Return an element as an object where a property equals a value
  	this.get = function(whereThis,equalsThis) {
  		var rows = JSON.parse(sessionStorage.getItem(this.name));
  		for (var i = 0; i < rows.length; i++) {
  			var row = rows[i];
  			if (row[whereThis]==equalsThis) {
  				if(this.debug===true){console.log(this.name+" -> get: Object found! ");console.log(row);}
  				return row;
  			}
  		}
  		if(this.debug===true){console.log(this.name+" -> get: Object not found!");}
  		if (rows.length<1&&this.debug===true){
  			console.log(this.name+" -> get: No objects, with the property of "+whereThis+", matched "+equalsThis);
  		}
  		return null;
  	};

  	//Return an array of all the elements as objects
  	this.listAll = function() {
  		var rows = JSON.parse(sessionStorage.getItem(this.name));
  		if (rows.length<1&&this.debug===true) {
  			console.log(this.name+" -> listAll: There are no stored objects to return!");
  		}
  		if(this.debug===true){console.log(this.name+" -> listAll: Objects were found!");console.log(rows);}
  		return rows;
  	};

  	//Return an array of elements as objects that all have a specific property that is equal to a certain value
  	this.where = function(whereThis,equalsThis) {
  		var result = new Array();
  		var rows = JSON.parse(sessionStorage.getItem(this.name));
  		for (var i = 0; i < rows.length; i++) {
  			var row = rows[i];
  			if (row[whereThis]==equalsThis) {
  				if(this.debug===true){console.log(this.name+" -> search: Object matched - ");console.log(row);}
  				result.push(row);
  			}
  		}
  		if (result.length<1&&this.debug===true) {
  			console.log(this.name+" -> search: No objects, with the property of "+whereThis+", matched "+equalsThis);
  		}
  		if(this.debug===true){console.log(this.name+" -> search: Final result - ");console.log(result);}
  		return result;
  	};
  	this.filter = function(evaluations) {
  		var data = JSON.parse(sessionStorage.getItem(this.name)),
  		    result = new Array(), check = null;
          for (var i = 0; i < data.length; i++) {
              var row = data[i];
              for (var x = 0; x < evaluations.length; x++) {
              if (eval(evaluations[x].split("object").join("row"))) {
                  check = true;
                  if (this.debug) {
                      console.log("Passed: "+evaluations[x].split("object").join("row"))
                  }
                  continue;
              } else {
                  check = false;
                  if (this.debug) {
                      console.log("Failed: "+evaluations[x].split("object").join("row"))
                  }
                  break;
              }
              }
              if (check==true) {
              result.push(row);
              }
          }
          if (result.length < 1) {
              return false;
          }
          return result;
  	};
  	this.debugFunction = function(func,parameters,oops,catchAs) {
  	  	if(oops!==undefined&&catchAs!==undefined){
  	    	try{
  	    		this[func](parameters);
  	    	}
  	    	catch(catchAs){
  	      		oops();
  	    	}
  	    } else{
  	    	try{
  	      		this[func](parameters);
  	    	}
  	    	catch(err){
  	      		console.log(err);
  	    	}
  	  	}
  	}
  }
  return function (name, storageType, ex) {
      this.expiration = ex==undefined||ex==null?false:ex;
      if (storageType=="session") {
          cloneObject(new SessionStorageEngine(name), this);
      } else if(storageType=="local") {
          cloneObject(new LocalStorageEngine(name, ex), this);
      }
      //element: dataType=DOMElement description "The element that you want to push the data to"
      //data: dataType=Array (an array of objects) description "The data you want to cycle through"
      //markup: dataType=String description "The markup you want to repeatedly paste into the elmement.
      // In the string use [-property-] anywhere in the markup to output that property for the current
      // object into the markup"
      this.pushData = function(element, data, markup) {
          if (markup=="auto") markup = element.innerHTML;

          if (typeof element == 'array') {
              for (var i = 0; i < element.length; i++) {
              for (var x = 0; x < data.length; x++) {
                  var temp = markup;
                  for (var prop in data[x]) {
                      var obj = data[w];
                      temp = temp.split("[-"+prop+"-]").join(obj[prop]);
                  }
                  element[i].innerHTML += temp;
              }
              }
          } else {
              for (var x = 0; x < data.length; x++) {
              var temp = markup;
              for (var prop in data[x]) {
                  var obj = data[x];
                  temp = temp.split("[-"+prop+"-]").join(obj[prop]);
              }
              element.innerHTML += temp;
              }
          }
      }
  }
})();
