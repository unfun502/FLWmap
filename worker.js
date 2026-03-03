import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  try {
    const response = await getAssetFromKV(event);

    // Apply security headers
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' api.mapbox.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com api.mapbox.com; font-src fonts.gstatic.com; img-src 'self' data: blob: images.adsttc.com api.mapbox.com *.tiles.mapbox.com; connect-src 'self' api.mapbox.com *.tiles.mapbox.com events.mapbox.com; worker-src blob:");

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (e) {
    // Serve index.html for SPA-style fallback
    try {
      const notFoundResponse = await getAssetFromKV(event, {
        mapRequestToAsset: (req) =>
          new Request(`${new URL(req.url).origin}/index.html`, req),
      });
      return new Response(notFoundResponse.body, {
        ...notFoundResponse,
        status: 200,
      });
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  }
}
