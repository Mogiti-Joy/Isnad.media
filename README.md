# Isnad Media website

The website for Isnad Media. It is plain HTML, CSS and JavaScript, so there is nothing to install or build.

## Run it on your computer

```bash
cd ~/Desktop/Isnad
python3 serve.py
```

Then open http://localhost:8000. Press `Ctrl + C` in Terminal to stop it.

`serve.py` is used instead of `python3 -m http.server` because Safari needs it to play the videos. To use another port: `python3 serve.py 8080`.

## Before going live

Open `js/main.js`. The settings are at the top, in `SETTINGS`:

| Setting | What to put there |
|---|---|
| `formEndpoint` | Where the contact form sends messages, e.g. a Formspree link. Until this is set, the form says it is a preview. |
| `city` | The city whose prayer times are shown when a visitor's time zone doesn't match any city in the list (currently Nairobi). It must be one of the `CITIES` listed below it. |
| `asrFactor` | `1` for the standard Asr (Shafiʿi, Maliki, Hanbali), `2` for Hanafi Asr. |

## Prayer times

The prayer times cover every country in Africa (54 countries, 125 cities). Visitors pick their city in the countdown at the top of the page or in the Prayer Times section. The page starts on the first city in the visitor's own time zone.

Each country uses the method its masjids follow. These are set in `METHODS` and `CITIES` in `js/main.js`:

| Countries | Method |
|---|---|
| Egypt, Libya, Sudan, South Sudan, Nigeria | Egyptian General Authority of Survey (Fajr 19.5°, Isha 17.5°) |
| Morocco | Ministry of Habous and Islamic Affairs (Fajr 19°, Isha 17°, 5 minutes added to Dhuhr and Maghrib) |
| Algeria | Ministry of Religious Affairs and Wakfs (Fajr 18°, Isha 17°, 3 minutes added to Maghrib, rounded up) |
| Tunisia | Ministry of Religious Affairs (Fajr 18°, Isha 18°) |
| All other countries | Muslim World League (Fajr 18°, Isha 17°) |

The method in use is named under the prayer times on the page.

The times were checked against official timetables for Cairo, Rabat and Algeria, and against the Aladhan prayer-times service for every city. A local masjid can still be a minute or two different. If your masjid follows a different method, change that country's method in `CITIES`.

Morocco moved to GMT all year on 20 September 2026. Browsers released before then still add an hour, so the site carries the new rule itself in `ZONE_CHANGES` in `js/main.js`. If a country changes its clocks again, add it there.

To add a city, add `['Name', latitude, longitude, 'time zone']` to its country in `CITIES`. The time zone is the country's entry from the [IANA list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), for example `'Africa/Nairobi'`.

## Films

The "From the Haramain" and "Masajid of Africa" labels were painted out of both films and their covers; the small Isnad arch logo is kept. The labelled versions are in `originals/`.

Both films were filmed upright. To fill the wide frame, the film plays whole in the middle with a blurred copy of the same footage at the sides. The earlier versions, with plain green sides, are in `originals/green-sides/`.

The mihrab arch at the top of the page plays Masajid of Africa, Jumuʿah. It is the `<figure class="stage">` block in `index.html`. The arch is tall, so it suits a vertical film; a landscape film is cropped at the sides. To change it, put the video (`.mp4`) and a cover image (`.jpg`) in `assets/video/`, then in that block change the video and cover file names, the `0:00 / 0:53` length in the controls, and the caption (series in English and Arabic, title and description).

The other films are on the shelves under "What you'll find here" (see below).

## The menu

The bar at the top links to Watch, Prayer times, The Haram, Our name and Contact, and underlines the section on screen. On phones it shows only the logo and Follow us. The links are the `<nav class="site-nav">` block in `index.html`.

## Our name

The "Our name" section explains the name in two paragraphs, then sets apart the first hadith in Ṣaḥīḥ al-Bukhārī ("Actions are only by intentions") and closes with the quote from ʿAbdullāh ibn al-Mubārak.

## What you'll find here

The four cards are buttons. Each shows a picture from its films (the `<div class="pillar__media">` at the top of the card); The Majlis shows the Isnad arch until it has films. The chosen card turns green and opens a shelf of its videos, shown as horizontal thumbnails; choosing a video plays it in the full view, with sound for the films. A video can sit on more than one shelf:

| Card | Videos |
|---|---|
| Reminders | Jumuʿah (Masajid of Africa), The recitation at the next table (From the Haramain), Islam’s first command (Scholars of Mali) |
| African Muslim History | Jumuʿah, then the five Scholars of Mali films with Thierno Hady Thiam: Why Timbuktu is more famous abroad than at home, How Islam crossed the Sahara, From teacher to student, Islam’s first command, Who’s reading the manuscripts? |
| Faces of the Ummah | The recitation at the next table, The courtyards, How Islam in West Africa has changed (Scholars of Mali) |
| The Majlis | None yet: it shows "Coming soon" with a link to follow Isnad Media |

