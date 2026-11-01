  /* ---------- the qiblah, from the visitor's city or any city on the map ---------- */

  const KAABA = { lat: 21.4225, lng: 39.8262 };
  const WINDS = ['north', 'north-north-east', 'north-east', 'east-north-east', 'east', 'east-south-east', 'south-east', 'south-south-east',
    'south', 'south-south-west', 'south-west', 'west-south-west', 'west', 'west-north-west', 'north-west', 'north-north-west'];

  // The first bearing of the great circle to the Kaʿbah, and the distance along it.
  function qibla(p) {
    const f1 = rad(p.lat), f2 = rad(KAABA.lat), dl = rad(KAABA.lng - p.lng);
    const brg = wrap(deg(Math.atan2(Math.sin(dl) * Math.cos(f2), Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl))), 360);
    const km = 6371 * 2 * Math.asin(Math.sqrt(Math.sin((f2 - f1) / 2) ** 2 + Math.cos(f1) * Math.cos(f2) * Math.sin(dl / 2) ** 2));
    return { brg, km: Math.round(km / 10) * 10, wind: WINDS[Math.round(brg / 22.5) % 16] };
  }

  // The clock in the Haramain section: Makkah's time on the hands, the visitor's qiblah on the outer ring.
  // Every hand keeps a running angle, so it only ever moves forwards, and the Kaʿbah takes the short way round.
  const svgMark = (tag, attrs) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`;
  const onDial = (r, a) => [120 + r * dsin(a), 120 - r * dcos(a)].map(n => n.toFixed(1));
  const ARABIC_DIGITS = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

  function drawClockMarks() {
    let ring = '', hours = '';
    for (let a = 0; a < 360; a += 5) {
      const [x1, y1] = onDial(a % 45 ? 111 : 107, a), [x2, y2] = onDial(113, a);
      ring += svgMark('line', { class: 'qibla__tick', x1, y1, x2, y2 });
    }
    for (const [text, a] of [['N', 0], ['E', 90], ['S', 180], ['W', 270]]) {
      const [x, y] = onDial(102, a);
      ring += `<text class="qibla__wind" x="${x}" y="${y}">${text}</text>`;
    }
    for (let m = 0; m < 60; m++) {
      const [x1, y1] = onDial(m % 5 ? 90 : 87, m * 6), [x2, y2] = onDial(92, m * 6);
      hours += svgMark('line', { class: 'qibla__minute', x1, y1, x2, y2 });
    }
    for (let hour = 1; hour <= 12; hour++) {
      const [x, y] = onDial(74, hour * 30);
      hours += `<text class="qibla__numeral" x="${x}" y="${y}">${ARABIC_DIGITS(hour)}</text>`;
    }
    $('#qiblaRing').innerHTML = ring;
    $('#qiblaHours').innerHTML = hours;
  }

  // The moon tonight: its age in days since a known new moon, drawn as the lit part of a disc.
  function drawMoon(now) {
    const synodic = 29.530588, age = wrap(now.getTime() / 864e5 - 10962.76, synodic), phase = age / synodic;
    const r = 11.5, k = Math.cos(2 * Math.PI * phase), waxing = phase < 0.5;
    $('#qiblaMoon').setAttribute('d', `M0 ${-r}A${r} ${r} 0 0 ${waxing ? 1 : 0} 0 ${r}A${(r * Math.abs(k)).toFixed(2)} ${r} 0 0 ${(waxing ? k > 0 : k <= 0) ? 0 : 1} 0 ${-r}Z`);
  }

  const qiblaAngles = { needle: 0, hour: 0, minute: 0, second: 0 };
  const turn = (id, key, to) => {
    qiblaAngles[key] += wrap(to - qiblaAngles[key], 360);
    $(id).style.transform = `rotate(${qiblaAngles[key]}deg)`;
  };
  let clockAwake = false;  // the hands wait at twelve until the clock comes on screen

  function renderQiblah() {
    const q = qibla(place);
    $('#qiblaKm').textContent = q.km.toLocaleString('en');
    $('#qiblaWind').textContent = q.wind;
    $('#qiblaDeg').textContent = `${Math.round(q.brg)}°`;
    if (!clockAwake) return;
    qiblaAngles.needle += ((q.brg - qiblaAngles.needle + 540) % 360) - 180;
    $('#qiblaNeedle').style.transform = `rotate(${qiblaAngles.needle}deg)`;
  }

  const makkahClock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Riyadh' });
  function renderMakkahTime() {
    const now = new Date(), parts = Object.fromEntries(makkahClock.formatToParts(now).map(p => [p.type, p.value]));
    const h = +parts.hour, m = +parts.minute, s = +parts.second;
    $('#qiblaTime').textContent = `${parts.hour}:${parts.minute}:${parts.second}`;
    if (!clockAwake) return;
    turn('#qiblaSecond', 'second', s * 6);
    turn('#qiblaMinute', 'minute', (m + s / 60) * 6);
    turn('#qiblaHour', 'hour', ((h % 12) + m / 60) * 30);
  }

  // Saudi Arabia's own calendar, Umm al-Qurā, in Arabic.
  function renderHijri() {
    try {
      $('#qiblaHijri').textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-arab', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Riyadh' }).format(new Date());
    } catch { /* this browser has no Hijri calendar */ }
    drawMoon(new Date());
  }

  // Once, on reaching the clock, the hands wind round to the time and the Kaʿbah finds the qiblah.
  function wakeClock() {
    const dial = $('#qiblaDial');
    clockAwake = true;
    dial.classList.add('is-winding');
    renderMakkahTime();
    renderQiblah();
    setTimeout(() => dial.classList.remove('is-winding'), 1900);
  }

