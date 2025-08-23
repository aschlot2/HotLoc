// assets/js/contact-email.js
document.addEventListener('DOMContentLoaded', function () {
  emailjs.init({ publicKey: "gz9Ti7xmlFRShsOxn" });

  const contactArticle = document.querySelector('#contact');
  const form = contactArticle?.querySelector('form');
  if (!form) return;

  let status = contactArticle.querySelector('#contact-status');
  if (!status) {
    status = document.createElement('div');
    status.id = 'contact-status';
    status.setAttribute('aria-live', 'polite');
    status.style.marginTop = '0.75rem';
    contactArticle.appendChild(status);
  }

  // helper to set hidden input
  const setHidden = (name, value) => {
    let el = form.querySelector(`[name="${name}"]`);
    if (!el) {
      el = document.createElement('input');
      el.type = 'hidden';
      el.name = name;
      form.appendChild(el);
    }
    el.value = value;
  };

  form.addEventListener('submit', async (e) => {
    // Prevent double submits
    if (form.querySelector('button[type="submit"]')?.disabled) return;
    e.preventDefault();

    // Honeypot
    const honeypot = form.querySelector('#company');
    if (honeypot && honeypot.value.trim() !== '') {
      status.textContent = "Thanks! If this was a real person, your message would be on its way.";
      form.reset();
      return;
    }

    // Inject dynamic fields used by your EmailJS template
    setHidden(
      'time',
      new Date().toLocaleString(undefined, { timeZoneName: 'short' })
    ); // {{time}} (includes timezone)
    setHidden('subject', 'New HotLoc inquiry via website'); // {{subject}}
    setHidden('reply_to', form.email?.value || ''); // use this as Reply-To in template settings

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    status.textContent = '';

    try {
      const serviceID  = "service_fj9u4mh";
      const templateID = "template_ynfpis7";

      await emailjs.sendForm(serviceID, templateID, form);

      status.innerHTML = `✅ Message sent from <strong>${form.email.value}</strong>. We'll get back to you soon.`;
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = "❌ Sorry, something went wrong sending your message. Please try again later.";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText || 'Send Message';
      }
    }
  });
});
