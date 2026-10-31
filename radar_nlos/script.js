'use strict';

const bibtexToggle = document.querySelector('#bibtex-toggle');
const bibtexPanel = document.querySelector('#bibtex-panel');
bibtexToggle.addEventListener('click', () => {
  const expanded = bibtexToggle.getAttribute('aria-expanded') === 'true';
  bibtexToggle.setAttribute('aria-expanded', String(!expanded));
  bibtexPanel.hidden = expanded;
});

const dialog = document.querySelector('#figure-dialog');
const expandedImage = document.querySelector('#expanded-image');
const expandedCaption = document.querySelector('#expanded-caption');
let figureTrigger = null;
document.querySelectorAll('[data-figure]').forEach(button => {
  button.addEventListener('click', () => {
    figureTrigger = button;
    expandedImage.src = button.dataset.figure;
    expandedImage.alt = button.querySelector('img').alt;
    expandedCaption.textContent = button.dataset.caption;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  figureTrigger?.focus({preventScroll:true});
});

document.querySelectorAll('.chapter-player').forEach(player => {
  const video = player.querySelector('video');
  const chapters = [...player.querySelectorAll('[data-time]')];
  const updateChapter = () => {
    let active = 0;
    chapters.forEach((button, index) => {
      if (video.currentTime >= Number(button.dataset.time)) active = index;
    });
    chapters.forEach((button, index) => {
      button.classList.toggle('is-active', index === active);
      if (index === active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  };
  chapters.forEach(button => button.addEventListener('click', () => {
    video.currentTime = Number(button.dataset.time);
    video.play().catch(() => {});
    updateChapter();
  }));
  video.addEventListener('timeupdate', updateChapter);
  video.muted = true;
  updateChapter();
  video.play().catch(() => {});
});
