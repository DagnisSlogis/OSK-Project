// Global variables
var inputs = [], proceses = [];
var processButton, resetButton, addInputButton, removeInputButton, inputX, inputY, algoLabel, algoSelect, algorithm;
var timerHtml;

// Setup everything
function setup() {
  // create canvas
  var canvas = createCanvas(980, 600);
  canvas.parent('canvas');
  algorithm = new Algorithm();
  createForm();
  createTestingCanva();
  createElement('h1', 'CPU Scheduling Algorithm Animation').position(20, 0);
}

// Adds process input field
function addProcess() {
  size = inputs.length;
  if(size < 9) {
    inputY += 35;
    inputs.push(new Input(inputX, inputY, 'P'+(size+1)));
    if(size == 8) {
      addInputButton.hide();
    }
    else if(size == 1) {
      removeInputButton.show();
    }
  }
}

// Removes process input field
function removeProcess() {
  size = inputs.length;
  if(size > 1) {
    inputY -= 35;
    inputs[size-1].delete();
    inputs.pop();
    if(size == 2) {
      removeInputButton.hide();
    }
    else if(size == 9) {
      addInputButton.show();
    }
  }
}

function startAlgorithm() {
  if(everythingIsFiled()) {
    proceses = [];
    for (var i=0; i<inputs.length; i++) {
      proceses.push(new Process(i+1, inputs[i].burstTime.value(), inputs[i].priority.value()));
    }

    switch(algoSelect.value()) {
      case "FCFS":
          algorithm.clean();
          algorithm.fcfs(proceses);
          break;
      case "SJF":
          console.log("SJF");
          break;
      case "Round robin":
          console.log("Round robin");
          break;
      case "Priority":
          console.log("Priority");
          break;        
    }
  }
  else {
    alert("Some Process is not filled!")
  }
}

function resetCanvas() {
  console.log("resetCanvas");
  proceses = [];
  algorithm.clean();
}

// initialize control form
function createForm() {
  inputX = 20;
  inputY = 70;

  algoLabel = createSpan("Algorithm").position(inputX-10, inputY);
  algoSelect = createSelect().position(inputX+70, inputY).size(145, 20);
  algoSelect.option("FCFS");
  algoSelect.option("SJF");
  algoSelect.option("Round robin");
  algoSelect.option("Priority");
  inputY += 105;
  
  for (var i=1; i<4; i++) {
    inputY += 35;
    inputs.push(new Input(inputX, inputY, 'P'+i));
  }

  createElement('strong', "Name").position(10, 175);
  createElement('strong', "Burst Time").position(70, 175);
  createElement('strong', "Priority").position(170, 175);

  processButton = createButton('Start').position(10, 105);
  resetButton = createButton("Reset").position(58, 105);
  addInputButton = createButton('Add Process').position(10, 140);
  removeInputButton = createButton('Remove Process').position(105, 140);

  addInputButton.mousePressed(addProcess);
  removeInputButton.mousePressed(removeProcess);
  processButton.mousePressed(startAlgorithm);
  resetButton.mousePressed(resetCanvas);
}

function createTestingCanva() {
  createElement("h3", "Average wait time:").position(310, 70);
  timerHtml = createElement("h3", "Timer:").position(310, 90);
}

// Validator
function everythingIsFiled() {
  for (var i=0; i<inputs.length; i++) {
    if (!inputs[i].burstTime.value() || !inputs[i].priority.value()) {
      console.log(!inputs[i].burstTime.value() || !inputs[i].priority.value())
      return false;
    }
  }
  return true;
}