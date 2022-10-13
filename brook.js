
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

    audioCtx = new AudioContext()
    
    //brown noise
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
    
    const totalGain = audioCtx.createGain();
    totalGain.gain.value = 0.1;

    const freqGain = audioCtx.createGain();
    freqGain.gain.value = 400;

    input.type = 'lowpass'
    input.frequency.value = 400;
    
    freq.type = 'lowpass'
    freq.frequency.value = 14;
    const helper = new ConstantSourceNode(audioCtx, {offset: 500})
    helper.connect(freq)
    
    brook.type = 'highpass'
    brook.Q.value = 1/0.03;

    
    brownNoise.connect(input).connect(brook)
    brownNoise.connect(freq).connect(freqGain).connect(brook.frequency)
    
    brook.connect(totalGain).connect(audioCtx.destination);


}