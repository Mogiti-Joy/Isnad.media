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
| `email` | The address the contact form's messages are written to. |
| `city` | The city whose prayer times are shown when a visitor's time zone doesn't match any city in the list (currently Nairobi). It must be one of the `CITIES` listed below it. |
| `asrFactor` | `1` for the standard Asr (Shafiʿi, Maliki, Hanbali), `2` for Hanafi Asr. |

## Prayer times

The prayer times cover every country in Africa (54 countries, 125 cities). Visitors pick their city in the Prayer times section, which opens with a live countdown to the next adhan, or by tapping it on the map. The page starts on the first city in the visitor's own time zone.

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

The "From the Haramain" and "Masajid of Africa" labels were painted out of both films and their covers; the small Isnad arch logo is kept. The label was also painted out of Uganda National Mosque. The labelled versions are in `originals/`.

These films were filmed upright. To fill the wide frame, the film plays whole in the middle with a blurred copy of the same footage at the sides. The earlier versions, with plain green sides, are in `originals/green-sides/`.

The mihrab arch under "Our name" and its quote plays the Ṭawāf around the Kaʿbah, late in the day. It is the `<figure class="stage">` block in `index.html` and uses `assets/haramain/tawaf-arch.mp4` (cover `tawaf-arch.jpg`). The clip was cut from a 1080×1920 video (`originals/tawaf-source-1080x1920.mp4`, from Pexels judging by its file name; the Pexels licence allows use without credit) to the arch's tall shape at 760×1056, sharp on Retina screens. The source is 7 seconds long, so the last second fades into the first and the clip loops without a jump. It is never played backwards, which would show the Ṭawāf turning the wrong way. The arch is 380px wide. The earlier courtyards version is in `originals/unused/`.

The other films are on the shelves under "What you'll find here" (see below).

## The menu

The bar at the top links to Our name, Watch, What we do, Prayer times, From Haramain and Contact, and underlines the section on screen. On phones it shows only the logo and Follow us. The links are the `<nav class="site-nav">` block in `index.html`.

## Phones, folding phones and dual-screen phones

The site was checked on every common size, from the 280px outer screen of the first Galaxy Fold, through the Galaxy Z Fold and Flip, every iPhone from the SE to the Pro Max, and phones turned sideways, to tablets and large desktops.

