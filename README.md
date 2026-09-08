# To My Favorite Person

A single-page romantic website. Pure HTML, CSS, and vanilla JavaScript —
no frameworks, no build tools, no backend. Everything can be edited in
Notepad++ and hosted for free on GitHub + Cloudflare Pages.

## 1. Files you have

```
romantic-site/
├── index.html      the whole page structure
├── style.css       all styling and animations
├── script.js       all interactivity
├── README.md       this file
└── assets/
    └── README.txt  placeholder note (delete once you add real files)
```

## 2. Where to put your photos and music

Drop these files directly into the `assets/` folder, using these exact
names:

- `assets/photo1.jpg` through `assets/photo6.jpg` — your gallery photos
- `assets/song.mp3` — "your" song

If you'd rather use `.png` or `.webp` images, or a different filename,
just update the matching `src="assets/..."` paths in `index.html` to
match. Everything uses relative paths (`assets/...`, not `C:\...`), so
it will keep working after you upload it to GitHub.

## 3. Text you should replace with your own

Search `index.html` for these spots (they're also marked with
`<!-- REPLACE -->` comments):

- **Our Story** section — the three placeholder paragraphs
- **Our Timeline** — the five `Month, Year` dates and their descriptions
- **Our Song** — the `Song Title Here` / `Artist Name` placeholders
- **Love Letter** — the bracketed `[Write my personal letter here.]`
  and `[My Name]`
- **Gallery captions** — each photo's `data-caption="..."` and the
  matching `<span class="gallery-caption">` text

Everything else (buttons, section titles, the surprise message, the
final message) is ready to use as-is, or tweak the wording to match
your own voice.

## 4. Preview it before uploading anywhere

Just double-click `index.html` to open it in your browser. Because
everything uses relative paths and there's no backend, it works
straight away — no local server required.

## 5. Push it to GitHub

1. Create a free account at https://github.com if you don't have one.
2. Click **New repository**, give it a name (e.g. `for-my-love`), and
   create it (public or private both work — private is fine too, and
   Cloudflare Pages can still deploy from it).
3. On your computer, put the `index.html`, `style.css`, `script.js`,
   and `assets/` folder inside a local folder that matches your new
   repo name.
4. If you have Git installed, open a terminal in that folder and run:
   ```
   git init
   git add .
   git commit -m "First version of the site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
   (Replace `YOUR-USERNAME` and `YOUR-REPO` with your actual GitHub
   username and repository name.)
5. If you don't want to use the command line, you can instead drag and
   drop all the files (including the `assets` folder) directly into
   the repository page on github.com using the **Add file → Upload
   files** button.

## 6. Deploy with Cloudflare Pages

1. Go to https://dash.cloudflare.com and sign in (or create a free
   account).
2. In the sidebar, go to **Workers & Pages → Create → Pages → Connect
   to Git**.
3. Authorize Cloudflare to access GitHub, then select the repository
   you just created.
4. On the build settings screen:
   - **Framework preset:** None
   - **Build command:** leave empty
   - **Build output directory:** `/` (the root — since `index.html`
     sits at the top level of the repo)
5. Click **Save and Deploy**. Cloudflare will give you a live URL like
   `your-site.pages.dev` within a minute or two.
6. Any time you push new changes to GitHub (new photos, edited text),
   Cloudflare Pages automatically redeploys the site.

That's it — no database, no server, nothing else to configure.
