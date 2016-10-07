# What is SLS?
SLS is a general Session and Local Storage management object contructor.
This means it allows you to construct objects to easily manage storing data with the sessionStorage and localStorage APIs.
SLS allows you to perform basic queries such as add, get, edit, remove, filter and more.
It also gives you the ability to set certain data to expire after so many days. 

# Getting Started

Basic use of SLS:
```js
// Create a localStorage system called "logs" that will clear its data after 7 days.
var loggingSystem = new storageSystem("logs", "local", 7);
// NOTE: the exipration period is an optional parameter.

// Store a log
loggingSystem.add({
  id: loggingSystem.listAll().length,
  timeStamp: new Date(),
  description: "I did something cool",
  madeBy: "John Doe"
});

// Change a log where the id is equal to 0 (meaning the first item).
// Set description to "actually it doesn't work"
loggingSystem.edit("id", 0, "description", "actually it doesn't work");

//Add a copy of the first log to the loggingSystem
logginSystem.add(loggingSystem.get("id", 0));

//Get the newest log object
var log = loggingSystem.get("id", loggingSyste.listAll().length-1);

//Get an array of all of the stored log objects
var allLogs = loggingSystem.listAll();

// Remove the first log
loggingSystem.remove("id", 0);

// Get an array of all of the logs that were made by John Doe
loggingSystem.where("madeBy", "John Doe");

// Get an array of all of the logs that were made by John Doe that also have a description that is longer than 5 characters
loggingSystem.filter([
  "object.madeBy=='John Doe'",
  "object.description.length>5"
]);

```
