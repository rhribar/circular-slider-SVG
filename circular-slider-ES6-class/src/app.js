import '../styles/main.css';

/* import '../styles/main.scss'; */

let Slider = require('../lib/Slider').default;

let transportation = new Slider({color: "#5d3b6d", max: 950, min: 50, step: 50, radius: 180, amountContainerId: "legend__transportation"});
let food = new Slider({color: "#127fc3", max: 975, min: 50, step: 25, radius: 150, amountContainerId: "legend__food"});
let insurance = new Slider({color: "#22a823", max: 990, min: 50, step: 10, radius: 120, amountContainerId: "legend__insurance"});
let entertainment = new Slider({color: "#fd8123", max: 975, min: 50, step: 25, radius: 90, amountContainerId: "legend__entertainment"});
let healthcare = new Slider({color: "#fd3b3f", max: 995, min: 10, step: 5, radius: 60, amountContainerId: "legend__healthcare"});

document.getElementById("legend__transportation").getElementsByClassName("legend__price")[0].innerHTML = "$" + transportation.options.min;
document.getElementById("legend__food").getElementsByClassName("legend__price")[0].innerHTML = "$" + food.options.min;
document.getElementById("legend__insurance").getElementsByClassName("legend__price")[0].innerHTML = "$" + insurance.options.min;
document.getElementById("legend__entertainment").getElementsByClassName("legend__price")[0].innerHTML = "$" + entertainment.options.min;
document.getElementById("legend__healthcare").getElementsByClassName("legend__price")[0].innerHTML = "$" + healthcare.options.min;

transportation.setStepNo(5);
food.setStepNo(10);
insurance.setStepNo(10);
entertainment.setStepNo(10);
healthcare.setStepNo(25);