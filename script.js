(function(){
  /* ====== Cấu hình: sửa ở đây hoặc truyền qua URL ======
     ?name=Lan&age=22&wish=Lời chúc 1|Lời chúc 2|Lời chúc 3 */
  var q = new URLSearchParams(location.search);
  var NAME = (q.get('name') || 'bạn').slice(0, 30);
  var AGE  = Math.min(Math.max(parseInt(q.get('age'), 10) || 5, 1), 12);
  var WISHES = q.get('wish') ? q.get('wish').split('|') : [
    'Tuổi mới thật nhiều niềm vui',
    'Sức khỏe dồi dào, tinh thần phơi phới',
    'Mọi điều ước đều thành hiện thực',
    'Luôn cười thật tươi nhé',
    'Bình an và hạnh phúc mỗi ngày',
    'Tiền vào như nước',
    'Ăn hoài không béo',
    'Deadline tránh xa bạn',
    'Thành công rực rỡ, đi đâu cũng gặp may',
    'Được yêu thương thật nhiều',
    'Mỗi ngày đều là một ngày vui'
  ];
  /* Lưu điều ước (Supabase). Để trống thì trang vẫn chạy, chỉ là không lưu.
     Dùng anon / publishable key, TUYỆT ĐỐI không dùng service_role key. */
  var SUPABASE_URL = 'https://betrmntejorvpvdpujsx.supabase.co/rest/v1/';   // ví dụ: https://abcdxyz.supabase.co
  var SUPABASE_KEY = 'sb_publishable_qboLSBWR18ILuLJUWNiRjg_l8hzQSRK';   // anon hoặc publishable key
  document.getElementById('nm').textContent = NAME;
  document.title = 'Chúc mừng sinh nhật ' + NAME + '!';

  var body = document.body, stage = document.getElementById('stage');
  var candlesEl = document.getElementById('candles'), againBtn = document.getElementById('again');
  var rnd = function(a, b){ return a + Math.random() * (b - a); };

  /* Sao */
  var stars = document.getElementById('stars');
  for (var i = 0; i < 70; i++) {
    var s = document.createElement('i'); s.className = 'star';
    s.style.cssText = 'left:' + rnd(0,100) + '%;top:' + rnd(0,100) + '%;--z:' + rnd(1,2.6) + 'px;--t:' + rnd(2,5) + 's;--d:' + rnd(0,4) + 's';
    stars.appendChild(s);
  }

  /* Nến */
  for (var c = 0; c < AGE; c++) {
    var can = document.createElement('div'); can.className = 'candle';
    can.innerHTML = '<div class="flame" style="--o:' + (-rnd(0,.3)).toFixed(2) + 's"></div><div class="smoke"></div>';
    candlesEl.appendChild(can);
  }
  var candles = candlesEl.children;

  /* ====== Nhạc: Happy Birthday tạo bằng Web Audio (không cần file mp3) ====== */
  var ctx, master, tuneTimer, BEAT = .52;
  var TUNE = [
    [392,.75],[392,.25],[440,1],[392,1],[523.25,1],[493.88,2],
    [392,.75],[392,.25],[440,1],[392,1],[587.33,1],[523.25,2],
    [392,.75],[392,.25],[783.99,1],[659.25,1],[523.25,1],[493.88,1],[440,1],
    [698.46,.75],[698.46,.25],[659.25,1],[523.25,1],[587.33,1],[523.25,2]
  ];
  function setupAudio(){
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = .0001;
    var dly = ctx.createDelay(); dly.delayTime.value = .27;
    var fb = ctx.createGain(); fb.gain.value = .32;
    var wet = ctx.createGain(); wet.gain.value = .35;
    master.connect(ctx.destination); master.connect(dly);
    dly.connect(fb); fb.connect(dly); dly.connect(wet); wet.connect(ctx.destination);
  }
  function playTune(){
    if (!ctx) return;
    var t = ctx.currentTime + .1, total = 0;
    master.gain.cancelScheduledValues(t); master.gain.setTargetAtTime(.9, t, .3);
    TUNE.forEach(function(n){
      var d = n[1] * BEAT;
      [[ 'triangle', n[0], .2 ], [ 'sine', n[0] * 2, .08 ]].forEach(function(o){
        var osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = o[0]; osc.frequency.value = o[1];
        g.gain.setValueAtTime(0, t + total);
        g.gain.linearRampToValueAtTime(o[2], t + total + .015);
        g.gain.exponentialRampToValueAtTime(.0008, t + total + d * 1.5);
        osc.connect(g); g.connect(master);
        osc.start(t + total); osc.stop(t + total + d * 1.5 + .05);
      });
      total += d;
    });
    tuneTimer = setTimeout(playTune, (total + 1.8) * 1000);
  }
  function stopTune(){
    clearTimeout(tuneTimer);
    if (ctx) master.gain.setTargetAtTime(.0001, ctx.currentTime, .15);
  }

  /* ====== Pháo giấy ====== */
  var COLORS = ['#ff8fb3','#ffd36b','#fff1dc','#7fe0d0','#b79bff','#ff6a5b'];
  function burst(n){
    for (var i = 0; i < n; i++) {
      var p = document.createElement('i'); p.className = 'confetti';
      var w = rnd(6, 11), long = Math.random() > .5;
      p.style.cssText = '--c:' + COLORS[i % COLORS.length] + ';--w:' + w + 'px;--h:' + (long ? w * 2 : w) + 'px;' +
        '--br:' + (Math.random() > .6 ? '50%' : '2px') + ';--dx:' + rnd(-48, 48) + 'vw;--up:-' + rnd(25, 62) + 'vh;' +
        '--r:' + rnd(-900, 900) + 'deg;--dur:' + rnd(2.8, 4.8).toFixed(2) + 's';
      document.body.appendChild(p);
      p.addEventListener('animationend', function(){ this.remove(); });
    }
  }

  /* ====== Lời chúc bay lên ====== */
  var wishIdx = Math.floor(Math.random() * WISHES.length), wishTimer;
  function spawnWish(){
    var w = document.createElement('div'); w.className = 'wish';
    var dur = rnd(10, 15);
    w.style.cssText = 'left:' + rnd(8, Math.max(40, innerWidth - 270)) + 'px;--dur:' + dur.toFixed(1) +
      's;--sw:' + rnd(2.4, 4.2).toFixed(1) + 's;--fs:' + rnd(.92, 1.2).toFixed(2) + 'rem';
    var sp = document.createElement('span');
    sp.textContent = WISHES[wishIdx++ % WISHES.length];
    w.appendChild(sp); document.body.appendChild(w);
    setTimeout(function(){ w.remove(); }, dur * 1000 + 200);
  }
  function startWishes(){
    for (var i = 0; i < 5; i++) setTimeout(spawnWish, i * 450);
    wishTimer = setInterval(spawnWish, 1500);
  }
  function stopWishes(){
    clearInterval(wishTimer);
    document.querySelectorAll('.wish').forEach(function(e){ e.remove(); });
  }

  /* ====== Thổi nến ====== */
  var busy = false, blown = false, timers = [];
  function later(fn, ms){ timers.push(setTimeout(fn, ms)); }

  function blow(){
    if (busy || blown) return;
    busy = true; setupAudio();
    body.classList.add('puff');
    Array.prototype.forEach.call(candles, function(cd){ cd.classList.add('puff'); });
    Array.prototype.forEach.call(candles, function(cd, i){
      later(function(){ cd.classList.remove('puff'); cd.classList.add('out'); }, 500 + i * 130);
    });
    var done = 500 + candles.length * 130 + 500;
    later(function(){
      body.classList.add('blown', 'lit'); burst(110); playTune(); startWishes(); blown = true; busy = false;
    }, done);
    later(function(){ burst(60); }, done + 1400);
    later(function(){ wishbox.classList.add('show'); }, done + 4500);
  }

  function reset(){
    timers.forEach(clearTimeout); timers = [];
    stopTune(); stopWishes();
    body.classList.remove('lit', 'blown', 'puff');
    againBtn.classList.remove('show');
    wishbox.classList.remove('show'); thanks.classList.remove('show'); body.classList.remove('sent');
    wishInput.value = ''; sent = false;
    document.querySelectorAll('.meteor').forEach(function(m){ m.remove(); });
    Array.prototype.forEach.call(candles, function(cd){ cd.classList.remove('out', 'puff'); });
    blown = false; busy = false;
  }

  /* ====== Điều ước + sao băng ====== */
  var wishbox = document.getElementById('wishbox'), wishInput = document.getElementById('wishInput');
  var thanks = document.getElementById('thanks'), sent = false;

  function saveWish(text){
    if (!SUPABASE_URL || !SUPABASE_KEY) { console.info('Chưa cấu hình Supabase nên điều ước chưa được lưu.'); return; }
    var h = { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Prefer': 'return=minimal' };
    if (SUPABASE_KEY.indexOf('eyJ') === 0) h.Authorization = 'Bearer ' + SUPABASE_KEY;
    fetch(SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/wishes', {
      method: 'POST', headers: h, keepalive: true,
      body: JSON.stringify({ name: NAME, wish: text })
    }).catch(function(err){ console.warn('Không lưu được điều ước:', err); });
  }
  function meteors(){
    for (var i = 0; i < 9; i++) {
      var m = document.createElement('i'); m.className = 'meteor';
      m.style.cssText = '--x:' + rnd(35, 108) + 'vw;--y:' + rnd(-8, 24) + 'vh;--dl:' + (i * rnd(.15, .3)).toFixed(2) +
        's;--du:' + rnd(1.3, 2.1).toFixed(2) + 's';
      document.body.appendChild(m);
      m.addEventListener('animationend', function(){ this.remove(); });
    }
  }
  wishbox.addEventListener('submit', function(e){
    e.preventDefault();
    var text = wishInput.value.trim().slice(0, 200);
    if (!text || sent) return;
    sent = true; saveWish(text); wishInput.blur();
    wishbox.classList.remove('show'); body.classList.add('sent'); meteors();
    later(meteors, 1800);
    later(function(){ thanks.classList.add('show'); }, 1600);
    later(function(){ againBtn.classList.add('show'); }, 8000);
  });

  stage.addEventListener('click', blow);
  body.addEventListener('click', function(e){ if (e.target !== againBtn) blow(); });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' ') {
      var t = document.activeElement && document.activeElement.tagName;
      if (t === 'INPUT' || t === 'BUTTON') return;
      e.preventDefault(); blow();
    }
  });
  againBtn.addEventListener('click', function(e){ e.stopPropagation(); reset(); });
})();