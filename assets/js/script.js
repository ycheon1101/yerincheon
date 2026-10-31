'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");
const testimonialsModal = document.querySelector(".testimonials-modal");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalDate = document.querySelector("[data-modal-date]");
const modalText = document.querySelector("[data-modal-text]");
const newsBackBtn = document.querySelector("[data-news-back-btn]");
const newsOpenBtns = document.querySelectorAll("[data-news-open-detail]");
const newsModalItems = document.querySelectorAll(".news-modal-item[data-testimonials-item]");

// modal open/close (avoid toggle while clicking inside the open modal)
const testimonialsModalOpen = function () {
  modalContainer.classList.add("active");
  overlay.classList.add("active");
}

const testimonialsModalClose = function () {
  modalContainer.classList.remove("active");
  overlay.classList.remove("active");
  if (testimonialsModal) {
    testimonialsModal.classList.remove("news-detail-active");
  }
}

const setNewsDetailMode = function (isDetail) {
  if (!testimonialsModal) { return; }
  testimonialsModal.classList.toggle("news-detail-active", isDetail);
}

const openTestimonialsModalFrom = function (itemEl) {
  const avatarEl = itemEl.querySelector("[data-testimonials-avatar]");
  const titleEl = itemEl.querySelector("[data-testimonials-title]");
  const dateEl = itemEl.querySelector("[data-testimonials-date]");
  const textEl = itemEl.querySelector("[data-testimonials-text]");
  const extraEl = itemEl.querySelector("[data-testimonials-extra]");
  if (!avatarEl || !titleEl || !textEl) { return; }

  modalImg.src = avatarEl.src;
  modalImg.alt = avatarEl.alt;
  modalTitle.innerHTML = titleEl.innerHTML;
  if (modalDate && dateEl) {
    modalDate.dateTime = dateEl.dateTime || dateEl.getAttribute("datetime") || "";
    modalDate.innerHTML = dateEl.innerHTML;
  }
  modalText.innerHTML = textEl.innerHTML;
  if (extraEl) {
    modalText.insertAdjacentHTML("beforeend", extraEl.innerHTML);
  }
  // Keep a visible closing quote icon at the end of modal text.
  const firstParagraph = modalText.querySelector("p");
  if (firstParagraph && !firstParagraph.querySelector(".modal-quote-end-inline")) {
    firstParagraph.insertAdjacentHTML(
      "beforeend",
      '<img src="./assets/images/icon-quote.svg" class="modal-quote-end-inline" alt="" aria-hidden="true">'
    );
  }

  testimonialsModalOpen();
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  if (testimonialsItem[i].closest(".news-item") || testimonialsItem[i].classList.contains("news-modal-item")) { continue; }

  testimonialsItem[i].addEventListener("click", function () {
    openTestimonialsModalFrom(this);
  });

}

// News: icon opens list-only modal; news card itself is not clickable
const newsMoreBtn = document.querySelector("[data-news-more-btn]");
if (newsMoreBtn) {
  newsMoreBtn.addEventListener("click", function () {
    setNewsDetailMode(false);
    testimonialsModalOpen();
  });
}

// News list arrows: open detail mode for the selected item
for (let i = 0; i < newsOpenBtns.length; i++) {
  newsOpenBtns[i].addEventListener("click", function () {
    const newsItem = this.closest("[data-testimonials-item]");
    if (!newsItem) { return; }
    openTestimonialsModalFrom(newsItem);
    setNewsDetailMode(true);
  });
}

// News list cards: clicking anywhere opens detail mode
for (let i = 0; i < newsModalItems.length; i++) {
  newsModalItems[i].addEventListener("click", function (event) {
    // Keep button click behavior, but allow full-card click too.
    if (event.target.closest("a, [data-news-open-detail]")) { return; }
    openTestimonialsModalFrom(this);
    setNewsDetailMode(true);
  });
}

