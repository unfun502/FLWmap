import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const assetManifest = JSON.parse(manifestJSON);

function addSecurityHeaders(headers) {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' api.mapbox.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com api.mapbox.com; font-src fonts.gstatic.com; img-src 'self' data: blob: images.adsttc.com api.mapbox.com *.tiles.mapbox.com; connect-src 'self' api.mapbox.com *.tiles.mapbox.com events.mapbox.com; worker-src blob:");
}

export default {
  async fetch(request, env, ctx) {
    const event = { request, waitUntil: ctx.waitUntil.bind(ctx) };
    const options = {
      ASSET_NAMESPACE: env.__STATIC_CONTENT,
      ASSET_MANIFEST: assetManifest,
    };

    try {
      const response = await getAssetFromKV(event, options);
      const headers = new Headers(response.headers);
      addSecurityHeaders(headers);
      return new Response(response.body, { status: response.status, headers });
    } catch (e) {
      // SPA fallback
      try {
        const fallbackEvent = {
          request: new Request(new URL(request.url).origin + '/index.html', request),
          waitUntil: ctx.waitUntil.bind(ctx),
        };
        const fallback = await getAssetFromKV(fallbackEvent, options);
        const headers = new Headers(fallback.headers);
        addSecurityHeaders(headers);
        return new Response(fallback.body, { status: 200, headers });
      } catch {
        return new Response('Not Found', { status: 404 });
      }
    }
  },
};
