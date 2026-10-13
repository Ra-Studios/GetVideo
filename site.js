const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('open', open);
});
navigation?.addEventListener('click', event => {
  if (!event.target.closest('a')) return;
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation?.classList.contains('open')) {
    navigation.classList.remove('open'); menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','Open navigation'); menu.focus();
  }
});
// The release page remains a working fallback if GitHub is temporarily unavailable.
if (document.querySelector('[data-download]')) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  fetch('https://api.github.com/repos/Ra-Studios/GetVideo/releases/latest', {
    headers: {Accept:'application/vnd.github+json'}, signal:controller.signal
  }).then(response => response.ok ? response.json() : null).then(release => {
    if (!release || release.draft || release.prerelease) return;
    const asset = release.assets?.find(file => file.name?.endsWith('.apk') && file.state === 'uploaded' &&
      file.browser_download_url?.startsWith('https://github.com/Ra-Studios/GetVideo/releases/download/'));
    if (asset) document.querySelectorAll('[data-download]').forEach(link => link.href = asset.browser_download_url);
    if (/^v?\d+\.\d+\.\d+$/.test(release.tag_name)) document.querySelectorAll('[data-version]').forEach(el => {
      el.textContent = 'Version ' + release.tag_name.replace(/^v/,'');
    });
  }).catch(() => {}).finally(() => clearTimeout(timeout));
}
