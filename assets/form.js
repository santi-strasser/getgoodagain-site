document.querySelectorAll('form.w3f-form').forEach(function (form) {
  var status = form.querySelector('.form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var originalLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    status.textContent = '';

    fetch(form.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          form.reset();
          status.textContent = "You're on the list – we'll let you know as soon as we debut.";
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
