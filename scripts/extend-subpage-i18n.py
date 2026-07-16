# -*- coding: utf-8 -*-
"""
Extend SoftenWise i18n to all subpages.
1) Fix fallback chain: lang -> en -> tr
2) Merge page strings into js/locales.js
3) Wire data-i18n on subpage bodies
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES_JS = ROOT / "js" / "locales.js"
I18N_JS = ROOT / "js" / "i18n.js"

# Shared contact-band / CTAs used across pages
SHARED_TR = {
    "common.cta.meeting": "Görüşme talep et",
    "common.cta.project": "Proje görüşmesi alın",
    "common.cta.back_services": "Hizmetlere dön",
    "common.cta.send": "Talebi gönder",
    "common.cta.view_guides": "Rehberleri gör",
    "common.contact.h2": "Projenizi birlikte değerlendirelim",
    "common.contact.p": "Kapsam, zaman planı ve bir sonraki adımı netleştirmek için kısa bir teknik görüşme planlayabilirsiniz.",
    "common.contact.name": "Ad Soyad",
    "common.contact.email": "E-posta",
    "common.contact.message": "Projeniz hakkında kısa bir özet",
    "common.contact.success": "Talebinizi aldık. En kısa sürede dönüş yapacağız.",
    "common.proof": "Seçilmiş referanslar",
    "common.detail": "Detaylı bakış",
    "common.process": "Süreç",
    "common.more": "Devamı",
}

SHARED_EN = {
    "common.cta.meeting": "Request a meeting",
    "common.cta.project": "Book a project discussion",
    "common.cta.back_services": "Back to services",
    "common.cta.send": "Submit request",
    "common.cta.view_guides": "View guides",
    "common.contact.h2": "Let us evaluate your project together",
    "common.contact.p": "Schedule a short technical discussion to clarify scope, timeline, and next steps.",
    "common.contact.name": "Full name",
    "common.contact.email": "Email",
    "common.contact.message": "Brief overview of your project",
    "common.contact.success": "Thank you. We have received your request and will respond shortly.",
    "common.proof": "Selected clients",
    "common.detail": "In detail",
    "common.process": "Process",
    "common.more": "Continue",
}

# Page-specific TR / EN
PAGES_TR = {
    # urunler
    "urunler.title": "SoftenWise | Ürünler",
    "urunler.desc": "SoftenWise Clinic, Otomini, SoftenWise Maps ve BLOC — SoftenWise ürün portföyü.",
    "urunler.brand": "SoftenWise",
    "urunler.h1": "Ürünler",
    "urunler.lead": 'Klinikten haritaya, mobil uygulamaya: geliştirdiğimiz ürünleri burada topladık. Özel yazılım veya entegrasyon için <a href="index.html#solutions">hizmetlerimize</a> bakın.',
    "urunler.cta1": "Ürünleri inceleyin",
    "urunler.cta2": "Görüşme talep et",
    "urunler.featured": "Öne çıkanlar",
    "urunler.jump": "Ürün detay bölümlerine git",
    "urunler.clinic.desc": "Randevudan finansa klinik süreçleri tek panelde yönetin.",
    "urunler.clinic.cta": "Teknik detayları inceleyin",
    "urunler.otomini.desc": "İkinci el araç değerleme, ekspertiz ve galeri vitrini.",
    "urunler.otomini.cta": "Teknik detayları inceleyin",
    "urunler.maps.desc": "Saha operasyonları için kurumsal CBS: harita, bölge, rota ve REST API.",
    "urunler.maps.cta": "Özet ve bağlantılar",
    "urunler.bloc.badge": "Mobil uygulama",
    "urunler.bloc.desc": "Topluluk ve sosyal akış odaklı iOS / Android uygulaması.",
    "urunler.bloc.cta": "Uygulama özeti",
    "urunler.kicker.portfolio": "Portföy",
    "urunler.kicker.eco": "SoftenWise ekosistemi",
    "urunler.visit": "Ürün sitesine gidin",
    "urunler.clinic.lead": "Randevudan hasta takibine, finanstan raporlamaya: klinik süreçleri tek merkezden yöneten web paneli.",
    "urunler.clinic.b1": "<strong>11 dil</strong> ve çok ülkeli altyapı; şube bazlı görünürlük",
    "urunler.clinic.b2": "Hasta ve ziyaret, randevu, finans ve raporlama modülleri",
    "urunler.clinic.b3": "Rol / yetki ayrımı ve <strong>audit log</strong> ile izlenebilirlik",
    "urunler.clinic.b4": "Web tabanlı panel; SaaS veya müşteri bulutu seçenekleri",
    "urunler.clinic.b5": "<strong>15 gün ücretsiz deneme</strong> — softenwiseclinic.com",
    "urunler.clinic.b6": "Poliklinikler, özel tıp merkezleri ve çok şubeli yapılar için",
    "urunler.otomini.lead": "İkinci el araç ticaretinde güven odaklı süreç: anlık dijital değerleme, şeffaf ekspertiz ve profesyonel galeri vitrini.",
    "urunler.otomini.b1": "<strong>Akıllı değerleme:</strong> marka, model ve donanım verileriyle saniyeler içinde ön değer",
    "urunler.otomini.b2": "<strong>Şeffaf ekspertiz:</strong> Tramer ve hasar özeti",
    "urunler.otomini.b3": "<strong>İlan yönetimi:</strong> Otomini vitrininde galeri odaklı sunum",
    "urunler.otomini.b4": "İkinci el galeriler, bayi ağları ve alım-satım ekipleri için",
    "urunler.otomini.b5": "SoftenWise mühendisliğiyle geliştirilen bağımsız ürün markası",
    "urunler.maps.lead": "Saha operasyonlarını tek panelden izleyen kurumsal <strong>CBS</strong> ekosistemi: harita, bölge, rota, raporlama ve REST API.",
    "urunler.maps.b1": "<strong>Tek panel:</strong> harita, katman ağacı, çizim araçları; adres / koordinat ile canlı odak",
    "urunler.maps.b2": "Güvenli ve yasaklı bölgeler (poligon); versiyonlu değişiklik kaydı",
    "urunler.maps.b3": "Geocode, rota, mesafe matrisi; GeoJSON / KML ve <strong>REST API</strong> entegrasyonu",
    "urunler.maps.b4": "XYZ karo, Nominatim, WMS / WMTS; Google Maps Platform veya kurum içi harita servisleri",
    "urunler.maps.b5": "Çok kiracılı mimari, rol tabanlı erişim; OpenAPI / Redoc dokümantasyonu",
    "urunler.maps.b6": "Saha, lojistik ve bölge planlaması için tasarlandı",
    "urunler.bloc.lead": "Topluluk ve sosyal akış odaklı <strong>iOS ve Android</strong> mobil uygulama; paylaşım, keşif ve etkileşim tek çatıda.",
    "urunler.bloc.b1": "App Store ve Google Play üzerinden dağıtım",
    "urunler.bloc.b2": "Sosyal akış ve topluluk etkileşimine uygun arayüz",
    "urunler.bloc.b3": "SoftenWise mühendislik kalitesiyle geliştirildi",
    "urunler.bloc.b4": "Mağaza odaklı ürün yaşam döngüsü",
    "urunler.bloc.b5": "iOS ve Android için native deneyim",
    # services
    "svc.custom.brand": "Yazılım Geliştirme",
    "svc.custom.h1": "Özel Yazılım Geliştirme",
    "svc.custom.lead": "Standart paket yazılımların sınırlarını aşıp, karmaşık süreçlerinizi basitleştiren ve işinizle birlikte büyüyen modüler platformlar inşa ediyoruz.",
    "svc.custom.title": "SoftenWise | Özel Yazılım Geliştirme",
    "svc.mobile.brand": "Mobil Geliştirme",
    "svc.mobile.h1": "Mobil Geliştirme",
    "svc.mobile.lead": "iOS ve Android için native ve hybrid mobil uygulamaları ürün odaklı şekilde, mağaza yayınından canlı izlemeye kadar birlikte götürüyoruz.",
    "svc.mobile.title": "SoftenWise | Mobil Geliştirme",
    "svc.integ.brand": "Entegrasyon ve Otomasyon",
    "svc.integ.h1": "Entegrasyon ve Otomasyon",
    "svc.integ.lead": "Kopuk sistemleri birbirine bağlayıp veri akışını otomatize ederek manuel hata payını azaltıyor, ekibinizin zamanını stratejik işlere ayırmasını sağlıyoruz.",
    "svc.integ.title": "SoftenWise | Entegrasyon ve Otomasyon",
    "svc.sec.brand": "Güvenlik ve Denetim",
    "svc.sec.h1": "Güvenlik ve Denetim",
    "svc.sec.lead": "Sistemlerinizi siber tehditlere karşı güçlendirirken yasal uyumluluk ve teknik denetim süreçlerinde yanınızda yer alıyoruz.",
    "svc.sec.title": "SoftenWise | Güvenlik ve Denetim",
    "svc.consult.brand": "Teknik Danışmanlık",
    "svc.consult.h1": "Teknik Danışmanlık",
    "svc.consult.lead": "Ürün ve ekip ölçeklenirken teknik borç üretmeden ilerlemeniz için mimari karar, refactor ve ölçeklenme konularında net danışmanlık sunuyoruz.",
    "svc.consult.title": "SoftenWise | Teknik Danışmanlık",
    # company
    "academy.brand": "SoftenWise Academy",
    "academy.h1": "Mühendislik disiplinini birlikte güçlendirelim",
    "academy.lead": "SoftenWise Academy; kod yazmayı değil, mühendislik disiplinini ve ölçeklenebilir sistem mimarilerini merkeze alan bir gelişim programıdır.",
    "academy.title": "SoftenWise | Academy",
    "career.brand": "SoftenWise Kariyer",
    "career.h1": "Gerçek ürünler, yüksek trafik, ölçülebilir gelişim",
    "career.lead": "SoftenWise’de yalnızca görev tamamlamazsınız; yüksek trafikli sistemlerin mimari kararlarında sorumluluk alır, performans ve ölçeklenebilirlik sorunlarını gerçek projelerde çözersiniz.",
    "career.title": "SoftenWise | Kariyer",
    "partner.brand": "Girişim Ortaklığı",
    "partner.h1": "Fikirlerinizi teknik kapasitemizle büyütelim",
    "partner.lead": "Potansiyeli yüksek vizyonları teknik doğrulama, MVP geliştirme ve büyüme stratejileriyle sürdürülebilir modellere dönüştürüyoruz.",
    "partner.title": "SoftenWise | Fikir Ortaklığı",
    "resources.brand": "Kaynak Merkezi",
    "resources.h1": "Yazılım kararı veren ekipler için net rehberler",
    "resources.lead": "Gerçek kullanıcı sorularına odaklı içerik kümesi: seçim, maliyet ve süreç kararlarını netleştirmek için.",
    "resources.title": "SoftenWise | Kaynaklar",
    "guide.firm.brand": "Rehber",
    "guide.firm.h1": "Yazılım firması nasıl seçilir?",
    "guide.firm.lead": "Doğru teknoloji ortağını seçmek projenin kaderini belirler. Teklif değerlendirmeden teknik kaliteye kadar kritik kontrol noktalarını derledik.",
    "guide.firm.title": "SoftenWise | Yazılım Firması Nasıl Seçilir?",
    "guide.cost.brand": "Maliyet Rehberi",
    "guide.cost.h1": "Özel yazılım maliyeti nasıl hesaplanır?",
    "guide.cost.lead": "Kapsam analizi, bütçe planlama ve geliştirme süreçlerinin şeffaf yürütülmesi için pratik bir çerçeve.",
    "guide.cost.title": "SoftenWise | Özel Yazılım Maliyeti",
    "guide.mobile.brand": "Mobil Rehber",
    "guide.mobile.h1": "Mobil uygulama geliştirme süreci",
    "guide.mobile.lead": "Başarılı mobil ürünler; keşif, test ve yayın disipliniyle ortaya çıkar.",
    "guide.mobile.title": "SoftenWise | Mobil Uygulama Süreci",
    "err404.brand": "SoftenWise",
    "err404.h1": "404 — Sayfa bulunamadı",
    "err404.lead": "Bu adres artık yok veya yanlış yazılmış olabilir; ana sayfadan, hizmetlerimizden veya kaynaklarımızdan devam edebilirsiniz.",
    "err404.title": "SoftenWise | Sayfa bulunamadı",
    "err404.home": "Ana sayfaya dön",
}

PAGES_EN = {
    "urunler.title": "SoftenWise | Products",
    "urunler.desc": "SoftenWise Clinic, Otomini, SoftenWise Maps, and BLOC — the SoftenWise product portfolio.",
    "urunler.brand": "SoftenWise",
    "urunler.h1": "Products",
    "urunler.lead": 'From clinic to maps and mobile: our products are collected here. For custom software or integration, see our <a href="index.html#solutions">services</a>.',
    "urunler.cta1": "Explore products",
    "urunler.cta2": "Request a meeting",
    "urunler.featured": "Featured",
    "urunler.jump": "Jump to product details",
    "urunler.clinic.desc": "Manage clinic workflows from appointments to finance in one panel.",
    "urunler.clinic.cta": "Review technical details",
    "urunler.otomini.desc": "Used-vehicle valuation, inspection, and gallery showcase.",
    "urunler.otomini.cta": "Review technical details",
    "urunler.maps.desc": "Enterprise GIS for field operations: maps, zones, routing, and REST API.",
    "urunler.maps.cta": "Summary and links",
    "urunler.bloc.badge": "Mobile app",
    "urunler.bloc.desc": "Community and social-feed oriented iOS / Android application.",
    "urunler.bloc.cta": "App overview",
    "urunler.kicker.portfolio": "Portfolio",
    "urunler.kicker.eco": "SoftenWise ecosystem",
    "urunler.visit": "Visit product site",
    "urunler.clinic.lead": "A web console that centralizes clinic workflows from appointments and patient tracking to finance and reporting.",
    "urunler.clinic.b1": "<strong>11 languages</strong> and multi-country infrastructure; branch-level visibility",
    "urunler.clinic.b2": "Patient and visit, appointment, finance, and reporting modules",
    "urunler.clinic.b3": "Role-based access and <strong>audit log</strong> for traceability",
    "urunler.clinic.b4": "Web-based console; SaaS or customer-cloud options",
    "urunler.clinic.b5": "<strong>15-day free trial</strong> — softenwiseclinic.com",
    "urunler.clinic.b6": "Built for polyclinics, private medical centers, and multi-branch organizations",
    "urunler.otomini.lead": "Trust-focused used-vehicle trading: instant digital valuation, transparent inspection, and a professional gallery showcase.",
    "urunler.otomini.b1": "<strong>Smart valuation:</strong> preliminary value in seconds from make, model, and trim data",
    "urunler.otomini.b2": "<strong>Transparent inspection:</strong> damage and history summary",
    "urunler.otomini.b3": "<strong>Listing management:</strong> gallery-first presentation on the Otomini showcase",
    "urunler.otomini.b4": "For used-car dealers, dealer networks, and trading teams",
    "urunler.otomini.b5": "An independent product brand engineered by SoftenWise",
    "urunler.maps.lead": "An enterprise <strong>GIS</strong> ecosystem to monitor field operations from one panel: maps, zones, routing, reporting, and REST API.",
    "urunler.maps.b1": "<strong>Single panel:</strong> map, layer tree, drawing tools; live focus by address / coordinates",
    "urunler.maps.b2": "Safe and restricted zones (polygons); versioned change history",
    "urunler.maps.b3": "Geocode, routing, distance matrix; GeoJSON / KML and <strong>REST API</strong> integration",
    "urunler.maps.b4": "XYZ tiles, Nominatim, WMS / WMTS; Google Maps Platform or on-prem map services",
    "urunler.maps.b5": "Multi-tenant architecture, role-based access; OpenAPI / Redoc documentation",
    "urunler.maps.b6": "Designed for field, logistics, and regional planning",
    "urunler.bloc.lead": "A community and social-feed oriented <strong>iOS and Android</strong> mobile app — sharing, discovery, and engagement in one product.",
    "urunler.bloc.b1": "Distributed via App Store and Google Play",
    "urunler.bloc.b2": "Interface suited to social feed and community interaction",
    "urunler.bloc.b3": "Built with SoftenWise engineering standards",
    "urunler.bloc.b4": "Store-first product lifecycle",
    "urunler.bloc.b5": "Native experience for iOS and Android",
    "svc.custom.brand": "Software Development",
    "svc.custom.h1": "Custom Software Development",
    "svc.custom.lead": "We build modular platforms that go beyond off-the-shelf packages — simplifying complex processes and scaling with your business.",
    "svc.custom.title": "SoftenWise | Custom Software Development",
    "svc.mobile.brand": "Mobile Development",
    "svc.mobile.h1": "Mobile Development",
    "svc.mobile.lead": "We deliver product-focused native and hybrid apps for iOS and Android — from store release to live monitoring.",
    "svc.mobile.title": "SoftenWise | Mobile Development",
    "svc.integ.brand": "Integration & Automation",
    "svc.integ.h1": "Integration & Automation",
    "svc.integ.lead": "We connect disconnected systems and automate data flow to reduce manual error and free your team for strategic work.",
    "svc.integ.title": "SoftenWise | Integration & Automation",
    "svc.sec.brand": "Security & Audit",
    "svc.sec.h1": "Security & Audit",
    "svc.sec.lead": "We strengthen your systems against cyber threats while supporting compliance and technical audit processes.",
    "svc.sec.title": "SoftenWise | Security & Audit",
    "svc.consult.brand": "Technical Advisory",
    "svc.consult.h1": "Technical Advisory",
    "svc.consult.lead": "Clear advisory on architecture, refactoring, and scale — so your product and team can grow without accumulating technical debt.",
    "svc.consult.title": "SoftenWise | Technical Advisory",
    "academy.brand": "SoftenWise Academy",
    "academy.h1": "Strengthen engineering discipline together",
    "academy.lead": "SoftenWise Academy centers engineering discipline and scalable system architecture — not just writing code.",
    "academy.title": "SoftenWise | Academy",
    "career.brand": "SoftenWise Careers",
    "career.h1": "Real products, high traffic, measurable growth",
    "career.lead": "At SoftenWise you take ownership in architecture decisions for high-traffic systems and solve performance and scalability problems on real projects.",
    "career.title": "SoftenWise | Careers",
    "partner.brand": "Venture Partnership",
    "partner.h1": "Grow your ideas with our technical capacity",
    "partner.lead": "We turn high-potential visions into durable models through technical validation, MVP delivery, and growth strategy.",
    "partner.title": "SoftenWise | Venture Partnership",
    "resources.brand": "Resource Center",
    "resources.h1": "Clear guides for teams making software decisions",
    "resources.lead": "A content set focused on real buyer questions — clarifying selection, cost, and process decisions.",
    "resources.title": "SoftenWise | Resources",
    "guide.firm.brand": "Guide",
    "guide.firm.h1": "How to choose a software partner",
    "guide.firm.lead": "Choosing the right technology partner shapes project outcomes. We compiled critical checkpoints from proposal review to technical quality.",
    "guide.firm.title": "SoftenWise | How to Choose a Software Partner",
    "guide.cost.brand": "Cost Guide",
    "guide.cost.h1": "How custom software cost is calculated",
    "guide.cost.lead": "A practical framework for scope analysis, budget planning, and transparent delivery.",
    "guide.cost.title": "SoftenWise | Custom Software Cost",
    "guide.mobile.brand": "Mobile Guide",
    "guide.mobile.h1": "Mobile application development process",
    "guide.mobile.lead": "Successful mobile products come from discovery, testing, and release discipline — not code alone.",
    "guide.mobile.title": "SoftenWise | Mobile App Process",
    "err404.brand": "SoftenWise",
    "err404.h1": "404 — Page not found",
    "err404.lead": "This address may no longer exist or may be mistyped. Continue from the home page, services, or resources.",
    "err404.title": "SoftenWise | Page not found",
    "err404.home": "Back to home",
}

# Compact translations for other langs (heroes + shared + urunler core). Missing keys fall back to EN.
DE_EXTRA = {
    **{k: SHARED_EN[k] for k in SHARED_EN},
    "common.cta.meeting": "Gespräch anfragen",
    "common.cta.project": "Projektgespräch vereinbaren",
    "common.cta.back_services": "Zurück zu den Leistungen",
    "common.cta.send": "Anfrage senden",
    "common.cta.view_guides": "Leitfäden ansehen",
    "common.contact.h2": "Lassen Sie uns Ihr Projekt gemeinsam bewerten",
    "common.contact.p": "Vereinbaren Sie ein kurzes technisches Gespräch zu Scope, Zeitplan und nächsten Schritten.",
    "common.contact.name": "Vollständiger Name",
    "common.contact.email": "E-Mail",
    "common.contact.message": "Kurze Projektbeschreibung",
    "common.contact.success": "Vielen Dank. Wir haben Ihre Anfrage erhalten und melden uns in Kürze.",
    "urunler.h1": "Produkte",
    "urunler.lead": 'Von der Klinik bis zu Karten und Mobile: unsere Produkte finden Sie hier. Für Individualsoftware oder Integration siehe unsere <a href="index.html#solutions">Leistungen</a>.',
    "urunler.cta1": "Produkte ansehen",
    "urunler.cta2": "Gespräch anfragen",
    "urunler.featured": "Highlights",
    "urunler.title": "SoftenWise | Produkte",
    "svc.custom.h1": "Individuelle Softwareentwicklung",
    "svc.mobile.h1": "Mobile Entwicklung",
    "svc.integ.h1": "Integration & Automatisierung",
    "svc.sec.h1": "Sicherheit & Audit",
    "svc.consult.h1": "Technische Beratung",
    "resources.h1": "Klare Leitfäden für Software-Entscheidungen",
    "resources.brand": "Ressourcencenter",
    "err404.h1": "404 — Seite nicht gefunden",
    "err404.home": "Zur Startseite",
}


def load_locales() -> dict:
    raw = LOCALES_JS.read_text(encoding="utf-8")
    payload = raw.split("=", 1)[1].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


def save_locales(data: dict) -> None:
    LOCALES_JS.write_text(
        "/* SoftenWise locales — generated; includes subpages */\n"
        f"window.SW_LOCALES = {json.dumps(data, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
        newline="\n",
    )


def merge_pages(data: dict) -> dict:
    for lang in data:
        data[lang].update(SHARED_EN if lang != "tr" else SHARED_TR)
        data[lang].update(PAGES_EN if lang != "tr" else PAGES_TR)
    # TR shared/pages overwrite EN defaults
    data["tr"].update(SHARED_TR)
    data["tr"].update(PAGES_TR)
    data["en"].update(SHARED_EN)
    data["en"].update(PAGES_EN)
    # DE gets German extras; others keep EN page strings (fallback chain also helps)
    data["de"].update(DE_EXTRA)
    # Light overlays for remaining langs — at least urunler.h1 + common CTAs
    overlays = {
        "fr": {
            "urunler.h1": "Produits",
            "urunler.featured": "À la une",
            "urunler.cta1": "Voir les produits",
            "urunler.cta2": "Demander un entretien",
            "urunler.lead": 'De la clinique aux cartes et au mobile : nos produits sont réunis ici. Pour un logiciel sur mesure ou une intégration, consultez nos <a href="index.html#solutions">services</a>.',
            "common.cta.meeting": "Demander un entretien",
            "common.cta.project": "Planifier une discussion projet",
            "common.cta.back_services": "Retour aux services",
            "resources.brand": "Centre de ressources",
            "resources.h1": "Des guides clairs pour les décisions logiciels",
            "err404.h1": "404 — Page introuvable",
            "err404.home": "Retour à l’accueil",
        },
        "es": {
            "urunler.h1": "Productos",
            "urunler.featured": "Destacados",
            "urunler.cta1": "Explorar productos",
            "urunler.cta2": "Solicitar reunión",
            "urunler.lead": 'De la clínica a los mapas y el móvil: aquí reunimos nuestros productos. Para software a medida o integración, vea nuestros <a href="index.html#solutions">servicios</a>.',
            "common.cta.meeting": "Solicitar reunión",
            "common.cta.project": "Agendar discusión de proyecto",
            "common.cta.back_services": "Volver a servicios",
            "resources.brand": "Centro de recursos",
            "resources.h1": "Guías claras para decisiones de software",
            "err404.h1": "404 — Página no encontrada",
            "err404.home": "Volver al inicio",
        },
        "it": {
            "urunler.h1": "Prodotti",
            "urunler.featured": "In evidenza",
            "urunler.cta1": "Esplora i prodotti",
            "urunler.cta2": "Richiedi un incontro",
            "common.cta.meeting": "Richiedi un incontro",
            "common.cta.back_services": "Torna ai servizi",
            "resources.h1": "Guide chiare per decisioni sul software",
            "err404.h1": "404 — Pagina non trovata",
            "err404.home": "Torna alla home",
        },
        "nl": {
            "urunler.h1": "Producten",
            "urunler.featured": "Uitgelicht",
            "urunler.cta1": "Producten bekijken",
            "urunler.cta2": "Gesprek aanvragen",
            "common.cta.meeting": "Gesprek aanvragen",
            "common.cta.back_services": "Terug naar diensten",
            "resources.h1": "Duidelijke gidsen voor softwarebeslissingen",
            "err404.h1": "404 — Pagina niet gevonden",
            "err404.home": "Terug naar home",
        },
        "pt": {
            "urunler.h1": "Produtos",
            "urunler.featured": "Destaques",
            "urunler.cta1": "Explorar produtos",
            "urunler.cta2": "Pedir reunião",
            "common.cta.meeting": "Pedir reunião",
            "common.cta.back_services": "Voltar aos serviços",
            "resources.h1": "Guias claros para decisões de software",
            "err404.h1": "404 — Página não encontrada",
            "err404.home": "Voltar ao início",
        },
        "ru": {
            "urunler.h1": "Продукты",
            "urunler.featured": "Избранное",
            "urunler.cta1": "Смотреть продукты",
            "urunler.cta2": "Запросить встречу",
            "common.cta.meeting": "Запросить встречу",
            "common.cta.back_services": "К услугам",
            "resources.h1": "Понятные гайды для решений по ПО",
            "err404.h1": "404 — Страница не найдена",
            "err404.home": "На главную",
        },
        "ar": {
            "urunler.h1": "المنتجات",
            "urunler.featured": "مميز",
            "urunler.cta1": "استكشف المنتجات",
            "urunler.cta2": "اطلب اجتماعًا",
            "common.cta.meeting": "اطلب اجتماعًا",
            "common.cta.back_services": "العودة إلى الخدمات",
            "resources.h1": "أدلة واضحة لقرارات البرمجيات",
            "err404.h1": "404 — الصفحة غير موجودة",
            "err404.home": "العودة للرئيسية",
        },
        "az": {
            "urunler.h1": "Məhsullar",
            "urunler.featured": "Öne çıxanlar",
            "urunler.cta1": "Məhsullara baxın",
            "urunler.cta2": "Görüş sorğusu",
            "common.cta.meeting": "Görüş sorğusu",
            "common.cta.back_services": "Xidmətlərə qayıt",
            "resources.h1": "Proqram qərarları üçün aydın bələdçilər",
            "err404.h1": "404 — Səhifə tapılmadı",
            "err404.home": "Ana səhifəyə qayıt",
        },
    }
    for lang, over in overlays.items():
        data[lang].update(PAGES_EN)  # full EN page body
        data[lang].update(SHARED_EN)
        data[lang].update(over)
    data["de"].update(PAGES_EN)
    data["de"].update(SHARED_EN)
    data["de"].update(DE_EXTRA)
    return data


def fix_i18n_fallback() -> None:
    text = I18N_JS.read_text(encoding="utf-8")
    old = """  function t(lang, key) {
    const pack = dict[lang] || dict.tr || {};
    const fallback = dict.tr || {};
    return pack[key] ?? fallback[key] ?? key;
  }"""
    new = """  function t(lang, key) {
    const pack = dict[lang] || {};
    const en = dict.en || {};
    const tr = dict.tr || {};
    return pack[key] ?? en[key] ?? tr[key] ?? key;
  }"""
    if old not in text:
        raise SystemExit("i18n t() block not found")
    I18N_JS.write_text(text.replace(old, new), encoding="utf-8", newline="\n")
    print("i18n fallback: lang -> en -> tr")


def wire_body(html: str, mapping: list[tuple[str, str]]) -> str:
    for old, new in mapping:
        if old not in html:
            print("  miss:", old[:70].replace("\n", " "))
        else:
            html = html.replace(old, new, 1)
    return html


def set_body_meta(html: str, title_key: str, desc_key: str | None = None) -> str:
    def repl(m: re.Match) -> str:
        attrs = m.group(1)
        if "data-i18n-title" in attrs:
            return m.group(0)
        extra = f' data-i18n-title="{title_key}"'
        if desc_key:
            extra += f' data-i18n-desc="{desc_key}"'
        return f"<body{attrs}{extra}>"

    return re.sub(r"<body([^>]*)>", repl, html, count=1)


def wire_contact_band(html: str) -> str:
    pairs = [
        ('placeholder="Ad Soyad"', 'placeholder="Ad Soyad" data-i18n-attr="placeholder:common.contact.name"'),
        ('placeholder="E-posta"', 'placeholder="E-posta" data-i18n-attr="placeholder:common.contact.email"'),
        ('placeholder="Ne üzerinde çalışıyorsunuz?"', 'placeholder="Projeniz hakkında kısa bir özet" data-i18n-attr="placeholder:common.contact.message"'),
        ('placeholder="Projenizi kısaca anlatın"', 'placeholder="Projeniz hakkında kısa bir özet" data-i18n-attr="placeholder:common.contact.message"'),
        ('placeholder="Mesajınız"', 'placeholder="Projeniz hakkında kısa bir özet" data-i18n-attr="placeholder:common.contact.message"'),
    ]
    for old, new in pairs:
        if old in html and "placeholder:common.contact" not in html.split(old)[0][-80:]:
            html = html.replace(old, new, 1)

    clean = [
        ('class="btn-primary">Proje Görüşmesi Al</a>', 'class="btn-primary" data-i18n="common.cta.project">Proje görüşmesi alın</a>'),
        ('class="btn-ghost">Hizmetlere Dön</a>', 'class="btn-ghost" data-i18n="common.cta.back_services">Hizmetlere dön</a>'),
        ('class="btn-primary">Rehberleri Gör</a>', 'class="btn-primary" data-i18n="common.cta.view_guides">Rehberleri gör</a>'),
        ('class="btn-ghost">Proje Görüşmesi Al</a>', 'class="btn-ghost" data-i18n="common.cta.project">Proje görüşmesi alın</a>'),
        ('class="btn-primary">Proje Talebi Gönder</button>', 'class="btn-primary" data-i18n="common.cta.send">Talebi gönder</button>'),
        ('class="btn-primary">Görüşme iste</button>', 'class="btn-primary" data-i18n="common.cta.send">Talebi gönder</button>'),
        ('class="section-kicker">Detaylı Bakış</p>', 'class="section-kicker" data-i18n="common.detail">Detaylı bakış</p>'),
        ('class="section-kicker">Süreç</p>', 'class="section-kicker" data-i18n="common.process">Süreç</p>'),
        ('class="section-kicker">Devamı</p>', 'class="section-kicker" data-i18n="common.more">Devamı</p>'),
    ]
    for old, new in clean:
        if old in html:
            html = html.replace(old, new)

    html2, n = re.subn(
        r'(<section class="cta contact-band"[\s\S]{0,500}?<h2>)([^<]+)(</h2>)',
        r'\1<span data-i18n="common.contact.h2">\2</span>\3',
        html,
        count=1,
    )
    if n:
        html = html2
    html2, n = re.subn(
        r'(<section class="cta contact-band"[\s\S]{0,900}?<p>\s*)([^<]+?)(\s*</p>)',
        r'\1<span data-i18n="common.contact.p">\2</span>\3',
        html,
        count=1,
    )
    if n:
        html = html2
    return html


def wire_urunler(html: str) -> str:
    html = set_body_meta(html, "urunler.title", "urunler.desc")
    mapping = [
        ('<p class="page-hero__brand">SoftenWise</p>\n        <h1 class="page-hero__title">Ürünler</h1>',
         '<p class="page-hero__brand" data-i18n="urunler.brand">SoftenWise</p>\n        <h1 class="page-hero__title" data-i18n="urunler.h1">Ürünler</h1>'),
        (
            """        <p class="page-hero__lead">
          Klinikten haritaya, mobil uygulamaya: geliştirdiğimiz ürünleri burada topladık.
          Özel yazılım veya entegrasyon için <a href="index.html#solutions">hizmetlerimize</a> bakın.
        </p>""",
            """        <p class="page-hero__lead" data-i18n="urunler.lead" data-i18n-html>
          Klinikten haritaya, mobil uygulamaya: geliştirdiğimiz ürünleri burada topladık. Özel yazılım veya entegrasyon için <a href="index.html#solutions">hizmetlerimize</a> bakın.
        </p>""",
        ),
        ('class="btn-primary">Ürünleri incele</a>', 'class="btn-primary" data-i18n="urunler.cta1">Ürünleri inceleyin</a>'),
        ('class="btn-ghost">Görüşme talep et</a>', 'class="btn-ghost" data-i18n="urunler.cta2">Görüşme talep et</a>'),
        ('id="products-heading" class="reveal">Öne çıkanlar</h2>', 'id="products-heading" class="reveal" data-i18n="urunler.featured">Öne çıkanlar</h2>'),
        ('aria-label="Ürün detay bölümlerine git"', 'aria-label="Ürün detay bölümlerine git" data-i18n-attr="aria-label:urunler.jump"'),
        ('<p class="product-tile-desc">Randevudan finansa klinik süreçleri tek panelde yönetin.</p>',
         '<p class="product-tile-desc" data-i18n="urunler.clinic.desc">Randevudan finansa klinik süreçleri tek panelde yönetin.</p>'),
        ('href="#softenwise-clinic">Teknik detayları incele</a>', 'href="#softenwise-clinic" data-i18n="urunler.clinic.cta">Teknik detayları inceleyin</a>'),
        ('<p class="product-tile-desc">İkinci el araç değerleme, ekspertiz ve galeri vitrini.</p>',
         '<p class="product-tile-desc" data-i18n="urunler.otomini.desc">İkinci el araç değerleme, ekspertiz ve galeri vitrini.</p>'),
        ('href="#otomini">Teknik detayları incele</a>', 'href="#otomini" data-i18n="urunler.otomini.cta">Teknik detayları inceleyin</a>'),
        ('<p class="product-tile-desc">Saha operasyonları için kurumsal CBS: harita, bölge, rota ve REST API.</p>',
         '<p class="product-tile-desc" data-i18n="urunler.maps.desc">Saha operasyonları için kurumsal CBS: harita, bölge, rota ve REST API.</p>'),
        ('href="#softenwise-maps">Özet ve bağlantılar</a>', 'href="#softenwise-maps" data-i18n="urunler.maps.cta">Özet ve bağlantılar</a>'),
        ('product-tile-badge--soft">Mobil uygulama</span>', 'product-tile-badge--soft" data-i18n="urunler.bloc.badge">Mobil uygulama</span>'),
        ('<p class="product-tile-desc">Topluluk ve sosyal akış odaklı iOS / Android uygulaması.</p>',
         '<p class="product-tile-desc" data-i18n="urunler.bloc.desc">Topluluk ve sosyal akış odaklı iOS / Android uygulaması.</p>'),
        ('href="#bloc">Uygulama özeti</a>', 'href="#bloc" data-i18n="urunler.bloc.cta">Uygulama özeti</a>'),
        ('<span class="section-kicker">Portföy</span>\n          <h2 id="clinic-detail-title">SoftenWise Clinic</h2>',
         '<span class="section-kicker" data-i18n="urunler.kicker.portfolio">Portföy</span>\n          <h2 id="clinic-detail-title">SoftenWise Clinic</h2>'),
        (
            """          <p class="product-detail-lead">
            Randevudan hasta takibine, finanstan raporlamaya: klinik süreçleri tek merkezden yöneten web paneli.
          </p>""",
            """          <p class="product-detail-lead" data-i18n="urunler.clinic.lead">
            Randevudan hasta takibine, finanstan raporlamaya: klinik süreçleri tek merkezden yöneten web paneli.
          </p>""",
        ),
        ('softenwiseclinic.com/" target="_blank" rel="noopener noreferrer">Ürün sitesine git</a>',
         'softenwiseclinic.com/" target="_blank" rel="noopener noreferrer" data-i18n="urunler.visit">Ürün sitesine gidin</a>'),
        ('<span class="section-kicker">SoftenWise ekosistemi</span>\n          <h2 id="otomini-detail-title">Otomini</h2>',
         '<span class="section-kicker" data-i18n="urunler.kicker.eco">SoftenWise ekosistemi</span>\n          <h2 id="otomini-detail-title">Otomini</h2>'),
        (
            """          <p class="product-detail-lead">
            İkinci el araç ticaretinde güven odaklı süreç: anlık dijital değerleme, şeffaf ekspertiz ve profesyonel galeri vitrini.
          </p>""",
            """          <p class="product-detail-lead" data-i18n="urunler.otomini.lead">
            İkinci el araç ticaretinde güven odaklı süreç: anlık dijital değerleme, şeffaf ekspertiz ve profesyonel galeri vitrini.
          </p>""",
        ),
        ('otomini.com/" target="_blank" rel="noopener noreferrer">Ürün sitesine git</a>',
         'otomini.com/" target="_blank" rel="noopener noreferrer" data-i18n="urunler.visit">Ürün sitesine gidin</a>'),
        ('<span class="section-kicker">Portföy</span>\n          <h2 id="softenwise-maps-detail-title">SoftenWise Maps</h2>',
         '<span class="section-kicker" data-i18n="urunler.kicker.portfolio">Portföy</span>\n          <h2 id="softenwise-maps-detail-title">SoftenWise Maps</h2>'),
        (
            """          <p class="product-detail-lead">
            Saha operasyonlarını tek panelden izleyen kurumsal <strong>CBS</strong> ekosistemi: harita, bölge, rota, raporlama ve REST API.
          </p>""",
            """          <p class="product-detail-lead" data-i18n="urunler.maps.lead" data-i18n-html>
            Saha operasyonlarını tek panelden izleyen kurumsal <strong>CBS</strong> ekosistemi: harita, bölge, rota, raporlama ve REST API.
          </p>""",
        ),
        ('softenwisemaps.com/" target="_blank" rel="noopener noreferrer">Ürün sitesine git</a>',
         'softenwisemaps.com/" target="_blank" rel="noopener noreferrer" data-i18n="urunler.visit">Ürün sitesine gidin</a>'),
        ('<span class="section-kicker">SoftenWise ekosistemi</span>\n          <h2 id="bloc-detail-title">BLOC</h2>',
         '<span class="section-kicker" data-i18n="urunler.kicker.eco">SoftenWise ekosistemi</span>\n          <h2 id="bloc-detail-title">BLOC</h2>'),
    ]
    html = wire_body(html, mapping)
    # bullet lists - replace li contents with data-i18n-html
    bullets = [
        ("clinic", [
            ("<strong>11 dil</strong> ve çok ülkeli altyapı; şube bazlı görünürlük", "urunler.clinic.b1"),
            ("Hasta &amp; ziyaret, randevu, finans ve raporlama modülleri", "urunler.clinic.b2"),
            ("Rol / yetki ayrımı ve <strong>audit log</strong> ile izlenebilirlik", "urunler.clinic.b3"),
            ("Web tabanlı panel; SaaS veya müşteri bulutu seçenekleri", "urunler.clinic.b4"),
            ("<strong>15 gün ücretsiz deneme</strong> — softenwiseclinic.com", "urunler.clinic.b5"),
            ("Poliklinikler, özel tıp merkezleri ve çok şubeli yapılar için", "urunler.clinic.b6"),
        ]),
        ("otomini", [
            ("<strong>Akıllı değerleme:</strong> marka, model ve donanım verileriyle saniyeler içinde ön değer", "urunler.otomini.b1"),
            ("<strong>Şeffaf ekspertiz:</strong> Tramer ve hasar özeti", "urunler.otomini.b2"),
            ("<strong>İlan yönetimi:</strong> Otomini vitrininde galeri odaklı sunum", "urunler.otomini.b3"),
            ("İkinci el galeriler, bayi ağları ve alım-satım ekipleri için", "urunler.otomini.b4"),
            ("SoftenWise mühendisliğiyle geliştirilen bağımsız ürün markası", "urunler.otomini.b5"),
        ]),
    ]
    for _, items in bullets:
        for text, key in items:
            old = f"<li>{text}</li>"
            new = f'<li data-i18n="{key}" data-i18n-html>{text}</li>'
            if old in html:
                html = html.replace(old, new, 1)
    # maps + bloc bullets via regex on remaining Turkish list items near those sections - approximate
    maps_bullets = [
        ("<strong>Tek panel:</strong> harita, katman ağacı, çizim araçları; adres / koordinat ile canlı odak", "urunler.maps.b1"),
        ("Güvenli ve yasaklı bölgeler (poligon); versiyonlu değişiklik kaydı", "urunler.maps.b2"),
        ("Geocode, rota, mesafe matrisi; GeoJSON / KML ve <strong>REST API</strong> entegrasyonu", "urunler.maps.b3"),
        ("XYZ karo, Nominatim, WMS / WMTS; Google Maps Platform veya kurum içi harita servisleri", "urunler.maps.b4"),
        ("Çok kiracılı mimari, rol tabanlı erişim; OpenAPI / Redoc dokümantasyonu", "urunler.maps.b5"),
        ("Saha, lojistik ve bölge planlaması için tasarlandı", "urunler.maps.b6"),
    ]
    for text, key in maps_bullets:
        old = f"<li>{text}</li>"
        if old in html:
            html = html.replace(old, f'<li data-i18n="{key}" data-i18n-html>{text}</li>', 1)
    # bloc lead
    html = html.replace(
        "Topluluk ve sosyal akış odaklı <strong>iOS ve Android</strong> mobil uygulama; paylaşım, keşif ve etkileşim tek çatıda.",
        '<span data-i18n="urunler.bloc.lead" data-i18n-html>Topluluk ve sosyal akış odaklı <strong>iOS ve Android</strong> mobil uygulama; paylaşım, keşif ve etkileşim tek çatıda.</span>',
        1,
    )
    return wire_contact_band(html)


def wire_simple_hero(html: str, prefix: str, brand: str, h1: str, lead: str) -> str:
    html = set_body_meta(html, f"{prefix}.title", None)
    mapping = [
        (f'<p class="page-hero__brand">{brand}</p>', f'<p class="page-hero__brand" data-i18n="{prefix}.brand">{brand}</p>'),
        (f'<h1 class="page-hero__title">{h1}</h1>', f'<h1 class="page-hero__title" data-i18n="{prefix}.h1">{h1}</h1>'),
        (f'<p class="page-hero__lead">{lead}</p>', f'<p class="page-hero__lead" data-i18n="{prefix}.lead">{lead}</p>'),
    ]
    return wire_contact_band(wire_body(html, mapping))


def main() -> None:
    fix_i18n_fallback()
    data = load_locales()
    data = merge_pages(data)
    save_locales(data)
    print("locales merged, keys/tr=", len(data["tr"]))

    pages = {
        "urunler.html": "urunler",
        "ozel-yazilim.html": ("svc.custom", "Yazılım Geliştirme", "Özel Yazılım Geliştirme",
            "Standart paket yazılımların sınırlarını aşıp, karmaşık süreçlerinizi basitleştiren ve işinizle birlikte büyüyen modüler platformlar inşa ediyoruz."),
        "mobil-gelistirme.html": ("svc.mobile", "Mobil Geliştirme", "Mobil Geliştirme",
            "iOS ve Android için native ve hybrid mobil uygulamaları ürün odaklı şekilde, mağaza yayınından canlı izlemeye kadar birlikte götürüyoruz."),
        "entegrasyon-otomasyon.html": ("svc.integ", "Entegrasyon & Otomasyon", "Entegrasyon & Otomasyon",
            "Kopuk sistemleri birbirine bağlayıp veri akışını otomatize ederek manuel hata payını sıfıra indiriyor, ekibinizin vaktini stratejik işlere odaklamasını sağlıyoruz."),
        "guvenlik-denetim.html": ("svc.sec", "Güvenlik & Denetim", "Güvenlik & Denetim",
            "Sistemlerinizi siber tehditlere karşı zırhlandırırken, yasal uyumluluk ve teknik denetim süreçlerinde yanınızda yer alarak dijital varlıklarınızı koruma altına alıyoruz."),
        "teknik-danismanlik.html": ("svc.consult", "Teknik Danışmanlık", "Teknik Danışmanlık",
            "Ürün ve ekip ölçeklenirken teknik borç üretmeden ilerlemeniz için mimari karar, refactor ve ölçeklenme konularında net danışmanlık sunuyoruz."),
        "academy.html": ("academy", "SoftenWise Academy", "Geleceğin Yazılım Standartlarını Birlikte İnşa Edelim",
            "SoftenWise Academy; sadece kod yazmayı değil, mühendislik disiplinini ve ölçeklenebilir sistem mimarilerini merkeze alan bir gelişim ekosistemidir. Teorik bilgiyi gerçek dünya projeleriyle birleştirerek ekipleri ve bireyleri üretime hazır hale getiriyoruz."),
        "kariyer.html": ("career", "SoftenWise Kariyer", "Gerçek Ürünler, Yüksek Trafik, Maksimum Gelişim",
            "SoftenWise'de sadece size verilen görevleri tamamlamazsınız; yüksek trafikli sistemlerin mimari kararlarında sorumluluk alır, performans ve ölçeklenebilirlik sorunlarını gerçek projeler üzerinde çözersiniz. Kısa sürede derinlemesine teknik yetkinlik ve piyasada karşılığı olan bir üretim disiplini kazanmak isteyen yeni ekip arkadaşları arıyoruz."),
        "girisim-ortakligi.html": ("partner", "Girişim Ortaklığı &amp; Melek Yatırım", "Fikirlerinizi Teknik Gücümüzle Büyütelim",
            "Potansiyeli yüksek vizyonları sadece dinlemekle kalmıyor; teknik doğrulama, MVP geliştirme ve büyüme stratejileriyle sürdürülebilir iş modellerine dönüştürüyoruz. Uygun projelerde teknik ortaklık veya melek yatırım modellerini devreye alarak; gelir yapısı, ölçeklenebilirlik ve pazar uyumu netleşmiş somut bir yol haritası sunuyoruz."),
        "kaynaklar.html": ("resources", "Kaynak Merkezi", "Yazılım kararı veren ekipler için net rehberler",
            "Arama motorlarında ve AI sonuçlarında daha görünür olmak için, gerçek kullanıcı sorularına odaklı içerik kümesi hazırladık."),
        "yazilim-firmasi-nasil-secilir.html": ("guide.firm", "Rehber", "Yazılım firması nasıl seçilir?",
            "Doğru teknoloji ortağını seçmek, projenizin kaderini belirler. Teklif değerlendirmeden teknik kalite kontrolüne kadar, doğru kararı vermenizi sağlayacak kritik kontrol listelerini sizin için hazırladık."),
        "ozel-yazilim-maliyeti.html": ("guide.cost", "Maliyet Rehberi", "Özel yazılım maliyeti nasıl hesaplanır?",
            "Yazılım maliyetlerindeki belirsizliği ortadan kaldırın. Kapsam analizi, bütçe planlama ve geliştirme süreçlerinin şeffaf bir şekilde nasıl yürütülmesi gerektiğini rehberlerimizde bulabilirsiniz."),
        "mobil-uygulama-gelistirme-sureci.html": ("guide.mobile", "Mobil Rehber", "Mobil uygulama geliştirme süreci",
            "Başarılı mobil ürünler, sadece kod değil; doğru keşif, test ve yayın disipliniyle ortaya çıkar."),
        "404.html": ("err404", "SoftenWise", "404 — Sayfa bulunamadı",
            "Bu adres artık yok veya yanlış yazılmış olabilir; ana sayfadan, hizmetlerimizden veya kaynaklarımızdan devam edebilirsiniz."),
    }

    for name, spec in pages.items():
        path = ROOT / name
        if not path.exists():
            print("skip missing", name)
            continue
        html = path.read_text(encoding="utf-8")
        print("wire", name)
        if name == "urunler.html":
            html = wire_urunler(html)
        else:
            prefix, brand, h1, lead = spec
            # Use exact strings from file for brand/h1/lead when possible
            bm = re.search(r'page-hero__brand">(.*?)</p>', html)
            hm = re.search(r'page-hero__title">(.*?)</h1>', html)
            lm = re.search(r'page-hero__lead">(.*?)</p>', html, re.S)
            if bm and hm and lm:
                brand = bm.group(1)
                h1 = hm.group(1)
                lead = lm.group(1).strip()
            html = wire_simple_hero(html, prefix, brand, h1, lead)
            if name == "404.html":
                html = html.replace(
                    'class="btn-primary">Ana sayfaya dön</a>',
                    'class="btn-primary" data-i18n="err404.home">Ana sayfaya dön</a>',
                )
                html = html.replace(
                    'class="btn-primary">Ana Sayfa</a>',
                    'class="btn-primary" data-i18n="err404.home">Ana sayfaya dön</a>',
                )
        # bump locale script versions
        html = re.sub(r"js/locales\.js\?v=\d+", "js/locales.js?v=202607173", html)
        html = re.sub(r"js/i18n\.js\?v=\d+", "js/i18n.js?v=202607173", html)
        path.write_text(html, encoding="utf-8", newline="\n")

    # bump index too
    idx = ROOT / "index.html"
    t = idx.read_text(encoding="utf-8")
    t = re.sub(r"js/locales\.js\?v=\d+", "js/locales.js?v=202607173", t)
    t = re.sub(r"js/i18n\.js\?v=\d+", "js/i18n.js?v=202607173", t)
    idx.write_text(t, encoding="utf-8", newline="\n")
    print("done")


if __name__ == "__main__":
    main()
