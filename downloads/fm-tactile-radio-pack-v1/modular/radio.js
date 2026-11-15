(function () {
  if (window.__radioWidgetInit) return;
  window.__radioWidgetInit = true;

  var widgets = Array.prototype.slice.call(document.querySelectorAll('.radio'));
  var instances = [];

  widgets.forEach(function (root) {
    var rows = Array.prototype.slice.call(root.querySelectorAll('.row'));
    var pill = root.querySelector('[data-pill]');
    var play = root.querySelector('[data-play]');
    var icon = root.querySelector('.t-play-pause');
    var nameEl = root.querySelector('[data-name]');
    var freqEl = root.querySelector('[data-freq]');
    var tuner = root.querySelector('[data-tuner]');
    var needle = root.querySelector('[data-needle]');
    var audio = root.querySelector('[data-audio]');
    var swapMs = parseFloat(getComputedStyle(root).getPropertyValue('--text-swap-dur')) || 150;

    var current = 0, playing = false;
    var bars = [], N = 30;

    for (var b = 0; b < N; b++) {
      var s = document.createElement('span');
      s.className = 'bar';
      s.style.setProperty('--bar-dur', (500 + (b * 53) % 400) + 'ms');
      s.style.setProperty('--bar-delay', (-((b * 137) % 800)) + 'ms');
      tuner.insertBefore(s, needle);
      bars.push(s);
    }

    function tune(i, instant) {
      var f = parseFloat(rows[i].dataset.freq);
      var p = Math.max(0, Math.min(1, (f - 96) / 12));
      bars.forEach(function (bar, k) {
        var prox = Math.max(0, 1 - Math.abs((k + 0.5) / N - p) / 0.25);
        bar.style.setProperty('--lvl', (0.18 + 0.82 * prox * prox).toFixed(3));
      });
      if (instant) needle.classList.add('no-anim');
      needle.style.transform = 'translateX(' + (p * tuner.offsetWidth) + 'px)';
      if (instant) { void needle.offsetHeight; needle.classList.remove('no-anim'); }
    }

    function place(i, instant) {
      if (instant) pill.classList.add('no-anim');
      pill.style.transform = 'translateY(' + (rows[i].offsetTop) + 'px)';
      if (instant) { void pill.offsetHeight; pill.classList.remove('no-anim'); }
    }

    function swap(el, next) {
      if (el.textContent === next) return;
      el.classList.add('is-exit');
      setTimeout(function () {
        el.textContent = next;
        el.classList.remove('is-exit');
        el.classList.add('is-enter-start');
        void el.offsetHeight;
        el.classList.remove('is-enter-start');
      }, swapMs);
    }

    function syncUI(v) {
      playing = v;
      tuner.setAttribute('data-playing', v ? 'true' : 'false');
      icon.setAttribute('data-state', v ? 'pause' : 'play');
      play.setAttribute('aria-label', v ? 'Pause' : 'Lecture');
      if (!v) play.classList.remove('is-loading');
    }

    function loadAndPlay(index) {
      var url = rows[index].dataset.stream;
      if (!url) return;

      instances.forEach(function (inst) {
        if (inst !== api) inst.pause();
      });

      play.classList.add('is-loading');
      syncUI(true);

      if (audio.src !== url) {
        audio.src = url;
      }
      var promise = audio.play();
      if (promise !== undefined) {
        promise.then(function () {
          play.classList.remove('is-loading');
        }).catch(function () {
          syncUI(false);
        });
      }
    }

    function stopAudio() {
      syncUI(false);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }

    function setPlaying(v) {
      if (v) {
        loadAndPlay(current);
      } else {
        stopAudio();
      }
    }

    function select(i) {
      if (i === current) {
        if (!playing) setPlaying(true);
        return;
      }
      current = i;
      rows.forEach(function (r, k) {
        r.setAttribute('aria-checked', k === i ? 'true' : 'false');
        r.tabIndex = k === i ? 0 : -1;
      });
      place(i, false);
      tune(i, false);
      swap(nameEl, rows[i].dataset.name);
      swap(freqEl, rows[i].dataset.freq);
      loadAndPlay(i);
    }

    audio.addEventListener('playing', function () { play.classList.remove('is-loading'); });
    audio.addEventListener('waiting', function () { if (playing) play.classList.add('is-loading'); });
    audio.addEventListener('error', function () { syncUI(false); });

    rows.forEach(function (r, k) {
      r.tabIndex = k === 0 ? 0 : -1;
      r.addEventListener('click', function () { select(k); });
      r.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = (k + d + rows.length) % rows.length;
        select(n);
        rows[n].focus();
      });
    });

    play.addEventListener('click', function () { setPlaying(!playing); });
    place(0, true);
    tune(0, true);
    window.addEventListener('load', function () { place(current, true); tune(current, true); });
    window.addEventListener('resize', function () { place(current, true); tune(current, true); });

    var api = { pause: stopAudio };
    instances.push(api);
  });

  // Retour tactile mobile
  var min = 150;
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    var el = e.target && e.target.closest && e.target.closest('.radio-bg button');
    if (!el || el.disabled) return;
    var t0 = performance.now();
    clearTimeout(el._tPress);
    el.classList.add('is-pressed');
    function up() {
      document.removeEventListener('pointerup', up, true);
      document.removeEventListener('pointercancel', up, true);
      el._tPress = setTimeout(function () { el.classList.remove('is-pressed'); }, Math.max(0, min - (performance.now() - t0)));
    }
    document.addEventListener('pointerup', up, true);
    document.addEventListener('pointercancel', up, true);
  }, { passive: true });
})();