- **Menu**: up to 900px wide, the menu folds into a **Menu** button that opens the sections as a list. Choosing one, tapping elsewhere or pressing Esc closes it. On the narrowest screens the bar shows only the arch mark, Follow us and Menu.
- **Taps**: buttons and pickers are at least 44px tall on phones, the size Apple recommends for a finger. The city pickers use 16px text so iPhones don't zoom in when they are tapped.
- **The map**: on a phone the 125 cities crowd together, so a tap picks the city closest to the finger.
- **The full view**: swipe left or right to move between pictures (films keep their own controls, so swiping isn't used on them). The picture or film always fits the screen above its caption, including phones turned sideways, where the arrows move to the sides.
- **Small details**: buttons never break their label over two lines, the map's labels are enlarged on phones, and numbers stay on the same line as their units ("4 min").
- **The form**: phone keyboards show the right keys for email and phone numbers, and the Return key moves to the next field.
- **Dual-screen phones** (such as the Surface Duo) with the page spread over both screens: nothing sits across the hinge. Two-part layouts put one part on each screen (the verse in Arabic on the left and English on the right), cards and services fill two columns, one each side, and the full view uses one screen. This is the `dual-screen phones` block near the end of `css/styles.css`.

## Our name

The "Our name" section comes straight after the opening, so it is the first thing people reach when they scroll. It explains the name in two paragraphs, then gives the saying of ʿAbdullāh ibn al-Mubārak on the isnad in Arabic and English, and ends with the Ṭawāf arch.

## What you'll find here

The four cards are buttons. Each shows a picture from its films (the `<div class="pillar__media">` at the top of the card). The chosen card turns green and opens a shelf of its videos, shown as horizontal thumbnails; choosing a video plays it in the full view, with sound for the films. A video can be on two shelves at most, and a series stays together (all the Scholars of Mali films are under African Muslim History). A film on two shelves shares its progress line, because it is the same file:

| Card | Videos |
|---|---|
| Reminders | Jumuʿah (Masajid of Africa) |
| African Muslim History | The six Scholars of Mali films with Thierno Hady Thiam: Why Timbuktu is more famous abroad than at home, How Islam crossed the Sahara, From teacher to student, Islam’s first command, Who’s reading the manuscripts?, How Islam in West Africa has changed. Also Uganda National Mosque (Masajid of Africa) |
| Faces of the Ummah | The recitation at the next table (also under From the Haramain), How Islam in West Africa has changed (also under African Muslim History) |
| From the Haramain | The recitation at the next table |

Each video on a shelf:

- **Plays a silent preview** of its first seconds: on hover with a mouse, or while on screen on a phone. There are no previews for visitors who have asked their device for reduced motion or data saving.
- **Remembers where each visitor stopped**, in their own browser only. A gold line on the thumbnail shows how far they got, and reopening a film carries on from where it was left.

**Thumbnails.** Each film has a cover (`NAME.jpg`, 1280×720, shown in the full view before it plays) and a thumbnail (`NAME-sm.jpg`, 960×540, sharp on phone screens), chosen by hand so that every one is different and none shows a burned-in subtitle or the corner logo:

- The six Scholars of Mali thumbnails are taken from the 1080p originals in `Downloads/REPORTAGE_Horizontal`, cropped above the subtitle line. Where the scholar is seated, his face sits off-centre so the play button doesn't cover it.
- Jumuʿah, filmed upright, shows three moments side by side: the empty minbar, the khutbah and the congregation.
- The recitation at the next table, also upright, shows Jamal close up.
- Uganda National Mosque, also upright, shows the arch and minaret from the wide shot inside the film, above its captions.

The earlier thumbnails are in `originals/unused/old-thumbnails/`. If you replace a thumbnail, raise its `?v=` number in `index.html` so returning visitors see the new one.

To add a video to a shelf, copy one `<li class="shelf__film">` block inside that card's `<div class="shelf">` in `index.html`, change the video, cover, length, series and text, and update the count on the card ("2 videos").

## What we do

After the four categories in "What you’ll find here", "What we do" (ما نقدّمه) lists Isnad Media's services: six main ones as numbered cards, then three under the smaller heading "Also from Isnad". The **Start a conversation** button under them goes to the contact form. To change a service, edit its `<li>` in the `<section id="services">` block in `index.html`.

## Contact

"Write to us" has the form, then the WhatsApp line and the promise about privacy, and beside it the three kinds of message and a button for each way to reach us: Email (isnadmedia9@gmail.com), WhatsApp (+250 793 835 632, `https://wa.me/250793835632`), Instagram and TikTok. In a WhatsApp link, write the number with the country code and no `+`, spaces or dashes.

The form asks for a name, an email address (required, so we can reply), a WhatsApp number (optional), the topic and the message. A hidden field catches spam robots.

"Send message" opens the visitor's own email app with their message already written to isnadmedia9@gmail.com, and they press send there. There is no Google Sheet or outside form service, so it is free and has no limit. A visitor with no email app set up sees the address on the page and can write to it directly.

## The adhan never stops (live map)

After the prayer times, a live map of Africa shows:

- **The night over Africa right now**, worked out from the sun's position, with soft twilight at its edge.
- **All 125 prayer-time cities**, each coloured by the prayer it is in. A ring spreads from a city while its adhan is being called.
- **A line from every city to the Kaʿbah.**
- **What is happening**: where the adhan is being called, or where it comes next, and how many cities are in each prayer.

Hovering over or tapping a city shows its local time, current and next prayer, and its qiblah direction and distance to Makkah. Tapping also makes it the city for the site's prayer times. "Watch a day go by" plays the next 24 hours in about 24 seconds, and the slider moves through them by hand.

The map uses the same prayer times as the rest of the site, so there is nothing extra to keep up to date. The coastline and country borders come from Natural Earth (public domain) and are built into `index.html`, with the equator and the tropics marked.

## Masajid of Africa

After the live map, the story of the Great Mosque of Djenné in Mali, from Isnad Media's Instagram, lies beside a short introduction as a stack of its eight pages (`assets/masajid/djenne-1.jpg` to `djenne-8.jpg`, 1080×1350, in order). The pages under the top one fan out a little.

- **Turning the pages**: drag the top page aside (it flies off and the next one shows; drag the other way to bring the last one back), or use the arrows under the stack or the arrow keys. The count shows which page is on top.
- **Reading in full**: tapping the top page opens it in the full view; closing it leaves the stack on the page last seen.

The words on each page are part of the picture, so each picture's description in `index.html` repeats them for screen readers. To use another story, replace the eight pictures (keeping the names, or changing them in the `<section id="masajid">` block), then change the heading, the paragraph and the descriptions. For more or fewer pages, add or remove `<li class="deck__page">` blocks and change the "8" in the count and the labels.

## Through the doors

After Masajid of Africa, this section keeps the curved door frames and opens onto three regions. The three small doors at the top choose one, and the doors and words take on its colours. The background stays the same for all three: parchment with a gold star-and-cross pattern and a double gold frame, like the illuminated pages of a printed muṣḥaf. It uses no verses, because Qurʾān text shouldn't sit behind buttons and pictures. It is the `<section id="haramain">` block in `index.html`, and it always opens on the Haramain, so the menu's link still goes there.

| Door | Colours | Arches |
|---|---|---|
| From the Haramain | Green and gold | The Kaʿbah, the Clock Tower, sunset over the courtyards, the Prophet’s Masjid in Madinah |
| The Sahel | Terracotta | The Great Mosque of Djenné, and three Scholars of Mali films |
| East Africa | Ocean teal and coral | Lamu, the dhows, the Swahili door, and the Uganda National Mosque film |

- **The leaves**: each arch starts shut, with two studded leaves in its region's colour. They swing open one arch after another when the section comes on screen, and again whenever a door is chosen. Visitors who have asked their device for reduced motion see the pictures straight away.
- **Pictures and films**: tapping an arch opens the whole picture, uncropped, or plays its film. The arrow keys move along that region's arches only, and Esc closes it.
- **Pictures in the arches**: the Sahel's are in `assets/sahel/` and East Africa's in `assets/east-africa/`, cut to 720×1000. Keep faces in the upper part of the picture, because a film's play button sits low in the arch.

To add an arch, copy an `<li class="arcade__bay">` block inside that region's `<div class="door">` and change its picture and text. An arch with a film needs `data-full-kind="film"` and `data-full-poster`, and the play button and length from another film arch. To add a region, add a `<button class="gate">`, a `<div class="door">` to match, and a block of colours under `.doors[data-region="sahel"]` in `css/styles.css`.

The Haramain arches show smaller copies of the pictures (`kaaba-arch-sm.jpg` and so on); tapping an arch opens the full-size one. To swap a picture, keep the same file name, or change it in the block.

The Maghrib clip and the wide courtyards banner that used to be in the Haramain arcade were removed because they repeated the courtyards clip and looked like the Sunset arch. Their files are in `originals/unused/`.

If you edit the CSS or JavaScript after the site is online, raise the `?v=` number on their links at the top and bottom of `index.html`, so visitors' browsers fetch the new version.

## Data and caching

The page is built so visitors download as little as possible:

- **The Ṭawāf arch** under "Our name" plays a 2 MB, 6.5-second looping clip, cut to the arch's shape. It is the only video that plays without a tap, and only while it is on screen.
- **Previews on the shelves** play 8-second, silent, small copies from `assets/video/previews/` (about 200 KB each), not the films themselves.
- **The films** are 720p, 4–17 MB each, and are only downloaded when someone presses play. The Mali films' 1080p originals are in `Downloads/REPORTAGE_Horizontal` if you ever want them back.
- **Pictures** on the cards, shelves and arches are small copies (`-sm.jpg`); the full-size ones load only when opened.
- **Visitors who turn on data saving** on their phone get no moving pictures until they press play.
- **Returning visitors** reuse what they already have. `_headers` (Netlify, Cloudflare Pages) and `.htaccess` (Apache hosting such as cPanel) tell browsers to keep the CSS and JavaScript for a year and pictures and videos for 30 days, and to always check the page itself for changes. GitHub Pages ignores both files and keeps everything for 10 minutes.

Because pictures and videos are kept for 30 days, if you replace one under the same file name, add or raise a `?v=` number after its name in `index.html` (for example `tawaf-arch.mp4?v=2`) so visitors get the new one.

To make a preview for a new film, run this in Terminal from the site folder (with your film's name):

```bash
ffmpeg -t 8 -i assets/video/NAME.mp4 -an -vf "scale=480:-2,fps=24" -c:v libx264 -crf 30 -movflags +faststart assets/video/previews/NAME.mp4
```

and add `data-preview="assets/video/previews/NAME.mp4"` to the film's `<button class="shelf__thumb">`.

## What is in the folder

| Path | What it is |
|---|---|
| `index.html` | The page |
| `css/styles.css` | All styling (colours are at the top, under `:root`) |
| `js/main.js` | Settings, prayer times, the live map, the shelves and full view, contact form |
| `assets/` | Logo, icons, the link-preview picture and photos |
| `assets/video/` | The films and their cover images |
| `assets/masajid/` | The eight pages of the Djenné story in Masajid of Africa |
| `serve.py` | Local preview server |
| `_headers`, `.htaccess` | How long visitors' browsers keep each file (see "Data and caching") |
| `originals/` | Earlier versions, not used by the page: `unused/` (files no longer on the page: the courtyards and Maghrib clips, an earlier Madinah photo, the Lamu sunrise illustration, and the sources of the Lamu and Swahili-door pictures), `tawaf-source-1080x1920.mp4` (the full video the arch's clip was cut from), the two films with their series labels, `green-sides/` (before the blurred sides) and the courtyards clip and picture before they were made smaller |

## Photos

- `assets/haramain/madinah-evening.jpg` (the Prophet’s Masjid, the fourth arch) is from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Madeena_masjid_nabavi_12122008230.jpg). Its photographer released it into the public domain, so it needs no credit.
- `assets/makkah-sunset.jpg` (Makkah at sunset, under the verse) was supplied as a WhatsApp image. It has no caption on the page; if it needs a photographer's credit, add one under the photo in `index.html`.
- The other Haram pictures and all the films are Isnad Media's own.

Two East Africa pictures came from Wikimedia Commons and must keep their credit under the arch, which also says they were cropped: `assets/east-africa/dhows.jpg` (dhow race at Lamu during Maulidi, by FredD, CC BY-SA 3.0) and `assets/east-africa/lamu-town.jpg` (Lamu Island, by folklore.co.ke, CC BY-SA 4.0). Pictures that are no longer on the page are in `originals/unused/`.

## Icons and link preview

- `assets/isnad-mark.svg` is the browser-tab icon, with `assets/favicon-32.png` for browsers that can't show SVG icons.
- `assets/apple-touch-icon.png` is the icon an iPhone or iPad shows when someone adds the site to their home screen.
- `assets/share.jpg` (1200×630) is the picture shown when the site's link is shared on WhatsApp, Facebook, X, LinkedIn and similar apps, with the title and description in the `og:` lines at the top of `index.html`.

**Once the site has its address,** change `og:image` at the top of `index.html` to the picture's full address (for example `https://isnadmedia.org/assets/share.jpg`). Some apps, Facebook among them, only show the picture when the address is written in full.

## Putting it online

Upload the whole folder (everything except `serve.py`, this file and the `originals` folder) to any static web host, for example Netlify (drag and drop the folder), GitHub Pages, Cloudflare Pages or your current hosting's file manager. No server code is needed.

Include `_headers` and `.htaccess`. They tell visitors' browsers how long to keep each file (see "Data and caching" above). Your Mac hides files whose names start with a dot; press `Cmd + Shift + .` in Finder to see `.htaccess`.
