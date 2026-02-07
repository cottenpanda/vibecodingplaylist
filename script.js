/**
 * Spotify Playlist Portfolio
 * Track interactions and playback simulation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const tracks = document.querySelectorAll('.track');
  const playlistContainer = document.getElementById('playlistContainer');
  const videoPanel = document.getElementById('videoPanel');

  // Blobs for ambient color shift
  const blobs = document.querySelectorAll('.blob');
  const scribbleStar = document.querySelector('.scribble-star');

  // Color palettes for each track (4 colors per track for 4 blobs)
  const trackColors = [
    ['#4ECDC4', '#FF6B9D', '#F7B733', '#7B68EE'], // 1. Cozy Journaling
    ['#FF8C42', '#4ABDAC', '#A855F7', '#FFD93D'], // 2. yanliuos
    ['#6366F1', '#EC4899', '#10B981', '#F59E0B'], // 3. Mindstream
    ['#3B82F6', '#10B981', '#6366F1', '#F97316'], // 4. Focus now
    ['#8B5CF6', '#06B6D4', '#F43F5E', '#84CC16'], // 5. Virtual Online Studio
    ['#059669', '#7C3AED', '#F97316', '#0EA5E9'], // 6. 3D Cabin
    ['#0891B2', '#E11D48', '#65A30D', '#9333EA'], // 7. One, not many
    ['#D946EF', '#14B8A6', '#EAB308', '#3B82F6'], // 8. PixelArt Studio
    ['#F97316', '#8B5CF6', '#22C55E', '#EC4899'], // 9. Halloween Pumpkin
    ['#06B6D4', '#F43F5E', '#A3E635', '#8B5CF6'], // 10. Painting Gallery
    ['#EF4444', '#3B82F6', '#FBBF24', '#10B981'], // 11. Credit card scanning
    ['#6B7280', '#9CA3AF', '#4B5563', '#D1D5DB'], // 12. Vintage Computer
    ['#EC4899', '#8B5CF6', '#06B6D4', '#F59E0B'], // 13. Suno
    ['#F59E0B', '#EF4444', '#A855F7', '#22C55E'], // 14. Fireworks
  ];

  // Default blob colors
  const defaultColors = ['#F5A623', '#4ABDAC', '#FC6E51', '#F7B733'];

  // Blobs react to mouse movement
  let mouseX = 0;
  let mouseY = 0;
  let blobX = 0;
  let blobY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateBlobs() {
    // Smooth lerp toward mouse position
    blobX += (mouseX - blobX) * 0.05;
    blobY += (mouseY - blobY) * 0.05;

    blobs.forEach((blob, i) => {
      const speed = (i + 1) * 15;
      const xOffset = blobX * speed;
      const yOffset = blobY * speed;
      blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });

    requestAnimationFrame(animateBlobs);
  }

  animateBlobs();

  // Update ambient colors based on track
  function updateAmbientColors(trackIndex) {
    const colors = trackIndex >= 0 ? trackColors[trackIndex] : defaultColors;
    blobs.forEach((blob, i) => {
      blob.style.background = colors[i % colors.length];
    });
  }

  // Star particle burst
  function createStarBurst(e) {
    const particles = ['✦', '✧', '⋆', '✵', '✶', '✷', '✸', '✹', '★', '☆'];
    const colors = ['#FF6B9D', '#FFD93D', '#4ECDC4', '#A855F7', '#F7B733', '#fff'];

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'star-particle';
      particle.textContent = particles[Math.floor(Math.random() * particles.length)];
      particle.style.left = e.clientX + 'px';
      particle.style.top = e.clientY + 'px';
      particle.style.color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
      particle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 1000);
    }
  }

  // Star click handler
  if (scribbleStar) {
    scribbleStar.addEventListener('click', createStarBurst);
  }

  const panelClose = document.getElementById('panelClose');
  const panelVideo = document.getElementById('panelVideo');
  const panelTitle = document.getElementById('panelTitle');
  const panelArtist = document.getElementById('panelArtist');
  const panelDesc = document.getElementById('panelDesc');
  const panelPlayBtn = document.getElementById('panelPlayBtn');
  const panelPrevBtn = document.getElementById('panelPrevBtn');
  const panelNextBtn = document.getElementById('panelNextBtn');
  const panelProgressFill = document.getElementById('panelProgressFill');
  const panelProgressBar = document.getElementById('panelProgressBar');
  const panelCurrentTime = document.getElementById('panelCurrentTime');
  const panelTotalTime = document.getElementById('panelTotalTime');

  // Now playing bar elements
  const nowPlayingTitle = document.getElementById('nowPlayingTitle');
  const nowPlayingArtist = document.getElementById('nowPlayingArtist');
  const nowPlayingThumb = document.getElementById('nowPlayingThumb');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressFill = document.getElementById('progressFill');
  const totalTimeEl = document.getElementById('totalTime');
  const playAllBtn = document.getElementById('playAllBtn');

  // Parallax scroll elements
  const playlistCover = document.querySelector('.playlist-cover');
  const playlistHeader = document.querySelector('.playlist-header');

  // State
  let currentTrackIndex = -1;
  let isPlaying = false;
  let isPanelOpen = false;

  // Parallax scroll effect - vinyl only
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const headerHeight = playlistHeader ? playlistHeader.offsetHeight : 400;

    if (scrollY < headerHeight && playlistCover && !isPanelOpen) {
      const coverOffset = scrollY * 0.4;
      playlistCover.style.transform = `translateY(${coverOffset}px)`;
    }
  });

  // Track if current video is YouTube
  let isYouTube = false;
  const panelVideoContainer = document.getElementById('panelVideoContainer');

  // Load YouTube fallback
  function loadYouTube(youtubeId) {
    isYouTube = true;
    panelVideo.style.display = 'none';
    const existingIframe = panelVideoContainer.querySelector('iframe');
    if (existingIframe) existingIframe.remove();
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&mute=0&controls=1&modestbranding=1&rel=0`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.id = 'youtubePlayer';
    panelVideoContainer.appendChild(iframe);
  }

  // Open panel with track data
  function openPanel(index) {
    const track = tracks[index];
    const title = track.querySelector('.track-title').textContent;
    const artist = track.querySelector('.track-artist').textContent;
    const desc = track.querySelector('.track-desc')?.innerHTML || '';
    const video = track.querySelector('video source')?.getAttribute('src') || '';
    const youtubeId = track.getAttribute('data-youtube');
    const duration = track.querySelector('.track-duration').textContent;

    // Update panel content
    panelTitle.textContent = title;
    panelArtist.textContent = artist;
    panelDesc.innerHTML = desc;
    panelTotalTime.textContent = duration;

    // Reset state
    isYouTube = false;
    const existingIframe = panelVideoContainer.querySelector('iframe');
    if (existingIframe) existingIframe.remove();
    panelVideo.style.display = 'block';

    // Try local video first, fallback to YouTube if it fails
    panelVideo.querySelector('source').setAttribute('src', video);
    panelVideo.load();

    // If local video fails and we have YouTube fallback
    if (youtubeId) {
      panelVideo.onerror = () => loadYouTube(youtubeId);
      // Also check if source fails to load
      const source = panelVideo.querySelector('source');
      source.onerror = () => loadYouTube(youtubeId);
    }

    // Open panel
    videoPanel.classList.add('active');
    document.body.classList.add('panel-open');
    isPanelOpen = true;

    // Update track states
    tracks.forEach(t => t.classList.remove('active'));
    track.classList.add('active');
    currentTrackIndex = index;

    // Update now playing bar
    updateNowPlaying({ title, artist, duration });

    // Update ambient colors
    updateAmbientColors(index);

    // Auto play
    panelVideo.play().catch(() => {
      // If play fails and we have YouTube, use it
      if (youtubeId && !isYouTube) {
        loadYouTube(youtubeId);
      }
    });
    isPlaying = true;
    panelPlayBtn.classList.add('playing');
    playPauseBtn.classList.add('playing');
  }

  // Close panel
  function closePanel() {
    videoPanel.classList.remove('active');
    document.body.classList.remove('panel-open');
    isPanelOpen = false;

    // Stop video
    if (isYouTube) {
      const iframe = panelVideoContainer.querySelector('iframe');
      if (iframe) iframe.remove();
    } else {
      panelVideo.pause();
      panelVideo.currentTime = 0;
    }
    isPlaying = false;
    isYouTube = false;
    panelPlayBtn.classList.remove('playing');
    playPauseBtn.classList.remove('playing');

    // Reset track states
    tracks.forEach(t => t.classList.remove('active'));
    currentTrackIndex = -1;

    // Reset now playing
    updateNowPlaying(null);

    // Reset ambient colors
    updateAmbientColors(-1);
  }

  // Track click and 3D tilt effect
  tracks.forEach((track, index) => {
    track.addEventListener('click', () => {
      if (currentTrackIndex === index && isPanelOpen) {
        // Clicking same track - close panel
        closePanel();
      } else {
        // Open panel with new track
        openPanel(index);
      }
    });

    // 3D tilt on hover
    track.addEventListener('mousemove', (e) => {
      const rect = track.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      track.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    track.addEventListener('mouseleave', () => {
      track.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });

  // Close button
  panelClose.addEventListener('click', closePanel);

  // Panel play/pause
  panelPlayBtn.addEventListener('click', () => {
    if (isPlaying) {
      panelVideo.pause();
      isPlaying = false;
      panelPlayBtn.classList.remove('playing');
      playPauseBtn.classList.remove('playing');
      nowPlayingThumb.classList.remove('playing');
    } else {
      panelVideo.play();
      isPlaying = true;
      panelPlayBtn.classList.add('playing');
      playPauseBtn.classList.add('playing');
      nowPlayingThumb.classList.add('playing');
    }
  });

  // Panel prev/next
  panelPrevBtn.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
      openPanel(currentTrackIndex - 1);
    }
  });

  panelNextBtn.addEventListener('click', () => {
    if (currentTrackIndex < tracks.length - 1) {
      openPanel(currentTrackIndex + 1);
    }
  });

  // Video progress update
  panelVideo.addEventListener('timeupdate', () => {
    if (panelVideo.duration) {
      const percent = (panelVideo.currentTime / panelVideo.duration) * 100;
      panelProgressFill.style.width = percent + '%';
      progressFill.style.width = percent + '%';
      panelCurrentTime.textContent = formatTime(panelVideo.currentTime);
    }
  });

  // Auto-play next track when video ends
  panelVideo.addEventListener('ended', () => {
    if (currentTrackIndex < tracks.length - 1) {
      openPanel(currentTrackIndex + 1);
    } else {
      // Loop back to first track
      openPanel(0);
    }
  });

  // Seekable progress bar
  panelProgressBar.addEventListener('click', (e) => {
    const rect = panelProgressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    panelVideo.currentTime = percent * panelVideo.duration;
  });

  // Format time helper
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Update now playing bar
  function updateNowPlaying(data) {
    if (data) {
      nowPlayingTitle.textContent = data.title;
      nowPlayingArtist.textContent = data.artist;
      totalTimeEl.textContent = data.duration;
      nowPlayingThumb.classList.add('playing');
    } else {
      nowPlayingTitle.textContent = 'Select a track';
      nowPlayingArtist.textContent = '—';
      totalTimeEl.textContent = '0:00';
      progressFill.style.width = '0%';
      nowPlayingThumb.classList.remove('playing');
    }
  }

  // Now playing bar controls
  playPauseBtn.addEventListener('click', () => {
    if (!isPanelOpen && tracks.length > 0) {
      openPanel(0);
      return;
    }

    if (isPlaying) {
      panelVideo.pause();
      isPlaying = false;
      panelPlayBtn.classList.remove('playing');
      playPauseBtn.classList.remove('playing');
      nowPlayingThumb.classList.remove('playing');
    } else {
      panelVideo.play();
      isPlaying = true;
      panelPlayBtn.classList.add('playing');
      playPauseBtn.classList.add('playing');
      nowPlayingThumb.classList.add('playing');
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
      openPanel(currentTrackIndex - 1);
    } else if (!isPanelOpen && tracks.length > 0) {
      openPanel(tracks.length - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentTrackIndex < tracks.length - 1) {
      openPanel(currentTrackIndex + 1);
    } else if (!isPanelOpen && tracks.length > 0) {
      openPanel(0);
    }
  });

  // Play all button
  playAllBtn.addEventListener('click', () => {
    openPanel(0);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      playPauseBtn.click();
    }
    if (e.code === 'ArrowRight') {
      nextBtn.click();
    }
    if (e.code === 'ArrowLeft') {
      prevBtn.click();
    }
    if (e.code === 'Escape' && isPanelOpen) {
      closePanel();
    }
  });

  // Mobile swipe gestures
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  videoPanel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  videoPanel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const minSwipeDistance = 50;

    // Horizontal swipe (prev/next)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // Swipe right - previous track
        if (currentTrackIndex > 0) {
          openPanel(currentTrackIndex - 1);
        }
      } else {
        // Swipe left - next track
        if (currentTrackIndex < tracks.length - 1) {
          openPanel(currentTrackIndex + 1);
        }
      }
    }

    // Vertical swipe down (close panel)
    if (diffY > minSwipeDistance && Math.abs(diffY) > Math.abs(diffX)) {
      closePanel();
    }
  }
});
