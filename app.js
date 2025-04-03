let canvaBG = "white"; // canva background color
let seletedTool = "pen";
let brushSize = 5;
let opacity = 100;
let paintColor = "red";
// not selecting any painters now
let paintTool = null;
let isDrawing = false;
let hasInput = false;
let fontSize = "18px";
let fontType = "sans-serif";
let setFontSize = document.getElementById('fontSize');
let setFontType = document.getElementById("fontType");
let BG = document.getElementById('background');
let canvas = document.getElementById('canva-area');
// could draw 2D objects => ctx = context
let BGctx = BG.getContext('2d')
let ctx = canvas.getContext('2d');
let slideBrush = document.getElementById('sizeSlider');
let slideOpacity = document.getElementById("opacitySlider");
let inputFile = document.getElementById('fileInput');

// 圓心 for circle!
let startX,startY,lastRadius=0;
let undo_path = [];//for undo
let redo_path = [];
let shape_path = []; //for clear shape
const toolboxWidth = document.querySelector('section.tool-box').offsetWidth;
const paintToolsList = ["pen","eraser","text","circle","rectangle","triangle"];
const tempCanvas = document.createElement('canvas');
tempCanvas.width = canvas.width;
tempCanvas.height = canvas.height;
const tempCtx = tempCanvas.getContext('2d');

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

// for text input
// ref: https://stackoverflow.com/questions/21011931/how-to-embed-an-input-or-textarea-in-a-canvas-element
canvas.addEventListener("click",(e)=>{
    if(paintTool != "text" || hasInput) return;
    addInput(e.offsetX, e.offsetY);
});

// slide for brush size
slideBrush.addEventListener('change',()=>{
    brushSize = slideBrush.value;
    console.log("brushSize = " + brushSize);
});

setFontSize.addEventListener("change",()=>{
    fontSize = setFontSize.value;
    console.log("change font size to ",fontSize);
    ctx.font = `${fontSize} ${fontType}`;

    console.log(ctx.font);
});

setFontType.addEventListener("change",()=>{
    fontType = setFontType.value;
    console.log("change font type to ",fontType);
    ctx.font = `${fontSize} ${fontType}`;
    console.log(ctx.font);
});

// input file call handleImage
// false -> 按照事情冒泡順序而不是捕獲順序做處理 ! 
// false is default
inputFile.addEventListener('change', LoadImage, false); 


canvas.addEventListener('mousedown', (mouse) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = mouse.clientX - rect.left;
    const y = mouse.clientY - rect.top;
    startX = x;
    startY = y;
    shape_path.push(canvas.toDataURL());
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

        // draw circle
        else if(paintTool == "circle")
        {
            // console.log("draw circle");
            // const dx = x - startX;
            // const dy = y - startY;
            // radius = Math.sqrt(dx * dx + dy * dy);

            // if(shape_path.length == 1) shape_path.push(canvas.toDataURL());
            // restore(shape_path[0]);
            // ctx.beginPath();
            // ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            // ctx.stroke();
            // shape_path.push(canvas.toDataURL());
            // // fill in shape?
            // // ctx.fillStyle = "blue";
            // // ctx.fill();
            // lastRadius = radius;
        }
    }
});

canvas.addEventListener('mouseup', () => {
    undo_path.push(canvas.toDataURL());
    isDrawing = false;
    shape_path = [];
    ctx.beginPath();
});

// initial function for the whole canva
function init()
{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.font = `${fontSize} ${fontType}`;
    reset();
    undo_path.push(canvas.toDataURL());
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
        // hide the <input> and be triggered by the button !
        inputFile.click();
    }

    // download
    // ref : https://stackoverflow.com/questions/8126623/downloading-canvas-element-to-an-image
    else if(btn == "save")
    {
        console.log("save img");
        let combined = document.createElement('canvas');
        combined.width = canvas.width;
        combined.height = canvas.height;
        let combinedCtx = combined.getContext('2d');
    
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
        link.href = combined.toDataURL();
        link.click();
    }

    // undo
    else if(btn == "undo")
    {
        // nothing to undo already
        let len = undo_path.length;
        if(len == 0) return;
        let last = undo_path.pop();// js => WOULD return element
        redo_path.push(last);
        restore(undo_path[undo_path.length-1]);
    }

    // redo
    else if(btn == "redo")
    {
        console.log("redo size = ", redo_path.length);
        if(redo_path.length == 0) return;

        // Move last item from redo_path to undo_path
        undo_path.push(redo_path.pop());
    
        // Restore the last state from undo_path
        restore(undo_path[undo_path.length - 1]);
    }

    else if(btn == "reset")
    {
        console.log("reset canva");
        reset();
    }
}


// ref1: https://stackoverflow.com/questions/10906734/how-to-upload-image-into-html5-canvas
// ref2: https://jsfiddle.net/influenztial/qy7h5/
function LoadImage(e)
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
            undo_path.push(canvas.toDataURL());
        }
        // event.target => is the reader. 
        // so it means that the reader's result (may be base64 or something else)
        // it would be the source of img.src

        // same pic event.target.result may be same so NOT load again (since may not be triggered)
        img.src = "";  // clear img.src to ensure that even uploading the same pic it would triggered onload
        img.src = event.target.result;
        // img.src = event.target.result + "?t=" + Date.now();
    }

    // e.target => the one that have this event => <input type="file">! 
    // files[0] to get the first file
    reader.readAsDataURL(e.target.files[0]);  
}

// for text input
function addInput(x,y) // the present mouse position
{
    // create a html text input element
    let text_input = document.createElement('input');
    text_input.type = 'text';
    text_input.style.position = 'fixed';
    text_input.style.left = x + 'px';
    text_input.style.top = y + 'px';

    text_input.addEventListener('keydown', (e) => {
        let key = e.key;
        // press Enter for ending the input
        if (key === "Enter") {
            // parseInt => 10 base
            ctx.fillText(text_input.value, x, y);

            // take away the input box
            document.body.removeChild(text_input);
            hasInput = false;
            undo_path.push(canvas.toDataURL());
        }
    });

    document.body.appendChild(text_input);
    // could text-in directly !!
    text_input.focus();
    hasInput = true; // for avoid repeated input place
}

// go back to a previous state
function restore(state)
{
    console.log("in restore");
    let screen = new Image();
    screen.src = state; //return to the previous
    screen.addEventListener("load",()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(screen, 0, 0);
    });
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


// main
init();