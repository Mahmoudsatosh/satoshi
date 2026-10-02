/* SATOSHI SMART - Service Worker (installability only)
 *
 * عمدًا لا يستخدم أي تخزين (Cache Storage) ولا يعترض أي طلب بيانات.
 * كل طلبات Supabase والحسابات والعمليات المالية تمر مباشرة للشبكة دون تدخل.
 * الوحيد الذي يعترضه: فتح صفحة التطبيق نفسها (navigation) من نفس الموقع،
 * وفي حال انقطاع الإنترنت يعرض رسالة بسيطة بدل صفحة الخطأ.
 * لا يحفظ أي نسخة من الصفحة أو البيانات.
 */

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

var OFFLINE_HTML =
  '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>SATOSHI SMART</title>' +
  '<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;' +
  'background:#03133F;color:#fff;font-family:sans-serif;text-align:center;padding:24px}' +
  'button{margin-top:16px;padding:10px 24px;border:0;border-radius:10px;background:#2563eb;color:#fff;font-size:16px}' +
  '</style></head><body><div><h2>لا يوجد اتصال بالإنترنت</h2>' +
  '<p>ساتوشي يحتاج اتصالًا لحماية بيانات حسابك. تأكد من الإنترنت ثم حاول مرة أخرى.</p>' +
  '<button onclick="location.reload()">إعادة المحاولة</button></div></body></html>';

self.addEventListener('fetch', function (event) {
  var req = event.request;
  // نتدخل فقط في فتح الصفحة نفسها من نفس الموقع؛ كل شيء آخر يمر دون تعديل.
  if (req.mode !== 'navigate' || req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req).catch(function () {
      return new Response(OFFLINE_HTML, {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
      });
    })
  );
});
