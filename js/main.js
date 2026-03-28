// Avantio configuration
const AVANTIO_BASE = 'https://demo-651.avantio.dev/it';
const AVANTIO_TYPE_MAP = {
  '1':  'appartamenti-c1',
  '2':  'ville-c2',
  '14': 'studi-c14',
  '19': 'case-c19',
  '20': 'villette-c20',
};

function buildAvantioUrl(checkin, checkout, typeId, guests) {
  const typeSlug = typeId ? `affitti-${AVANTIO_TYPE_MAP[typeId]}` : 'affitti-affitti-p0';
  let path = `/affitti/${typeSlug}`;
  if (guests) path += `/${guests}-persone`;
  if (checkin) {
    const ci = formatAvantioDate(checkin);
    path += `/disponibile-da-${ci}`;
  }
  if (checkout) {
    const co = formatAvantioDate(checkout);
    path += `/fino-${co}`;
  }
  return `${AVANTIO_BASE}${path}/`;
}

function formatAvantioDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}-${m}-${y}`;
}

function doSearch() {
  const checkin = document.getElementById('sf-checkin').value;
  const checkout = document.getElementById('sf-checkout').value;
  const typeId = document.getElementById('sf-type').value;
  const guests = document.getElementById('sf-guests').value;
  const url = buildAvantioUrl(checkin, checkout, typeId, guests);
  window.open(url, '_blank');
  return false;
}

// Mobile menu
const hamburger = document.getElementById('navHamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('mobile-open');
  hamburger.setAttribute('aria-expanded', isOpen);
});
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    hamburger.classList.remove('open');
    navLinks.classList.remove('mobile-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// Navbar scroll
const nav = document.getElementById('navbar');
function updateNav() {
  if (window.scrollY > 56) {
    nav.classList.add('is-scrolled');
    nav.classList.remove('is-top');
  } else {
    nav.classList.remove('is-scrolled');
    nav.classList.add('is-top');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Reveal on scroll
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Hero Slideshow
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
const locText = document.getElementById('heroLocationText');
const locWrap = document.getElementById('heroLocation');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  locWrap.classList.remove('visible');
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  setTimeout(() => {
    locText.textContent = slides[currentSlide].getAttribute('data-location');
    locWrap.classList.add('visible');
  }, 400);
}

function nextSlide() {
  goToSlide((currentSlide + 1) % slides.length);
}

function startSlideshow() {
  slideInterval = setInterval(nextSlide, 5500);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(slideInterval);
    goToSlide(parseInt(dot.getAttribute('data-slide')));
    startSlideshow();
  });
});

startSlideshow();

// Carousel
const track = document.getElementById('destTrack');
let carouselPos = 0;
const cardWidth = 364;

function scrollCarousel(dir) {
  const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
  carouselPos = Math.max(0, Math.min(carouselPos + dir * cardWidth, maxScroll));
  track.style.transform = `translateX(-${carouselPos}px)`;
}

// Drag support
let isDragging = false, startX, scrollLeft;
track.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.pageX;
  scrollLeft = carouselPos;
});
document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const diff = startX - e.pageX;
  const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
  carouselPos = Math.max(0, Math.min(scrollLeft + diff, maxScroll));
  track.style.transform = `translateX(-${carouselPos}px)`;
});
document.addEventListener('mouseup', () => { isDragging = false; });

// Touch support
track.addEventListener('touchstart', e => {
  isDragging = true;
  startX = e.touches[0].pageX;
  scrollLeft = carouselPos;
}, { passive: true });
track.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const diff = startX - e.touches[0].pageX;
  const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
  carouselPos = Math.max(0, Math.min(scrollLeft + diff, maxScroll));
  track.style.transform = `translateX(-${carouselPos}px)`;
}, { passive: true });
track.addEventListener('touchend', () => { isDragging = false; });
