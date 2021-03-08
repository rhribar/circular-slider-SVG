 const rootSVG = document.getElementById("rootSVG");
 const rect = document.getElementById("rectangle");
 const circle = document.getElementById("circle");
 const container = document.getElementById("container");

// 1. moving with offsetX
/* function screenToSVG(e) {
    positionX = e.clientX;
    positionX_o = e.offsetX;
    positionY_o = e.offsetY;
    console.log(positionX, positionX_o)

    circle.setAttributeNS(null, "cx", positionX_o);
    circle.setAttributeNS(null, "cy", positionY_o);
}

let isDragging = false;

rect.addEventListener("mousedown", e => {
    e.preventDefault();
    isDragging = true;}
)

rect.addEventListener("mousemove", e => {
    e.preventDefault();
    screenToSVG(e);}
) */


// 2. moving with offsetX
/* function screenToSVG(e) {
    let svgPoint = rootSVG.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;

    let transform = svgPoint.matrixTransform(rootSVG.getScreenCTM().inverse());
    console.log(transform.x, e.offsetX);


    circle.setAttributeNS(null, "cx", transform.x);
    circle.setAttributeNS(null, "cy", transform.y);
}

let isDragging = false;

container.addEventListener("mousedown", e => {

    isDragging=true;
    screenToSVG(e);
}
)

container.addEventListener("mousemove", e => {
    e.preventDefault();
    if(isDragging) {
        screenToSVG(e);
 
    }
    console.log("2.5");
})

container.addEventListener("mouseup", e => {
    e.preventDefault();


    if(isDragging === true) {
        isDragging = false;
    }
    
    }
)


console.log(isDragging); */



/* const moveSlider = (slider, direction) => {
    let value = slider.value;
    let coord = "c" + direction;

    circle.setAttributeNS(null, coord, value * 5);
}  */


