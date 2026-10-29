import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'Expert Contracts: project management and contracts consultancy in Riyadh, Saudi Arabia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#0B1110',
          color: '#ECEFEA',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, color: '#93A099' }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: '#3DB75A' }} />
          Expert Contracts
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>Projects that stay on contract.</div>
          <div style={{ fontSize: 34, color: '#93A099', maxWidth: 900 }}>
            Project management consultancy, FIDIC contracts and claims expertise. Riyadh, Saudi Arabia.
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#3DB75A' }}>expertcontracts.ca</div>
      </div>
    ),
    size,
  );
}
