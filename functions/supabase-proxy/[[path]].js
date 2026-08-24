// ============================================================================
// SUPABASE TERS PROXY (Reverse Proxy)
// ----------------------------------------------------------------------------
// Amaç: Bazı ağlarda (örn. okul ağı/MEB filtresi) supabase.co adresinin
// doğrudan engellenmesi durumunda, tarayıcının hiç supabase.co ile konuşmasına
// gerek kalmadan aynı sonucu almasını sağlamak. Tarayıcı bu siteye (Cloudflare
// üzerinde çalışan kendi adresimize) istek atar, biz burada sunucu tarafında
// (Cloudflare'in kendi ağından, hiçbir okul filtresine takılmadan) isteği asıl
// Supabase projesine iletir ve cevabı olduğu gibi geri döneriz.
//
// Kapsam: /supabase-proxy/ ile başlayan HER istek (REST API, Storage/görseller,
// Auth/giriş dahil) buradan geçer. Yani "/supabase-proxy/rest/v1/..." aslında
// "https://lvrwponfyvdxvypeewnw.supabase.co/rest/v1/..." adresine gider.
// ============================================================================

const SUPABASE_TARGET = "https://lvrwponfyvdxvypeewnw.supabase.co";

export async function onRequest(context) {
  const { request, params } = context;

  // "/supabase-proxy/rest/v1/foo" -> params.path = ["rest","v1","foo"]
  const subPath = Array.isArray(params.path) ? params.path.join("/") : (params.path || "");

  const incomingUrl = new URL(request.url);
  const targetUrl = new URL(SUPABASE_TARGET + "/" + subPath);
  targetUrl.search = incomingUrl.search; // ?id=eq.1&select=active gibi sorgu parametrelerini koru

  // Gelen isteğin header'larını olduğu gibi taşı, sadece "host" gibi bu sunucuya
  // özel olanları çıkar (asıl hedefe host bilgimiz karışmasın diye).
  const headers = new Headers(request.headers);
  headers.delete("host");

  const proxied = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    redirect: "manual",
  });

  // Cevabı (veri, görsel, hata mesajı ne olursa olsun) aynen geri döndür.
  const responseHeaders = new Headers(proxied.headers);
  responseHeaders.set("access-control-allow-origin", "*");

  return new Response(proxied.body, {
    status: proxied.status,
    statusText: proxied.statusText,
    headers: responseHeaders,
  });
}
