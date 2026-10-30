import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'sw';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.music': 'Music',
    'nav.videos': 'Videos',
    'nav.team': 'Team',
    'nav.news': 'News',
    'nav.contact': 'Contact',
    'nav.book': 'Book a Session',
    'nav.portal': 'Client Portal',
    'nav.admin': 'Admin Dashboard',
    'nav.login': 'Sign In',

    // Hero
    'hero.badge': 'International Music Label & Studio • Tanga, Tanzania',
    'hero.title': 'COLLS RECORDS',
    'hero.subtitle': 'Music Production · Video Production · Film Production · Documentary',
    'hero.tagline': 'Crafting the definitive sound of East Africa with Grammy-standard acoustic precision, state-of-the-art studio facilities, and global music distribution.',
    'hero.cta.book': 'Book Studio Session',
    'hero.cta.listen': 'Listen to Music',
    'hero.cta.whatsapp': 'Talk to Producers',
    'hero.stats.songs': 'Songs Produced',
    'hero.stats.artists': 'Artists Recorded',
    'hero.stats.years': 'Years Experience',
    'hero.stats.projects': 'Media Projects',

    // Sections
    'section.releases.title': 'Latest Releases',
    'section.releases.subtitle': 'Fresh master recordings produced directly at Colls Records studios in Tanga.',
    'section.releases.listen': 'Play Track',
    'section.releases.viewall': 'Explore Full Catalogue',
    
    'section.services.title': 'Studio & Creative Services',
    'section.services.subtitle': 'End-to-end production capabilities covering every phase from beat composition to worldwide streaming.',
    'section.services.request': 'Request Service',
    
    'section.video.title': 'Featured Brand Showcase',
    'section.video.subtitle': 'Watch our studio visualizer and discover what sets Colls Records apart.',
    'section.video.youtube': 'Subscribe on YouTube',
    
    'section.producers.title': 'Talk to Our Producers',
    'section.producers.subtitle': 'Connect directly with our Chief Producer and Assistant Producer on WhatsApp to book sessions or review beats.',
    'section.producers.chief': 'Chief Producer',
    'section.producers.assistant': 'Assistant Producer',
    'section.producers.chat': 'Chat on WhatsApp',
    
    'section.pricing.title': 'Studio Rates & Packages',
    'section.pricing.subtitle': 'Transparent, competitive pricing in Tanzanian Shillings (TZS) tailored for emerging and established artists.',
    'section.pricing.disclaimer': 'Prices are indicative and may vary by project scope; contact us for custom enterprise packages.',
    'section.pricing.book': 'Book This Package',

    'section.team.title': 'The Creative Vanguard',
    'section.team.subtitle': 'Meet the executives, hit producers, digital creators, and vocalists driving Colls Records.',

    // Common
    'footer.credit': 'Designed & Developed by Iyan Eman Juma',
    'footer.location': 'Tanga, Tanzania',
    'footer.rights': 'All rights reserved.',
    'ticker.live': 'LIVE'
  },
  sw: {
    // Nav
    'nav.home': 'Nyumbani',
    'nav.about': 'Kuhusu Sisi',
    'nav.services': 'Huduma Zetu',
    'nav.pricing': 'Gharama / Bei',
    'nav.music': 'Muziki',
    'nav.videos': 'Video',
    'nav.team': 'Timu Yetu',
    'nav.news': 'Habari',
    'nav.contact': 'Wasiliana Nasi',
    'nav.book': 'Weka Miadi / Book',
    'nav.portal': 'Mlango wa Wateja',
    'nav.admin': 'Dashibodi ya Usimamizi',
    'nav.login': 'Ingia / Jisajili',

    // Hero
    'hero.badge': 'Lebo ya Muziki ya Kimataifa & Studio • Tanga, Tanzania',
    'hero.title': 'COLLS RECORDS',
    'hero.subtitle': 'Utengenezaji wa Muziki · Video · Filamu · Makala Maalum',
    'hero.tagline': 'Kutengeneza na kusambaza sauti bora zaidi za Afrika Mashariki kwa viwango vya kimataifa, studio ya kisasa, na usambazaji duniani kote.',
    'hero.cta.book': 'Weka Nafasi Studio',
    'hero.cta.listen': 'Sikiliza Muziki Wetu',
    'hero.cta.whatsapp': 'Ongea na Maprodyuza',
    'hero.stats.songs': 'Nyimbo Zilizotengenezwa',
    'hero.stats.artists': 'Wasanii Waliorikodi',
    'hero.stats.years': 'Miaka ya Uzoefu',
    'hero.stats.projects': 'Miradi ya Video & Picha',

    // Sections
    'section.releases.title': 'Nyimbo Mpya Zilizoachiwa',
    'section.releases.subtitle': 'Kazi mpya zilizotayarishwa na kukamilishwa studio za Colls Records, Tanga.',
    'section.releases.listen': 'Sikiliza Wimbo',
    'section.releases.viewall': 'Tazama Nyimbo Zote',
    
    'section.services.title': 'Huduma za Studio na Ubunifu',
    'section.services.subtitle': 'Uwezo kamili wa utayarishaji kuanzia kutunga mdundo, kurekodi, mixing, mastering hadi usambazaji.',
    'section.services.request': 'Agiza Huduma Hii',
    
    'section.video.title': 'Video Maalum ya Studio',
    'section.video.subtitle': 'Tazama muonekano wa kazi zetu za studio na utambue ubora unaotofautisha Colls Records.',
    'section.video.youtube': 'Jiunge Nasi YouTube',
    
    'section.producers.title': 'Ongea Moja kwa Moja na Maprodyuza Wetu',
    'section.producers.subtitle': 'Wasiliana moja kwa moja na Prodyuza Mkuu na Prodyuza Msaidizi kupitia WhatsApp kwa booking au midundo mipya.',
    'section.producers.chief': 'Prodyuza Mkuu',
    'section.producers.assistant': 'Prodyuza Msaidizi',
    'section.producers.chat': 'Wasiliana WhatsApp',
    
    'section.pricing.title': 'Vifurushi na Bei za Studio',
    'section.pricing.subtitle': 'Bei wazi katika Shilingi za Kitanzania (TZS) zinazowafaa wasanii wachanga na wenye uzoefu.',
    'section.pricing.disclaimer': 'Bei hizi ni makadirio ya kuanzia na zinaweza kubadilika kulingana na ukubwa wa mradi wako; wasiliana nasi kwa makubaliano maalum.',
    'section.pricing.book': 'Chagua Kifurushi Hiki',

    'section.team.title': 'Viongozi na Timu ya Ubunifu',
    'section.team.subtitle': 'Kutana na viongozi, watengeneza hit, wataalamu wa kidijitali na wasanii wanaounda Colls Records.',

    // Common
    'footer.credit': 'Imebuniwa na Kutengenezwa na Iyan Eman Juma',
    'footer.location': 'Tanga, Tanzania',
    'footer.rights': 'Haki zote zimehifadhiwa.',
    'ticker.live': 'MUBASHARA'
  }
};

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('colls_records_lang') as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('colls_records_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
