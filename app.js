let canvaBG = "white"; // canva background color
let seletedTool = "pen";
let brushSize = 5;
let opacity = 100;
let paintColor = "red";
// not selecting any painters now
let paintTool = null;
let isDrawing = false;
let canvas = document.getElementById('canva-area');
// could draw 2D objects => ctx = context
let ctx = canvas.getContext('2d');
let slideBrush = document.getElementById('sizeSlider');
let slideOpacity = document.getElementById("opacitySlider");

const toolboxWidth = document.querySelector('section.tool-box').offsetWidth;
const paintToolsList = ["pen","eraser","text","circle","rectangle","triangle"];

console.log("toolbox width = " + toolboxWidth);
// console.log("MouseX = " + mouseX);

// canvas && mouse cursor
canvas.addEventListener('mouseenter', () => {
    if (paintTool === "pen") 
    {
        document.body.style.cursor = "url('../cursor_svg/pen-solid.svg') 16 16, auto";
    }
    else if(paintTool == "eraser")
    {
        document.body.style.cursor = "url('../cursor_svg/eraser-solid.svg') 16 16, auto";
    }
    else if(paintTool == "text")
    {
        document.body.style.cursor = "url('../cursor_svg/font-solid.svg') 16 16, auto";
    }
    else if(paintTool == "circle")
    {
        document.body.style.cursor = "url('../cursor_svg/circle-regular.svg') 16 16, auto";
    }
    else if(paintTool == "rectangle")
    {
        document.body.style.cursor = "url('../cursor_svg/square-regular.svg') 16 16, auto";
    }
    else if(paintTool == "triangle")
    {
        document.body.style.cursor = "url('../cursor_svg/caret-up-solid.svg') 16 16, auto";
    }
});

canvas.addEventListener('mouseleave', () => {
    document.body.style.cursor = "auto";
});

// slide for brush size
slideBrush.addEventListener('change',()=>{
    brushSize = slideBrush.value;
    console.log("brushSize = " + brushSize);
});

// slideOpacity.addEventListener("change",()=>{
//     opacity = slideOpacity.val / 100; // only have 0 -1
//     paintColor.setAlpha(opacity);
//     console.log("opacity = " + opacity);
// });

// for canvas && drawing

    // 按下滑鼠時開始繪製

canvas.addEventListener('mousedown', (mouse) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = mouse.offsetX-100;
    const y = mouse.offsetY-30;
    ctx.beginPath();
    ctx.move(x,y);
    console.log("isDrawing (mousedown):", isDrawing);
});

// 放開滑鼠時停止繪製
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    console.log("isDrawing (mouseup):", isDrawing);
});

canvas.addEventListener("mousemove",(mouse) => {
    if(isDrawing)
    {
        const rect = canvas.getBoundingClientRect();
        const x = mouse.offsetX-100;
        const y = mouse.offsetY-30;
        ctx.strokeStyle = paintColor;
        if(paintTool == "pen")
        {
            console.log("use pen draw");
            ctx.lineTo(x, y);
        }

        // actually reneder on the canva
        ctx.stroke();
    }
});


init();

function setup()
{

}
// initial function for the whole canva
function init()
{
    reset();
}

// click the button
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

    else if(btn == "reset")
    {
        console.log("reset canva");
        reset();
    }
}


// reset
function reset() 
{
    // fill with the background color
    ctx.fillStyle = canvaBG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}