if (newsBackBtn) {
  newsBackBtn.addEventListener("click", function () {
    setNewsDetailMode(false);
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalClose);
overlay.addEventListener("click", testimonialsModalClose);

// All news: reuse archive content, keeping the two illustrated announcements.
const newsCarousel = document.querySelector("[data-news-carousel]");
if (newsCarousel) {
  const newsList = newsCarousel.querySelector(".news-list");
  const illustratedSlides = new Map([...newsList.querySelectorAll("[data-news-key]")].map(slide => [slide.dataset.newsKey, slide]));
  newsModalItems.forEach(item => {
    const illustrated = illustratedSlides.get(item.dataset.newsKey);
    if (illustrated) {
      newsList.append(illustrated);
      return;
    }

    const slide = document.createElement("li");
    slide.className = "testimonials-item news-item";
    slide.setAttribute("aria-roledescription", "slide");
    const card = document.createElement("div");
    card.className = "content-card";
    const scene = document.createElement("div");
    scene.className = "news-scene news-scene--archive";
    const date = item.querySelector("[data-testimonials-date]").cloneNode(true);
    date.className = "news-scene-date";
    date.insertAdjacentHTML("afterbegin", '<ion-icon class="news-scene-date-icon" name="alarm-outline" aria-hidden="true"></ion-icon>');
    const picture = item.querySelector("[data-testimonials-avatar]").cloneNode(true);
    picture.className = "news-archive-image";
    picture.loading = "lazy";
    picture.decoding = "async";
    const title = item.querySelector("[data-testimonials-title]").cloneNode(true);
    title.className = "h4 testimonials-item-title";
    const body = item.querySelector("[data-testimonials-text]").cloneNode(true);
    body.className = "testimonials-text";
    scene.append(date, picture);
    card.append(scene, title, body);
    slide.append(card);
    newsList.append(slide);
  });
  const newsSlides = [...newsList.querySelectorAll(".news-item")];
  newsSlides.forEach((slide, index) => slide.setAttribute("aria-label", `${index + 1} of ${newsSlides.length}`));
  const newsStatus = document.querySelector("[data-news-status]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentNews = 0;
  let carouselVisible = true;
  let newsWidth = 0;
  let scrollTimer;

  const updateNewsMotion = () => {
    newsCarousel.dataset.motionPaused = String(!carouselVisible);
    newsSlides.forEach((slide, index) => {
      slide.querySelectorAll("[data-news-animation]").forEach(svg => {
        if (!carouselVisible || index !== currentNews) {
          svg.pauseAnimations();
        } else {
          svg.unpauseAnimations();
        }
      });
    });
  };

  const fitNewsHeight = () => {
    if (!newsList.clientWidth) return;
    const style = getComputedStyle(newsList);
    newsList.style.height = `${newsSlides[currentNews].offsetHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)}px`;
  };

  const setCurrentNews = index => {
    currentNews = index;
    newsSlides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentNews;
      if (!active && slide.contains(document.activeElement)) newsList.focus({ preventScroll: true });
      slide.classList.toggle("is-current", active);
      slide.inert = !active;
      slide.setAttribute("aria-hidden", String(!active));
    });
    newsStatus.textContent = `${currentNews + 1} / ${newsSlides.length}`;
    fitNewsHeight();
    updateNewsMotion();
  };

  const slideLeft = index => newsSlides[index].offsetLeft - newsSlides[0].offsetLeft;
  const goToNews = index => {
    const nextIndex = (index + newsSlides.length) % newsSlides.length;
    setCurrentNews(nextIndex);
    newsList.scrollTo({ left: slideLeft(nextIndex), behavior: reducedMotion.matches ? "instant" : "smooth" });
  };
  newsCarousel.querySelector("[data-news-prev]").addEventListener("click", () => goToNews(currentNews - 1));
  newsCarousel.querySelector("[data-news-next]").addEventListener("click", () => goToNews(currentNews + 1));
  newsCarousel.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    goToNews(currentNews + (event.key === "ArrowRight" ? 1 : -1));
  });
  // Settle on the nearest card after a swipe without fighting smooth arrow navigation.
  newsList.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (!newsList.clientWidth) return;
      let nearest = 0;
      newsSlides.forEach((slide, index) => {
        if (Math.abs(slideLeft(index) - newsList.scrollLeft) < Math.abs(slideLeft(nearest) - newsList.scrollLeft)) nearest = index;
      });
      setCurrentNews(nearest);
    }, 150);
  }, { passive: true });
  new ResizeObserver(() => {
    if (!newsList.clientWidth) {
      newsWidth = 0;
      return;
    }
    if (newsList.clientWidth && newsList.clientWidth !== newsWidth) {
      newsWidth = newsList.clientWidth;
      newsList.scrollTo({ left: slideLeft(currentNews), behavior: "instant" });
      fitNewsHeight();
    }
  }).observe(newsList);
  const cardResizeObserver = new ResizeObserver(fitNewsHeight);
  newsSlides.forEach(slide => cardResizeObserver.observe(slide.querySelector(".content-card")));
  new IntersectionObserver(entries => {
    carouselVisible = entries[0].isIntersecting;
    updateNewsMotion();
  }).observe(newsCarousel);
  setCurrentNews(0);
}



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formBtn = document.querySelector("[data-form-btn]");

