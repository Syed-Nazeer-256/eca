import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google';

export const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap', axes: ['opsz'] });
export const body = Geist({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
export const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const latinFontVars = `${display.variable} ${body.variable} ${mono.variable}`;
