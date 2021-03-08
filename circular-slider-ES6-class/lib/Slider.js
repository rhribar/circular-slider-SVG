/* import "@babel/plugin-proposal-nullish-coalescing-operator"; */

const STROKE_WIDTH = 20;
const HANDLER_RADIUS = (STROKE_WIDTH / 2) + 2;
/* const TOLERANCE = 40; */
const SVG_NS = "http://www.w3.org/2000/svg";

export default class Slider {

    constructor(options) {
        this.options = options;
        this.options.container = options.container ?? "slider";
        this.options.color = options.color ?? "blue";
        this.options.max = options.max ?? 100;
        this.options.min = options.min ?? 0;
        this.options.step = options.step ?? 1;
        this.options.radius = options.radius ?? 50;

        this.options.amountContainerId = options.amountContainerId ?? "transportation";

        this.init();
    }

    init() {
        this.isDragging = false;
        this.centerX = 0;
        this.centerY = 0;
        this.currentStep = 0;
        this.circumference = this.options.radius * 2 * Math.PI;
        this.maxSteps = this.calculateMaxSteps();
        this.position = this.calculateNewPosition(this.centerX, this.centerY - this.options.radius)

        this.initSlider();
    }


    initSlider() {
        const container = document.getElementsByClassName(this.options.container)[0];
        this.checkRootSVG(container);

        this.slider = this.drawCurrentPath();
        this.handle = this.drawHandle();
        this.path = this.drawPath();

        this.svg.appendChild(this.path);
        this.svg.appendChild(this.slider);
        this.svg.appendChild(this.handle);
        
        this.initEventHandlers();

    }

    currentValue() {
        return this.options.min + (this.currentStep * this.options.step);
    }

    test() {
        return this.options.min;
    }

    checkRootSVG(container) {
        this.svg = document.getElementsByClassName("sliderSVG")[0];

        if (this.svg === null || this.svg === undefined) {
            this.svg = this.createRootSVG();
            container.appendChild(this.svg);
        }
    }

    createRootSVG() {
        const svg = document.createElementNS(SVG_NS, "svg");

        svg.setAttributeNS(null, "class", "sliderSVG");
        svg.setAttributeNS(null, "width", 500);
        svg.setAttributeNS(null, "height", 500);
        svg.setAttributeNS(null, "style", "background-color:none");
        svg.setAttributeNS(null, "viewBox", "-200 -200 400 400");

        return svg;
    }

    createCircleSVG(cx, cy, r, fill) {
        const container = document.createElementNS(SVG_NS, "circle");

        container.setAttributeNS(null, 'cx', cx);
        container.setAttributeNS(null, 'cy', cy);
        container.setAttributeNS(null, 'r', r);
        container.setAttributeNS(null, "fill", fill);

        return container;
    }

    drawHandle() {
        const handle = this.createCircleSVG(this.centerX, this.centerY - this.options.radius, HANDLER_RADIUS, "none");

        handle.setAttributeNS(null, 'class', 'sliderSVG__handle');
        handle.setAttributeNS(null, "stroke", "grey");
        handle.setAttributeNS(null, "stroke-width", "1px");

        return handle;
    }

    drawPath() {
        const slider = this.createCircleSVG(this.centerX, this.centerY, this.options.radius, "none");

        slider.setAttributeNS(null, 'class', 'sliderSVG__dashed-circle');
        slider.setAttributeNS(null, 'transform', 'rotate(-90)');

        slider.setAttributeNS(null, "stroke", this.options.color);
        slider.setAttributeNS(null, "stroke-width", STROKE_WIDTH + "px");
        slider.setAttributeNS(null, 'stroke-dasharray', "5, 2");

        return slider;
    }

    drawCurrentPath() {
        const slider = this.createCircleSVG(this.centerX, this.centerY, this.options.radius, "none");

        slider.setAttributeNS(null, 'class', 'sliderSVG__top-slider');
        slider.setAttributeNS(null, 'transform', 'rotate(-90)');
        
        slider.setAttributeNS(null, "stroke", this.options.color);
        slider.setAttributeNS(null, "stroke-width", STROKE_WIDTH + 1 + "px");
        slider.setAttributeNS(null, 'stroke-dasharray', `${this.circumference} ${this.circumference}`);
        slider.setAttributeNS(null, 'stroke-dashoffset', `${this.circumference}`);

        return slider;
    }

    screenToSVG(e) {
        e.preventDefault();

        let svgPoint = this.svg.createSVGPoint();
        [svgPoint.x, svgPoint.y] = [e.clientX, e.clientY];
        let transform = svgPoint.matrixTransform(this.svg.getScreenCTM().inverse());

        return {
            x: transform.x,
            y: transform.y
        }
    }

    convertPointToRad(x, y) {
        return Math.atan2(x, - y); // add here centerX and centerY !offset! if needed
    }

    calculateNewPosition(angleRad) {
        const X = Math.round(Math.sin(angleRad) * this.options.radius);
        const Y = Math.round(Math.cos(angleRad) * this.options.radius * -1);

        /* console.log(X, Y); */

        const radians360 = angleRad < 0 ? angleRad + 2 * Math.PI : angleRad;
        const angleDegrees = radians360 * 180.0 / Math.PI;

        return {
            x: Math.floor(angleDegrees) === 359 ? -1 : X,
            y: Y,
            degrees: angleDegrees,
            radians: radians360,
        };
    }

