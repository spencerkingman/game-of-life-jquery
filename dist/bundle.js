/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var size = 100;
var initialLifeProb = 0.18;
var turnLength = 25;
var world = createWorld(size);
var crowdNumsArr = createWorld(size);
var clock = void 0;
var turnCounter = void 0;

function createWorld(size) {
  var world = Array(size).fill(0);
  for (var i = 0; i < size; ++i) {
    world[i] = Array(size).fill(0);
  }
  return world;
}

function initializeWorld() {
  if ($('#grid').children().length === 0) {
    var tileName = void 0;
    for (var i = 0; i < size; ++i) {
      $('#grid').append($('<div/>').addClass("row"));
      for (var j = 0; j < size; ++j) {
        tileName = "tile" + i + "-" + j;
        $('.row').last().append($('<div/>').attr("id", tileName).addClass("tile"));
        if (Math.random() < initialLifeProb) world[i][j] = 1;
      }
    }
  } else {
    for (var _i = 0; _i < size; ++_i) {
      for (var _j = 0; _j < size; ++_j) {
        if (Math.random() < initialLifeProb) world[_i][_j] = 1;
      }
    }
  };
  turnCounter = 0;
}

function crowdCount(i, j) {
  var count = 0;
  var last = size - 1;
  count += world[(i - 1 + size) % size][(j - 1 + size) % size]; //up left
  count += world[(i - 1 + size) % size][j]; //up 
  count += world[(i - 1 + size) % size][(j + 1) % size]; //up right
  count += world[i][(j - 1 + size) % size]; //left
  count += world[i][(j + 1) % size]; //right
  count += world[(i + 1) % size][(j - 1 + size) % size]; //down left
  count += world[(i + 1) % size][j]; //down
  count += world[(i + 1) % size][(j + 1) % size]; //down right

  return count;
}

function handleClear(event) {
  event.preventDefault();
  for (var i = 0; i < size; ++i) {
    for (var j = 0; j < size; ++j) {
      world[i][j] = 0;
    }
  }
  renderWorld();
  if ($("#pauseButton").hasClass("playing")) {
    $("#pauseButton").trigger("click");
  }
}

function handlePause(event) {
  event.preventDefault();
  if ($("#pauseButton").hasClass("playing")) {
    clearInterval(clock);
    $("#pauseButton").removeClass("playing").html("Play");
  } else {
    clock = setInterval(doTurn, turnLength);
    $("#pauseButton").addClass("playing").html("Pause");
  }
}

function handleStartOver(event) {
  event.preventDefault();
  initializeWorld();
  if (!$("#pauseButton").hasClass("playing")) {
    $("#pauseButton").trigger("click");
  }
}

function handleTileClick(event) {
  event.preventDefault();
  var id = $(this).attr("id");
  var hyphenIndex = id.indexOf("-");
  var i = id.substring(4, hyphenIndex);
  var j = id.substring(hyphenIndex + 1);
  if (world[i][j] === 0) {
    $(this).css("background-color", "red");
    world[i][j] = 1;
  } else {
    $(this).css("background-color", "black");
    world[i][j] = 0;
  }
}

function renderWorld() {
  for (var i = 0; i < size; ++i) {
    for (var j = 0; j < size; ++j) {
      var tileId = "#tile" + i + "-" + j;
      if (world[i][j] === 0) $(tileId).css("background-color", "black");else $(tileId).css("background-color", "white");
    }
  }
  $("#turnCounter").text("Turns: " + turnCounter);
}

function doTurn() {
  for (var i = 0; i < size; ++i) {
    for (var j = 0; j < size; ++j) {
      crowdNumsArr[i][j] = crowdCount(i, j);
    }
  }
  for (var _i2 = 0; _i2 < size; ++_i2) {
    for (var _j2 = 0; _j2 < size; ++_j2) {
      if (world[_i2][_j2] === 0 && crowdNumsArr[_i2][_j2] === 3) {
        world[_i2][_j2] = 1;
      };
      if (world[_i2][_j2] === 1 && (crowdNumsArr[_i2][_j2] <= 1 || crowdNumsArr[_i2][_j2] >= 4)) {
        world[_i2][_j2] = 0;
      }
    }
  }
  turnCounter++;
  renderWorld();
}

$(document).ready(function () {
  initializeWorld();
  clock = setInterval(doTurn, turnLength);
  $("#startOverButton").on("click", handleStartOver);
  $("#pauseButton").on("click", handlePause);
  $("#clearButton").on("click", handleClear);
  $(".tile").on("click", handleTileClick);
});

/***/ })
/******/ ]);