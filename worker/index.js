addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const backend = BACKEND_URL || process.env.BACKEND_URL;
  if (!backend) return new Response('BACKEND_URL not configured', { status: 500 });

  // Proxy only /tracks and /years
  if (url.pathname.startsWith('/tracks') || url.pathname === '/years') {
    const target = new URL(backend);
    target.pathname = url.pathname;
    target.search = url.search;
    const resp = await fetch(target.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method === 'GET' ? null : await request.text(),
    });
    const body = await resp.arrayBuffer();
    return new Response(body, { status: resp.status, headers: resp.headers });
  }

  return fetch(request);
}


