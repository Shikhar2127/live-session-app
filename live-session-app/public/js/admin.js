// public/js/admin.js
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const sessionArea = document.getElementById('sessionArea');
  const sessionUrlInput = document.getElementById('sessionUrl');

  const video = document.getElementById('videoPlayer');
  const playPauseBtn = document.getElementById('playPause');
  const volumeSlider = document.getElementById('volume');
  const fullscreenBtn = document.getElementById('fullscreen');
  const playbackRate = document.getElementById('playbackRate');

  startBtn.addEventListener('click', async () => {
    startBtn.disabled = true;
    startBtn.textContent = 'Creating...';
    try {
      const res = await fetch('/api/sessions', { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error('Failed to create session');
      const { userurl } = data.session;
      sessionUrlInput.value = userurl;
      sessionArea.style.display = 'block';
      startBtn.style.display = 'none';
      // Auto-play video (some browsers require user gesture)
      try { await video.play(); } catch(e) { /* ignore */ }
    } catch (err) {
      alert('Error creating session: ' + err.message);
      startBtn.disabled = false;
      startBtn.textContent = 'START SESSION';
    }
  });

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