    moveSlider(e) {
        const position = this.screenToPosition(e);

        let value =  this.currentValue();
        let roundedValue = Math.round(value * 100) / 100;
        
        document.getElementById(this.options.amountContainerId).getElementsByClassName("legend__price")[0].innerHTML = "$" + roundedValue;

        if(!this.checkCollision(position)) { console.log(-1); return; }

        /* this.slider.style.transition = "all 0.1s ease-in-out";
        this.handle.style.transition = "all 0.1s ease-in-out"; */

        const adjustedPosition = this.adjustPosition(position);

        requestAnimationFrame(() => {
            this.slider.setAttributeNS(null, 'stroke-dashoffset', `${adjustedPosition.arcPath}`);
            this.handle.style.transform = `rotate(${adjustedPosition.calculatedDegrees}deg)`;
            this.updateState(position, adjustedPosition.thisStep);
        });
    }

    screenToPosition(e) {
        const localCoord = this.screenToSVG(e);
        const angleRad = this.convertPointToRad(localCoord.x , localCoord.y);
        const newPosition = this.calculateNewPosition(angleRad);

        return newPosition;
    }

    adjustPosition(position) {
        let thisStep = this.degreesToStep(position.degrees);
        let calculatedDegrees = this.calculateStepValueRad(thisStep);
        let arcPath = this.calculateArcLength(calculatedDegrees);

        return {thisStep, calculatedDegrees, arcPath}
    }

    calculateArcLength(degrees) {
        let length = Math.PI * this.options.radius * degrees / 180;
        let adjustedLength = this.circumference - length;

        return adjustedLength;
    }

    setStepNo(stepNo) {
        let calculatedDegrees = this.calculateStepValueRad(stepNo);
        let arcPath = this.calculateArcLength(calculatedDegrees);

        let value =  (this.options.min + (stepNo * this.options.step));
        let roundedValue = Math.round(value * 100) / 100;
        
        
        document.getElementById(this.options.amountContainerId).getElementsByClassName("legend__price")[0].innerHTML = "$" + roundedValue;

        requestAnimationFrame(() => {
            this.slider.setAttributeNS(null, 'stroke-dashoffset', `${arcPath}`);
            this.handle.style.transform = `rotate(${calculatedDegrees}deg)`;
        });
    }

    initEventHandlers() {
        window.addEventListener("mousemove", e => { this.onDrag(e); });
        window.addEventListener("mouseup", e => { this.endDrag(e); });
        window.addEventListener("mouseleave", e => this.endDrag(e));

        window.addEventListener("touchmove", e => {this.handleTouch(e); });
        window.addEventListener("touchcancel", e => this.handleTouch(e));
        window.addEventListener("touchend", e => this.handleTouch(e));

        (this.handle).addEventListener("mousedown", e => { this.startDrag(e); });
        (this.path).addEventListener("mousedown", e => { this.startDrag(e); this.onDrag(e); });
        (this.slider).addEventListener("mousedown", e => { this.startDrag(e); this.onDrag(e); });
        (this.handle).addEventListener("touchstart", e => {this.handleTouch(e); });
    }

    startDrag(e) {
        e.preventDefault();
        this.isDragging=true;
    }

    onDrag(e) {
        e.preventDefault();
        if(this.isDragging) { this.moveSlider(e); }
    }

    endDrag(e) {
        e.preventDefault();
        if(this.isDragging) { this.isDragging = false; }
    }

    checkCollision(newPosition) {
        return !(this.position.y < 0 && ((this.position.x >= 0 && newPosition.x < 0) || (this.position.x < 0 && newPosition.x >= 0)));
    }

    updateState(newPosition, currentStep) {
        this.position = newPosition;
        this.currentStep = currentStep;
    }

    calculateMaxSteps() {
        return (this.options.max - this.options.min) / this.options.step;
    }

    calculateStepValueRad(stepN) {
        let value = stepN * this.options.step + this.options.min;
        let adjustedVal = value - this.options.min;
        let range = this.options.max - this.options.min;
        
        let degrees;
        if(this.options.max === value) {
            degrees = 359.99;
        } else {
            degrees = (Math.round(adjustedVal * (360.0 / range))) % 360;
        }
        return degrees;
    }

    degreesToStep(deg) {
        const range = this.options.max - this.options.min;
        const value = Math.round(deg * (range / 360.0)) + this.options.min;
        const step = Math.round((value - this.options.min) / this.options.step);

        return step;
    }


    // simulate mouse events
    handleTouch(e) {
        const touches = e.changedTouches;

        // Ignore multi-touch
        if (touches.length > 1) return;

        const touch = touches[0];
        const events = ["touchstart", "touchmove", "touchend", "touchcancel"];
        const mouseEvents = ["mousedown", "mousemove", "mouseup", "mouseleave"];
        const ev = events.indexOf(e.type);

        if (ev === -1) return;

        const type = e.type === events[2] && this.lastTouchType === events[0] ? 'click' : mouseEvents[ev];
        const simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
            touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);

        touch.target.dispatchEvent(simulatedEvent);
        e.preventDefault();
        this.lastTouchType = e.type;
    };
}