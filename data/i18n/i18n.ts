import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import resources from './lang.json'

i18n
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: resources,
    fallbackLng: "row",
    debug: false,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false
    }
  })

export default i18n;
