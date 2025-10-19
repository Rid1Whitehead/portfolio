# Research Portfolio (GitHub Pages)

A minimal, warm-toned portfolio for a doctoral researcher in computer vision / LLMs / learning sciences.

## Quick start
1. Create a repo named **your-username.github.io**.
2. Copy all files/folders from this project into the repo root.
3. Commit & push — GitHub Pages will auto-publish at https://your-username.github.io/

## Personalize
- Edit **index.html**: name, tagline, contact links.
- Put your CV at `cv.pdf` (repo root).
- Add project thumbnails to **/media** and update the `src` of each `<img class="thumb">`.
- Update **Google Scholar** link in the Publications header.
- Set your Semantic Scholar author ID in **assets/main.js** (search for `AUTHOR_ID`).

## Auto publications
We use [Semantic Scholar Graph API] to fetch your papers. Public/Open-Access PDFs are linked when available.

- Find your author ID in your S2 profile URL: `.../author/Your-Name/1234567` → ID is `1234567`.
- Edit `assets/main.js`: `const AUTHOR_ID = '1234567'`.

## File structure
```
assets/
  main.css       # styles
  main.js        # theme, filters, auto publications
  favicon.svg
media/
  mvgaze.jpg
  dialogue2signals.jpg
  opencollab.jpg
  embodied-tutor.jpg
  mmla-cookiecutter.jpg
  posekit.jpg
  collab-annotator.jpg
posts/           # (optional) add your posts here
index.html
README.md
.nojekyll
```

## Notes
- Thumbnails are 16:9; use ~1200×675 for crispness.
- Add more projects by duplicating an `<article class="tile ...">` block and setting `data-tags`.
- Reflections support tagging + search similar to Projects.

## License
Do whatever you want. Attribution appreciated but not required.