/**
 * Contact form → email via Web3Forms (static-site friendly).
 * 1) Sign up at https://web3forms.com with ycheon@cs.stonybrook.edu
 * 2) Paste the Access Key below (enable “Restrict to domain” for your site).
 */
const WEB3FORMS_ACCESS_KEY = "60e05351-127b-44a2-b3b5-3f7e5c9831fa";

const formFeedback = document.querySelector("[data-form-feedback]");

function setFormFeedback(state, message) {
  if (!formFeedback) return;
  if (!message) {
    formFeedback.hidden = true;
    formFeedback.textContent = "";
    delete formFeedback.dataset.state;
    return;
  }
  formFeedback.hidden = false;
  formFeedback.dataset.state = state;
  formFeedback.textContent = message;
}

if (form && formBtn) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    setFormFeedback("", "");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!WEB3FORMS_ACCESS_KEY) {
      setFormFeedback(
        "error",
        "Email sending is not set up yet. Add your Web3Forms access key in assets/js/script.js (see https://web3forms.com), or email ycheon@cs.stonybrook.edu directly."
      );
      return;
    }

    const fullname = form.fullname.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const btnLabel = formBtn.querySelector("span");
    const prevLabel = btnLabel ? btnLabel.textContent : "";
    formBtn.disabled = true;
    if (btnLabel) btnLabel.textContent = "Sending...";

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "Portfolio contact form",
          name: fullname,
          email: email,
          message: message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFormFeedback("success", "Message sent. Thank you!");
        form.reset();
      } else {
        setFormFeedback(
          "error",
          (data.message && String(data.message)) || "Could not send. Please try again or email ycheon@cs.stonybrook.edu."
        );
      }
    } catch (err) {
      setFormFeedback("error", "Network error. Please try again later or email ycheon@cs.stonybrook.edu.");
    } finally {
      formBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = prevLabel;
    }
  });
}



// page navigation + URL sync (paths like /yerincheon/projects on GitHub Pages)
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
const PAGE_KEYS = new Set([
  "about",
  "publications",
  "ongoing",
  "projects",
  "contact",
]);
const appBase = new URL(document.baseURI).pathname;
const defaultPageTitle = document.title;
const projectPdfTriggers = document.querySelectorAll("[data-project-slug]");
let projectPdfFrame = document.querySelector("[data-project-pdf-frame]");
const projectTitle = document.querySelector("[data-project-title]");
const projectPdfLink = document.querySelector("[data-project-pdf-link]");
const projectBackBtn = document.querySelector("[data-project-back-btn]");
const projectsBySlug = new Map([...projectPdfTriggers].map(anchor => [anchor.dataset.projectSlug, {
  title: anchor.querySelector(".blog-item-title").textContent.trim(),
  pdfUrl: new URL(anchor.dataset.openProjectPdf, document.baseURI).href,
}]));

