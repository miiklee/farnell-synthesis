
const playButton = document.querySelector('button');
var audioCtx;
    
playButton.addEventListener('click', function () {
    if (!audioCtx) {
        initAudio();
        return;
    }
    else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    else if (audioCtx.state === 'running') {
        audioCtx.suspend();
    }

}, false);

    


function initAudio(){

    audioCtx = new (window.AudioContext || window.webkitAudioContext)
    
    var bufferSize = 10 * audioCtx.sampleRate,
    noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
    output = noiseBuffer.getChannelData(0);

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
        var brown = Math.random() * 2 - 1;

        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    brownNoise = audioCtx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.start(0); 


    const input = audioCtx.createBiquadFilter()
    const freq = audioCtx.createBiquadFilter()
    const brook = audioCtx.createBiquadFilter()
    
    input.type = 'lowpass'
    input.frequency.setValueAtTime(400, audioCtx.currentTime);
    
    
    freq.type = 'lowpass'
    freq.frequency.setValueAtTime(14, audioCtx.currentTime);
    
    const friend = new ConstantSourceNode(audioCtx, {offset: 400})
    brook.type = 'highpass'
    brook.frequency = brownNoise.connect(freq) * friend + 500;
    brook.Q = 0.03;
    

    brownNoise.connect(input).connect(brook).connect(audioCtx.destination);
    

}