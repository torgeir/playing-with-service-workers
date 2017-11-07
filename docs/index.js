const { serviceWorker } = navigator;
(async function() {
  if (!serviceWorker) {
    console.warn("Service worker not supported, bailing.");
    return;
  }

  const updateVersion = () =>
    fetch('/sw-version')
      .then(res => res.status == 200 ? res.text() : "sw not under service worker control.")
      .catch(err => "failed to fetch version")
      .then(v => (version.innerText = v));

  // not defined until the first installed worker is in control of the page
  const { controller } = serviceWorker;

  // when new workers take control
  serviceWorker.addEventListener("controllerchange", updateVersion);

  const reg = await serviceWorker.register("sw.js");
  if (reg.active) {
    updateVersion();
  }

  fetch("not-cached.js")
    .then(res => res.text())
    .catch(err => "failed to fetch non-cached content")
    .then(msg => (content.innerText = msg));

})();

async function registerServiceWorker(sw) {
  try {
    const registration = await serviceWorker.register(sw);
    console.log("ServiceWorker registration successful with scope: ", registration.scope);
    return registration;
  } catch (err) {
    console.log("ServiceWorker registration failed: ", err);
    throw err;
  }
}
