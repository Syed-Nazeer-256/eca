import { IBM_Plex_Sans_Arabic, Noto_Kufi_Arabic } from 'next/font/google';

// Arabic faces, loaded only by the Arabic layout. Arabic subset only: Latin characters
// in Arabic pages (FIDIC, PMC, phone numbers) keep using the Latin faces listed first.
export const arDisplay = Noto_Kufi_Arabic({ subsets: ['arabic'], variable: '--font-ar-display', display: 'swap' });
export const arBody = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '500', '600', '700'], variable: '--font-ar-body', display: 'swap' });

export const arabicFontVars = `${arDisplay.variable} ${arBody.variable}`;
