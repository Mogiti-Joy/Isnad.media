/* Isnad Media: prayer times, films and page interactions. */
(() => {
  'use strict';

  /* ------------------------------------------------------------------
     Settings. Change these to match Isnad Media.
     ------------------------------------------------------------------ */
  const SETTINGS = {
    // The Google Form the contact form fills in (see "Contact" in README.md). `action` is the form's link with
    // "viewform" changed to "formResponse"; each field is that question's entry number. Until `action` is set,
    // "Send" opens the visitor's email app with the message addressed to `email`.
    googleForm: {
      action: '',               // e.g. 'https://docs.google.com/forms/d/e/1FAIpQL…/formResponse'
      fields: { name: '', email: '', whatsapp: '', topic: '', message: '' },  // e.g. name: 'entry.123456789'
    },
    email: 'isnadmedia9@gmail.com',
    city: 'Nairobi',            // prayer times shown when a visitor's time zone matches none of the CITIES below
    asrFactor: 1,               // 1 = Shafiʿi, Maliki, Hanbali; 2 = Hanafi
  };

  // How masjids in each country set the times. Fajr and Isha begin when the sun is this far below the
  // horizon; `add` is the minutes an official timetable puts on top of the astronomical time, and
  // `roundUp` lists the times it rounds up to the next minute instead of to the nearest one.
  const METHODS = {
    mwl: { name: 'the Muslim World League method', fajr: 18, isha: 17 },
    egypt: { name: 'the Egyptian General Authority of Survey', fajr: 19.5, isha: 17.5 },
    morocco: { name: 'Morocco’s Ministry of Habous and Islamic Affairs', fajr: 19, isha: 17, add: { dhuhr: 5, maghrib: 5 } },
    algeria: { name: 'Algeria’s Ministry of Religious Affairs and Wakfs', fajr: 18, isha: 17, add: { maghrib: 3 }, roundUp: ['maghrib'] },
    tunisia: { name: 'Tunisia’s Ministry of Religious Affairs', fajr: 18, isha: 18 },
  };

  // Every country in Africa, with the method its masjids use and the cities visitors can pick:
  // [country, method, [[city, latitude, longitude, time zone], …]]. The first city is the default for that time zone.
  const CITIES = [
    ['Algeria', 'algeria', [['Algiers', 36.7538, 3.0588, 'Africa/Algiers'], ['Oran', 35.6971, -0.6308, 'Africa/Algiers'], ['Constantine', 36.365, 6.6147, 'Africa/Algiers']]],
    ['Angola', 'mwl', [['Luanda', -8.839, 13.2894, 'Africa/Luanda']]],
    ['Benin', 'mwl', [['Porto-Novo', 6.4969, 2.6289, 'Africa/Porto-Novo'], ['Cotonou', 6.3703, 2.3912, 'Africa/Porto-Novo']]],
    ['Botswana', 'mwl', [['Gaborone', -24.6282, 25.9231, 'Africa/Gaborone']]],
    ['Burkina Faso', 'mwl', [['Ouagadougou', 12.3714, -1.5197, 'Africa/Ouagadougou'], ['Bobo-Dioulasso', 11.1771, -4.2979, 'Africa/Ouagadougou']]],
    ['Burundi', 'mwl', [['Gitega', -3.4271, 29.9246, 'Africa/Bujumbura'], ['Bujumbura', -3.3614, 29.3599, 'Africa/Bujumbura']]],
    ['Cabo Verde', 'mwl', [['Praia', 14.933, -23.5133, 'Atlantic/Cape_Verde']]],
    ['Cameroon', 'mwl', [['Yaoundé', 3.848, 11.5021, 'Africa/Douala'], ['Douala', 4.0511, 9.7679, 'Africa/Douala'], ['Maroua', 10.5956, 14.3247, 'Africa/Douala']]],
    ['Central African Republic', 'mwl', [['Bangui', 4.3947, 18.5582, 'Africa/Bangui']]],
    ['Chad', 'mwl', [['N’Djamena', 12.1348, 15.0557, 'Africa/Ndjamena'], ['Abéché', 13.8292, 20.8324, 'Africa/Ndjamena']]],
    ['Comoros', 'mwl', [['Moroni', -11.7172, 43.2473, 'Indian/Comoro']]],
    ['Congo', 'mwl', [['Brazzaville', -4.2694, 15.2712, 'Africa/Brazzaville'], ['Pointe-Noire', -4.7761, 11.8635, 'Africa/Brazzaville']]],
    ['Côte d’Ivoire', 'mwl', [['Abidjan', 5.36, -4.0083, 'Africa/Abidjan'], ['Yamoussoukro', 6.8276, -5.2893, 'Africa/Abidjan']]],
    ['Djibouti', 'mwl', [['Djibouti', 11.5721, 43.1456, 'Africa/Djibouti']]],
    ['DR Congo', 'mwl', [['Kinshasa', -4.3217, 15.3123, 'Africa/Kinshasa'], ['Lubumbashi', -11.6609, 27.4794, 'Africa/Lubumbashi'], ['Kisangani', 0.5153, 25.191, 'Africa/Lubumbashi']]],
    ['Egypt', 'egypt', [['Cairo', 30.0444, 31.2357, 'Africa/Cairo'], ['Alexandria', 31.2001, 29.9187, 'Africa/Cairo'], ['Aswan', 24.0889, 32.8998, 'Africa/Cairo']]],
    ['Equatorial Guinea', 'mwl', [['Malabo', 3.7504, 8.7371, 'Africa/Malabo']]],
    ['Eritrea', 'mwl', [['Asmara', 15.3229, 38.9251, 'Africa/Asmara'], ['Massawa', 15.6097, 39.45, 'Africa/Asmara']]],
    ['Eswatini', 'mwl', [['Mbabane', -26.3054, 31.1367, 'Africa/Mbabane']]],
    ['Ethiopia', 'mwl', [['Addis Ababa', 9.03, 38.74, 'Africa/Addis_Ababa'], ['Harar', 9.3126, 42.1227, 'Africa/Addis_Ababa'], ['Dire Dawa', 9.6009, 41.8501, 'Africa/Addis_Ababa']]],
    ['Gabon', 'mwl', [['Libreville', 0.4162, 9.4673, 'Africa/Libreville']]],
    ['Gambia', 'mwl', [['Banjul', 13.4549, -16.579, 'Africa/Banjul'], ['Serekunda', 13.4382, -16.6781, 'Africa/Banjul']]],
    ['Ghana', 'mwl', [['Accra', 5.6037, -0.187, 'Africa/Accra'], ['Kumasi', 6.6885, -1.6244, 'Africa/Accra'], ['Tamale', 9.4008, -0.8393, 'Africa/Accra']]],
    ['Guinea', 'mwl', [['Conakry', 9.5171, -13.6998, 'Africa/Conakry'], ['Kankan', 10.3854, -9.3057, 'Africa/Conakry']]],
    ['Guinea-Bissau', 'mwl', [['Bissau', 11.8636, -15.5977, 'Africa/Bissau']]],
    ['Kenya', 'mwl', [
      ['Nairobi', -1.2864, 36.8172, 'Africa/Nairobi'], ['Mombasa', -4.0435, 39.6682, 'Africa/Nairobi'],
      ['Kisumu', -0.0917, 34.768, 'Africa/Nairobi'], ['Nakuru', -0.3031, 36.08, 'Africa/Nairobi'],
      ['Eldoret', 0.5143, 35.2698, 'Africa/Nairobi'], ['Garissa', -0.4532, 39.6461, 'Africa/Nairobi'],
      ['Lamu', -2.2717, 40.902, 'Africa/Nairobi'], ['Malindi', -3.2192, 40.1169, 'Africa/Nairobi'],
      ['Wajir', 1.7471, 40.0573, 'Africa/Nairobi'], ['Mandera', 3.9366, 41.867, 'Africa/Nairobi'],
      ['Isiolo', 0.3546, 37.5822, 'Africa/Nairobi'], ['Marsabit', 2.3284, 37.9899, 'Africa/Nairobi'],
    ]],
    ['Lesotho', 'mwl', [['Maseru', -29.3151, 27.4869, 'Africa/Maseru']]],
    ['Liberia', 'mwl', [['Monrovia', 6.3005, -10.7969, 'Africa/Monrovia']]],
    ['Libya', 'egypt', [['Tripoli', 32.8872, 13.1913, 'Africa/Tripoli'], ['Benghazi', 32.1194, 20.0868, 'Africa/Tripoli'], ['Misrata', 32.3754, 15.0925, 'Africa/Tripoli']]],
    ['Madagascar', 'mwl', [['Antananarivo', -18.8792, 47.5079, 'Indian/Antananarivo'], ['Mahajanga', -15.7167, 46.3167, 'Indian/Antananarivo']]],
    ['Malawi', 'mwl', [['Lilongwe', -13.9626, 33.7741, 'Africa/Blantyre'], ['Blantyre', -15.7861, 35.0058, 'Africa/Blantyre']]],
    ['Mali', 'mwl', [['Bamako', 12.6392, -8.0029, 'Africa/Bamako'], ['Timbuktu', 16.7666, -3.0026, 'Africa/Bamako'], ['Gao', 16.2717, -0.0447, 'Africa/Bamako']]],
    ['Mauritania', 'mwl', [['Nouakchott', 18.0735, -15.9582, 'Africa/Nouakchott'], ['Nouadhibou', 20.931, -17.0347, 'Africa/Nouakchott']]],
    ['Mauritius', 'mwl', [['Port Louis', -20.1609, 57.5012, 'Indian/Mauritius']]],
    ['Morocco', 'morocco', [['Casablanca', 33.5731, -7.5898, 'Africa/Casablanca'], ['Rabat', 34.0209, -6.8416, 'Africa/Casablanca'], ['Fez', 34.0181, -5.0078, 'Africa/Casablanca'], ['Marrakesh', 31.6295, -7.9811, 'Africa/Casablanca'], ['Tangier', 35.7595, -5.834, 'Africa/Casablanca']]],
    ['Mozambique', 'mwl', [['Maputo', -25.9692, 32.5732, 'Africa/Maputo'], ['Nampula', -15.1165, 39.2666, 'Africa/Maputo']]],
    ['Namibia', 'mwl', [['Windhoek', -22.5609, 17.0658, 'Africa/Windhoek']]],
    ['Niger', 'mwl', [['Niamey', 13.5116, 2.1254, 'Africa/Niamey'], ['Zinder', 13.8072, 8.9881, 'Africa/Niamey'], ['Maradi', 13.5, 7.1017, 'Africa/Niamey']]],
    ['Nigeria', 'egypt', [['Lagos', 6.5244, 3.3792, 'Africa/Lagos'], ['Abuja', 9.0643, 7.4893, 'Africa/Lagos'], ['Kano', 12.0022, 8.592, 'Africa/Lagos'], ['Sokoto', 13.0611, 5.2373, 'Africa/Lagos'], ['Maiduguri', 11.8311, 13.151, 'Africa/Lagos'], ['Ilorin', 8.4966, 4.5421, 'Africa/Lagos']]],
    ['Rwanda', 'mwl', [['Kigali', -1.9441, 30.0619, 'Africa/Kigali']]],
    ['São Tomé and Príncipe', 'mwl', [['São Tomé', 0.3365, 6.7273, 'Africa/Sao_Tome']]],
    ['Senegal', 'mwl', [['Dakar', 14.7167, -17.4677, 'Africa/Dakar'], ['Touba', 14.85, -15.8833, 'Africa/Dakar'], ['Saint-Louis', 16.0326, -16.4818, 'Africa/Dakar']]],
    ['Seychelles', 'mwl', [['Victoria', -4.6191, 55.4513, 'Indian/Mahe']]],
    ['Sierra Leone', 'mwl', [['Freetown', 8.4657, -13.2317, 'Africa/Freetown']]],
    ['Somalia', 'mwl', [['Mogadishu', 2.0469, 45.3182, 'Africa/Mogadishu'], ['Hargeisa', 9.56, 44.065, 'Africa/Mogadishu'], ['Kismayo', -0.3582, 42.5454, 'Africa/Mogadishu'], ['Bosaso', 11.2842, 49.1816, 'Africa/Mogadishu']]],
    ['South Africa', 'mwl', [['Johannesburg', -26.2041, 28.0473, 'Africa/Johannesburg'], ['Pretoria', -25.7479, 28.2293, 'Africa/Johannesburg'], ['Cape Town', -33.9249, 18.4241, 'Africa/Johannesburg'], ['Durban', -29.8587, 31.0218, 'Africa/Johannesburg']]],
    ['South Sudan', 'egypt', [['Juba', 4.8594, 31.5713, 'Africa/Juba']]],
    ['Sudan', 'egypt', [['Khartoum', 15.5007, 32.5599, 'Africa/Khartoum'], ['Omdurman', 15.6445, 32.4777, 'Africa/Khartoum'], ['Port Sudan', 19.6158, 37.2164, 'Africa/Khartoum']]],
    ['Tanzania', 'mwl', [['Dar es Salaam', -6.8161, 39.2804, 'Africa/Dar_es_Salaam'], ['Dodoma', -6.163, 35.7516, 'Africa/Dar_es_Salaam'], ['Zanzibar', -6.1659, 39.2026, 'Africa/Dar_es_Salaam'], ['Tanga', -5.0689, 39.0988, 'Africa/Dar_es_Salaam'], ['Arusha', -3.3869, 36.683, 'Africa/Dar_es_Salaam'], ['Mwanza', -2.5164, 32.9175, 'Africa/Dar_es_Salaam']]],
    ['Togo', 'mwl', [['Lomé', 6.1375, 1.2123, 'Africa/Lome']]],
    ['Tunisia', 'tunisia', [['Tunis', 36.8065, 10.1815, 'Africa/Tunis'], ['Sfax', 34.7406, 10.7603, 'Africa/Tunis'], ['Kairouan', 35.6781, 10.0963, 'Africa/Tunis']]],
    ['Uganda', 'mwl', [['Kampala', 0.3476, 32.5825, 'Africa/Kampala'], ['Jinja', 0.4244, 33.2042, 'Africa/Kampala'], ['Mbale', 1.0821, 34.175, 'Africa/Kampala']]],
    ['Zambia', 'mwl', [['Lusaka', -15.4163, 28.2818, 'Africa/Lusaka']]],
    ['Zimbabwe', 'mwl', [['Harare', -17.8252, 31.0335, 'Africa/Harare'], ['Bulawayo', -20.1561, 28.5887, 'Africa/Harare']]],
  ];
  const PLACES = new Map();
  for (const [country, method, list] of CITIES) {
    for (const [name, lat, lng, timeZone] of list) PLACES.set(name, { name, country, method: METHODS[method], lat, lng, timeZone });
  }
  const HOME = PLACES.get(SETTINGS.city);

  const PRAYERS = [
    { key: 'fajr', en: 'Fajr', ar: 'الفجر' },
    { key: 'sunrise', en: 'Sunrise', ar: 'الشروق', sun: true },
    { key: 'dhuhr', en: 'Dhuhr', ar: 'الظهر' },
    { key: 'asr', en: 'Asr', ar: 'العصر' },
    { key: 'maghrib', en: 'Maghrib', ar: 'المغرب' },
    { key: 'isha', en: 'Isha', ar: 'العشاء' },
  ];

  /* ---------- helpers ---------- */

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wrap = (a, b) => ((a % b) + b) % b;

  const hm = h => {
    const t = Math.round(wrap(h, 24) * 60) % 1440;
    return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
  };

  /* ---------- local time in a city ---------- */

  let viewerZone = '';
  try { viewerZone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { /* unknown time zone */ }

  const zoneFmts = new Map();
  function zoneFmt(timeZone) {
    if (!zoneFmts.has(timeZone)) {
      zoneFmts.set(timeZone, new Intl.DateTimeFormat('en-GB', {
        timeZone, hourCycle: 'h23',
        year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
      }));
    }
    return zoneFmts.get(timeZone);
  }

  // Zones that changed after some browsers were released. Morocco has kept GMT all year since
  // 2 a.m. on 20 September 2026; a browser that doesn't know yet would show its times an hour late.
  const ZONE_CHANGES = { 'Africa/Casablanca': { from: Date.UTC(2026, 8, 20, 1), offset: 0 } };

  function zoned(date, timeZone) {
    const change = ZONE_CHANGES[timeZone];
    if (change && date.getTime() >= change.from) {
      const t = new Date(Math.floor(date.getTime() / 1000) * 1000 + change.offset * 36e5);
      return {
        y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), offset: change.offset,
        hours: t.getUTCHours() + t.getUTCMinutes() / 60 + t.getUTCSeconds() / 3600, weekday: t.getUTCDay(),
      };
    }
    const p = {};
    for (const { type, value } of zoneFmt(timeZone).formatToParts(date)) p[type] = value;
    const y = +p.year, m = +p.month, d = +p.day, hh = +p.hour % 24, mm = +p.minute, ss = +p.second;
    const offset = (Date.UTC(y, m - 1, d, hh, mm, ss) - Math.floor(date.getTime() / 1000) * 1000) / 36e5;
    return { y, m, d, offset, hours: hh + mm / 60 + ss / 3600, weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
  }

  function addDays(day, n, timeZone) {
    const dt = new Date(Date.UTC(day.y, day.m - 1, day.d + n, 12));
    return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate(), weekday: dt.getUTCDay(), offset: zoned(dt, timeZone).offset };
  }

  /* ---------- prayer times (the PrayTimes.org method) ---------- */

  const rad = d => d * Math.PI / 180;
  const deg = r => r * 180 / Math.PI;
  const dsin = d => Math.sin(rad(d)), dcos = d => Math.cos(rad(d)), dtan = d => Math.tan(rad(d));
  const dasin = x => deg(Math.asin(x)), dacos = x => deg(Math.acos(x));
  const datan2 = (y, x) => deg(Math.atan2(y, x)), dacot = x => deg(Math.atan(1 / x));

  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }

  function sunAt(jd) {
    const D = jd - 2451545;
    const g = wrap(357.529 + 0.98560028 * D, 360);
    const q = wrap(280.459 + 0.98564736 * D, 360);
    const L = wrap(q + 1.915 * dsin(g) + 0.02 * dsin(2 * g), 360);
    const e = 23.439 - 0.00000036 * D;
    const ra = wrap(datan2(dcos(e) * dsin(L), dcos(L)) / 15, 24);
    return { decl: dasin(dsin(e) * dsin(L)), eqt: q / 15 - ra };
  }

  const prayerCache = new Map();
  function prayerTimes(day, place) {
    const id = `${place.lat},${place.lng}:${day.y}-${day.m}-${day.d}:${day.offset}`;
    if (prayerCache.has(id)) return prayerCache.get(id);
    const { lat, lng, method } = place, { fajr: fajrAngle, isha: ishaAngle } = method, { asrFactor } = SETTINGS;
    const jd = julian(day.y, day.m, day.d) - lng / (15 * 24);
    const noon = t => wrap(12 - sunAt(jd + t).eqt, 24);
    const angleTime = (angle, t, before) => {
      const { decl } = sunAt(jd + t);
      const h = dacos((-dsin(angle) - dsin(decl) * dsin(lat)) / (dcos(decl) * dcos(lat))) / 15;
      return noon(t) + (before ? -h : h);
    };
    const asrAngle = t => -dacot(asrFactor + dtan(Math.abs(lat - sunAt(jd + t).decl)));
    const t = {
      fajr: angleTime(fajrAngle, 5 / 24, true),
      sunrise: angleTime(0.833, 6 / 24, true),
      dhuhr: noon(12 / 24),
      asr: angleTime(asrAngle(13 / 24), 13 / 24),
      sunset: angleTime(0.833, 18 / 24),
      isha: angleTime(ishaAngle, 18 / 24),
    };
    const shift = day.offset - lng / 15;
    for (const k in t) t[k] += shift;
    // High latitudes: cap Fajr and Isha at a portion of the night (angle-based rule).
    const night = wrap(t.sunrise - t.sunset, 24);
    const fajrMax = fajrAngle / 60 * night, ishaMax = ishaAngle / 60 * night;
    if (isNaN(t.fajr) || wrap(t.sunrise - t.fajr, 24) > fajrMax) t.fajr = t.sunrise - fajrMax;
    if (isNaN(t.isha) || wrap(t.isha - t.sunset, 24) > ishaMax) t.isha = t.sunset + ishaMax;
    t.maghrib = t.sunset;
    for (const k in method.add) t[k] += method.add[k] / 60;
    // Round to the minute so the countdown reaches zero at the time shown.
    for (const k in t) t[k] = (method.roundUp?.includes(k) ? Math.ceil : Math.round)(t[k] * 60) / 60;
    prayerCache.set(id, t);
    return t;
  }

  const prayerName = (p, weekday) => (p.key === 'dhuhr' && weekday === 5 ? { ...p, en: 'Jumuʿah', ar: 'الجمعة' } : p);

  // z is the local time in `place`, from zoned(date, place.timeZone).
  function nextPrayer(z, place) {
    const t = prayerTimes(z, place);
    for (const p of PRAYERS) {
      if (!p.sun && t[p.key] > z.hours) return { ...prayerName(p, z.weekday), time: t[p.key], inH: t[p.key] - z.hours };
    }
    const t2 = prayerTimes(addDays(z, 1, place.timeZone), place);
    return { ...PRAYERS[0], time: t2.fajr, inH: t2.fajr + 24 - z.hours, tomorrow: true };
  }

  // Hours since the most recent adhan (yesterday's Isha before today's Fajr).
  function sincePrayer(z, place) {
    const t = prayerTimes(z, place);
    const past = PRAYERS.filter(p => !p.sun && t[p.key] <= z.hours).map(p => t[p.key]);
    return z.hours - (past.length ? past.at(-1) : prayerTimes(addDays(z, -1, place.timeZone), place).isha - 24);
  }

  /* ---------- the visitor's city ---------- */

  function startingPlace() {
    try {
      const saved = localStorage.getItem('isnad-city');
      if (PLACES.has(saved)) return PLACES.get(saved);
    } catch { /* storage unavailable */ }
    return [...PLACES.values()].find(p => p.timeZone === viewerZone) || HOME;
  }
  let place = startingPlace();

  function renderCityPickers() {
    const options = CITIES.map(([country, , list]) =>
      `<optgroup label="${esc(country)}">${list.map(([name]) => `<option value="${esc(name)}">${esc(name)}</option>`).join('')}</optgroup>`).join('');
    for (const sel of $$('.city-select')) {
      sel.innerHTML = options;
      sel.value = place.name;
    }
  }

  document.addEventListener('change', e => {
    if (!e.target.matches('.city-select')) return;
    place = PLACES.get(e.target.value) || HOME;
    for (const sel of $$('.city-select')) sel.value = place.name;
    try { localStorage.setItem('isnad-city', place.name); } catch { /* storage unavailable */ }
    tick();
  });

  /* ---------- live countdown to the next adhan ---------- */

  let nextAt = 0, prevAt = 0;
  const clockText = ms => {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(n => String(n).padStart(2, '0')).join(':');
  };
  const countdownSpan = np => `<span data-countdown>${clockText(np.inH * 36e5)}</span>`;

  function renderCountdown(np) {
    $('#cdAr').textContent = np.ar;
    $('#cdName').textContent = np.en;
    $('#cdAt').textContent = `${np.tomorrow ? 'tomorrow ' : ''}at ${hm(np.time)}${place.timeZone === viewerZone ? '' : ' local time'}`;
    countdown(true);
  }

  function countdown(fromTick) {
    const left = nextAt - Date.now();
    if (left <= 0) { if (!fromTick) tick(); return; }
    const text = clockText(left);
    for (const el of $$('[data-countdown]')) el.textContent = text;
    $('#cdFill').setAttribute('stroke-dasharray', `${(100 * (1 - left / (nextAt - prevAt))).toFixed(2)} 100`);
  }

  /* ---------- prayer times section ---------- */

  function renderPrayers(z, t, np) {
    $('#prayers').innerHTML = PRAYERS.map(p => {
      const n = prayerName(p, z.weekday);
      // Marked like the countdown at the top; after Isha that is tomorrow's Fajr, shown with its own time.
      const isNext = np.key === p.key;
      return `<li class="prayer${p.sun ? ' prayer--sun' : ''}${isNext ? ' is-next' : ''}">
        <span class="prayer__ar" lang="ar" dir="rtl">${n.ar}</span>
        <span class="prayer__en">${n.en}${isNext ? `<span class="prayer__tag">${np.tomorrow ? 'Tomorrow' : 'Next'}</span>` : ''}</span>
        <span class="prayer__time">${hm(isNext ? np.time : t[p.key])}</span>
        ${isNext ? `<span class="prayer__in">in ${countdownSpan(np)}</span>` : ''}
      </li>`;
    }).join('');

    // Name the method, as we name every other source.
    const m = place.method, byMinutes = new Map();
    for (const [k, min] of Object.entries(m.add || {})) byMinutes.set(min, [...(byMinutes.get(min) || []), PRAYERS.find(p => p.key === k).en]);
    const added = [...byMinutes].map(([min, names]) => `, with ${min} minutes added to ${names.join(' and ')}`).join('');
    $('#prayersNote').textContent = `Times for ${place.name}, ${place.country}, follow ${m.name} (Fajr ${m.fajr}°, Isha ${m.isha}°${added})${SETTINGS.asrFactor === 2 ? ', with Hanafi Asr' : ''}.`;
  }

  /* ---------- five links ---------- */

  const linkBtns = $$('.link__btn');
  function renderVerdict() {
    const broken = linkBtns.filter(b => b.getAttribute('aria-pressed') === 'true');
    $('#verdict').classList.toggle('is-weak', broken.length > 0);
    $('#resetChain').hidden = broken.length === 0;
    if (!broken.length) {
      $('#verdictAr').textContent = 'صحيح';
      $('#verdictEn').textContent = 'Ṣaḥīḥ (sound)';
      $('#verdictNote').textContent = 'All five links hold. We publish this story.';
    } else {
      const names = broken.map(b => b.dataset.name);
      const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0];
      $('#verdictAr').textContent = 'ضعيف';
      $('#verdictEn').textContent = 'Ḍaʿīf (weak)';
      $('#verdictNote').textContent = `The chain fails at ${list}. We hold the story back until it is repaired.`;
    }
  }
  linkBtns.forEach(b => b.addEventListener('click', () => {
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    renderVerdict();
  }));
  $('#resetChain').addEventListener('click', () => {
    linkBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
    renderVerdict();
  });

  /* ---------- the mihrab frame (canvas) ---------- */

  // Drawn like the logo: a solid green arch with a fine gold line inside.
  (() => {
    const canvas = $('#stage'), ctx = canvas.getContext('2d');

    function archPath(W, H, inset) {
      const w = W - inset * 2, r = 0.6 * w, rise = Math.sqrt(r * r - (r - w / 2) ** 2);
      const x0 = inset, x1 = W - inset, top = inset, y0 = top + rise, cx = W / 2;
      const p = new Path2D();
      p.moveTo(x0, H);
      p.lineTo(x0, y0);
      p.arc(x0 + r, y0, r, Math.PI, Math.atan2(top - y0, cx - (x0 + r)));
      p.arc(x1 - r, y0, r, Math.atan2(top - y0, cx - (x1 - r)), 0);
      p.lineTo(x1, H);
      return p;
    }

    function draw() {
      const { width: W, height: H } = canvas.getBoundingClientRect();
      if (!W) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2), cs = getComputedStyle(document.documentElement);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.strokeStyle = cs.getPropertyValue('--green').trim();
      ctx.lineWidth = 5;
      ctx.stroke(archPath(W, H, 2.5));
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = cs.getPropertyValue('--gold').trim();
      ctx.lineWidth = 1.2;
      ctx.stroke(archPath(W, H, 13));
    }

    new ResizeObserver(draw).observe(canvas);
  })();

  /* ---------- toast ---------- */

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 4200);
  }

  /* ---------- films ---------- */

  const mmss = s => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');

  /* ---------- the moving picture in the arch, and the full view ---------- */

  // The silent clip plays by itself while on screen, never with reduced motion or data saving, and can be paused.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = !!navigator.connection?.saveData;
  for (const piece of $$('[data-ambient]')) {
    const v = $('video', piece), btn = $('[data-ambient-toggle]', piece);
    let held = reduceMotion.matches || saveData, onScreen = false;
    const update = () => (onScreen && !held ? v.play().catch(() => {}) : v.pause());
    const sync = () => {
      piece.classList.toggle('is-held', held);
      btn.setAttribute('aria-label', held ? 'Play the moving picture' : 'Pause the moving picture');
    };
    btn.addEventListener('click', () => { held = !held; sync(); update(); });
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; update(); }, { rootMargin: '200px 0px' }).observe(piece);
    sync();
  }

  // Tapping an arch opens the whole picture, uncropped; tapping a film plays it with its sound.
  // The arrow keys move through the pieces of the same gallery: the Haram's arcade, or one shelf.
  const box = $('#lightbox'), boxMedia = $('.lightbox__media', box), boxCaption = $('.lightbox__caption', box);
  let group = [], shown = 0;
  function showPiece(i) {
    shown = (i + group.length) % group.length;
    const el = group[shown], piece = el.closest('[data-piece]'), kind = el.dataset.fullKind;
    const text = s => esc($(s, piece)?.textContent.trim() || '');
    const src = esc(el.dataset.full), poster = esc(el.dataset.fullPoster || '');
    boxMedia.innerHTML = kind === 'film' ? `<video src="${src}" poster="${poster}" playsinline controls></video>`
      : `<img src="${src}" alt="${esc($('img', el)?.alt || '')}">`;
    const v = $('video', boxMedia), resumeAt = v ? watchFilm(v) : 0;
    if (v) v.play().catch(() => {});
    boxCaption.innerHTML = `<span lang="ar" dir="rtl">${text('.piece__ar')}</span> <b>${text('.piece__title')}</b> ${text('.piece__text')}`
      + (resumeAt ? ` <span class="lightbox__resume">Continuing from ${mmss(resumeAt)}</span>` : '');
    if (box.open && !box.contains(document.activeElement)) box.focus();  // keep the keys working after a swap
  }
  for (const el of $$('[data-full]')) {
    el.addEventListener('click', () => {
      for (const thumb of $$('.shelf__thumb')) preview(thumb, false);
      group = $$('[data-full]', el.closest('[data-gallery]') || document);
      box.classList.toggle('is-single', group.length < 2);
      showPiece(group.indexOf(el));
      box.showModal();
    });
  }
  box.addEventListener('click', e => {
    const act = e.target.closest('[data-box]')?.dataset.box;
    if (act === 'close' || e.target === box) box.close();
    else if (act) showPiece(shown + (act === 'next' ? 1 : -1));
  });
  document.addEventListener('keydown', e => {
    if (!box.open || group.length < 2) return;
    if (e.key === 'ArrowRight') showPiece(shown + 1);
    if (e.key === 'ArrowLeft') showPiece(shown - 1);
  });
  box.addEventListener('close', () => { boxMedia.innerHTML = ''; });
  // Phones: swipe left or right to move along. Not on a film, where a sideways drag belongs to its own controls.
  let swipeX = null, swipeY = 0;
  box.addEventListener('touchstart', e => {
    swipeX = e.touches.length === 1 && !e.target.closest('video') ? e.touches[0].clientX : null;
    swipeY = e.touches[0].clientY;
  }, { passive: true });
  box.addEventListener('touchend', e => {
    if (swipeX === null || group.length < 2) return;
    const dx = e.changedTouches[0].clientX - swipeX, dy = e.changedTouches[0].clientY - swipeY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showPiece(shown + (dx < 0 ? 1 : -1));
    swipeX = null;
  });

  /* ---------- header: the section on screen is marked in the menu ---------- */

  const navLinks = $$('.site-nav a');
  const spy = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      for (const a of navLinks) {
        if (a.hash === `#${e.target.id}`) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  for (const section of $$('main > section[id]')) spy.observe(section);

  // Phones: the menu button opens the sections as a list; choosing one, tapping elsewhere or Esc closes it.
  const menuBtn = $('.menu-btn'), nav = $('#siteNav');
  const setMenu = open => {
    menuBtn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', e => { if (nav.classList.contains('is-open') && !e.target.closest('.site-header')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- what you'll find here: each card opens its shelf of videos ---------- */

  const shelfBtns = $$('[data-shelf]');
  shelfBtns.forEach((btn, i) => btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    for (const b of shelfBtns) {
      const on = open && b === btn, shelf = $(`#${b.getAttribute('aria-controls')}`);
      b.setAttribute('aria-expanded', String(on));
      b.closest('.pillar').classList.toggle('is-open', on);
      shelf.hidden = !on;
      if (on) {
        shelf.style.setProperty('--i', i);
        shelf.style.setProperty('--c2', i % 2);
        requestAnimationFrame(() => shelf.scrollIntoView({ block: 'nearest' }));
      }
    }
  }));

  /* ---------- shelves: live previews, and where each visitor left off ---------- */

  // How far each film has been watched, kept in this browser only.
  const fileOf = src => (src || '').split('?')[0];
  let watched = {}, lastSave = 0;
  try { watched = JSON.parse(localStorage.getItem('isnad-watched')) || {}; } catch { /* storage unavailable */ }

  function remember(v) {
    if (!Number.isFinite(v.duration) || !v.duration) return;
    const f = fileOf(v.getAttribute('src')), done = v.ended || v.currentTime / v.duration > 0.95;
    watched[f] = { t: done ? 0 : Math.floor(v.currentTime), d: Math.round(v.duration), done: done || !!watched[f]?.done };
    if (Date.now() - lastSave < 2000 && !v.paused && !done) return;
    lastSave = Date.now();
    try { localStorage.setItem('isnad-watched', JSON.stringify(watched)); } catch { /* storage unavailable */ }
    renderWatched();
  }

  // A film opened in the full view picks up where it was left; returns that time, or 0.
  function watchFilm(v) {
    const w = watched[fileOf(v.getAttribute('src'))], at = w && !w.done && w.t > 3 ? w.t : 0;
    if (at) v.addEventListener('loadedmetadata', () => { v.currentTime = at; }, { once: true });
    for (const ev of ['timeupdate', 'pause', 'ended']) v.addEventListener(ev, () => remember(v));
    return at;
  }

  // Progress lines and the number of videos on each card.
  function renderWatched() {
    for (const thumb of $$('.shelf__thumb')) {
      const w = watched[fileOf(thumb.dataset.full)], label = $('.sr-only', thumb);
      const pct = !w ? 0 : w.done ? 100 : Math.min(100, (w.t / w.d) * 100);
      thumb.dataset.label ||= label.textContent;
      $('.shelf__progress span', thumb).style.width = `${pct}%`;
      thumb.classList.toggle('is-started', pct > 0);
      label.textContent = thumb.dataset.label + (w?.done ? ', watched' : pct ? `, ${Math.round(pct)}% watched` : '');
    }
    for (const btn of shelfBtns) {
      const thumbs = $$('.shelf__thumb', $(`#${btn.getAttribute('aria-controls')}`)), count = $('.pillar__count', btn.closest('.pillar'));
      if (!thumbs.length) continue;
      count.textContent = `${thumbs.length} video${thumbs.length > 1 ? 's' : ''}`;
    }
  }

  // A silent preview of the first seconds plays in a thumbnail: on hover with a mouse,
  // or while it is on screen on a touch screen. Never with reduced motion or data saving.
  function preview(thumb, on) {
    let v = $('.shelf__preview', thumb);
    if (on && !v) {
      v = document.createElement('video');
      v.className = 'shelf__preview';
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = 'none';
      v.setAttribute('aria-hidden', 'true');
      v.src = thumb.dataset.preview || thumb.dataset.full;  // a short, small clip, so a preview costs little data
      v.addEventListener('playing', () => thumb.classList.add('is-previewing'));
      v.addEventListener('timeupdate', () => { if (v.currentTime > 12) v.currentTime = 0; });
      $('img', thumb).after(v);
    }
    if (!v) return;
    if (on) v.play().catch(() => {});
    else { v.pause(); thumb.classList.remove('is-previewing'); }
  }
  if (!reduceMotion.matches && !saveData) {
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    for (const thumb of $$('.shelf__thumb')) {
      if (mouse) {
        thumb.addEventListener('pointerenter', () => preview(thumb, true));
        thumb.addEventListener('pointerleave', () => preview(thumb, false));
        thumb.addEventListener('focus', () => preview(thumb, true));
        thumb.addEventListener('blur', () => preview(thumb, false));
      } else {
        new IntersectionObserver(([e]) => preview(thumb, e.isIntersecting), { threshold: 0.6 }).observe(thumb);
      }
    }
  }
  renderWatched();

  /* ---------- across Africa: the live adhan map ---------- */

  (() => {
    const map = $('#atlasMap');
    if (!map) return;
    const KAABA = { lat: 21.4225, lng: 39.8262 };
    const proj = (lng, lat) => [(lng + 26) * 10, (39 - lat) * 10];  // the map: 10 units a degree, from 26°W and 39°N
    const PERIODS = [
      { key: 'fajr', en: 'Fajr', ar: 'الفجر' }, { key: 'sunrise', en: 'After sunrise', ar: 'الشروق' },
      { key: 'dhuhr', en: 'Dhuhr', ar: 'الظهر' }, { key: 'asr', en: 'Asr', ar: 'العصر' },
      { key: 'maghrib', en: 'Maghrib', ar: 'المغرب' }, { key: 'isha', en: 'Isha', ar: 'العشاء' },
    ];
    const WINDS = ['north', 'north-north-east', 'north-east', 'east-north-east', 'east', 'east-south-east', 'south-east', 'south-south-east',
      'south', 'south-south-west', 'south-west', 'west-south-west', 'west', 'west-north-west', 'north-west', 'north-north-west'];
    const label = (key, weekday) => (key === 'sunrise' ? 'After sunrise' : prayerName(PRAYERS.find(p => p.key === key), weekday).en);
    const join = list => (list.length < 2 ? list.join('') : `${list.slice(0, -1).join(', ')} and ${list.at(-1)}`);

    // Qiblah: the first bearing of the great circle to the Kaʿbah, and the distance along it.
    function qibla(p) {
      const f1 = rad(p.lat), f2 = rad(KAABA.lat), dl = rad(KAABA.lng - p.lng);
      const brg = wrap(deg(Math.atan2(Math.sin(dl) * Math.cos(f2), Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl))), 360);
      const km = 6371 * 2 * Math.asin(Math.sqrt(Math.sin((f2 - f1) / 2) ** 2 + Math.cos(f1) * Math.cos(f2) * Math.sin(dl / 2) ** 2));
      return { brg, km: Math.round(km / 10) * 10, wind: WINDS[Math.round(brg / 22.5) % 16] };
    }
    // Points along the great circle from a city to the Kaʿbah, on the map.
    function arc(p, n = 18) {
      const v = q => [Math.cos(rad(q.lat)) * Math.cos(rad(q.lng)), Math.cos(rad(q.lat)) * Math.sin(rad(q.lng)), Math.sin(rad(q.lat))];
      const A = v(p), B = v(KAABA), w = Math.acos(Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2])), pts = [];
      for (let i = 0; i <= n; i++) {
        const s1 = Math.sin((1 - i / n) * w) / Math.sin(w), s2 = Math.sin((i / n) * w) / Math.sin(w);
        const x = s1 * A[0] + s2 * B[0], y = s1 * A[1] + s2 * B[1], z = s1 * A[2] + s2 * B[2];
        pts.push(proj(deg(Math.atan2(y, x)), deg(Math.atan2(z, Math.hypot(x, y)))));
      }
      return pts;
    }
    const line = pts => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');

    const cities = [...PLACES.values()];
    $('#atlasQibla').setAttribute('d', cities.map(p => line(arc(p))).join(''));
    const [kx, ky] = proj(KAABA.lng, KAABA.lat);
    $('#atlasKaaba').innerHTML = `<rect x="${kx - 6}" y="${ky - 6}" width="12" height="12"/><line x1="${kx - 6}" y1="${ky - 2.5}" x2="${kx + 6}" y2="${ky - 2.5}"/><text x="${kx + 12}" y="${ky + 5}">Makkah</text>`;

    // Each city's prayer right now: which period it is in, and for how many minutes.
    function stateOf(p, date) {
      const z = zoned(date, p.timeZone), t = prayerTimes(z, p);
      let key = null, at = 0;
      for (const pr of PRAYERS) if (t[pr.key] <= z.hours) { key = pr.key; at = t[pr.key]; }
      if (!key) { key = 'isha'; at = prayerTimes(addDays(z, -1, p.timeZone), p).isha - 24; }
      return { z, key, since: (z.hours - at) * 60 };
    }

    // One button per city.
    const tip = $('#atlasTip');
    let active = null;
    const dots = cities.map(p => {
      const b = document.createElement('button'), [x, y] = proj(p.lng, p.lat), d = { p, b, q: qibla(p) };
      b.type = 'button';
      b.className = 'atlas__dot';
      b.style.left = `${(x / 8.6).toFixed(2)}%`;
      b.style.top = `${(y / 7.6).toFixed(2)}%`;
      b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') showTip(d); });
      b.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hideTip(); });
      b.addEventListener('focus', () => showTip(d));
      b.addEventListener('blur', hideTip);
      b.addEventListener('click', e => {
        const t = (e.detail && nearest(e.clientX, e.clientY)) || d;  // a tap goes to the closest city; Enter to this one
        choose(t.p);
        showTip(t);
      });
      $('#atlasDots').append(b);
      return d;
    });
    // On a phone the dots crowd together, so a tap picks the city closest to the finger, within reach of it.
    function nearest(x, y) {
      let best = null, dist = 28;
      for (const d of dots) {
        const r = d.b.getBoundingClientRect(), far = Math.hypot(r.left + r.width / 2 - x, r.top + r.height / 2 - y);
        if (far < dist) { best = d; dist = far; }
      }
      return best;
    }
    map.addEventListener('click', e => {
      if (e.target.closest('.atlas__dot')) return;
      const t = nearest(e.clientX, e.clientY);
      if (t) { choose(t.p); showTip(t); } else hideTip();
    });

    function showTip(d) {
      const s = d.s || stateOf(d.p, when()), np = nextPrayer(s.z, d.p), calling = s.key !== 'sunrise' && s.since < windowMin();
      active = d;
      for (const x of dots) x.b.classList.toggle('is-on', x === d);
      $('#atlasQiblaOn').setAttribute('d', line(arc(d.p)));
      const now = calling ? `The adhan for ${label(s.key, s.z.weekday)} is being called` : s.key === 'sunrise' ? 'After sunrise' : `${label(s.key, s.z.weekday)} time`;
      tip.innerHTML = `<b>${esc(d.p.name)}</b><small>${esc(d.p.country)} · ${hm(Math.floor(s.z.hours * 60) / 60)} local time</small>
        <p class="atlas__tip-now">${esc(now)}</p>
        <p>Next: ${esc(np.en)} at ${hm(np.time)}${np.tomorrow ? ' tomorrow' : ''}</p>
        <p>Qiblah ${Math.round(d.q.brg)}°, ${d.q.wind} · ${d.q.km.toLocaleString('en')} km to the Kaʿbah</p>
        <small>${d.p.name === place.name ? 'Your prayer times follow this city' : 'Tap to use it for your prayer times'}</small>`;
      tip.hidden = false;
      const m = map.getBoundingClientRect(), r = d.b.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
      const cx = r.left - m.left + r.width / 2, cy = r.top - m.top + r.height / 2;
      let left = cx + 18;
      if (left + tw > m.width - 8) left = cx - 18 - tw;
      tip.style.left = `${Math.max(8, left)}px`;
      tip.style.top = `${Math.min(Math.max(8, cy - th / 2), m.height - th - 8)}px`;
    }
    function hideTip() {
      active = null;
      tip.hidden = true;
      for (const x of dots) x.b.classList.remove('is-on');
      $('#atlasQiblaOn').removeAttribute('d');
    }
    function choose(p) {
      const sel = $('#cityPrayers');
      if (sel.value === p.name) return;
      sel.value = p.name;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      toast(`Prayer times now follow ${p.name}.`);
    }

    // The night: the sun's height over every degree of the map, soft at the edges (twilight).
    const nctx = $('#atlasNight').getContext('2d'), img = nctx.createImageData(86, 76);
    function drawNight(date) {
      const { decl, eqt } = sunAt(date.getTime() / 864e5 + 2440587.5);
      const subLng = 15 * (12 - eqt - (date.getTime() / 36e5) % 24), sd = dsin(decl), cd = dcos(decl);
      for (let j = 0; j < 76; j++) {
        const sl = dsin(39 - j - 0.5), cl = dcos(39 - j - 0.5);
        for (let i = 0; i < 86; i++) {
          const h = dasin(sl * sd + cl * cd * dcos(-26 + i + 0.5 - subLng));
          const a = h >= 0 ? 0 : h > -6 ? 0.2 * -h / 6 : h > -18 ? 0.2 + 0.4 * (-h - 6) / 12 : 0.6;
          const k = (j * 86 + i) * 4;
          img.data[k] = 18; img.data[k + 1] = 52; img.data[k + 2] = 42; img.data[k + 3] = Math.round(a * 255);
        }
      }
      nctx.putImageData(img, 0, 0);
    }

    // Time: live, or moved forward by the slider or the "watch a day" button.
    let offset = 0, playing = false, raf = 0, lastFrame = 0, lastDraw = 0;
    const when = () => new Date(Date.now() + offset * 6e4);
    const windowMin = () => (playing ? 25 : 6);  // how long a city counts as "calling"
    const play = $('#atlasPlay'), scrub = $('#atlasScrub'), back = $('#atlasBack');

    function render() {
      const date = when(), counts = {}, calling = [];
      for (const d of dots) {
        const s = stateOf(d.p, date);
        d.s = s;
        counts[s.key] = (counts[s.key] || 0) + 1;
        const isCalling = s.key !== 'sunrise' && s.since < windowMin();
        if (d.b.dataset.p !== s.key) {
          d.b.dataset.p = s.key;
          d.b.setAttribute('aria-label', `${d.p.name}, ${d.p.country}: ${label(s.key, s.z.weekday)}`);
        }
        d.b.classList.toggle('is-calling', isCalling);
        if (isCalling) calling.push(d);
      }
      drawNight(date);
      $('#atlasKey').innerHTML = PERIODS.map(p => `<li><i style="--c: var(--p-${p.key})"></i>${p.en} <span lang="ar" dir="rtl">${p.ar}</span><b>${counts[p.key] || 0}</b></li>`).join('');

      // What is happening: where the adhan is being called, or where it comes next.
      const now = $('#atlasNow');
      if (calling.length) {
        const groups = new Map();
        for (const d of calling.sort((a, b) => a.s.since - b.s.since)) {
          const k = label(d.s.key, d.s.z.weekday);
          groups.set(k, [...(groups.get(k) || []), d.p.name]);
        }
        now.innerHTML = [...groups].slice(0, 2).map(([name, list], i) => {
          const shown = list.slice(0, 3), more = list.length - shown.length;
          const where = esc(join(more ? [...shown, `${more} more`] : shown));
          return i ? ` ${esc(name)} in ${where}.` : `The adhan for <b>${esc(name)}</b> is being called in ${where}.`;
        }).join('');
      } else {
        let best = null;
        for (const d of dots) { const np = nextPrayer(d.s.z, d.p); if (!best || np.inH < best.np.inH) best = { d, np }; }
        now.innerHTML = `Next: the adhan for <b>${esc(best.np.en)}</b> in ${esc(best.d.p.name)}, in ${(m => (m < 60 ? `${m}\u00a0min` : `${Math.floor(m / 60)}\u00a0h ${m % 60}\u00a0min`))(Math.max(1, Math.round(best.np.inH * 60)))}.`;
      }

      // The clock, in the visitor's own city.
      const z = zoned(date, place.timeZone), today = zoned(new Date(), place.timeZone);
      $('#atlasClock').textContent = `${z.d !== today.d ? 'Tomorrow, ' : ''}${hm(Math.floor(z.hours * 60) / 60)} in ${place.name}`;
      const live = $('#atlasLive');
      live.textContent = offset ? `+${Math.floor(offset / 60)} h ${String(Math.floor(offset % 60)).padStart(2, '0')} min` : 'Live';
      live.classList.toggle('is-sim', offset > 0);
      if (active) showTip(active);
    }

    function setOffset(min) {
      offset = Math.max(0, Math.min(1440, min));
      scrub.value = offset;
      back.hidden = offset === 0;
      render();
    }
    function frame(ts) {
      if (!playing) return;
      offset += lastFrame ? (ts - lastFrame) / 1000 * 60 : 0;  // an hour every second
      lastFrame = ts;
      if (offset >= 1440) { stop(); setOffset(0); return; }
      if (ts - lastDraw > 33) { lastDraw = ts; scrub.value = offset; back.hidden = false; render(); }
      raf = requestAnimationFrame(frame);
    }
    function start() {
      playing = true;
      lastFrame = 0;
      play.setAttribute('aria-pressed', 'true');
      $('use', play).setAttribute('href', '#i-pause');
      $('#atlasPlayLabel').textContent = 'Pause';
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      playing = false;
      cancelAnimationFrame(raf);
      play.setAttribute('aria-pressed', 'false');
      $('use', play).setAttribute('href', '#i-play');
      $('#atlasPlayLabel').textContent = 'Watch a day go by';
      render();
    }
    play.addEventListener('click', () => (playing ? stop() : start()));
    scrub.addEventListener('input', () => { if (playing) stop(); setOffset(+scrub.value); });
    back.addEventListener('click', () => { if (playing) stop(); setOffset(0); });
    document.addEventListener('change', e => { if (e.target.matches('.city-select')) render(); });

    // Live: refresh every 20 seconds while the map is on screen.
    let onScreen = false;
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen && !playing) render(); }).observe(map);
    setInterval(() => { if (onScreen && !playing) render(); }, 20000);
    render();
  })();

  /* ---------- contact form ---------- */

  $('#contactForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.currentTarget, status = $('#formStatus');
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return;  // filled in by a spam robot
    const { action, fields } = SETTINGS.googleForm;

    // Not connected yet: the visitor's email app opens with the message written out.
    if (!action) {
      const body = `${data.message}\n\n${data.name}\n${data.email}${data.whatsapp ? `\nWhatsApp: ${data.whatsapp}` : ''}`;
      location.href = `mailto:${SETTINGS.email}?subject=${encodeURIComponent(`${data.topic}, from the Isnad Media website`)}&body=${encodeURIComponent(body)}`;
      status.dataset.state = 'info';
      status.innerHTML = `Your email app should open with your message. If it doesn’t, write to us at <a href="mailto:${SETTINGS.email}">${SETTINGS.email}</a>.`;
      return;
    }

    // Google Forms accepts the answers but doesn't let the page read its reply, so a sent request counts as delivered.
    const body = new URLSearchParams();
    for (const [key, entry] of Object.entries(fields)) if (entry) body.append(entry, data[key] || '');
    status.dataset.state = 'info';
    status.textContent = 'Sending…';
    try {
      await fetch(action, { method: 'POST', mode: 'no-cors', body });
      form.reset();
      status.dataset.state = 'ok';
      status.textContent = `JazākAllāhu khayran${data.name ? `, ${data.name}` : ''}. Your message reached us.`;
    } catch {
      status.dataset.state = 'error';
      status.innerHTML = `Your message could not be sent. Check your connection and try again, or email us at <a href="mailto:${SETTINGS.email}">${SETTINGS.email}</a>.`;
    }
  });

  /* ---------- start ---------- */

  function tick() {
    const now = new Date(), z = zoned(now, place.timeZone), np = nextPrayer(z, place);
    nextAt = now.getTime() + np.inH * 36e5;
    prevAt = now.getTime() - sincePrayer(z, place) * 36e5;
    renderPrayers(z, prayerTimes(z, place), np);
    renderCountdown(np);
  }

  $('#year').textContent = new Date().getFullYear();
  renderCityPickers();
  tick();
  setInterval(countdown, 1000);  // the countdown ticks every second
  setInterval(tick, 60000);      // prayer times roll over to the new day after midnight
})();
