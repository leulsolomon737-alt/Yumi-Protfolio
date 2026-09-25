# Leul Solomon — Portfolio Site

A one-page portfolio for a video editor. Plain HTML, CSS and JavaScript.
No build step, no frameworks, no backend.

---

## 1. Folder structure

```
leul-portfolio/
├── index.html          All the page content and text
├── css/
│   └── style.css       All colours, spacing, layout, animation styling
├── js/
│   └── main.js         All behaviour: scroll effects, filters, YouTube players
├── images/
│   └── portrait.jpg    Your photo (you add this)
└── README.md           This file
```

Four files. That's the whole site.

**What each one does**

| File | What lives in it | When you touch it |
|---|---|---|
| `index.html` | Every word on the page, every YouTube ID, every link | Changing text, adding a video, changing a link |
| `css/style.css` | Colours, fonts, sizes, spacing, how things move | Changing colours or spacing |
| `js/main.js` | The timecode rail, scroll reveals, filters, video loading | Rarely. Only for new behaviour |
| `images/` | Your photo and any pictures | Adding or swapping images |

`index.html` is split into numbered sections with comment blocks like
`===== 3. WORK =====`. Use Ctrl+F (Cmd+F on Mac) to jump to one.

---

## 2. Setting up in VS Code

**Install VS Code**
1. Go to https://code.visualstudio.com and download it for your system.
2. Install and open it.

**Open the project**
1. Unzip the `leul-portfolio` folder somewhere you'll remember (Documents is fine).
2. In VS Code: **File → Open Folder** → pick `leul-portfolio` → Open.
3. You should now see the file tree on the left.

**Install one extension** (this is the only one you need)
1. Click the Extensions icon on the left bar (four squares).
2. Search for **Live Server** by Ritwick Dey.
3. Click Install.

Live Server runs the site on your computer and refreshes the browser
every time you save a file. That feedback loop is most of what makes
learning this fast.

---

## 3. Running it locally

1. In VS Code, right-click `index.html` in the file tree.
2. Choose **Open with Live Server**.
3. Your browser opens at something like `http://127.0.0.1:5500`.

Now edit any file, press **Ctrl+S** to save, and watch the browser update itself.

To stop it: click **Port: 5500** in the blue bar at the bottom of VS Code.

> Don't just double-click `index.html` to open it in the browser. It mostly
> works, but some things behave differently on a `file://` address. Use Live Server.

---

## 4. Putting it on GitHub

**One-time setup**

1. Make a free account at https://github.com
2. Download GitHub Desktop from https://desktop.github.com and sign in.
   (You can do all of this with terminal commands instead, but Desktop is
   less to learn at once, and it does exactly the same thing.)

**Publishing the project**

1. Open GitHub Desktop → **File → Add Local Repository** → choose your
   `leul-portfolio` folder.
2. It will say the folder isn't a repository yet and offer to **create one**. Click that.
3. Name: `leul-portfolio`. Leave the rest as it is. Click **Create Repository**.
4. In the bottom-left box, type a summary like `First version of the site`.
5. Click **Commit to main**.
6. Click **Publish repository** at the top. Uncheck "Keep this code private"
   if you want people to be able to read it. Either setting works with Vercel.

**Every time you change something later**

1. Save your files in VS Code.
2. Open GitHub Desktop. Your changes appear on the left.
3. Type a short summary of what you changed.
4. Click **Commit to main**, then **Push origin**.

That's the whole loop: edit → save → commit → push.

---

## 5. Deploying to Vercel

1. Go to https://vercel.com and click **Sign Up**.
2. Choose **Continue with GitHub** and allow access.
3. On your Vercel dashboard click **Add New… → Project**.
4. Find `leul-portfolio` in the list and click **Import**.
5. Vercel will ask about a framework. Choose **Other**.
   Leave Build Command and Output Directory empty. This is a plain HTML
   site, so there is nothing to build.
6. Click **Deploy** and wait about thirty seconds.
7. You get a live address like `leul-portfolio.vercel.app`.

**To change the address**: Project → Settings → Domains → edit.
`leulsolomon.vercel.app` or `leuledits.vercel.app` are both available styles,
as long as nobody has taken them.

**After this, deployment is automatic.** Every time you push to GitHub,
Vercel rebuilds and updates the live site within a minute. You never touch
Vercel again.

---

## 6. Adding your YouTube videos

**Finding a video ID**

A YouTube link looks like this:

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                 ^^^^^^^^^^^
                                 this is the ID
