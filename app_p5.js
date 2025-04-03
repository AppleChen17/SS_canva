let canvaBG = "white"; // canva background color
let seletedTool = "pen";
let brushSize = 5;
let opacity = 100;
let paintColor = "red";
// not selecting any painters now
let paintTool = null;
let isDrawing = false;

const toolboxWidth = document.querySelector('section.tool-box').offsetWidth;
const paintToolsList = ["pen","eraser","text","circle","rectangle","triangle"];

console.log("toolbox width = " + toolboxWidth);

function setup()
{
    let canvas = createCanvas(windowWidth - toolboxWidth, windowHeight *0.93);
    canvas.parent(select('section.canvas'));
    background(canvaBG);
}

function onClick(btn)
{
    // choose different paint tool
    if(paintToolsList.includes(btn))
    {
        paintTool = btn;
    }

    // upload
    // else if
    // {

    // }

    // download
    // else if
    // {

    // }

    // undo
    // else if
    // {

    // }

    // redo
    // else if
    // {

    // }

    // reset
}

function draw() {
	// check if mouse button is pressed and mouse is hovering over canvas section
  if (mouseIsPressed && mouseX <= windowWidth - toolboxWidth) {
    // set the paint color
    setPaintColor()

    // draw on the canvas with the selected painting tool function
    window[selectedTool]()
  }
}