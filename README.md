# YerinCheon's web
This repository is for my own website.

Website: https://ycheon1101.github.io/yerincheon/

NLoS radar project: https://ycheon1101.github.io/yerincheon/radar_nlos/

The project page lives in `radar_nlos/` and is linked from both Publications
sections in `index.html`. Edit its HTML, CSS, JavaScript, and media directly in
that folder. It includes the paper PDF, technical video, and muted looping
dataset and generalization clips. The publication is listed as
Under Review / arXiv preprint.

GitHub Pages serves the repository root. To preview the same base path locally,
run `npm run dev -- --open=false`. For a Vite build, run
`npm run build`; the standalone project is copied into
`dist/radar_nlos/` as part of the build.

Each Projects card has a shareable `/yerincheon/projects/<slug>` URL. The slug,
title, and PDF come from the card in `index.html`; direct visits, refreshes, and
browser history restore the matching PDF. The document base keeps assets rooted
at `/yerincheon/` when GitHub Pages restores a nested URL through `404.html`.

The resume button is temporarily disabled. The resume PDF is excluded from the
repository and public deployment; a local copy is retained for future updates.
