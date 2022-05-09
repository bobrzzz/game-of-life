let counter: HTMLElement | null;
let gameToggleButton: HTMLElement | null;
let speedIncreaseButton: HTMLElement | null;
let speedDecreaseButton: HTMLElement | null;
let speedMeter: HTMLElement | null;

function init() {
    return new Promise((resolve, reject) => {
        window.onload = function() {
            initElements();
            resolve();
        }
    })
}

function initElements() {
    counter = document.querySelector('.panel__counter');
    gameToggleButton = document.querySelector('.panel__button');
    speedIncreaseButton = document.getElementById('speedIncrease');
    speedDecreaseButton = document.getElementById('speedDecrease');
    speedMeter = document.getElementById('speedMeter');
}

function initToggleButton(callback: () => boolean) {
    gameToggleButton?.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        const isRunning = callback();        
        if(gameToggleButton) {
            gameToggleButton.innerText = isRunning ? 'Pause' : 'Start';
        }

    });  
}

function initSpeedIncreaseButton(callback: () => void) {
    speedIncreaseButton?.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        callback();        
    }); 
}

function initSpeedDecreaseButton(callback: () => void) {
    speedDecreaseButton?.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        callback();        
    }); 
}

function addGlobalListener(callback: EventListener, type = 'click') {
    window.addEventListener(type, callback);
}

function updateCycleMeter(cycleAmount: string | number) {
    if(!counter) {
        return;    
    }
    // I feel like those type guard a bit bulky, even too much maybe
    if(typeof cycleAmount === 'number') {
        cycleAmount = cycleAmount.toString(); 
    }

    counter.innerText = cycleAmount;
}

function updateSpeedMeter(newSpeed: number) {
    if(speedMeter) {
        speedMeter.innerText = newSpeed.toString();
    }
}

export {
    init,
    initToggleButton,
    initSpeedIncreaseButton,
    initSpeedDecreaseButton,
    addGlobalListener,
    updateCycleMeter,
    updateSpeedMeter
}