```

On a share link it looks like this:

```
https://youtu.be/dQw4w9WgXcQ
                 ^^^^^^^^^^^
```

You want **only** the ID. Not the whole link.

**Putting it in**

Open `index.html` and search for `REPLACE_ME`. You'll find seven of them.
Each one sits inside a line like this:

```html
<div class="player" data-yt="REPLACE_ME" data-title="Course promo cutdown" data-time="0:38"></div>
```

Change it to:

```html
<div class="player" data-yt="dQw4w9WgXcQ" data-title="Course promo cutdown" data-time="0:38"></div>
```

- `data-yt` — the video ID. This is the only required one.
- `data-title` — used for screen readers and the play button label.
- `data-time` — the little duration chip in the corner. Delete it if you don't want one.

The thumbnail is pulled from YouTube automatically. You don't upload anything.

**Important:** the video must be Public or Unlisted on YouTube. Private videos
will not play on your site.

---

## 7. Making common changes

### Change any text
Open `index.html`, find the words on screen, change them. Look for the
`EDIT ME` comments — they mark the spots you're most likely to want.

### Change the colours
Open `css/style.css`. Everything is in the first block at the top:

```css
:root {
  --ink:      #05100F;   /* page background */
  --surface:  #0B1A19;   /* panels */
  --line:     #17302E;   /* thin borders */
  --brand:    #0F6E6E;   /* your brand colour */
  --glow:     #4FE3CE;   /* bright teal for links and hovers */
  --sand:     #E9B872;   /* the one warm accent */
  --text:     #EAF2F0;   /* main text */
  --muted:    #7F9A97;   /* secondary text */
}
```

Change a hex code there and it updates everywhere on the site at once.
That's what those `--name` variables are for.

One warning: `--brand` (#0F6E6E) is quite dark. It works as a background fill
but it's too dim to use as text on the dark background. That's why `--glow`
exists. If you swap the brand colour for something lighter, you can simplify
by using it for both.

### Add a video to the work grid
In `index.html`, find section 3. Copy one whole block from `<article` to
`</article>`, paste it after the last one, then change `data-yt`, the title,
the description line, and `data-cat`.

`data-cat` must be one of: `short`, `long`, `ad`. It controls which filter
button shows the video.

### Add a new filter category
1. Copy a filter button and change both the text and `data-filter`:
   ```html
   <button class="filter" data-filter="wedding">Weddings</button>
   ```
2. Give the matching cards `data-cat="wedding"`.

### Change your photo
Put your image in the `images` folder and name it `portrait.jpg`.
No code change needed. If you want a different filename, update this line
in section 6 of `index.html`:

```html
<img src="images/portrait.jpg" alt="Leul Solomon" ... />
```

A vertical photo around 800×1000 pixels works best. Keep it under 400KB
so the page stays fast — export it as JPEG at about 75% quality.

### Add a whole new section
Copy this skeleton and paste it between two existing sections:

```html
<section class="section" id="testimonials" data-clip="Testimonials">
  <div class="wrap">
    <div class="head">
      <h2 class="head__title">What clients say</h2>
      <p class="head__note">A line under the heading.</p>
    </div>
    <div class="reveal">
      <p>Your content here.</p>
    </div>
  </div>
</section>
```

- `id` is what menu links point at.
- `data-clip` is the sideways label on the left ruler.
- `class="reveal"` on anything makes it wipe into view on scroll.

Then add it to the menu in the navigation block:
```html
<a href="#testimonials">Testimonials</a>
```

### Turn an animation off
In `css/style.css` section 16, find `.reveal` and delete the `transform` and
`clip-path` lines to make it a plain fade. Or remove `class="reveal"` from an
element to stop it animating at all.

### Change how fast things move
In `css/style.css` section 1:
```css
--slow: 900ms;   /* make it smaller = snappier, bigger = slower */
```

---

## 8. Things worth knowing

**Test on your phone before you share it.** Open the Vercel address on your
actual phone, not just a narrow browser window. Most of your visitors will be
on a phone.

**Check the file names match exactly.** `Portrait.JPG` and `portrait.jpg` are
different files on Vercel's servers even though they look the same on Windows.
This is the single most common reason an image works locally and breaks live.

**If the site looks broken after a change**, press F12 in your browser and look
at the Console tab. Red text tells you the line number of the problem.

**Undo is your friend.** If you break something badly, GitHub Desktop can
discard your changes and put the file back the way it was before your last commit.
