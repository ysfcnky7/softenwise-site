# -*- coding: utf-8 -*-
"""Wire data-i18n on index.html + inject scripts/CSS hooks on all pages."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# CEO Turkish defaults already in HTML text; we add data-i18n keys

def patch_index() -> None:
    path = ROOT / "index.html"
    t = path.read_text(encoding="utf-8")

    t = t.replace(
        '<body class="page-home">',
        '<body class="page-home" data-i18n-title="meta.title" data-i18n-desc="meta.desc">',
    )
    t = t.replace(
        '<a class="skip-link" href="#main">İçeriğe atla</a>',
        '<a class="skip-link" href="#main" data-i18n="skip">İçeriğe atla</a>',
    )
    t = t.replace(
        'aria-label="SoftenWise ana sayfa"',
        'aria-label="SoftenWise ana sayfa" data-i18n-attr="aria-label:logo.home"',
        1,
    )
    t = t.replace(
        'aria-label="Ana menü"',
        'aria-label="Ana menü" data-i18n-attr="aria-label:nav.aria"',
        1,
    )

    # Nav main links
    replacements = [
        ('>Hizmetler</a>\n          <button class="nav-parent-toggle"',
         ' data-i18n="nav.services">Hizmetler</a>\n          <button class="nav-parent-toggle"'),
        ('aria-label="Hizmetler alt menüsünü aç/kapat"',
         'aria-label="Hizmetler alt menüsünü aç/kapat" data-i18n-attr="aria-label:nav.services.toggle"'),
        ('<span class="nav-dd-title">Özel Yazılım Geliştirme</span>',
         '<span class="nav-dd-title" data-i18n="nav.custom">Özel Yazılım Geliştirme</span>'),
        ('<span class="nav-dd-desc">Kuruma özel ürün ve platform geliştirme</span>',
         '<span class="nav-dd-desc" data-i18n="nav.custom.desc">Kuruma özel ürün ve platform geliştirme</span>'),
        ('<span class="nav-dd-title">Mobil Geliştirme</span>',
         '<span class="nav-dd-title" data-i18n="nav.mobile">Mobil Geliştirme</span>', 1),
        ('<span class="nav-dd-desc">Native ve hybrid mobil uygulama çözümleri</span>',
         '<span class="nav-dd-desc" data-i18n="nav.mobile.desc">Native ve hybrid mobil uygulama çözümleri</span>'),
        ('<span class="nav-dd-title">Entegrasyon & Otomasyon</span>',
         '<span class="nav-dd-title" data-i18n="nav.integ">Entegrasyon ve Otomasyon</span>'),
        ('<span class="nav-dd-desc">Sistemler arası veri akışı ve süreç otomasyonu</span>',
         '<span class="nav-dd-desc" data-i18n="nav.integ.desc">Sistemler arası veri akışı ve süreç otomasyonu</span>'),
        ('<span class="nav-dd-title">Güvenlik & Denetim</span>',
         '<span class="nav-dd-title" data-i18n="nav.sec">Güvenlik ve Denetim</span>'),
        ('<span class="nav-dd-desc">Risk analizi, uyum ve güvenlik değerlendirmesi</span>',
         '<span class="nav-dd-desc" data-i18n="nav.sec.desc">Risk analizi, uyum ve güvenlik değerlendirmesi</span>'),
        ('<span class="nav-dd-title">Teknik Danışmanlık</span>',
         '<span class="nav-dd-title" data-i18n="nav.consult">Teknik Danışmanlık</span>'),
        ('<span class="nav-dd-desc">Mimari karar, ölçeklenme ve yol haritası</span>',
         '<span class="nav-dd-desc" data-i18n="nav.consult.desc">Mimari karar, ölçeklenme ve yol haritası</span>'),
        ('href="urunler.html">Ürünler</a>',
         'href="urunler.html" data-i18n="nav.products">Ürünler</a>'),
        ('href="kaynaklar.html">Şirket</a>',
         'href="kaynaklar.html" data-i18n="nav.company">Şirket</a>'),
        ('aria-label="Şirket alt menüsünü aç/kapat"',
         'aria-label="Şirket alt menüsünü aç/kapat" data-i18n-attr="aria-label:nav.company.toggle"'),
        ('<span class="nav-dd-title">Academy</span>',
         '<span class="nav-dd-title" data-i18n="nav.academy">Academy</span>'),
        ('<span class="nav-dd-desc">Eğitim ve gelişim programları</span>',
         '<span class="nav-dd-desc" data-i18n="nav.academy.desc">Eğitim ve gelişim programları</span>'),
        ('<span class="nav-dd-title">Kariyer</span>',
         '<span class="nav-dd-title" data-i18n="nav.career">Kariyer</span>'),
        ('<span class="nav-dd-desc">Açık roller ve ekibe katılım</span>',
         '<span class="nav-dd-desc" data-i18n="nav.career.desc">Açık pozisyonlar ve ekibe katılım</span>'),
        ('<span class="nav-dd-title">Fikir Ortaklığı</span>',
         '<span class="nav-dd-title" data-i18n="nav.partner">Fikir Ortaklığı</span>'),
        ('<span class="nav-dd-desc">Girişim ve melek yatırım hattı</span>',
         '<span class="nav-dd-desc" data-i18n="nav.partner.desc">Girişim ve yatırım iş birliği</span>'),
        ('<span class="nav-dd-title">Kaynaklar</span>',
         '<span class="nav-dd-title" data-i18n="nav.resources">Kaynaklar</span>'),
        ('<span class="nav-dd-desc">Rehberler ve içerikler</span>',
         '<span class="nav-dd-desc" data-i18n="nav.resources.desc">Rehberler ve içerikler</span>'),
        ('href="#references">Referanslar</a>',
         'href="#references" data-i18n="nav.refs">Referanslar</a>'),
        ('href="#contact">İletişim</a>',
         'href="#contact" data-i18n="nav.contact">İletişim</a>'),
        ('<p class="nav-mobile-footer-label">Hızlı iletişim</p>',
         '<p class="nav-mobile-footer-label" data-i18n="nav.quick">Hızlı iletişim</p>'),
        ('aria-label="Telefonla ara">Telefonla ara</a>',
         'aria-label="Telefonla ara" data-i18n="nav.call" data-i18n-attr="aria-label:nav.call">Telefonla ara</a>'),
        ('aria-label="Menüyü aç/kapat"',
         'aria-label="Menüyü aç/kapat" data-i18n-attr="aria-label:nav.menu"'),
    ]
    for item in replacements:
        if len(item) == 3:
            old, new, count = item
            t = t.replace(old, new, count)
        else:
            old, new = item
            if old not in t:
                print("WARN missing:", old[:60])
            t = t.replace(old, new, 1)

    # Hero CEO copy
    hero_old = """          <p class="hero-brand">SoftenWise</p>
          <h1>Yazılımı teslim ederiz. Sistemi büyütürüz.</h1>
          <p>
            Özel yazılım, mobil, entegrasyon ve güvenlik —
            kapsam net, süreç şeffaf, canlı sonrası destek dahil.
          </p>
          <div class="hero-actions">
            <a href="#contact" class="btn-primary">15 dk görüşme ayarla</a>
            <a href="#solutions" class="btn-ghost">Ne yapıyoruz?</a>
          </div>"""
    hero_new = """          <p class="hero-brand">SoftenWise</p>
          <h1 data-i18n="home.hero.h1">Kurumsal yazılım sistemleri tasarlıyor ve hayata geçiriyoruz.</h1>
          <p data-i18n="home.hero.p">
            Özel yazılım, mobil uygulama, entegrasyon ve güvenlik alanlarında net kapsam, şeffaf süreç ve canlı sonrası destek sunuyoruz.
          </p>
          <div class="hero-actions">
            <a href="#contact" class="btn-primary" data-i18n="home.hero.cta">Görüşme planlayın</a>
            <a href="#solutions" class="btn-ghost" data-i18n="home.hero.ghost">Hizmetlerimiz</a>
          </div>"""
    if hero_old not in t:
        raise SystemExit("hero block not found")
    t = t.replace(hero_old, hero_new)

    # Rest of homepage sections — batch replace key strings
    section_map = [
        ('<p class="logo-strip__label">Seçilmiş referanslar</p>',
         '<p class="logo-strip__label" data-i18n="home.refs.label">Seçilmiş referanslar</p>'),
        ('<span class="section-kicker reveal">Hizmetler</span>\n          <h2 class="reveal">Beş hatta net teslim</h2>\n          <p class="section-desc reveal">Her işte kapsam, takvim ve ölçülebilir çıktıyı baştan kilitleriz.</p>',
         '<span class="section-kicker reveal" data-i18n="home.svc.kicker">Hizmetler</span>\n          <h2 class="reveal" data-i18n="home.svc.h2">Sunduğumuz hizmetler</h2>\n          <p class="section-desc reveal" data-i18n="home.svc.desc">Her projede kapsam, zaman planı ve teslim kriterlerini baştan tanımlıyoruz.</p>'),
        ('<span class="service-index__title">Özel Yazılım Geliştirme</span>\n              <span class="service-index__desc">Platform, SaaS ve B2B sistemler — işinizle birlikte büyüyen modüler mimari.</span>',
         '<span class="service-index__title" data-i18n="home.svc.custom">Özel Yazılım Geliştirme</span>\n              <span class="service-index__desc" data-i18n="home.svc.custom.desc">Platform, SaaS ve B2B sistemler — işinizle birlikte büyüyen modüler mimari.</span>'),
        ('<span class="service-index__title">Mobil Geliştirme</span>\n              <span class="service-index__desc">iOS ve Android için native / hybrid uygulamalar.</span>',
         '<span class="service-index__title" data-i18n="home.svc.mobile">Mobil Geliştirme</span>\n              <span class="service-index__desc" data-i18n="home.svc.mobile.desc">iOS ve Android için native ve hybrid uygulamalar.</span>'),
        ('<span class="service-index__title">Entegrasyon & Otomasyon</span>\n              <span class="service-index__desc">ERP, CRM, ödeme ve lojistik sistemleri arasında veri akışı.</span>',
         '<span class="service-index__title" data-i18n="home.svc.integ">Entegrasyon ve Otomasyon</span>\n              <span class="service-index__desc" data-i18n="home.svc.integ.desc">ERP, CRM, ödeme ve lojistik sistemleri arasında güvenilir veri akışı.</span>'),
        ('<span class="service-index__title">Güvenlik & Denetim</span>\n              <span class="service-index__desc">Risk analizi, uyum ve teknik güvenlik değerlendirmesi.</span>',
         '<span class="service-index__title" data-i18n="home.svc.sec">Güvenlik ve Denetim</span>\n              <span class="service-index__desc" data-i18n="home.svc.sec.desc">Risk analizi, uyumluluk ve teknik güvenlik değerlendirmesi.</span>'),
        ('<span class="service-index__title">Teknik Danışmanlık</span>\n              <span class="service-index__desc">Mimari karar, ölçeklenme ve teknoloji yol haritası.</span>',
         '<span class="service-index__title" data-i18n="home.svc.consult">Teknik Danışmanlık</span>\n              <span class="service-index__desc" data-i18n="home.svc.consult.desc">Mimari kararlar, ölçeklenme ve teknoloji yol haritası.</span>'),
        ('<span class="section-kicker reveal">Seçilmiş iş</span>\n          <h2 class="reveal">İsim koyduğumuz işler</h2>\n          <p class="section-desc reveal">Ürünlerimiz ve referanslarımız — NDA’daki projeler kapalı kalır.</p>',
         '<span class="section-kicker reveal" data-i18n="home.case.kicker">Projeler</span>\n          <h2 class="reveal" data-i18n="home.case.h2">Seçilmiş çalışmalar</h2>\n          <p class="section-desc reveal" data-i18n="home.case.desc">Ürün portföyümüz ve referanslarımız. Gizlilik sözleşmesi kapsamındaki projeler paylaşılmaz.</p>'),
        ('<p class="case-feature__sector">Ürün · SoftenWise Clinic</p>\n            <h3 class="case-feature__title">Klinik operasyonu tek panelde</h3>',
         '<p class="case-feature__sector" data-i18n="home.case.sector">Ürün · SoftenWise Clinic</p>\n            <h3 class="case-feature__title" data-i18n="home.case.title">Klinik operasyonunu tek panelde yönetin</h3>'),
    ]
    for old, new in section_map:
        if old not in t:
            print("WARN section:", old[:70].replace("\n", " "))
        else:
            t = t.replace(old, new, 1)

    # Case summary + cols
    case_bits = [
        (
            """            <p class="case-feature__summary">
              Randevu, hasta takibi, finans ve çok dilli operasyonu SoftenWise Clinic’te birleştirdik;
              referanslarımız arasında Dest Clinic yer alıyor.
            </p>""",
            """            <p class="case-feature__summary" data-i18n="home.case.summary">
              Randevu, hasta takibi, finans ve çok dilli operasyonu SoftenWise Clinic üzerinde birleştirdik. Referanslarımız arasında Dest Clinic yer almaktadır.
            </p>""",
        ),
        (
            """                <strong>Sorun</strong>
                <p>Şube ve finans süreçleri dağınık araçlarda; yönetim görünürlüğü zayıftı.</p>""",
            """                <strong data-i18n="home.case.problem">Sorun</strong>
                <p data-i18n="home.case.problem.p">Şube ve finans süreçleri dağınık araçlarda ilerliyordu; yönetim görünürlüğü sınırlıydı.</p>""",
        ),
        (
            """                <strong>Çözüm</strong>
                <p>Rol bazlı web panel, audit log, çok dil ve şube görünürlüğü.</p>""",
            """                <strong data-i18n="home.case.solution">Çözüm</strong>
                <p data-i18n="home.case.solution.p">Rol bazlı web paneli, denetim kaydı, çok dil desteği ve şube görünürlüğü.</p>""",
        ),
        (
            """                <strong>Etki</strong>
                <p>Operasyon tek ekrandan; 15 gün denemeden canlıya net yol.</p>""",
            """                <strong data-i18n="home.case.impact">Sonuç</strong>
                <p data-i18n="home.case.impact.p">Operasyon tek ekrandan yönetilir; deneme sürecinden canlıya net bir geçiş yolu.</p>""",
        ),
        (
            """Clinic’i incele</a></p>""",
            """Clinic ürününü inceleyin</a></p>""".replace(
                "Clinic ürününü inceleyin</a></p>",
                '<span data-i18n="home.case.cta">Clinic ürününü inceleyin</span></a></p>',
            ),
        ),
    ]
    # Fix last replacement properly
    case_bits[-1] = (
        'class="btn-ghost">Clinic’i incele</a></p>',
        'class="btn-ghost"><span data-i18n="home.case.cta">Clinic ürününü inceleyin</span></a></p>',
    )
    for old, new in case_bits:
        if old not in t:
            print("WARN case:", old[:60].replace("\n", " "))
        else:
            t = t.replace(old, new, 1)

    more_map = [
        ("<span>Otomini — ikinci el değerleme &amp; galeri</span>\n              <span>SoftenWise ürünü</span>",
         '<span data-i18n="home.case.otomini">Otomini — ikinci el değerleme ve galeri</span>\n              <span data-i18n="home.case.otomini.meta">SoftenWise ürünü</span>'),
        ("<span>SoftenWise Maps — saha CBS / harita API</span>\n              <span>Kurumsal ürün</span>",
         '<span data-i18n="home.case.maps">SoftenWise Maps — saha CBS ve harita API</span>\n              <span data-i18n="home.case.maps.meta">Kurumsal ürün</span>'),
        ("<span>Point Croissant · Sharingo · Aytu · Jenesis</span>\n              <span>Referanslar</span>",
         '<span data-i18n="home.case.refs">Point Croissant · Sharingo · Aytu · Jenesis</span>\n              <span data-i18n="home.case.refs.meta">Referanslar</span>'),
        ('class="btn-primary">Projeni konuşalım</a></p>',
         'class="btn-primary" data-i18n="home.case.talk">Projenizi konuşalım</a></p>'),
        ('<span class="section-kicker reveal">Ürünler</span>\n          <h2 class="reveal">Kendi ürünlerimiz</h2>\n          <p class="section-desc reveal">Klinik, harita ve otomotiv — canlıda çalışan SoftenWise hatları.</p>',
         '<span class="section-kicker reveal" data-i18n="home.prod.kicker">Ürünler</span>\n          <h2 class="reveal" data-i18n="home.prod.h2">SoftenWise ürünleri</h2>\n          <p class="section-desc reveal" data-i18n="home.prod.desc">Klinik yönetimi, harita operasyonu ve otomotiv çözümleri — canlıda kullanılan ürün hatlarımız.</p>'),
        ("<span>Klinik ve sağlık operasyonları için dijital platform.</span>",
         '<span data-i18n="home.prod.clinic">Klinik ve sağlık operasyonları için dijital platform.</span>'),
        ("<span>Konum ve harita tabanlı operasyon araçları.</span>",
         '<span data-i18n="home.prod.maps">Konum ve harita tabanlı operasyon araçları.</span>'),
        ("<span>Otomotiv ve filo süreçleri için dijital çözümler.</span>",
         '<span data-i18n="home.prod.otomini">Otomotiv ve filo süreçleri için dijital çözümler.</span>'),
        ('class="btn-ghost">Tüm ürünleri incele</a></p>',
         'class="btn-ghost" data-i18n="home.prod.more">Tüm ürünleri inceleyin</a></p>'),
        ('<span class="section-kicker">Rehberler</span>',
         '<span class="section-kicker" data-i18n="home.res.kicker">Rehberler</span>'),
        (">Yazılım firması nasıl seçilir?</a>",
         ' data-i18n="home.res.firm">Yazılım firması nasıl seçilir?</a>'),
        (">Özel yazılım maliyeti</a>",
         ' data-i18n="home.res.cost">Özel yazılım maliyeti</a>'),
        (">Mobil uygulama süreci</a>",
         ' data-i18n="home.res.mobile">Mobil uygulama süreci</a>'),
        (">Tüm kaynaklar →</a>",
         ' data-i18n="home.res.all">Tüm kaynaklar →</a>'),
        (
            """        <h2>15 dakikada netleştirelim</h2>
        <p>
          Risk, kapsam ve bir sonraki adım — bağlayıcı değil, net bir çıkış.
        </p>""",
            """        <h2 data-i18n="home.contact.h2">Projenizi birlikte değerlendirelim</h2>
        <p data-i18n="home.contact.p">
          Kapsam, zaman planı ve bir sonraki adımı netleştirmek için kısa bir teknik görüşme planlayabilirsiniz.
        </p>""",
        ),
        ('placeholder="Ad Soyad"',
         'placeholder="Ad Soyad" data-i18n-attr="placeholder:home.contact.name"'),
        ('placeholder="E-posta"',
         'placeholder="E-posta" data-i18n-attr="placeholder:home.contact.email"'),
        ('placeholder="Ne üzerinde çalışıyorsunuz?"',
         'placeholder="Projeniz hakkında kısa bir özet" data-i18n-attr="placeholder:home.contact.message"'),
        (">Görüşme iste</button>",
         ' data-i18n="home.contact.submit">Görüşme talebi gönder</button>'),
        (
            """            Talebinizi aldık. En kısa sürede dönüyoruz.""",
            """            <span data-i18n="home.contact.success">Talebinizi aldık. En kısa sürede dönüş yapacağız.</span>""",
        ),
        (
            """        <p class="footer-desc">
          SoftenWise — kurumlara ve girişimlere ölçeklenebilir yazılım, güvenlik ve teknik danışmanlık.
        </p>""",
            """        <p class="footer-desc" data-i18n="footer.desc">
          SoftenWise — kurumlara ve girişimlere ölçeklenebilir yazılım, güvenlik ve teknik danışmanlık.
        </p>""",
        ),
        ('<div class="footer-title">Hizmetler</div>',
         '<div class="footer-title" data-i18n="footer.services">Hizmetler</div>'),
        ('href="ozel-yazilim.html">Özel Yazılım</a>',
         'href="ozel-yazilim.html" data-i18n="footer.custom">Özel Yazılım</a>'),
        ('href="mobil-gelistirme.html">Mobil Geliştirme</a>',
         'href="mobil-gelistirme.html" data-i18n="footer.mobile">Mobil Geliştirme</a>', 1),
        ('href="entegrasyon-otomasyon.html">Entegrasyon & Otomasyon</a>',
         'href="entegrasyon-otomasyon.html" data-i18n="footer.integ">Entegrasyon ve Otomasyon</a>'),
        ('href="guvenlik-denetim.html">Güvenlik & Denetim</a>',
         'href="guvenlik-denetim.html" data-i18n="footer.sec">Güvenlik ve Denetim</a>'),
        ('href="teknik-danismanlik.html">Teknik Danışmanlık</a>',
         'href="teknik-danismanlik.html" data-i18n="footer.consult">Teknik Danışmanlık</a>'),
        ('<div class="footer-title">Şirket</div>',
         '<div class="footer-title" data-i18n="footer.company">Şirket</div>'),
        ('href="urunler.html">Ürünler</a>',
         'href="urunler.html" data-i18n="footer.products">Ürünler</a>', 1),
        ('href="academy.html">Academy</a>',
         'href="academy.html" data-i18n="footer.academy">Academy</a>'),
        ('href="kariyer.html">Kariyer</a>',
         'href="kariyer.html" data-i18n="footer.career">Kariyer</a>'),
        ('href="girisim-ortakligi.html">Fikir Ortaklığı</a>',
         'href="girisim-ortakligi.html" data-i18n="footer.partner">Fikir Ortaklığı</a>'),
        ('href="kaynaklar.html">Kaynaklar</a>',
         'href="kaynaklar.html" data-i18n="footer.resources">Kaynaklar</a>', 1),
        ('href="index.html#references">Referanslar</a>',
         'href="index.html#references" data-i18n="footer.refs">Referanslar</a>'),
        ('<div class="footer-title">İletişim</div>',
         '<div class="footer-title" data-i18n="footer.contact">İletişim</div>'),
        ('<div class="footer-title">Sosyal</div>',
         '<div class="footer-title" data-i18n="footer.social">Sosyal</div>'),
        ("© 2022–2026 SoftenWise · Tüm hakları saklıdır",
         '<span data-i18n="footer.copy">© 2022–2026 SoftenWise · Tüm hakları saklıdır</span>'),
        ('aria-label="Hızlı iletişim"',
         'aria-label="Hızlı iletişim" data-i18n-attr="aria-label:quick.aria"'),
        ('aria-label="WhatsApp ile yazın"',
         'aria-label="WhatsApp ile yazın" data-i18n-attr="aria-label:quick.wa"'),
        ('aria-label="Telefonla ara"',
         'aria-label="Telefonla ara" data-i18n-attr="aria-label:quick.call"', 1),
    ]
    for item in more_map:
        if len(item) == 3:
            old, new, n = item
            if old not in t:
                print("WARN more:", old[:50])
            else:
                t = t.replace(old, new, n)
        else:
            old, new = item
            if old not in t:
                print("WARN more:", old[:50].replace("\n", " "))
            else:
                t = t.replace(old, new, 1)

    # Scripts
    if "js/locales.js" not in t:
        t = t.replace(
            '<script src="js/main.js',
            '<script src="js/locales.js?v=202607170"></script>\n  <script src="js/i18n.js?v=202607170"></script>\n  <script src="js/main.js',
        )

    # Title/desc defaults
    t = t.replace(
        "<title>SoftenWise | Ölçeklenebilir Yazılım Sistemleri</title>",
        "<title>SoftenWise | Kurumsal Yazılım Sistemleri</title>",
    )
    t = re.sub(
        r'<meta name="description"\s+content="[^"]*"',
        '<meta name="description"\n    content="SoftenWise; kurumlar ve girişimler için özel yazılım, mobil uygulama, entegrasyon, güvenlik ve teknik danışmanlık sunan bir mühendislik şirketidir."',
        t,
        count=1,
    )

    # hreflang for 11 langs
    if 'hreflang="en"' not in t:
        alts = "\n".join(
            f'  <link rel="alternate" hreflang="{c}" href="https://softenwise.com/?lang={c}" />'
            for c in ["tr", "en", "de", "fr", "ar", "ru", "es", "it", "nl", "pt", "az"]
        )
        t = t.replace(
            '  <link rel="alternate" hreflang="tr" href="https://softenwise.com/" />\n  <link rel="alternate" hreflang="x-default" href="https://softenwise.com/" />',
            alts + '\n  <link rel="alternate" hreflang="x-default" href="https://softenwise.com/" />',
        )

    path.write_text(t, encoding="utf-8", newline="\n")
    print("patched index.html")


def inject_scripts_all() -> None:
    for path in ROOT.glob("*.html"):
        if path.name == "index.html":
            continue
        t = path.read_text(encoding="utf-8")
        if "js/locales.js" in t:
            continue
        if 'src="js/main.js' not in t:
            continue
        t = t.replace(
            '<script src="js/main.js',
            '<script src="js/locales.js?v=202607170"></script>\n  <script src="js/i18n.js?v=202607170"></script>\n  <script src="js/main.js',
        )
        path.write_text(t, encoding="utf-8", newline="\n")
        print("scripts:", path.name)


if __name__ == "__main__":
    patch_index()
    inject_scripts_all()
