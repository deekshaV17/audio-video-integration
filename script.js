let startButton = document.getElementById("start_button");
let stopButton = document.getElementById("stop_button");
let replayButton = document.getElementById("replay_button");
let videoContainer = document.getElementById("video_container");
let audioEnabled = document.getElementById("audio_enabled");
let videoEnabled = document.getElementById("video_enabled");
let recorder = null;

wait = function (delayInMS) {
  return new Promise(resolve => setTimeout(resolve, delayInMS));
};

startRecording = function () {
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({
      audio: audioEnabled.checked,
      video: videoEnabled.checked
    }).then(function (stream) {
      startButton.hidden = true;
      setSrcObject(stream, videoContainer);
      videoContainer.play();
      videoContainer.muted = true;

      recorder = new RecordRTCPromisesHandler(stream, {
        mimeType: 'videoContainer/mp4',
        bitsPerSecond: 1280000
      });

      recorder.startRecording().then(function () {
        wait(5000).then(
          () => stopRecording()
        );
      }).catch(function (error) {
        alert('Cannot start video recording: '+ error);
      });

      recorder.stream = stream;
      stopButton.hidden = false;
    }).catch(function (error) {
      alert("Cannot access media devices: " + error);
    });
  } else {
    alert("Some text here");
  }
};

stopRecording = function () {
    recorder.stopRecording().then(function () {
      let blob = recorder.getBlob();
      videoContainer.src = URL.createObjectURL(blob);
      recorder.stream.stop();

      startButton.hidden = false;
      replayButton.hidden = false;
      stopButton.hidden = true;
    }).catch(function (error) {
      alert('stopRecording failure: '+ error);
    });
};


replayRecording = function () {
  videoContainer.muted = false;
  videoContainer.play();
};
