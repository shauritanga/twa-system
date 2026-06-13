import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// CSRF protection: rely on the live, auto-refreshing XSRF-TOKEN cookie that
// Laravel sets on every response (axios reads it and sends X-XSRF-TOKEN for
// same-origin requests). Do NOT pin a static X-CSRF-TOKEN from the page's
// meta tag — in this SPA the meta token is only captured at full page load,
// so it goes stale whenever the session token rotates (e.g. on login). Since
// Laravel prefers the X-CSRF-TOKEN header over the XSRF-TOKEN cookie, a stale
// pinned header makes every form submit fail with HTTP 419 (Page Expired)
// even though the cookie is still valid.
window.axios.defaults.withXSRFToken = true;

// Configure dayjs globally
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// Make dayjs available globally
window.dayjs = dayjs;
