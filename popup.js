let essentia;
let isEssentiaInstance = false;
let audioCtx;
let bufferSize = 2048;
let hopSize = 1024;
let melNumBands = 96;
// global var getUserMedia mic stream
let gumStream;

// settings for plotting
let plotContainerId = "plotDiv";
let plotSpectrogram;

// record native microphone input and do further audio processing on each audio buffer using the given callback functions
function startMicRecordStream(
  audioCtx,
  bufferSize,
  onProcessCallback,
  btnCallback
) {
  if (navigator.getUserMedia) {
    console.log("Initializing audio...");
    navigator.getUserMedia(
      { audio: true, video: false },
      function(stream) {
        gumStream = stream;
        if (gumStream.active) {
          console.log(
            "Audio context sample rate = " + audioCtx.sampleRate
          );
          var mic = audioCtx.createMediaStreamSource(stream);
         
          // In most platforms where the sample rate is 44.1 kHz or 48 kHz,
          // and the default bufferSize will be 4096, giving 10-12 updates/sec.
          console.log("Buffer size = " + bufferSize);
          if (audioCtx.state == "suspended") {
            audioCtx.resume();
          }
          const scriptNode = audioCtx.createScriptProcessor(bufferSize, 1, 1);
          // onprocess callback (here we can use essentia.js algos)
          scriptNode.onaudioprocess = onProcessCallback;
          // It seems necessary to connect the stream to a sink for the pipeline to work, contrary to documentataions.
          // As a workaround, here we create a gain node with zero gain, and connect temp to the system audio output.
          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0, audioCtx.currentTime);
          mic.connect(scriptNode);
          scriptNode.connect(gain);
          gain.connect(audioCtx.destination);

          if (btnCallback) {
            btnCallback();
          }
        } else {
          throw "Mic stream not active";
        }
      },
      function(message) {
        throw "Could not access microphone - " + message;
      }
    );
  } else {
    throw "Could not access microphone - getUserMedia not available";
  }
}

try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  } catch (e) {
    throw "Could not instantiate AudioContext: " + e.message;
  }

  startMicRecordStream(audioCtx, bufferSize, onProcessCallback)

  function onProcessCallback(event) {
    var bufferSignal = essentia.arrayToVector(event.inputBuffer.getChannelData(0));
    if (!bufferSignal) { throw "onRecordingError: empty audio signal input found!"};
  }

