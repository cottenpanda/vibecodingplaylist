/**
 * Spotify Playlist Portfolio
 * Track interactions and playback simulation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Typewriter effect for title
  const typewriterEl = document.getElementById('typewriter');
  const titleText = 'VIBE CODING';

  // Create spans for each letter with staggered animation
  titleText.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${0.5 + i * 0.08}s`;
    typewriterEl.appendChild(span);
  });

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
    ['#EC4899', '#8B5CF6', '#06B6D4', '#F59E0B'], // 13. Vibe code the vibe
    ['#F59E0B', '#EF4444', '#A855F7', '#22C55E'], // 14. Fireworks
    ['#00FF00', '#0066FF', '#FF00FF', '#00FFFF'], // 15. Pixel rain mini game
    ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'], // 16. Quick Interaction Experiments
  ];

  // Default blob colors
  const defaultColors = ['#F5A623', '#4ABDAC', '#FC6E51', '#F7B733'];

  // Blobs: ambient floating + mouse reaction
  let mouseX = 0;
  let mouseY = 0;
  let blobX = 0;
  let blobY = 0;
  let time = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateBlobs() {
    time += 0.005;

    // Smooth lerp toward mouse position
    blobX += (mouseX - blobX) * 0.03;
    blobY += (mouseY - blobY) * 0.03;

    blobs.forEach((blob, i) => {
      // Mouse-reactive movement
      const mouseSpeed = (i + 1) * 20;
      const xMouse = blobX * mouseSpeed;
      const yMouse = blobY * mouseSpeed;

      // Ambient floating animation (each blob has unique pattern)
      const floatX = Math.sin(time * (0.5 + i * 0.2)) * (30 + i * 10);
      const floatY = Math.cos(time * (0.4 + i * 0.15)) * (25 + i * 8);
      const scale = 1 + Math.sin(time * (0.3 + i * 0.1)) * 0.1;

      blob.style.transform = `translate(${xMouse + floatX}px, ${yMouse + floatY}px) scale(${scale})`;
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
  const tryItBtn = document.getElementById('tryItBtn');
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

  // Secret video popover
  const artistName = document.getElementById('artistName');
  const secretPopover = document.getElementById('secretPopover');
  const secretVideo = document.getElementById('secretVideo');
  const secretClose = document.getElementById('secretClose');

  // Cloudinary fallback for secret video
  if (secretVideo) {
    secretVideo.addEventListener('error', () => {
      const cloudinaryUrl = secretVideo.dataset.cloudinary;
      if (cloudinaryUrl && secretVideo.src !== cloudinaryUrl) {
        secretVideo.src = cloudinaryUrl;
        secretVideo.load();
      }
    }, true);
  }

  function closeSecretPopover() {
    secretPopover.classList.remove('active');
    secretVideo.pause();
    secretVideo.currentTime = 0;
  }

  if (artistName && secretPopover) {
    artistName.addEventListener('click', (e) => {
      e.stopPropagation();

      // Position popover directly below yanliudesign (desktop only)
      // On mobile, CSS handles centering with position: fixed
      if (window.innerWidth > 600) {
        const rect = artistName.getBoundingClientRect();
        const playlistInfo = document.querySelector('.playlist-info');
        const infoRect = playlistInfo.getBoundingClientRect();
        secretPopover.style.top = (rect.bottom - infoRect.top + 8) + 'px';
        secretPopover.style.left = (rect.left - infoRect.left) + 'px';
      } else {
        // Clear inline styles for mobile so CSS takes over
        secretPopover.style.top = '';
        secretPopover.style.left = '';
      }

      secretPopover.classList.toggle('active');
      if (secretPopover.classList.contains('active')) {
        secretVideo.play();
      } else {
        closeSecretPopover();
      }
    });

    // Close button
    if (secretClose) {
      secretClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSecretPopover();
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!secretPopover.contains(e.target) && !artistName.contains(e.target)) {
        closeSecretPopover();
      }
    });
  }

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
    const cloudinaryUrl = track.querySelector('video')?.getAttribute('data-cloudinary') || '';
    const youtubeId = track.getAttribute('data-youtube');
    const duration = track.querySelector('.track-duration').textContent;

    // Update panel content
    panelTitle.textContent = title;
    panelArtist.textContent = artist;
    panelDesc.innerHTML = desc;
    panelTotalTime.textContent = duration;

    // Handle "Try it" button - only show if data-demo URL exists
    const demoUrl = track.getAttribute('data-demo');
    if (tryItBtn) {
      if (demoUrl && demoUrl.trim() !== '') {
        tryItBtn.dataset.url = demoUrl;
        tryItBtn.classList.add('visible');
        // Inline styles as fallback for Google App Browser
        tryItBtn.style.cssText = 'display: block; position: absolute; right: 20px; top: 4px; padding: 6px 14px; color: #1DB954; background: transparent; border: 1px solid #1DB954; border-radius: 20px; text-decoration: none; font-size: 13px; white-space: nowrap;';
      } else {
        tryItBtn.dataset.url = '';
        tryItBtn.classList.remove('visible');
        tryItBtn.style.cssText = 'display: none;';
      }
    }

    // Reset state
    isYouTube = false;
    const existingIframe = panelVideoContainer.querySelector('iframe');
    if (existingIframe) existingIframe.remove();
    panelVideo.style.display = 'block';

    // Reset video slider transform (in case of leftover from swipe)
    const slider = document.getElementById('videoSlider');
    if (slider) {
      slider.style.transition = 'none';
      slider.style.transform = 'translateX(0)';
    }

    // Try local video first, fallback to Cloudinary, then YouTube
    const source = panelVideo.querySelector('source');
    let triedCloudinary = false;

    function handleVideoError() {
      if (cloudinaryUrl && !triedCloudinary) {
        triedCloudinary = true;
        source.setAttribute('src', cloudinaryUrl);
        panelVideo.load();
      } else if (youtubeId) {
        loadYouTube(youtubeId);
      }
    }

    panelVideo.onerror = handleVideoError;
    source.onerror = handleVideoError;

    // Auto play when video is ready
    const playWhenReady = () => {
      panelVideo.play().then(() => {
        isPlaying = true;
        panelPlayBtn.classList.add('playing');
        playPauseBtn.classList.add('playing');
      }).catch(() => {
        if (youtubeId && !isYouTube) {
          loadYouTube(youtubeId);
        }
      });
      panelVideo.removeEventListener('loadeddata', playWhenReady);
    };
    panelVideo.addEventListener('loadeddata', playWhenReady);

    source.setAttribute('src', video);
    panelVideo.load();

    // Open panel - save scroll position for mobile
    if (!isPanelOpen) {
      document.body.dataset.scrollY = window.scrollY;
      document.body.style.top = `-${window.scrollY}px`;
    }
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
  }

  // Close panel
  function closePanel() {
    videoPanel.classList.remove('active');
    document.body.classList.remove('panel-open');

    // Restore scroll position on mobile
    const scrollY = document.body.dataset.scrollY || 0;
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY));

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

  // Try it button click
  if (tryItBtn) {
    tryItBtn.addEventListener('click', () => {
      const url = tryItBtn.dataset.url;
      if (url) {
        window.open(url, '_blank');
      }
    });
  }

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
    } else {
      // Loop to last track
      openPanel(tracks.length - 1);
    }
  });

  panelNextBtn.addEventListener('click', () => {
    if (currentTrackIndex < tracks.length - 1) {
      openPanel(currentTrackIndex + 1);
    } else {
      // Loop back to first track
      openPanel(0);
    }
  });

  // Video progress update
  let isSeeking = false;

  panelVideo.addEventListener('timeupdate', () => {
    if (panelVideo.duration && !isSeeking) {
      const percent = (panelVideo.currentTime / panelVideo.duration) * 100;
      panelProgressFill.style.width = percent + '%';
      if (progressFill) progressFill.style.width = percent + '%';
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

  // Seekable progress bar with drag support
  function seekToPosition(e, progressBar) {
    const rect = progressBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (panelVideo.duration) {
      panelVideo.currentTime = percent * panelVideo.duration;
      panelProgressFill.style.width = (percent * 100) + '%';
      progressFill.style.width = (percent * 100) + '%';
      panelCurrentTime.textContent = formatTime(panelVideo.currentTime);
    }
  }

  panelProgressBar.addEventListener('mousedown', (e) => {
    isSeeking = true;
    seekToPosition(e, panelProgressBar);

    const onMouseMove = (e) => seekToPosition(e, panelProgressBar);
    const onMouseUp = () => {
      isSeeking = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Touch support for mobile
  panelProgressBar.addEventListener('touchstart', (e) => {
    isSeeking = true;
    const touch = e.touches[0];
    seekToPosition({ clientX: touch.clientX }, panelProgressBar);
  }, { passive: true });

  panelProgressBar.addEventListener('touchmove', (e) => {
    if (isSeeking) {
      const touch = e.touches[0];
      seekToPosition({ clientX: touch.clientX }, panelProgressBar);
    }
  }, { passive: true });

  panelProgressBar.addEventListener('touchend', () => {
    isSeeking = false;
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
      if (totalTimeEl) totalTimeEl.textContent = data.duration;
      nowPlayingThumb.classList.add('playing');
    } else {
      nowPlayingTitle.textContent = 'Select a track';
      nowPlayingArtist.textContent = '—';
      if (totalTimeEl) totalTimeEl.textContent = '0:00';
      if (progressFill) progressFill.style.width = '0%';
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
    } else {
      // Loop to last track
      openPanel(tracks.length - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentTrackIndex < tracks.length - 1) {
      openPanel(currentTrackIndex + 1);
    } else {
      // Loop back to first track
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

  // Mobile swipe on video to change tracks
  const videoSlider = document.getElementById('videoSlider');
  const videoSwipeOverlay = document.getElementById('videoSwipeOverlay');
  let videoTouchStartX = 0;
  let videoTouchCurrentX = 0;
  let isVideoSwiping = false;

  if (videoSwipeOverlay && videoSlider) {
    videoSwipeOverlay.addEventListener('touchstart', (e) => {
      videoTouchStartX = e.touches[0].clientX;
      videoTouchCurrentX = 0;
      isVideoSwiping = true;
      videoSlider.style.transition = 'none';
    }, { passive: true });

    videoSwipeOverlay.addEventListener('touchmove', (e) => {
      if (!isVideoSwiping) return;
      e.preventDefault();
      const touchX = e.touches[0].clientX;
      const diffX = touchX - videoTouchStartX;
      videoTouchCurrentX = diffX;
      videoSlider.style.transform = `translateX(${videoTouchCurrentX * 0.5}px)`;
    }, { passive: false });

    videoSwipeOverlay.addEventListener('touchend', (e) => {
      if (!isVideoSwiping) return;
      isVideoSwiping = false;

      const swipeThreshold = 50;

      if (videoTouchCurrentX > swipeThreshold) {
        // Swipe right - previous track (loop to last if on first)
        const nextIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
        videoSlider.style.transition = 'transform 0.3s ease-out';
        videoSlider.style.transform = 'translateX(100%)';

        setTimeout(() => {
          openPanel(nextIndex);
          // Re-apply off-screen position after openPanel resets it
          videoSlider.style.transition = 'none';
          videoSlider.style.transform = 'translateX(-100%)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              videoSlider.style.transition = 'transform 0.3s ease-out';
              videoSlider.style.transform = 'translateX(0)';
            });
          });
        }, 300);

      } else if (videoTouchCurrentX < -swipeThreshold) {
        // Swipe left - next track (loop to first if on last)
        const nextIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
        videoSlider.style.transition = 'transform 0.3s ease-out';
        videoSlider.style.transform = 'translateX(-100%)';

        setTimeout(() => {
          openPanel(nextIndex);
          // Re-apply off-screen position after openPanel resets it
          videoSlider.style.transition = 'none';
          videoSlider.style.transform = 'translateX(100%)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              videoSlider.style.transition = 'transform 0.3s ease-out';
              videoSlider.style.transform = 'translateX(0)';
            });
          });
        }, 300);

      } else {
        // Snap back
        videoSlider.style.transition = 'transform 0.2s ease-out';
        videoSlider.style.transform = 'translateX(0)';
      }
    }, { passive: true });
  }

});
