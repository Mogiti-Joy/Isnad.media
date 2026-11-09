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

The first arch in "What we’re about" plays the Ṭawāf around the Kaʿbah, late in the day, muted on a loop. It is the first `<li class="arcade__bay">` in the `<section id="find">` block of `index.html` and uses `assets/haramain/tawaf-arch.mp4` (cover `tawaf-arch.jpg`). The clip was cut from a 1080×1920 video (`originals/tawaf-source-1080x1920.mp4`, from Pexels judging by its file name; the Pexels licence allows use without credit) to the arch's tall shape at 760×1056, sharp on Retina screens. The source is 7 seconds long, so the last second fades into the first and the clip loops without a jump. It is never played backwards, which would show the Ṭawāf turning the wrong way. The earlier courtyards version is in `originals/unused/`.

The other films are on the shelves under "What we’re about" (see below).

## The menu

The bar at the top links to About us (Our name, and What we’re about below it), Our expertise, Prayer times, From Haramain and Contact, and underlines the section on screen; a section without a link of its own counts as part of the one before it. Follow us is in the footer. The links are the `<nav class="site-nav">` block in `index.html`.

## The look: the page as a chain

The page is designed as an isnad: one link after another, from the opening to you.

- **The opening** is deep green and stands inside a mihrab drawn in a thin gold line. From the point of the arch a chain is let down one link at a time, as a narration is handed down, and a mosque lamp, with the logo's star on its glass, arrives at the end of it and is lit. Its light falls on the word "chain." in the heading, and the lamp swings gently. The arch draws itself when the page loads and its sides run down and fade into the page. It is the `hero__mihrab` block at the top of `index.html`.
- **The page itself** is a pale sage green (`--bg` at the top of `css/styles.css`), with cards and form fields in white (`--surface`) so they stand out.
- **Headings** are set in Bodoni Moda, from Google Fonts.
- **Every section label** has two chain links before it, like the links in the logo. The second slides in and locks onto the first as the section comes on screen, and the words and cards rise in after it.
- **A gold line** under the bar at the top fills from left to right as the page is read.
- **The quote** in "Our name" sits under a gold rule held by a star, as in the margin of a manuscript.
- **Our expertise and the footer** are deep green bands, with the muṣḥaf's star-and-cross pattern faint at the edges of Our expertise and the logo's arch and chain large and faint in the corner of the footer. To make another section green, add `section--deep` to its `class`.
- **The prayer times** carry each prayer's colour from the live map along their top edge.
- **"verify it."** under the verse is underlined in gold once it has been read.

Visitors who have asked their device for reduced motion see everything in place, with nothing moving.

## Phones, folding phones and dual-screen phones

The site was checked on every common size, from the 280px outer screen of the first Galaxy Fold, through the Galaxy Z Fold and Flip, every iPhone from the SE to the Pro Max, and phones turned sideways, to tablets and large desktops.

