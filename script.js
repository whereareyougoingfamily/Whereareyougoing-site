// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Mobile nav toggle ----------
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---------- Donate amount selector ----------
// Replace STRIPE_LINKS with your real Stripe Payment Links (one per amount),
// or point "custom" at a Payment Link with an open amount field.
const STRIPE_LINKS = {
  25: 'https://buy.stripe.com/REPLACE_25',
  50: 'https://buy.stripe.com/REPLACE_50',
  100: 'https://buy.stripe.com/REPLACE_100',
  custom: 'https://buy.stripe.com/REPLACE_CUSTOM'
};

const donateAmounts = document.getElementById('donateAmounts');
const donateBtn = document.getElementById('donateBtn');

donateAmounts.addEventListener('click', (e) => {
  const btn = e.target.closest('.amount-btn');
  if (!btn) return;
  donateAmounts.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const amount = btn.dataset.amount;
  donateBtn.textContent = amount === 'custom' ? 'Give' : `Give $${amount}`;
  donateBtn.href = STRIPE_LINKS[amount] || '#';
});

// ---------- Form submission handling ----------
// These forms currently show a local confirmation only.
// To make them actually send submissions, sign up at https://formspree.io,
// create a form, and replace FORM_ENDPOINT below with the URL Formspree gives you.
// Then swap handleFormSubmit's local-only branch for the fetch() call (left in place, commented).

function handleFormSubmit(form, statusEl, successMessage) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.className = 'form-status show';
    statusEl.textContent = 'Sending…';

    // --- Uncomment and set FORM_ENDPOINT to actually send submissions ---
    // const FORM_ENDPOINT = 'https://formspree.io/f/REPLACE_ME';
    // try {
    //   const res = await fetch(FORM_ENDPOINT, {
    //     method: 'POST',
    //     headers: { 'Accept': 'application/json' },
    //     body: new FormData(form)
    //   });
    //   if (res.ok) {
    //     statusEl.className = 'form-status show ok';
    //     statusEl.textContent = successMessage;
    //     form.reset();
    //   } else {
    //     throw new Error('Submission failed');
    //   }
    // } catch (err) {
    //   statusEl.className = 'form-status show err';
    //   statusEl.textContent = "Something went wrong — please email us directly at hello@whereareyougoing.family";
    // }

    // Local-only placeholder behavior until FORM_ENDPOINT is set above:
    setTimeout(() => {
      statusEl.className = 'form-status show ok';
      statusEl.textContent = successMessage;
      form.reset();
    }, 500);
  });
}

handleFormSubmit(
  document.getElementById('helpForm'),
  document.getElementById('helpStatus'),
  "Got it — someone from our team will reach out soon."
);

handleFormSubmit(
  document.getElementById('volunteerForm'),
  document.getElementById('volunteerStatus'),
  "Thanks for signing up — we'll be in touch."
);

handleFormSubmit(
  document.getElementById('shareForm'),
  document.getElementById('shareStatus'),
  "Thanks for sharing. Sometimes knowing where we're going starts with saying it out loud."
);

// ---------- Impact counter animation ----------
// Counts up each .impact-num from 0 to its data-target once it scrolls into view.
const impactNums = document.querySelectorAll('.impact-num');

function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (impactNums.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  impactNums.forEach(el => observer.observe(el));
}

// ---------- Interactive "I need help" category flow ----------
const helpStep1 = document.getElementById('helpStep1');
const helpStep2 = document.getElementById('helpStep2');
const helpSelectedCat = document.getElementById('helpSelectedCat');
const hCategory = document.getElementById('hCategory');
const hUrgentLabel = document.getElementById('helpUrgentLabel');
const helpBack = document.getElementById('helpBack');

document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    hCategory.value = cat;
    helpSelectedCat.textContent = cat;
    helpStep1.style.display = 'none';
    helpStep2.style.display = 'block';
  });
});

helpBack.addEventListener('click', () => {
  helpStep2.style.display = 'none';
  helpStep1.style.display = 'block';
});
