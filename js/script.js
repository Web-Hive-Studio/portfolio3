/* =========================================================
   HARSH PHOTOGRAPHY — Site Script
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Header: solid background on scroll ---------- */
  var header = document.querySelector('.site-header');
  function handleHeaderScroll(){
    if (!header) return;
    if (window.scrollY > 40){ header.classList.add('is-scrolled'); }
    else { header.classList.remove('is-scrolled'); }
  }
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var body = document.body;
  var scrim = document.querySelector('.nav-scrim');

  function closeNav(){
    body.classList.remove('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle){
    navToggle.addEventListener('click', function () {
      var isOpen = body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
  if (scrim){ scrim.addEventListener('click', closeNav); }

  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Gallery filtering ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length){
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var target = btn.getAttribute('data-filter');

        galleryItems.forEach(function (item) {
          var cat = item.getAttribute('data-category');
          if (target === 'all' || cat === target){
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox){
    var lightboxImg = lightbox.querySelector('img');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');

    var visibleItems = [];
    var currentIndex = 0;

    function getVisibleItems(){
      return Array.prototype.filter.call(
        document.querySelectorAll('.gallery-item'),
        function (item) { return !item.classList.contains('hidden'); }
      );
    }

    function openLightbox(index){
      visibleItems = getVisibleItems();
      currentIndex = index;
      showImage();
      lightbox.classList.add('is-open');
      body.style.overflow = 'hidden';
    }

    function showImage(){
      var item = visibleItems[currentIndex];
      if (!item) return;
      var img = item.querySelector('img');
      lightboxImg.src = img.getAttribute('data-full') || img.src;
      lightboxImg.alt = img.alt || '';
      lightboxCaption.textContent = item.getAttribute('data-category') || '';
    }

    function closeLightbox(){
      lightbox.classList.remove('is-open');
      body.style.overflow = '';
    }

    document.querySelectorAll('.gallery-item').forEach(function (item, i) {
      item.addEventListener('click', function () {
        var currentVisible = getVisibleItems();
        var idx = currentVisible.indexOf(item);
        openLightbox(idx === -1 ? 0 : idx);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () {
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      showImage();
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      currentIndex = (currentIndex + 1) % visibleItems.length;
      showImage();
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.querySelector('.contact-form');
  if (form){
    var successBox = document.querySelector('.form-success');

    function setError(group, message){
      group.classList.add('has-error');
      var msg = group.querySelector('.error-msg');
      if (msg) msg.textContent = message;
    }
    function clearError(group){
      group.classList.remove('has-error');
    }

    function validateField(field){
      var group = field.closest('.form-group');
      if (!group) return true;
      var value = field.value.trim();

      if (field.hasAttribute('required') && !value){
        setError(group, 'This field is required.');
        return false;
      }
      if (field.type === 'email' && value){
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)){
          setError(group, 'Please enter a valid email address.');
          return false;
        }
      }
      if (field.type === 'tel' && value){
        var phonePattern = /^[0-9+\-\s()]{7,15}$/;
        if (!phonePattern.test(value)){
          setError(group, 'Please enter a valid phone number.');
          return false;
        }
      }
      clearError(group);
      return true;
    }

    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll('input, textarea, select');
      var isValid = true;

      fields.forEach(function (field) {
        if (!validateField(field)) isValid = false;
      });

      if (isValid){
        form.reset();
        if (successBox){
          successBox.classList.add('is-visible');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        var firstError = form.querySelector('.has-error input, .has-error textarea, .has-error select');
        if (firstError) firstError.focus();
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector('#current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