- **Menu**: up to 900px wide, the menu folds into a **Menu** button that opens the sections as a list. Choosing one, tapping elsewhere or pressing Esc closes it. On phones the bar shows the logo and Menu.
- **Taps**: buttons and pickers are at least 44px tall on phones, the size Apple recommends for a finger. The city pickers use 16px text so iPhones don't zoom in when they are tapped.
- **The map**: on a phone the 125 cities crowd together, so a tap picks the city closest to the finger.
- **The full view**: swipe left or right to move between pictures (films keep their own controls, so swiping isn't used on them). The picture or film always fits the screen above its caption, including phones turned sideways, where the arrows move to the sides.
- **Small details**: buttons never break their label over two lines, the map's labels are enlarged on phones, and numbers stay on the same line as their units ("4 min").
- **Dual-screen phones** (such as the Surface Duo) with the page spread over both screens: nothing sits across the hinge. Two-part layouts put one part on each screen (the verse in Arabic on the left and English on the right), cards and services fill two columns, one each side, and the full view uses one screen. This is the `dual-screen phones` block near the end of `css/styles.css`.

## Our name

The "Our name" section comes straight after the opening, so it is the first thing people reach when they scroll. It explains the name in two paragraphs, then gives the saying of ʿAbdullāh ibn al-Mubārak on the isnad in Arabic and English.

## What we’re about

After "Our name", a swipeable strip of six arches shows everything Isnad covers, and each arch opens its own videos. It is the `<section id="find">` block in `index.html`, so the menu's Watch link lands on it. The arches use the frame from "Every prayer faces here", with a fine gold line inside. Only whole arches ever show: four at once on a computer, two on phones and tablets. A swipe or the arrows either side of the row move two arches along, and the small arches beneath light up for the arches in view. On phones, where two arches need the full width, the arrows sit on the outer edges of the arches, and each one hides when there is nothing further that way. The gold chain link between two arches shows only while both are in view.

Tapping an arch turns its frame gold and opens a shelf of its videos below the strip; choosing a video plays it in the full view, with sound for the films. A video can be on two shelves at most, and a series stays together (all the Scholars of Mali films are under Scholars of the Sahel). A film on two shelves shares its progress line, because it is the same file. The picture in the first arch is the Ṭawāf clip, which has a pause button. Visitors who have asked their device for reduced motion or data saving see its still instead. Images after the second arch load only when they are needed.

| Arch | Videos |
|---|---|
| From the Haramain | The recitation at the next table, The Haram at night (a 3-second clip with no sound, from `assets/haramain/films/`) |
| Masajid of Africa | Uganda National Mosque, Jumuʿah |
| Scholars of the Sahel | The six Scholars of Mali films with Thierno Hady Thiam: Why Timbuktu is more famous abroad than at home, How Islam crossed the Sahara, From teacher to student, Islam’s first command, Who’s reading the manuscripts?, How Islam in West Africa has changed |
| Faces of the Ummah | The recitation at the next table (also under From the Haramain), How Islam in West Africa has changed (also under Scholars of the Sahel), A night in Djibouti |
| African Muslim History | Five of the Scholars of Mali films (the sixth is under Faces of the Ummah), Uganda National Mosque |
| Reminders | Jumuʿah |

To add an arch, copy an `<li class="arcade__bay">` block in the strip, add a `<div class="shelf">` to match, and add one more `<span class="strip__dot">` to the row under the strip.

Each video on a shelf:

- **Plays a silent preview** of its first seconds: on hover with a mouse, or while on screen on a phone. There are no previews for visitors who have asked their device for reduced motion or data saving.
- **Remembers where each visitor stopped**, in their own browser only. A gold line on the thumbnail shows how far they got, and reopening a film carries on from where it was left.

**Thumbnails.** Each film has a cover (`NAME.jpg`, 1280×720, shown in the full view before it plays) and a thumbnail (`NAME-sm.jpg`, 960×540, sharp on phone screens), chosen by hand so that every one is different and none shows a burned-in subtitle or the corner logo:

- The six Scholars of Mali thumbnails are taken from the 1080p originals in `Downloads/REPORTAGE_Horizontal`, cropped above the subtitle line. Where the scholar is seated, his face sits off-centre so the play button doesn't cover it.
- Jumuʿah, filmed upright, shows three moments side by side: the empty minbar, the khutbah and the congregation.
- The recitation at the next table, also upright, shows Jamal close up.
- A night in Djibouti shows people walking towards the minaret, from behind.
- Uganda National Mosque, also upright, shows the arch and minaret from the wide shot inside the film, above its captions.

**Pictures in the strip.** Masajid of Africa, Faces of the Ummah and African Muslim History use their film thumbnails (Masajid of Africa shows the Uganda National Mosque's minaret). Two arches have their own tall pictures, 720×1000: `assets/video/scholars-of-the-sahel-arch.jpg` is a still from the 1080p Scholars of Mali footage, and `assets/video/masajid-of-africa-jumuah-arch.jpg` is the middle of the Jumuʿah cover, without its dividers.

The earlier thumbnails are in `originals/unused/old-thumbnails/`. If you replace a thumbnail, raise its `?v=` number in `index.html` so returning visitors see the new one.

To add a video to a shelf, copy one `<li class="shelf__film">` block inside that arch's `<div class="shelf">` in `index.html` and change the video, cover, length, series and text. The count under the arch updates itself.

## Our expertise

After the arch strip in "What we’re about", "Our expertise" (خبراتنا) lists Isnad Media's services: six main ones as numbered cards, then three under the smaller heading "Also from Isnad". The **Start a conversation** button under them goes to Contact. To change a service, edit its `<li>` in the `<section id="services">` block in `index.html`.

## Contact

"Contact us" has its heading in the middle under a soft gold glow, then one white box with a gold border: the line "Have a story or a question? We are happy to hear from you.", a dark green pill button for each way to reach us (isnadmedia9@gmail.com, which opens the visitor's email app; +250 793 835 632, which starts a call on a phone; and WhatsApp us, `https://wa.me/250793835632`), then the promise not to publish anything without asking and the reply time. On phones the buttons stack, one per line. Instagram, TikTok and YouTube are in the footer.

They are in the `<section id="contact">` block of `index.html`. In a WhatsApp link, write the number with the country code and no `+`, spaces or dashes; in a phone (`tel:`) link, keep the `+` and leave out the spaces.

There is no form, so nothing is sent through the site itself.

## The adhan never stops (live map)

After the prayer times, a live map of Africa shows:

- **The night over Africa right now**, worked out from the sun's position, with soft twilight at its edge.
- **All 125 prayer-time cities**, each coloured by the prayer it is in. A ring spreads from a city while its adhan is being called.
- **A line from every city to the Kaʿbah.**
- **What is happening**: where the adhan is being called, or where it comes next, and how many cities are in each prayer.

Hovering over or tapping a city shows its local time, current and next prayer, and its qiblah direction and distance to Makkah. Tapping also makes it the city for the site's prayer times. "Watch a day go by" plays the next 24 hours in about 24 seconds, and the slider moves through them by hand.

The map uses the same prayer times as the rest of the site, so there is nothing extra to keep up to date. The coastline and country borders come from Natural Earth (public domain) and are built into `index.html`, with the equator and the tropics marked.

## Masajid of Africa

The Masajid of Africa arch opens a shelf that starts with a photo story: the Great Mosque of Djenné in Mali, from Isnad Media's Instagram, as a stack of its eight pages (`assets/masajid/djenne-1.jpg` to `djenne-8.jpg`, 1080×1350, in order) beside a short introduction and a list of every page by name. The pages under the top one fan out a little. The stack is sized to the screen's height, so the whole of it, with its arrows and count, is always in view. The shelf's videos follow below.

- **Turning the pages**: drag the top page aside (it flies off and the next one shows; drag the other way to bring the last one back), or use the arrows either side of the stack, the arrow keys, or the list of pages (the page on top is marked in gold). On phones each arrow hides when there is no page further that way. The count under the stack shows which page is on top.
- **Reading in full**: tapping the top page opens it in the full view; closing it leaves the stack on the page last seen.

The words on each page are part of the picture, so each picture's description in `index.html` repeats them for screen readers. To use another story, replace the eight pictures (keeping the names, or changing them in the `<article class="story">` block inside `#shelf-masajid`), then change the heading, the paragraph, the page names in the list and the descriptions. For more or fewer pages, add or remove `<li class="deck__page">` blocks and their entries in the list, and change the "8" in the count and the labels.

**Photos from Addis Ababa.** At the foot of the Masajid of Africa shelf, below the videos, two photos from inside a masjid in Merkato, Addis Ababa (the one in our Merkato film) sit beside a short introduction: the painted dome (`assets/masajid/addis-dome.jpg`), ringed with Sūrat al-Ikhlāṣ, Āyat al-Kursī and the close of al-Baqarah, and a pillar with shelves of muṣḥafs (`addis-shelves.jpg`). The cards show smaller copies (`-sm.jpg`, 600×800); tapping one opens the full photo, and the arrows move between the two. To add a photo, copy an `<li class="pics__item">` in the `<article class="pics">` block. The photos as received are in `originals/addis-whatsapp/`.

## From the Haramain

After Masajid of Africa, this section shows Masjid al-Ḥarām, the qiblah of those prayers. Its files are in `assets/haramain/`.

- **The background**: parchment with a gold star-and-cross pattern and a double gold frame, like the illuminated pages of a printed muṣḥaf. It uses no verses, because Qurʾān text shouldn't sit behind buttons and pictures.
- **The arches**: a row of five arches, linked like a chain, works like the strip in "What we’re about": each arch shows how many videos it holds, and tapping it opens its shelf of videos underneath (one shelf at a time; tapping again closes it). Four arches show at a time on wide screens and two on phones and tablets, with arrows and small arches beneath to move along.
  - **The Kaʿbah**: Seeing the Kaʿbah for the first time, At the railing, The Kaʿbah at dusk.
  - **The Adhan**: Adhan in Makkah, from an arch on the upper floor and beneath the Clock Tower.
  - **Around the Haramain**: The rock of Marwah, Bakhūr, Madinah.
  - **Ramaḍān** (month 9 of the Hijri year): Martyrs of the Battle of Badr, which was fought on 17 Ramaḍān, 2 AH.
  - **Hajj** (Dhū al-Ḥijjah, month 12): With the pilgrims, Mount Arafat, Hajj: Pilgrims at ʿArafah, Hajj: Muzdalifah, in the order of the days of Hajj.

  Each arch's picture is a still from one of its films.
- **The shelves** work like the ones in "What we’re about": each video card plays a silent preview on hover (or while on screen on a phone), shows its length and how much of it the visitor has watched, and plays with its sound in the full view, where the arrows move through that shelf.
- **The films** are Isnad Media's own phone clips, in `assets/haramain/films/` (`NAME.mp4`, its cover `NAME.jpg`, a 960×540 card picture `NAME-sm.jpg`, and an 8-second silent preview in `previews/NAME.mp4`). Most clips were filmed upright, so their card pictures and previews show the clip in the middle with a blurred copy filling the sides; the full view plays them upright. Most are the clips as filmed, only rearranged to start playing sooner. Three were cleaned up and enlarged by half (1280×724 or 720×1272) to look sharper: Seeing the Kaʿbah for the first time, Hajj: Muzdalifah (brightened, keeping the night sky dark) and Hajj: Pilgrims at ʿArafah, with noise reduction, a little more contrast and colour, and sharpening. The files as received are in `originals/haramain-whatsapp/`. Each film keeps the sound it was filmed with; the two Adhan in Makkah films carry the call to prayer.

To add a film, copy a `<li class="shelf__film">` in its shelf (`<div class="shelf" id="shelf-h-...">`) in the `<section id="haramain">` block of `index.html`, change its files and text, and make its preview with the command under "Data and caching". The count on the arch updates itself.

To add an arch, such as Muḥarram (month 1) or Shawwāl and ʿĪd al-Fiṭr (month 10), copy an `<li class="arcade__bay">` in the Haramain strip and a shelf, give the shelf a new `id` and point the arch's `aria-controls` at it, and add one more `<span class="strip__dot">` under the arches.

The four photos that used to be in this section (the Kaʿbah from the upper floor, the Clock Tower, sunset over the courtyards and the Prophet's Masjid in the evening light) were removed to leave it to the films. They are in `originals/unused/haramain-photos/`, with the Clock Tower's earlier versions in `originals/clock-tower-before-regrade.jpg` and `clock-tower-sm-before-regrade.jpg`. The Maghrib clip and the wide courtyards banner that were there before them are in `originals/unused/`.

If you edit the CSS or JavaScript after the site is online, raise the `?v=` number on their links at the top and bottom of `index.html`, so visitors' browsers fetch the new version.

## Data and caching

The page is built so visitors download as little as possible:

- **The Ṭawāf arch** in "What we’re about" plays a 2 MB, 6.5-second looping clip, cut to the arch's shape. It is the only video that plays without a tap, and only while it is on screen.
- **Previews on the shelves** play 8-second, silent, small copies from `assets/video/previews/` (about 200 KB each), not the films themselves.
- **The films** are 720p, 4–17 MB each (A night in Djibouti is 464p, as it was filmed), and are only downloaded when someone presses play. The Mali films' 1080p originals are in `Downloads/REPORTAGE_Horizontal` if you ever want them back.
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
| `privacy.html` | The privacy notice, linked from the bottom of the footer |
| `404.html` | The page shown for an address that doesn't exist |
| `robots.txt` | Tells search engines they may read the whole site |
| `site.webmanifest` | The name, colours and icons used when someone adds the site to their phone's home screen |
| `css/styles.css` | All styling (colours are at the top, under `:root`) |
| `js/main.js` | Settings, prayer times, the live map, the shelves and full view |
| `assets/` | Logo, icons, the link-preview picture and photos |
| `assets/video/` | The films and their cover images |
| `assets/masajid/` | The eight pages of the Djenné story in Masajid of Africa |
| `serve.py` | Local preview server |
| `_headers`, `.htaccess` | How long visitors' browsers keep each file (see "Data and caching") |
| `originals/` | Earlier versions, not used by the page: `unused/` (files no longer on the page: the courtyards and Maghrib clips, an earlier Madinah photo, the Lamu and Swahili-door pictures, and `doors/`, the arch pictures from a Sahel and East Africa version of the Haramain section, and `makkah-clock/`, the code for a clock and qiblah dial that sat beside the Haramain heading), `tawaf-source-1080x1920.mp4` (the full video the arch's clip was cut from), the two films with their series labels, `green-sides/` (before the blurred sides) and the courtyards clip and picture before they were made smaller |

## Photos

- `assets/makkah-sunset.jpg` (Makkah at sunset, under the verse) was supplied as a WhatsApp image. It has no caption on the page; if it needs a photographer's credit, add one under the photo in `index.html`.
- `assets/masajid/addis-dome.jpg` and `addis-shelves.jpg` (inside a masjid in Merkato, Addis Ababa) were supplied as WhatsApp images. If they need a photographer's credit, add one under the photos in `index.html`.
- All the films are Isnad Media's own.

Pictures that are no longer on the page are in `originals/unused/`. Of the old Haramain photos there, `haramain-photos/madinah-evening.jpg` is from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Madeena_masjid_nabavi_12122008230.jpg) and in the public domain; the rest are Isnad Media's own. Two of them came from Wikimedia Commons and need their photographer credited if they are ever used again: `lamu-maulidi-dhows.jpg` (dhow race at Lamu during Maulidi, by FredD, CC BY-SA 3.0) and `lamu-town.jpg` (Lamu Island, by folklore.co.ke, CC BY-SA 4.0). The same goes for their cropped copies in `unused/doors/east-africa/`.

## Icons and link preview

- `assets/isnad-mark.svg` is the browser-tab icon, with `assets/favicon-32.png` for browsers that can't show SVG icons.
- `assets/apple-touch-icon.png` is the icon an iPhone or iPad shows when someone adds the site to their home screen, and `assets/icon-192.png` and `icon-512.png` are the same for Android phones (named in `site.webmanifest`).
- `assets/share.jpg` (1200×630) is the picture shown when the site's link is shared on WhatsApp, Facebook, X, LinkedIn and similar apps, with the title and description in the `og:` lines at the top of `index.html`.

## Search engines, privacy and safety

- **Search engines** read the title, the description and a short description of Isnad Media (its name, email, WhatsApp number and social accounts) in the `<script type="application/ld+json">` block at the top of `index.html`. If an account or number changes, change it there too.
- **Skip to content**: someone using a keyboard or a screen reader can press Tab once to jump past the bar to the page.
- **Without JavaScript**, the prayer times section explains that the times and the map need it.
- **Privacy**: `privacy.html` says what the site keeps (the city picked and how far each film was watched, in the visitor's own browser), that there are no cookies or tracking, and what happens to messages. If you add analytics, a newsletter, an embedded video or any other outside service, update it.
- **Safety settings**: `_headers` and `.htaccess` also tell browsers to load nothing from other sites except Google Fonts, and not to let other sites show this one inside theirs. If you embed something from another site (a YouTube film, say), add its address to the `Content-Security-Policy` line in both files, or it won't show.
- **Page not found**: `404.html` is shown for addresses that don't exist. Netlify, Cloudflare Pages and GitHub Pages find it by its name; on Apache hosting, `.htaccess` points to it.

## Once the site has its address

Some things need the site's full address (for example `https://isnadmedia.org`), so they wait until it has one:

1. **The shared picture**: change `og:image` at the top of `index.html` to the picture's full address (for example `https://isnadmedia.org/assets/share.jpg`). Some apps, Facebook among them, only show the picture when the address is written in full.
2. **The page's own address**: add `<link rel="canonical" href="https://isnadmedia.org/">` and `<meta property="og:url" content="https://isnadmedia.org/">` under the description at the top of `index.html`.
3. **Search engines**: add `"url": "https://isnadmedia.org/"` and `"logo": "https://isnadmedia.org/assets/icon-512.png"` to the `ld+json` block at the top of `index.html`.
4. **A sitemap**: add a `sitemap.xml` listing `https://isnadmedia.org/` and `https://isnadmedia.org/privacy.html`, and add its address to `robots.txt`.
5. **Google Search Console** (search.google.com/search-console): add the site and send it the sitemap, so Google finds it sooner.

## Putting it online

Upload the whole folder (everything except `serve.py`, this file and the `originals` folder, and including `privacy.html`, `404.html`, `robots.txt` and `site.webmanifest`) to any static web host, for example Netlify (drag and drop the folder), GitHub Pages, Cloudflare Pages or your current hosting's file manager. No server code is needed.

Include `_headers` and `.htaccess`. They tell visitors' browsers how long to keep each file (see "Data and caching" above). Your Mac hides files whose names start with a dot; press `Cmd + Shift + .` in Finder to see `.htaccess`.
