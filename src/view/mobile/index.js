var ReactDOM = require('react-dom');  // Browserify!
var Mobile = require("./MobileComponent.js");

ReactDOM.render(
    document.getElementById("container"),
    <Mobile access="true"/>
);