'use strict';

/**
 * #PRELOADING
 */

const loadElement = document.querySelector("[data-preloader]");

window.addEventListener("load", function () {
  loadElement.classList.add("loaded");
});

/**
 * #MOBILE NAVBAR TOGGLE
 */

const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
}

navToggler.addEventListener("click", toggleNavbar);

/**
 *  #HEADER
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-go-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

/**
 * #SCROLL REVEAL
 */

const revealElements = document.querySelectorAll("[data-reveal]");

const scrollReveal = function () {
  for (let i = 0, x = revealElements.length; i < x; i++) {
    if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.2) {
      revealElements[i].classList.add("revealed");
    } else {
      revealElements[i].classList.remove("revealed");
    }
  }
}

window.addEventListener("scroll", scrollReveal);
window.addEventListener("load", scrollReveal);

// CMS connection code
/* ----------------------------
   CONFIG
----------------------------- */
const SUPABASE_URL = "https://jngdbxdlxggyeamvaedh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuZ2RieGRseGdneWVhbXZhZWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyOTc3NTgsImV4cCI6MjA3OTg3Mzc1OH0.ddhiJOXL1NfA_h3sZ2JPs2w5fCU3jKiLWx-qzcpXUJQ";

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};

/* ----------------------------
   HERO SECTION
----------------------------- */
Promise.all([
  fetch(`${SUPABASE_URL}/rest/v1/hero_section?select=*`, { headers }),
  fetch(`${SUPABASE_URL}/rest/v1/hero_cards?select=*&order=display_order.asc`, { headers })
]).then(responses => Promise.all(responses.map(r => r.json())))
  .then(([heroData, cards]) => {
    const hero = heroData[0];
    if (!hero) return;

    const titleEl = document.getElementById("hero-title");
    if (titleEl) titleEl.innerHTML = hero.title;

    const subtitleEl = document.getElementById("hero-subtitle");
    if (subtitleEl) subtitleEl.innerHTML = hero.subtitle;

    const ctaEl = document.getElementById("hero-cta");
    if (ctaEl) {
      ctaEl.innerHTML = hero.cta_text;
      ctaEl.href = hero.cta_url;
    }

    // Feature cards
    cards.forEach((card, i) => {
      const el = document.getElementById(`hero-card-${i+1}`);
      if (!el) return;
      const subtitleEl = el.querySelector(".card-subtitle");
      const titleEl = el.querySelector(".card-title");
      if (subtitleEl) subtitleEl.innerHTML = card.subtitle;
      if (titleEl) titleEl.innerHTML = card.title;
    });

    // Hero image
    if (hero.hero_image_url) {
      const imgEl = document.getElementById("hero-image");
      if (imgEl) imgEl.src = hero.hero_image_url;
    }
  })
  .catch(err => console.error("Error loading hero section:", err));

/* ----------------------------
   ABOUT SECTION
----------------------------- */
Promise.all([
  fetch(`${SUPABASE_URL}/rest/v1/about_section?select=*`, { headers }),
  fetch(`${SUPABASE_URL}/rest/v1/about_list_items?select=*&order=display_order.asc`, { headers })
]).then(responses => Promise.all(responses.map(r => r.json())))
  .then(([aboutData, listItems]) => {
    const about = aboutData[0];
    if (!about) return;

    const subtitleEl = document.getElementById("about-subtitle");
    if (subtitleEl) subtitleEl.innerHTML = about.section_subtitle;

    const titleEl = document.getElementById("about-title");
    if (titleEl) titleEl.innerHTML = about.section_title;

    const textEl = document.getElementById("about-text");
    if (textEl) textEl.innerHTML = about.main_paragraph;

    // Mission
    const missionTitleEl = document.getElementById("mission-title");
    if (missionTitleEl) missionTitleEl.innerHTML = about.mission_title;

    const missionTextEl = document.getElementById("mission-text");
    if (missionTextEl) missionTextEl.innerHTML = about.mission_text;

    // Vision
    const visionTitleEl = document.getElementById("vision-title");
    if (visionTitleEl) visionTitleEl.innerHTML = about.vision_title;

    const visionTextEl = document.getElementById("vision-text");
    if (visionTextEl) visionTextEl.innerHTML = about.vision_text;

    // Images
    if (about.image_1_url) {
      const img1El = document.getElementById("about-img-1");
      if (img1El) img1El.src = about.image_1_url;
    }
    if (about.image_2_url) {
      const img2El = document.getElementById("about-img-2");
      if (img2El) img2El.src = about.image_2_url;
    }

    // List items
    const listEl = document.getElementById("about-list");
    if (listEl) {
      listEl.innerHTML = listItems.map(item => `
        <li class="about-item">
          <ion-icon name="checkmark-circle"></ion-icon>
          <span class="span">${item.text}</span>
        </li>
      `).join("");
    }
  })
  .catch(err => console.error("Error loading about section:", err));

/* ----------------------------
   STATISTICS
----------------------------- */
fetch(`${SUPABASE_URL}/rest/v1/statistics?select=*&order=display_order.asc`, { headers })
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("stats-list");
    if (!container) return;
    
    container.innerHTML = data.map(stat => `
      <li class="stats-card">
        <h3 class="h3 card-title">${stat.number}</h3>
        <p class="card-text">${stat.description}</p>
      </li>
    `).join("");
  })
  .catch(err => console.error("Error loading statistics:", err));

