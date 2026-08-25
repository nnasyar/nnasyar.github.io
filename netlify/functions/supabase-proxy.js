// ============================================================================
// SUPABASE TERS PROXY (Netlify Function)
// ----------------------------------------------------------------------------
// Amaç: Bazı ağlarda (örn. okul ağı/MEB filtresi) supabase.co adresinin
// doğrudan engellenmesi durumunda, tarayıcının hiç supabase.co ile konuşmasına
// gerek kalmadan aynı sonucu almasını sağlamak. Tarayıcı bu siteye (Netlify
// üzerindeki kendi adresimize) istek atar, biz burada sunucu tarafında
// (Netlify'ın kendi ağından, hiçbir okul filtresine takılmadan) isteği asıl
// Supabase projesine iletir ve cevabı olduğu gibi geri döneriz.
//
// netlify.toml'daki yönlendirme sayesinde "/supabase-proxy/..." ile başlayan
// HER istek buraya düşer (REST API, Storage/görseller, Auth/giriş dahil).
// ============================================================================

const SUPABASE_TARGET = "https://lvrwponfyvdxvypeewnw.supabase.co";
const FUNCTION_PREFIX = "/.netlify/functions/supabase-proxy/";

exports.handler = async function (event) {
  // Tarayıcılar, özel başlıklar (apikey, authorization vb.) içeren isteklerden
  // önce görünmez bir "OPTIONS" kontrol isteği (preflight) gönderir. Bunu doğru
  // cevaplamazsak, asıl veri isteği (GET/POST) tarayıcı tarafından hiç
  // gönderilmeden sessizce başarısız olur.
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "access-control-allow-headers":
          (event.headers && (event.headers["access-control-request-headers"] || event.headers["Access-Control-Request-Headers"])) ||
          "apikey, authorization, content-type, prefer, x-client-info, range",
        "access-control-max-age": "86400",
      },
      body: "",
    };
  }

  try {
    const subPath = (event.path.startsWith(FUNCTION_PREFIX)
      ? event.path.slice(FUNCTION_PREFIX.length)
      : ""
    ).replace(/^\/+/, ""); // baştaki fazladan "/" karakterlerini temizle

    const qs = event.rawQuery
      ? event.rawQuery
      : new URLSearchParams(event.queryStringParameters || {}).toString();

    const targetUrl = SUPABASE_TARGET + "/" + subPath + (qs ? "?" + qs : "");

    // Gelen isteğin header'larını olduğu gibi taşı, sadece bu sunucuya özel
    // olanları çıkar.
    const headers = { ...event.headers };
    delete headers.host;
    delete headers["content-length"];
    delete headers.connection;

    const isBodyless = ["GET", "HEAD"].includes(event.httpMethod);
    const body = isBodyless
      ? undefined
      : event.isBase64Encoded
        ? Buffer.from(event.body || "", "base64")
        : event.body;

    const proxied = await fetch(targetUrl, {
      method: event.httpMethod,
      headers,
      body,
    });

    const arrayBuffer = await proxied.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const responseHeaders = {};
    proxied.headers.forEach((value, key) => {
      // Netlify'ın kendisi bunu tekrar hesaplayacağı için taşımıyoruz.
      if (key.toLowerCase() === "content-encoding") return;
      responseHeaders[key] = value;
    });
    responseHeaders["access-control-allow-origin"] = "*";
    responseHeaders["access-control-allow-methods"] = "GET, POST, PATCH, PUT, DELETE, OPTIONS";
    responseHeaders["access-control-allow-headers"] = "apikey, authorization, content-type, prefer, x-client-info, range";

    return {
      statusCode: proxied.status,
      headers: responseHeaders,
      body: buffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: "Supabase proxy hatası: " + (err && err.message ? err.message : String(err)),
    };
  }
};
