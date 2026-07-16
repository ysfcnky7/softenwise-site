# -*- coding: utf-8 -*-
"""Wire remaining Turkish attributes (placeholder/aria/alt) for all 11 languages."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ROOT / "js" / "locales.js"

# Turkish source -> translations
ATTRS = {
    "Hizmetler alt menü": {
        "en": "Services submenu",
        "de": "Untermenü Leistungen",
        "fr": "Sous-menu Services",
        "ar": "القائمة الفرعية للخدمات",
        "ru": "Подменю услуг",
        "es": "Submenú de servicios",
        "it": "Sottomenu servizi",
        "nl": "Submenu Diensten",
        "pt": "Submenu Serviços",
        "az": "Xidmətlər alt menyusu",
    },
    "Şirket alt menü": {
        "en": "Company submenu",
        "de": "Untermenü Unternehmen",
        "fr": "Sous-menu Entreprise",
        "ar": "القائمة الفرعية للشركة",
        "ru": "Подменю компании",
        "es": "Submenú de empresa",
        "it": "Sottomenu azienda",
        "nl": "Submenu Bedrijf",
        "pt": "Submenu Empresa",
        "az": "Şirkət alt menyusu",
    },
    "Hızlı iletişim": {
        "en": "Quick contact",
        "de": "Schneller Kontakt",
        "fr": "Contact rapide",
        "ar": "تواصل سريع",
        "ru": "Быстрый контакт",
        "es": "Contacto rápido",
        "it": "Contatto rapido",
        "nl": "Snel contact",
        "pt": "Contacto rápido",
        "az": "Sürətli əlaqə",
    },
    "WhatsApp ile yazın": {
        "en": "Message on WhatsApp",
        "de": "Per WhatsApp schreiben",
        "fr": "Écrire sur WhatsApp",
        "ar": "راسلنا عبر WhatsApp",
        "ru": "Написать в WhatsApp",
        "es": "Escribir por WhatsApp",
        "it": "Scrivi su WhatsApp",
        "nl": "WhatsApp-bericht",
        "pt": "Escrever no WhatsApp",
        "az": "WhatsApp ilə yazın",
    },
    "Diğer örnekler": {
        "en": "Other examples",
        "de": "Weitere Beispiele",
        "fr": "Autres exemples",
        "ar": "أمثلة أخرى",
        "ru": "Другие примеры",
        "es": "Otros ejemplos",
        "it": "Altri esempi",
        "nl": "Andere voorbeelden",
        "pt": "Outros exemplos",
        "az": "Digər nümunələr",
    },
    "Kendinizi ve hedefinizi kısaca anlatın": {
        "en": "Briefly describe yourself and your goal",
        "de": "Beschreiben Sie kurz sich und Ihr Ziel",
        "fr": "Décrivez brièvement votre profil et votre objectif",
        "ar": "صف نفسك وهدفك باختصار",
        "ru": "Кратко опишите себя и вашу цель",
        "es": "Describa brevemente su perfil y objetivo",
        "it": "Descrivi brevemente te stesso e il tuo obiettivo",
        "nl": "Beschrijf kort uzelf en uw doel",
        "pt": "Descreva brevemente o seu perfil e objetivo",
        "az": "Özünüzü və məqsədinizi qısaca yazın",
    },
    "Entegrasyon ihtiyacınızı yazın": {
        "en": "Describe your integration need",
        "de": "Beschreiben Sie Ihren Integrationsbedarf",
        "fr": "Décrivez votre besoin d’intégration",
        "ar": "اكتب احتياج التكامل لديك",
        "ru": "Опишите вашу задачу по интеграции",
        "es": "Describa su necesidad de integración",
        "it": "Descrivi la tua esigenza di integrazione",
        "nl": "Beschrijf uw integratiebehoefte",
        "pt": "Descreva a sua necessidade de integração",
        "az": "İnteqrasiya ehtiyacınızı yazın",
    },
    "Fikir / ürün adı": {
        "en": "Idea / product name",
        "de": "Idee / Produktname",
        "fr": "Nom de l’idée / du produit",
        "ar": "اسم الفكرة / المنتج",
        "ru": "Название идеи / продукта",
        "es": "Nombre de la idea / producto",
        "it": "Nome idea / prodotto",
        "nl": "Idee- / productnaam",
        "pt": "Nome da ideia / produto",
        "az": "İdea / məhsul adı",
    },
    "Problemi, çözümü ve hedef kitlenizi yazın": {
        "en": "Describe the problem, solution, and target audience",
        "de": "Beschreiben Sie Problem, Lösung und Zielgruppe",
        "fr": "Décrivez le problème, la solution et la cible",
        "ar": "اكتب المشكلة والحل والجمهور المستهدف",
        "ru": "Опишите проблему, решение и целевую аудиторию",
        "es": "Describa el problema, la solución y el público objetivo",
        "it": "Descrivi problema, soluzione e target",
        "nl": "Beschrijf probleem, oplossing en doelgroep",
        "pt": "Descreva o problema, a solução e o público-alvo",
        "az": "Problemi, həlli və hədəf auditoriyanı yazın",
    },
    "Sistem ve beklentilerinizi yazın": {
        "en": "Describe your systems and expectations",
        "de": "Beschreiben Sie Systeme und Erwartungen",
        "fr": "Décrivez vos systèmes et attentes",
        "ar": "اكتب أنظمتك وتوقعاتك",
        "ru": "Опишите системы и ожидания",
        "es": "Describa sus sistemas y expectativas",
        "it": "Descrivi sistemi e aspettative",
        "nl": "Beschrijf systemen en verwachtingen",
        "pt": "Descreva sistemas e expectativas",
        "az": "Sistem və gözləntilərinizi yazın",
    },
    "Başvurduğunuz rol": {
        "en": "Role you are applying for",
        "de": "Beworbene Rolle",
        "fr": "Poste visé",
        "ar": "الدور الذي تتقدم له",
        "ru": "Желаемая роль",
        "es": "Rol al que postula",
        "it": "Ruolo per cui ti candidi",
        "nl": "Rol waarop u solliciteert",
        "pt": "Função a que se candidata",
        "az": "Müraciət etdiyiniz rol",
    },
    "Deneyiminizi ve neden SoftenWise istediğinizi yazın": {
        "en": "Describe your experience and why SoftenWise",
        "de": "Beschreiben Sie Erfahrung und Motivation für SoftenWise",
        "fr": "Décrivez votre expérience et votre motivation SoftenWise",
        "ar": "اكتب خبرتك ولماذا SoftenWise",
        "ru": "Опишите опыт и почему SoftenWise",
        "es": "Describa su experiencia y por qué SoftenWise",
        "it": "Descrivi esperienza e motivazione SoftenWise",
        "nl": "Beschrijf ervaring en motivatie voor SoftenWise",
        "pt": "Descreva experiência e motivação SoftenWise",
        "az": "Təcrübənizi və SoftenWise seçiminizi yazın",
    },
    "Mobil projenizi kısaca anlatın": {
        "en": "Briefly describe your mobile project",
        "de": "Beschreiben Sie kurz Ihr Mobile-Projekt",
        "fr": "Décrivez brièvement votre projet mobile",
        "ar": "صف مشروعك للجوال باختصار",
        "ru": "Кратко опишите мобильный проект",
        "es": "Describa brevemente su proyecto móvil",
        "it": "Descrivi brevemente il progetto mobile",
        "nl": "Beschrijf kort uw mobiele project",
        "pt": "Descreva brevemente o projeto mobile",
        "az": "Mobil layihənizi qısaca yazın",
    },
    "Teknik ihtiyacınızı yazın": {
        "en": "Describe your technical need",
        "de": "Beschreiben Sie Ihren technischen Bedarf",
        "fr": "Décrivez votre besoin technique",
        "ar": "اكتب احتياجك التقني",
        "ru": "Опишите техническую задачу",
        "es": "Describa su necesidad técnica",
        "it": "Descrivi l’esigenza tecnica",
        "nl": "Beschrijf uw technische behoefte",
        "pt": "Descreva a necessidade técnica",
        "az": "Texniki ehtiyacınızı yazın",
    },
    "Hangi ürün / ihtiyaç?": {
        "en": "Which product / need?",
        "de": "Welches Produkt / welcher Bedarf?",
        "fr": "Quel produit / besoin ?",
        "ar": "أي منتج / احتياج؟",
        "ru": "Какой продукт / задача?",
        "es": "¿Qué producto / necesidad?",
        "it": "Quale prodotto / esigenza?",
        "nl": "Welk product / welke behoefte?",
        "pt": "Qual produto / necessidade?",
        "az": "Hansı məhsul / ehtiyac?",
    },
    "SoftenWise Clinic ürün arayüzü": {
        "en": "SoftenWise Clinic product interface",
        "de": "SoftenWise Clinic Produktoberfläche",
        "fr": "Interface produit SoftenWise Clinic",
        "ar": "واجهة منتج SoftenWise Clinic",
        "ru": "Интерфейс продукта SoftenWise Clinic",
        "es": "Interfaz del producto SoftenWise Clinic",
        "it": "Interfaccia prodotto SoftenWise Clinic",
        "nl": "SoftenWise Clinic productinterface",
        "pt": "Interface do produto SoftenWise Clinic",
        "az": "SoftenWise Clinic məhsul interfeysi",
    },
    "SoftenWise Clinic arayüz görseli": {
        "en": "SoftenWise Clinic interface image",
        "de": "SoftenWise Clinic Oberflächenbild",
        "fr": "Image d’interface SoftenWise Clinic",
        "ar": "صورة واجهة SoftenWise Clinic",
        "ru": "Изображение интерфейса SoftenWise Clinic",
        "es": "Imagen de interfaz SoftenWise Clinic",
        "it": "Immagine interfaccia SoftenWise Clinic",
        "nl": "SoftenWise Clinic interfacebeeld",
        "pt": "Imagem da interface SoftenWise Clinic",
        "az": "SoftenWise Clinic interfeys görüntüsü",
    },
    "SoftenWise Clinic arayüz ekran görüntüsü": {
        "en": "SoftenWise Clinic interface screenshot",
        "de": "SoftenWise Clinic Screenshot",
        "fr": "Capture d’écran SoftenWise Clinic",
        "ar": "لقطة شاشة SoftenWise Clinic",
        "ru": "Скриншот SoftenWise Clinic",
        "es": "Captura SoftenWise Clinic",
        "it": "Screenshot SoftenWise Clinic",
        "nl": "Screenshot SoftenWise Clinic",
        "pt": "Captura SoftenWise Clinic",
        "az": "SoftenWise Clinic ekran görüntüsü",
    },
    "Native ve hybrid mobil uygulama geliştirme görseli": {
        "en": "Native and hybrid mobile development visual",
        "de": "Visual Native- und Hybrid-Mobile-Entwicklung",
        "fr": "Visuel développement mobile native et hybride",
        "ar": "صورة تطوير تطبيقات أصلية وهجينة",
        "ru": "Визуал native и hybrid мобильной разработки",
        "es": "Visual de desarrollo móvil native e hybrid",
        "it": "Visual sviluppo mobile native e hybrid",
        "nl": "Visual native en hybrid mobiele ontwikkeling",
        "pt": "Visual de desenvolvimento mobile native e hybrid",
        "az": "Native və hybrid mobil inkişaf görseli",
    },
    "Teknik danışmanlık kapsamında mimari değerlendirme": {
        "en": "Architecture assessment within technical advisory",
        "de": "Architekturbewertung im Rahmen technischer Beratung",
        "fr": "Évaluation d’architecture dans le conseil technique",
        "ar": "تقييم معماري ضمن الاستشارات التقنية",
        "ru": "Оценка архитектуры в рамках технического консалтинга",
        "es": "Evaluación de arquitectura en asesoría técnica",
        "it": "Valutazione architetturale nella consulenza tecnica",
        "nl": "Architectuurbeoordeling binnen technisch advies",
        "pt": "Avaliação de arquitetura em consultoria técnica",
        "az": "Texniki məsləhət çərçivəsində memarlıq qiymətləndirməsi",
    },
}


def main() -> None:
    raw = LOCALES.read_text(encoding="utf-8")
    data = json.loads(raw.split("=", 1)[1].strip().rstrip(";"))
    key_map = {}
    for i, (tr, pack) in enumerate(ATTRS.items(), start=1):
        key = f"attr.{i:03d}"
        key_map[tr] = key
        data["tr"][key] = tr
        for lang, val in pack.items():
            data[lang][key] = val

    LOCALES.write_text(
        "/* SoftenWise locales — full site coverage */\n"
        f"window.SW_LOCALES = {json.dumps(data, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
        newline="\n",
    )

    attr_names = ("placeholder", "aria-label", "alt")
    total = 0
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        hits = 0
        for tr, key in sorted(key_map.items(), key=lambda x: len(x[0]), reverse=True):
            for aname in attr_names:
                # tag containing this attr value, without already mapping this key
                pat = re.compile(
                    rf'(<(?:[^>]*?\s)?)({aname}="{re.escape(tr)}")([^>]*?>)',
                )

                def repl(m: re.Match, _key=key, _aname=aname) -> str:
                    before, attr, after = m.group(1), m.group(2), m.group(3)
                    full = before + attr + after
                    if f"{_aname}:{_key}" in full or f'data-i18n-attr="{_aname}:{_key}"' in full:
                        return full
                    # merge into existing data-i18n-attr or add new
                    if "data-i18n-attr=\"" in full:
                        full2 = re.sub(
                            r'data-i18n-attr="([^"]*)"',
                            lambda mm: f'data-i18n-attr="{mm.group(1)};{_aname}:{_key}"'
                            if f"{_aname}:" not in mm.group(1)
                            else mm.group(0),
                            full,
                            count=1,
                        )
                        return full2
                    # insert before closing >
                    if full.endswith("/>"):
                        return full[:-2] + f' data-i18n-attr="{_aname}:{_key}" />'
                    return full[:-1] + f' data-i18n-attr="{_aname}:{_key}">'

                text2, n = pat.subn(repl, text)
                if n:
                    text = text2
                    hits += n
        text = re.sub(r"js/locales\.js\?v=\d+", "js/locales.js?v=202607177", text)
        text = re.sub(r"js/i18n\.js\?v=\d+", "js/i18n.js?v=202607177", text)
        path.write_text(text, encoding="utf-8", newline="\n")
        print(path.name, hits)
        total += hits
    print("TOTAL", total, "locale keys", len(data["tr"]))


if __name__ == "__main__":
    main()