/* ----------------------------
   OBJECTIVES / SERVICES
----------------------------- */
Promise.all([
  fetch(`${SUPABASE_URL}/rest/v1/objectives?select=*&order=display_order.asc`, { headers }),
  fetch(`${SUPABASE_URL}/rest/v1/objectives_section_settings?select=*`, { headers })
]).then(responses => Promise.all(responses.map(r => r.json())))
  .then(([objectives, settings]) => {
    const leftList = objectives.filter(obj => obj.position === 'left');
    const rightList = objectives.filter(obj => obj.position === 'right');

    const leftEl = document.getElementById("objectives-left");
    if (leftEl) {
      leftEl.innerHTML = leftList.map(item => `
        <li class="service-item">
          <div>
            <h3 class="h5 card-title">${item.title}</h3>
            <p class="card-text">${item.description}</p>
          </div>
          <div class="card-icon"><ion-icon name="${item.icon_name}"></ion-icon></div>
        </li>
      `).join("");
    }

    const rightEl = document.getElementById("objectives-right");
    if (rightEl) {
      rightEl.innerHTML = rightList.map(item => `
        <li class="service-item">
          <div class="card-icon"><ion-icon name="${item.icon_name}"></ion-icon></div>
          <div>
            <h3 class="h5 card-title">${item.title}</h3>
            <p class="card-text">${item.description}</p>
          </div>
        </li>
      `).join("");
    }

    // Section title and subtitle
    if (settings[0]) {
      const titleEl = document.getElementById("objectives-title");
      if (titleEl) titleEl.innerHTML = settings[0].section_title;

      const subtitleEl = document.getElementById("objectives-subtitle");
      if (subtitleEl) subtitleEl.innerHTML = settings[0].section_subtitle;

      // Center banner image
      if (settings[0].banner_image_url) {
        const imgEl = document.getElementById("objectives-image");
        if (imgEl) imgEl.src = settings[0].banner_image_url;
      }
    }
  })
  .catch(err => console.error("Error loading objectives:", err));

/* ----------------------------
   CTA SECTION
----------------------------- */
fetch(`${SUPABASE_URL}/rest/v1/cta_section?select=*`, { headers })
  .then(res => res.json())
  .then(data => {
    const cta = data[0];
    if (!cta) return;

    const titleEl = document.getElementById("cta-title");
    if (titleEl) titleEl.innerHTML = cta.title;

    const textEl = document.getElementById("cta-text");
    if (textEl) textEl.innerHTML = cta.description;

    if (cta.image_url) {
      const imgEl = document.getElementById("cta-image");
      if (imgEl) imgEl.src = cta.image_url;
    }
  })
  .catch(err => console.error("Error loading CTA section:", err));

/* ----------------------------
   THERAPY / BLOG CARDS (Photobiomodulation)
----------------------------- */
fetch(`${SUPABASE_URL}/rest/v1/photobiomodulation_cards?select=*&order=display_order.asc`, { headers })
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("therapy-list");
    if (!container) return;

    container.innerHTML = data.map(item => `
      <li>
        <div class="blog-card">
          <figure class="card-banner img-holder">
            <img src="${item.image_url || ''}" class="img-cover" alt="${item.title}">
          </figure>
          <div class="card-content">
            <ul class="card-meta-list">
              <li class="card-meta-item">
                <ion-icon name="person-outline"></ion-icon>
                <span class="span">${item.author}</span>
              </li>
              <li class="card-meta-item">
                <ion-icon name="chatbubble-outline"></ion-icon>
                <span class="span">${item.comments_count} Comments</span>
              </li>
            </ul>
            <h3 class="h5">
              <a href="#" class="card-title">${item.title}</a>
            </h3>
            ${item.description ? `<p class="card-text">${item.description}</p>` : ''}
          </div>
        </div>
      </li>
    `).join("");
  })
  .catch(err => console.error("Error loading therapy cards:", err));

/* ----------------------------
   CONTACT + FOOTER SECTION
----------------------------- */
Promise.all([
  fetch(`${SUPABASE_URL}/rest/v1/contact_details?select=*`, { headers }),
  fetch(`${SUPABASE_URL}/rest/v1/social_links?select=*&order=display_order.asc`, { headers }),
  fetch(`${SUPABASE_URL}/rest/v1/footer_content?select=*`, { headers })
]).then(responses => Promise.all(responses.map(r => r.json())))
  .then(([contactData, socialLinks, footerData]) => {
    const contact = contactData[0];
    if (contact) {
      const hotlineEl = document.getElementById("contact-hotline");
      if (hotlineEl) {
        hotlineEl.innerHTML = contact.hotline;
        hotlineEl.href = `tel:${contact.hotline}`;
      }

      const emailEl = document.getElementById("contact-email");
      if (emailEl) {
        emailEl.innerHTML = contact.email;
        emailEl.href = `mailto:${contact.email}`;
      }

      const addressEl = document.getElementById("contact-address");
      if (addressEl) addressEl.innerHTML = contact.address;
    }

    // Social links
    socialLinks.forEach(link => {
      const linkEl = document.getElementById(`${link.platform.toLowerCase()}-link`);
      if (linkEl) linkEl.href = link.url;
    });

    // Footer about text
    if (footerData[0]) {
      const footerAboutEl = document.getElementById("footer-about");
      if (footerAboutEl) footerAboutEl.innerHTML = footerData[0].about_text;

      const copyrightEl = document.getElementById("footer-copyright");
      if (copyrightEl) copyrightEl.innerHTML = footerData[0].copyright_text;
    }
  })
  .catch(err => console.error("Error loading contact/footer:", err));
