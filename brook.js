
const playBrook = document.getElementById('brook');
const playDial = document.getElementById('dial');
var audioCtx1;
var audioCtx2;


playBrook.addEventListener('click', function () {
    if (!audioCtx1) {
        if(audioCtx2){ audioCtx2.suspend();}
        brook();
        return;
    }
    else if (audioCtx1.state === 'suspended') {
        if(audioCtx2){ audioCtx2.suspend();}
        audioCtx1.resume();
    }
    else if (audioCtx1.state === 'running') {
        audioCtx1.suspend();
    }


}, false);


playDial.addEventListener('click', function () {
    if (!audioCtx2) {
        if(audioCtx1){ audioCtx1.suspend();}
        dial();
        document.getElementById('r2').style.display = 'inline';
        return;
    }
    else if (audioCtx2.state === 'suspended') {
        if(audioCtx1){ audioCtx1.suspend();}
        audioCtx2.resume();
        document.getElementById('r2').style.display = 'inline';
    }
    else if (audioCtx2.state === 'running') {
        document.getElementById('r2').style.display = 'none';
        audioCtx2.suspend();
    }

}, false);



function dial(){

    audioCtx2 = new AudioContext()
    
    var osc1 = audioCtx2.createOscillator();
    osc1.type = 'sine'
    osc1.frequency.value = 350

    var osc2 = audioCtx2.createOscillator();
    osc2.type = 'sine'
    osc2.frequency.value = 440
    
    //osc1.connect(osc2);
    var gain = audioCtx2.createGain();
    gain.gain = 0.125/2
    osc2.connect(gain).connect(audioCtx2.destination)
    osc1.connect(gain).connect(audioCtx2.destination)
    osc1.start()
    osc2.start()
    

    
}


function brook(){
    //this first part I worked with Gabrielle D'Agostino and Chang Su Nam
    audioCtx1 = new AudioContext()

    //brown noise
    var bufferSize = 10 * audioCtx1.sampleRate,
    noiseBuffer = audioCtx1.createBuffer(1, bufferSize, audioCtx1.sampleRate),
    output = noiseBuffer.getChannelData(0);

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
        var brown = Math.random() * 2 - 1;

        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    brownNoise = audioCtx1.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.start(0);
    
    const input = audioCtx1.createBiquadFilter()
    const freq = audioCtx1.createBiquadFilter()
    const brook = audioCtx1.createBiquadFilter()
    
    const totalGain = audioCtx1.createGain();
    totalGain.gain.value = 0.1;

    const freqGain = audioCtx1.createGain();
    freqGain.gain.value = 400;

    input.type = 'lowpass'
    input.frequency.value = 400;
    
    freq.type = 'lowpass'
    freq.frequency.value = 14;
    const helper = new ConstantSourceNode(audioCtx1, {offset: 500})
    
    brook.type = 'highpass'
    brook.Q.value = 1/0.03;

    
    brownNoise.connect(input).connect(brook)
    brownNoise.connect(freq).connect(freqGain)
    freqGain.connect(brook.frequency)
    helper.connect(brook.frequency)
    brook.connect(totalGain).connect(audioCtx1.destination);
}