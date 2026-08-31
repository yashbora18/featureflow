import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import hi from "./locales/hi/translation.json";
import mr from "./locales/mr/translation.json";
import gu from "./locales/gu/translation.json";
import bn from "./locales/bn/translation.json";
import ta from "./locales/ta/translation.json";
import te from "./locales/te/translation.json";
import kn from "./locales/kn/translation.json";
import ml from "./locales/ml/translation.json";
import pa from "./locales/pa/translation.json";
import or from "./locales/or/translation.json";
import as from "./locales/as/translation.json";
import ur from "./locales/ur/translation.json";

import es from "./locales/es/translation.json";
import fr from "./locales/fr/translation.json";
import de from "./locales/de/translation.json";
import it from "./locales/it/translation.json";
import pt from "./locales/pt/translation.json";
import ja from "./locales/ja/translation.json";
import ko from "./locales/ko/translation.json";
import zh from "./locales/zh/translation.json";
import ar from "./locales/ar/translation.json";

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  gu: { translation: gu },
  bn: { translation: bn },
  ta: { translation: ta },
  te: { translation: te },
  kn: { translation: kn },
  ml: { translation: ml },
  pa: { translation: pa },
  or: { translation: or },
  as: { translation: as },
  ur: { translation: ur },

  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
  pt: { translation: pt },
  ja: { translation: ja },
  ko: { translation: ko },
  zh: { translation: zh },
  ar: { translation: ar },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: "en",

    supportedLngs: Object.keys(resources),

    detection: {
      order: [
        "localStorage",
        "navigator",
      ],
      caches: [
        "localStorage",
      ],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
