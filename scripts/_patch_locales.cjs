const fs = require("fs");
const path = "js/locales.js";
let s = fs.readFileSync(path, "utf8");
const keys = {
  "footer.legal": { tr: "Yasal", en: "Legal", de: "Rechtliches", fr: "Mentions", ar: "قانوني", ru: "Правовая информация", es: "Legal", it: "Legale", nl: "Juridisch", pt: "Legal", az: "Hüquqi" },
  "footer.privacy": { tr: "Gizlilik Politikası", en: "Privacy Policy", de: "Datenschutz", fr: "Confidentialité", ar: "الخصوصية", ru: "Конфиденциальность", es: "Privacidad", it: "Privacy", nl: "Privacy", pt: "Privacidade", az: "Məxfilik" },
  "footer.kvkk": { tr: "KVKK Aydınlatma", en: "Privacy Notice (TR)", de: "KVKK-Hinweis", fr: "Avis KVKK", ar: "إشعار KVKK", ru: "Уведомление KVKK", es: "Aviso KVKK", it: "Informativa KVKK", nl: "KVKK-kennisgeving", pt: "Aviso KVKK", az: "KVKK bildirişi" },
  "footer.cookies": { tr: "Çerez Politikası", en: "Cookie Policy", de: "Cookie-Richtlinie", fr: "Cookies", ar: "ملفات تعريف الارتباط", ru: "Файлы cookie", es: "Cookies", it: "Cookie", nl: "Cookies", pt: "Cookies", az: "Kuki siyasəti" },
  "form.human.placeholder": { tr: "Sonuç", en: "Answer", de: "Ergebnis", fr: "Résultat", ar: "النتيجة", ru: "Ответ", es: "Resultado", it: "Risultato", nl: "Antwoord", pt: "Resultado", az: "Nəticə" },
  "form.human.aria": { tr: "Doğrulama sonucu", en: "Verification answer", de: "Prüfantwort", fr: "Réponse de vérification", ar: "إجابة التحقق", ru: "Проверочный ответ", es: "Respuesta de verificación", it: "Risposta di verifica", nl: "Verificatieantwoord", pt: "Resposta de verificação", az: "Doğrulama cavabı" },
  "form.err.slow": { tr: "Lütfen formu dikkatlice doldurup tekrar deneyin.", en: "Please fill the form carefully and try again.", de: "Bitte Formular sorgfältig ausfüllen und erneut versuchen.", fr: "Veuillez remplir le formulaire avec soin et réessayer.", ar: "يرجى تعبئة النموذج بعناية والمحاولة مرة أخرى.", ru: "Заполните форму внимательнее и попробуйте снова.", es: "Complete el formulario con cuidado e inténtelo de nuevo.", it: "Compila il modulo con attenzione e riprova.", nl: "Vul het formulier zorgvuldig in en probeer opnieuw.", pt: "Preencha o formulário com cuidado e tente novamente.", az: "Formanı diqqətlə doldurub yenidən cəhd edin." },
  "form.err.human": { tr: "Doğrulama yanıtı hatalı. Lütfen tekrar deneyin.", en: "Verification answer is incorrect. Please try again.", de: "Prüfantwort ist falsch. Bitte erneut versuchen.", fr: "Réponse incorrecte. Réessayez.", ar: "إجابة التحقق غير صحيحة. حاول مرة أخرى.", ru: "Неверный проверочный ответ. Попробуйте снова.", es: "Respuesta incorrecta. Inténtelo de nuevo.", it: "Risposta non corretta. Riprova.", nl: "Onjuist verificatieantwoord. Probeer opnieuw.", pt: "Resposta incorreta. Tente novamente.", az: "Doğrulama cavabı yanlışdır. Yenidən cəhd edin." },
  "form.sending": { tr: "Gönderiliyor...", en: "Sending...", de: "Senden...", fr: "Envoi...", ar: "جارٍ الإرسال...", ru: "Отправка...", es: "Enviando...", it: "Invio...", nl: "Verzenden...", pt: "A enviar...", az: "Göndərilir..." },
  "form.received": { tr: "Talep Alındı", en: "Request received", de: "Anfrage erhalten", fr: "Demande reçue", ar: "تم استلام الطلب", ru: "Запрос получен", es: "Solicitud recibida", it: "Richiesta ricevuta", nl: "Aanvraag ontvangen", pt: "Pedido recebido", az: "Sorğu qəbul edildi" },
  "form.err.generic": { tr: "Bir hata oluştu. Lütfen tekrar deneyin.", en: "Something went wrong. Please try again.", de: "Ein Fehler ist aufgetreten. Bitte erneut versuchen.", fr: "Une erreur s'est produite. Réessayez.", ar: "حدث خطأ. حاول مرة أخرى.", ru: "Произошла ошибка. Попробуйте снова.", es: "Se produjo un error. Inténtelo de nuevo.", it: "Si è verificato un errore. Riprova.", nl: "Er is iets misgegaan. Probeer opnieuw.", pt: "Ocorreu um erro. Tente novamente.", az: "Xəta baş verdi. Yenidən cəhd edin." },
  "form.err.network": { tr: "Bağlantı hatası. Lütfen tekrar deneyin.", en: "Connection error. Please try again.", de: "Verbindungsfehler. Bitte erneut versuchen.", fr: "Erreur de connexion. Réessayez.", ar: "خطأ في الاتصال. حاول مرة أخرى.", ru: "Ошибка соединения. Попробуйте снова.", es: "Error de conexión. Inténtelo de nuevo.", it: "Errore di connessione. Riprova.", nl: "Verbindingsfout. Probeer opnieuw.", pt: "Erro de ligação. Tente novamente.", az: "Bağlantı xətası. Yenidən cəhd edin." },
  "cookie.notice": { tr: "Bu sitede reklam çerezi yok. Dil tercihi cihazınızda saklanır. Ayrıntılar için gizlilik ve çerez metinlerine bakın.", en: "No advertising cookies on this site. Language preference is stored on your device. See privacy and cookie policies for details.", de: "Keine Werbe-Cookies. Die Sprachwahl wird auf Ihrem Gerät gespeichert.", fr: "Pas de cookies publicitaires. La langue est enregistrée sur votre appareil.", ar: "لا توجد ملفات تعريف ارتباط إعلانية. يُحفظ تفضيل اللغة على جهازك.", ru: "Рекламных cookie нет. Язык сохраняется на устройстве.", es: "Sin cookies publicitarias. El idioma se guarda en su dispositivo.", it: "Nessun cookie pubblicitario. La lingua è salvata sul dispositivo.", nl: "Geen advertentiecookies. Taalvoorkeur wordt lokaal opgeslagen.", pt: "Sem cookies publicitários. O idioma fica no seu dispositivo.", az: "Reklam kukiləri yoxdur. Dil seçimi cihazınızda saxlanılır." },
  "cookie.accept": { tr: "Anladım", en: "Got it", de: "Verstanden", fr: "Compris", ar: "حسنًا", ru: "Понятно", es: "Entendido", it: "Ho capito", nl: "Begrepen", pt: "Compreendi", az: "Anladım" }
};
const langs = ["tr","en","de","fr","ar","ru","es","it","nl","pt","az"];
for (const lang of langs) {
  const blockRe = new RegExp(`"${lang}"\\s*:\\s*\\{`);
  const m = s.match(blockRe);
  if (!m) { console.log("missing lang", lang); continue; }
  const start = s.indexOf(m[0]) + m[0].length;
  let inject = "";
  for (const [k, map] of Object.entries(keys)) {
    if (s.includes(`"${k}"`) && s.slice(s.indexOf(`"${lang}"`), s.indexOf(`"${lang}"`)+50000).includes(`"${k}"`)) {
      // naive: if key exists globally we still add per-lang if missing in this pack
    }
    const packSlice = s.slice(start, start + 80000);
    if (packSlice.includes(`"${k}"`)) continue;
    inject += `\n    "${k}": ${JSON.stringify(map[lang] || map.en)},`;
  }
  if (inject) {
    s = s.slice(0, start) + inject + s.slice(start);
    console.log("patched", lang, inject.split("\n").length - 1);
  } else console.log("skip", lang);
}
fs.writeFileSync(path, s.replace(/\r\n/g, "\n"), "utf8");
console.log("locales done");
