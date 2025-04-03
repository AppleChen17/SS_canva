let canvaBG = "white"; // canva background color
let seletedTool = "pen";
let brushSize = 5;
let opacity = 100;
let paintColor = "red";
// not selecting any painters now
let paintTool = null;
let isDrawing = false;
let fontSize = 18;
let setFontSize = document.getElementById('fontSize');
let BG = document.getElementById('background');
let canvas = document.getElementById('canva-area');
// could draw 2D objects => ctx = context
let BGctx = BG.getContext('2d')
let ctx = canvas.getContext('2d');
let slideBrush = document.getElementById('sizeSlider');
let slideOpacity = document.getElementById("opacitySlider");
let inputFile = document.getElementById('fileInput');

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

setFontSize.addEventListener("change",()=>{
    fontSize = setFontSize.value;
    console.log("change font size to ",fontSize);
});

// input file call handleImage
// false -> 按照事情冒泡順序而不是捕獲順序做處理 ! 
// false is default
inputFile.addEventListener('change', handleImage, false); 


canvas.addEventListener('mousedown', (mouse) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = mouse.clientX - rect.left;
    const y = mouse.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
});

canvas.addEventListener('mousemove', (mouse) => {
    if (isDrawing) 
    {
        const rect = canvas.getBoundingClientRect();
        const x = mouse.clientX - rect.left;
        const y = mouse.clientY - rect.top;

        ctx.strokeStyle = paintColor;

        if(paintTool == "pen")
        {
            ctx.lineTo(x, y);
            ctx.moveTo(x, y);
            ctx.stroke();
            ctx.lineWidth = brushSize;
        }
        else if (paintTool === "eraser") 
        {
            ctx.clearRect(x - brushSize/2, y - brushSize/2, brushSize*2, brushSize*2);
        }

        // else if(paintTool == "text")
        // {
            
        // }
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath();
});


init();

// initial function for the whole canva
function init()
{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.font = "20pt Arial";
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
    else if(btn == "upload")
    {
        inputFile.click();
    }

    // download
    // ref : https://stackoverflow.com/questions/8126623/downloading-canvas-element-to-an-image
    else if(btn == "save")
    {
        console.log("save img");
        let combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = canvas.width;
        combinedCanvas.height = canvas.height;
        let combinedCtx = combinedCanvas.getContext('2d');
    
        combinedCtx.fillStyle = "white";
        combinedCtx.fillRect(0,0,canvas.width,canvas.height);

        // set background
        // BGctx.fillStyle = canvaBG;
        // BG.width = canvas.width;
        // BG.height = canvas.height;
        // BGctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // combinedCtx.drawImage(BG, 0, 0);
    
        // draw the upper one on the combined canva
        combinedCtx.drawImage(canvas, 0, 0);
    
        // a tag in <html>
        let link = document.createElement('a');
        link.download = 'masterpiece.png';
        link.href = combinedCanvas.toDataURL();
        link.click();
    }

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


// ref1: https://stackoverflow.com/questions/10906734/how-to-upload-image-into-html5-canvas
// ref2: https://jsfiddle.net/influenztial/qy7h5/
function handleImage(e)
{
    /*
    the order of executing the program
    reader.readAsDataURL(e.target.files[0]) would trigger reader.onload() 
    => img.src = event.target.result sent to img to be its src
    => img.onload() be triggered
    */
    let reader = new FileReader();
    // onload => if the reader and img load successfully than would call this !
    reader.onload = (event) => {
        let img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        // event.target => is the reader. 
        // so it means that the reader's result (may be base64 or something else)
        // it would be the source of img.src
        img.src = event.target.result;
    }

    // e.target => the one that have this event => <input type="file">! 
    // files[0] to get the first file
    reader.readAsDataURL(e.target.files[0]);  
}
// reset
function reset() 
{
    // fill with the background color
    BGctx.fillStyle = canvaBG;
    BG.width = canvas.width;
    BG.height = canvas.height;
    BGctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.strokeStyle = paintColor;
    // ctx.lineWidth = brushSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}