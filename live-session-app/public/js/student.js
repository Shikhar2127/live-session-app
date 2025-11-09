// public/js/student.js
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('videoPlayer');
  const playPauseBtn = document.getElementById('playPause');
  const volumeSlider = document.getElementById('volume');
  const fullscreenBtn = document.getElementById('fullscreen');
  const playbackRate = document.getElementById('playbackRate');

  playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playPauseBtn.textContent = 'Pause';
    } else {
      video.pause();
      playPauseBtn.textContent = 'Play';
    }
  });

  volumeSlider.addEventListener('input', () => {
    video.volume = parseFloat(volumeSlider.value);
  });

  fullscreenBtn.addEventListener('click', () => {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  });

  playbackRate.addEventListener('change', () => {
    video.playbackRate = parseFloat(playbackRate.value);
  });
});