Each video on a shelf:

- **Plays a silent preview** of its first seconds: on hover with a mouse, or while on screen on a phone. There are no previews for visitors who have asked their device for reduced motion or data saving.
- **Remembers where each visitor stopped**, in their own browser only. A gold line on the thumbnail shows how far they got, finished films are marked "Watched", the card counts them ("2 videos · 1 watched"), and reopening a film carries on from where it was left.

To add a video to a shelf, copy one `<li class="shelf__film">` block inside that card's `<div class="shelf">` in `index.html`, change the video, cover, length, series and text, and update the count on the card ("2 videos"). For The Majlis, replace the `shelf__empty` paragraph with a `<ul class="shelf__films">` list like the others.

## Work with us

Before the contact form, "Let’s make an impact together" has a **Start a conversation** button. It opens to show:

- **WhatsApp**: +250 793 835 632. The link (`https://wa.me/250793835632`) opens a WhatsApp chat with that number.
- **Email**: isnadmedia9@gmail.com, which opens a new email.

To change them, edit the `<section id="reach">` block in `index.html`. In the WhatsApp link, write the number with the country code and no `+`, spaces or dashes.

## The adhan never stops (live map)

After the prayer times, a live map of Africa shows:

- **The night over Africa right now**, worked out from the sun's position, with soft twilight at its edge.
- **All 125 prayer-time cities**, each coloured by the prayer it is in. A ring spreads from a city while its adhan is being called.
- **A line from every city to the Kaʿbah.**
- **What is happening**: where the adhan is being called, or where it comes next, and how many cities are in each prayer.

Hovering over or tapping a city shows its local time, current and next prayer, and its qiblah direction and distance to Makkah. Tapping also makes it the city for the site's prayer times. "Watch a day go by" plays the next 24 hours in about 24 seconds, and the slider moves through them by hand.

The map uses the same prayer times as the rest of the site, so there is nothing extra to keep up to date. The coastline and country borders come from Natural Earth (public domain) and are built into `index.html`, with the equator and the tropics marked.

## From the Haramain

The section after the prayer times shows Masjid al-Ḥarām, the qiblah of those prayers. Its files are in `assets/haramain/`.

- **The arcade**: four arches, linked like a chain, run from daylight to Maghrib: the Kaʿbah (`kaaba-arch.jpg`), the Clock Tower (`clock-tower.jpg`), sunset over the courtyards (`haram-sunset.jpg`) and a short moving clip of the same courtyards (`maghrib.mp4`). Tapping an arch opens the whole picture, uncropped; the arrow keys move along and Esc closes it.
- **The courtyards**: a wide moving view of the crowds (`courtyards.mp4`).

The two clips have no sound. They play by themselves only while on screen, have a pause button, and stay still for visitors who have asked their device for reduced motion.

The pictures are used at full size. The clips were re-encoded from the WhatsApp files: the short one turned upright, and the courtyards scaled to 720p with gentle sharpening, which looks clearer than the 480p original. Better originals (straight from the phone, not through WhatsApp) would look sharper still. To swap one, keep the same file name, or change it in the `<section id="haramain">` block of `index.html`.

If you edit the CSS or JavaScript after the site is online, raise the `?v=5` number on their links at the top and bottom of `index.html`, so visitors' browsers fetch the new version.

## What is in the folder

| Path | What it is |
|---|---|
| `index.html` | The page |
| `css/styles.css` | All styling (colours are at the top, under `:root`) |
| `js/main.js` | Settings, prayer times, film players, contact form |
| `assets/` | Logo, photos and illustrations |
| `assets/video/` | The films and their cover images |
| `serve.py` | Local preview server |
| `originals/` | The two films and their covers as they were, with the series labels, and in `green-sides/` the versions before the blurred sides. Not used by the page |

## Photos

Two photos come from Wikimedia Commons and may be used freely as long as the photographer is credited. The credit is in each photo's hover text in `index.html`. Keep it, or replace the photos with your own.

- `assets/lamu-maulidi-dhows.jpg`: dhow race at Lamu during Maulidi, by FredD, CC BY-SA 3.0 (not used on the page at the moment)
- `assets/lamu-town.jpg`: Lamu Island, by folklore.co.ke, CC BY-SA 4.0 (not used on the page at the moment)

`assets/makkah-sunset.jpg` (Makkah at sunset, under the verse) was supplied as a WhatsApp image. It has no caption on the page; if it needs a photographer's credit, add one under the photo in `index.html`.

The other pictures (`lamu-fajr.jpg`, `swahili-door.jpg`) were made for Isnad Media and need no credit. Neither is used on the page at the moment.

## Putting it online

Upload the whole folder (everything except `serve.py`, this file and the `originals` folder) to any static web host, for example Netlify (drag and drop the folder), GitHub Pages, Cloudflare Pages or your current hosting's file manager. No server code is needed.
