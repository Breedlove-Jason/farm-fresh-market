const { createHash, timingSafeEqual } = require('node:crypto');
const digest = value => createHash('sha256').update(value).digest();

// Browsing is public. Editing requires the owner's credentials in every environment.
module.exports = (req, res, next) => {
  const write = !['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  const editor = /\/(new|edit)\/?$/.test(req.path);
  if (!write && !editor) return next();
  res.set('Cache-Control', 'no-store');
  const password = process.env.MARKET_ADMIN_PASSWORD;
  if (!password || password.length < 24) {
    return res.status(403).send('Catalog editing is not enabled. You can still browse farms and products.');
  }
  const authorization = req.get('authorization') || '';
  const credentials = authorization.startsWith('Basic ')
    ? Buffer.from(authorization.slice(6), 'base64').toString() : '';
  if (!timingSafeEqual(digest(credentials), digest(`owner:${password}`))) {
    res.set('WWW-Authenticate', 'Basic realm="Farm Fresh Market editor", charset="UTF-8"');
    return res.status(401).send('Sign in with your market owner credentials to edit the catalog.');
  }
  // Browser form writes must originate on this host, including method-overridden forms.
  if (write) {
    let origin;
    try { origin = new URL(req.get('origin')); } catch { /* invalid or missing */ }
    const protocol = process.env.VERCEL ? 'https:' : `${req.protocol}:`;
    if (!origin || origin.host !== req.get('host') || origin.protocol !== protocol) {
      return res.status(403).send('Please submit this form from the market website.');
    }
  }
  next();
};
