import { I18n } from 'i18n-js';

import en from './en';

const i18n = new I18n({ en });
i18n.enableFallback = true;

export default i18n;
