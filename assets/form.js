var KLAVIYO_PUBLIC_KEY = 'UfmvKG';
var KLAVIYO_LIST_ID = 'WcGpR2';

document.querySelectorAll('form.waitlist-form').forEach(function (form) {
  var status = form.parentElement.querySelector('.form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var honeypot = form.querySelector('.hp-field');
    if (honeypot && honeypot.checked) return;

    var email = form.querySelector('input[type="email"]').value;
    var btn = form.querySelector('button[type="submit"]');
    var originalLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    status.textContent = '';

    fetch('https://a.klaviyo.com/client/subscriptions?company_id=' + KLAVIYO_PUBLIC_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
        revision: '2026-07-15'
      },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: email,
                  subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } }
                }
              }
            }
          },
          relationships: {
            list: { data: { type: 'list', id: KLAVIYO_LIST_ID } }
          }
        }
      })
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          status.textContent = "You're on the list – we'll let you know as soon as we launch.";
        } else {
          status.textContent = 'Something went wrong. Please try again.';
        }
      })
      .catch(function () {
        status.textContent = 'Something went wrong. Please try again.';
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = originalLabel;
      });
  });
});
