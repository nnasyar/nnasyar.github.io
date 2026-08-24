// ============================================================================
// WORKER GİRİŞ NOKTASI
// ----------------------------------------------------------------------------
// Bu worker iki iş yapar:
//   1) Normal istekler (index.html, pano99.html, app.js, görseller vb.)
//      -> doğrudan statik dosyaları (ASSETS) sunar, eskisi gibi.
//   2) "/supabase-proxy/..." ile başlayan istekler
//      -> tarayıcı yerine BURADAN (Cloudflare'in kendi ağından) gerçek
//         Supabase projesine gönderilir ve cevap aynen geri döndürülür.
//      Amaç: bazı ağlarda (örn. okul ağı/MEB filtresi) supabase.co adresinin
//      doğrudan engellenmesi durumunda, tarayıcının hiç supabase.co ile
//      konuşmasına gerek kalmadan aynı sonucu almasını sağlamak.
// ============================================================================

const SUPABASE_TARGET = "https://lvrwponfyvdxvypeewnw.supabase.co";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/supabase-proxy/")) {
      return handleSupabaseProxy(request, url);
    }

    // Supabase proxy değilse: eskisi gibi statik dosyaları sun.
    return env.ASSETS.fetch(request);
  },
};

async function handleSupabaseProxy(request, url) {
  // "/supabase-proxy/rest/v1/foo" -> "rest/v1/foo"
  const subPath = url.pathname.replace(/^\/supabase-proxy\//, "");

  const targetUrl = new URL(SUPABASE_TARGET + "/" + subPath);
  targetUrl.search = url.search; // ?id=eq.1&select=active gibi sorgu parametrelerini koru

  const headers = new Headers(request.headers);
  headers.delete("host");

  const proxied = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    redirect: "manual",
  });

  const responseHeaders = new Headers(proxied.headers);
  responseHeaders.set("access-control-allow-origin", "*");

  return new Response(proxied.body, {
    status: proxied.status,
    statusText: proxied.statusText,
    headers: responseHeaders,
  });
}