function normalizePathname() {
  let p = window.location.pathname;
  if (p.endsWith("/index.html")) {
    p = p.slice(0, -"/index.html".length) || "/";
  }
  return p.replace(/\/$/, "") || "/";
}

function getRouteFromPath() {
  const pathname = normalizePathname();
  const routePath = pathname.startsWith(appBase) ? pathname.slice(appBase.length) : "";
  const segments = routePath.split("/").filter(Boolean);
  if (segments[0] === "projects" && segments.length > 1) {
    const projectSlug = segments[1];
    return segments.length === 2 && projectsBySlug.has(projectSlug)
      ? { page: "project-detail", projectSlug }
      : { page: "projects", redirect: true };
  }
  // The old shared URL has no project identity; show the list instead of a blank PDF.
  if (segments[0] === "project-detail") return { page: "projects", redirect: true };
  if (segments.length === 1 && PAGE_KEYS.has(segments[0])) {
    return { page: segments[0], redirect: segments[0] === "about" };
  }
  return { page: "about" };
}

function buildPageUrl(pageKey, projectSlug) {
  if (pageKey === "about") return appBase;
  if (pageKey === "project-detail") return `${appBase}projects/${projectSlug}`;
  return appBase + pageKey;
}

function setActivePage(pageKey) {
  for (let i = 0; i < pages.length; i++) {
    pages[i].classList.toggle("active", pages[i].dataset.page === pageKey);
  }
  for (let i = 0; i < navigationLinks.length; i++) {
    const label = navigationLinks[i].textContent.trim().toLowerCase();
    const navMatch =
      pageKey === "project-detail" ? label === "projects" : label === pageKey;
    navigationLinks[i].classList.toggle("active", navMatch);
  }
  window.scrollTo(0, 0);
}

function showPage(pageKey, options = {}) {
  const { replace, skipHistory, projectSlug } = options;
  const project = pageKey === "project-detail" && projectsBySlug.get(projectSlug);
  if (pageKey === "project-detail" && !project) pageKey = "projects";
  if (project) {
    projectTitle.textContent = project.title;
    if (projectPdfFrame.src !== project.pdfUrl) {
      // A fresh frame keeps PDF navigations out of the browser's page history.
      const nextFrame = projectPdfFrame.cloneNode(false);
      nextFrame.title = `${project.title} — PDF`;
      nextFrame.src = project.pdfUrl;
      projectPdfFrame.replaceWith(nextFrame);
      projectPdfFrame = nextFrame;
    }
    projectPdfLink.href = project.pdfUrl;
  }
  document.title = project ? `${project.title} | ${defaultPageTitle}` : defaultPageTitle;
  setActivePage(pageKey);
  if (skipHistory) return;
  const url = buildPageUrl(pageKey, projectSlug);
  const state = { page: pageKey, projectSlug };
  if (replace) {
    history.replaceState(state, "", url);
  } else {
    history.pushState(state, "", url);
  }
}

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const pageKey = this.textContent.trim().toLowerCase();
    showPage(pageKey);
  });
}

function restorePageFromLocation() {
  const route = getRouteFromPath();
  showPage(route.page, { projectSlug: route.projectSlug, skipHistory: !route.redirect, replace: true });
}

window.addEventListener("popstate", restorePageFromLocation);

for (let i = 0; i < projectPdfTriggers.length; i++) {
  projectPdfTriggers[i].addEventListener("click", function (event) {
    // Keep native copy-link, modifier-click, and new-tab behavior.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showPage("project-detail", { projectSlug: this.dataset.projectSlug });
  });
}

if (projectBackBtn) {
  projectBackBtn.addEventListener("click", function () {
    showPage("projects");
  });
}

document.querySelectorAll('[data-page="publications"] a[href="#"], [data-page="ongoing"] a[href="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (event) {
    event.preventDefault();
  });
});

restorePageFromLocation();
