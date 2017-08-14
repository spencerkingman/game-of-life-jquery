const size = 100;
const initialLifeProb = 0.18;
const turnLength = 25;
let world = createWorld(size);
let crowdNumsArr = createWorld(size);
let clock;
let turnCounter;
    
function createWorld(size) {
  let world = Array(size).fill(0); 
  for (let i = 0; i < size; ++i) {
    world[i] = Array(size).fill(0);
  }
  return world;
}

function initializeWorld() {
  if($('#grid').children().length === 0) {
    let tileName;
    for (let i = 0; i < size; ++i) {
      $('#grid').append(
        $('<div/>')
          .addClass("row")
      );
      for (let j = 0; j < size; ++j) {
        tileName = "tile"+i+"-"+j;  
        $('.row').last().append(
          $('<div/>')
            .attr("id", tileName)
            .addClass("tile")
        );
        if (Math.random() < initialLifeProb) world[i][j] = 1;  
      }  
    }  
  } else {
    for (let i = 0; i < size; ++i) {
      for (let j = 0; j < size; ++j) {
        if (Math.random() < initialLifeProb) world[i][j] = 1;  
      }  
    }
    
  };
  turnCounter = 0;
}

function crowdCount(i, j) {
  let count = 0;
  const last = size-1;
  count += world[((i-1)+size)%size][((j-1)+size)%size]; //up left
  count += world[((i-1)+size)%size][j]; //up 
  count += world[((i-1)+size)%size][(j+1)%size]; //up right
  count += world[i][((j-1)+size)%size]; //left
  count += world[i][(j+1)%size]; //right
  count += world[(i+1)%size][((j-1)+size)%size]; //down left
  count += world[(i+1)%size][j]; //down
  count += world[(i+1)%size][(j+1)%size]; //down right
  
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
  const id = $(this).attr("id");
  const hyphenIndex = id.indexOf("-");
  const i = id.substring(4,hyphenIndex);
  const j = id.substring(hyphenIndex+1);
  if (world[i][j] === 0) {
    $(this).css("background-color", "red");
    world[i][j] = 1;
  } else {
    $(this).css("background-color", "black");
    world[i][j] = 0;
  }
}

function renderWorld() {
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      let tileId = "#tile"+i+"-"+j;
      if (world[i][j] === 0) $(tileId).css("background-color", "black");
      else $(tileId).css("background-color", "white");
    }  
  }
  $("#turnCounter").text("Turns: "+turnCounter);
}

function doTurn() {
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      crowdNumsArr[i][j] = crowdCount(i, j);
    }  
  }
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      if (world[i][j] === 0 && crowdNumsArr[i][j] === 3) {
        world[i][j] = 1;
      };
      if (world[i][j] === 1 && (crowdNumsArr[i][j] <= 1 || crowdNumsArr[i][j] >= 4)) {
        world [i][j] = 0;
      }
    }  
  }
  turnCounter++;
  renderWorld();
}

$(document).ready(function() {  
  initializeWorld();
  clock = setInterval(doTurn, turnLength);
  $("#startOverButton").on("click",  handleStartOver);
  $("#pauseButton").on("click",  handlePause);
  $("#clearButton").on("click",  handleClear);
  $(".tile").on("click", handleTileClick);
})