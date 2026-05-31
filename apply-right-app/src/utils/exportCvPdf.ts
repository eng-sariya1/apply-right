import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import type { CVData, TemplateId } from '../types/cv.types';

const esc = (s: string | undefined | null) =>
  (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const baseCss = (accent: string) => `
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; line-height: 1.5; font-size: 11pt; margin: 0; }
  h1 { font-size: 24pt; margin: 0 0 4pt; font-weight: 700; letter-spacing: -0.02em; }
  h2 { font-size: 11pt; margin: 14pt 0 6pt; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; color: ${accent}; border-bottom: 2px solid ${accent}; padding-bottom: 4pt; }
  h3 { font-size: 11pt; margin: 8pt 0 2pt; font-weight: 600; }
  p { margin: 2pt 0; }
  ul { padding-left: 18pt; margin: 4pt 0; }
  li { margin-bottom: 2pt; }
  .muted { color: #555; font-size: 9.5pt; }
  .accent { color: ${accent}; font-weight: 600; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; flex-wrap: wrap; }
  .chips { display: flex; flex-wrap: wrap; gap: 4pt 6pt; }
  .chip { background: ${accent}1A; color: ${accent}; padding: 2pt 8pt; border-radius: 4pt; font-size: 9.5pt; font-weight: 500; }
`;

function renderTemplate1(cv: CVData, accent: string): string {
  const css = baseCss(accent);
  return `<!doctype html><html><head><meta charset="utf-8"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
  <style>${css}</style></head>
  <body>
    <header>
      <h1>${esc(cv.header.fullName)}</h1>
      <div class="accent" style="font-size:13pt;margin-bottom:4pt;">${esc(cv.header.specialization)}</div>
      <div class="muted">${[cv.header.email, cv.header.phone, cv.header.address].filter(Boolean).map(esc).join(' &middot; ')}</div>
    </header>
    ${cv.abstract ? `<h2>Summary</h2><p>${esc(cv.abstract)}</p>` : ''}
    ${cv.skills.length ? `<h2>Skills</h2><div class="chips">${cv.skills.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>` : ''}
    ${cv.career.length ? `<h2>Career</h2>${cv.career.map((j) => `
      <div style="margin-bottom:12pt;">
        <div class="row" style="margin-bottom:4pt;">
          <div>
            <p><strong>Period:</strong> ${esc(j.startDate)} – ${j.isPresent ? 'Present' : esc(j.endDate || '')}</p>
            ${j.location ? `<p><strong>Location:</strong> ${esc(j.location)}</p>` : ''}
          </div>
          <div>
            <p><strong>Company:</strong> ${esc(j.companyName)}</p>
            <p><strong>Position:</strong> ${esc(j.workSpecialization)} (${esc(j.jobType)})</p>
          </div>
        </div>
        ${j.summarization ? `<p style="opacity:0.8;">${esc(j.summarization)}</p>` : ''}
        ${j.projects.length ? `<p><strong>Projects:</strong></p><ul>${j.projects.map((p) => `
          <li><strong>${esc(p.name)}</strong>
            <ul>
              <li><strong>Description:</strong> ${esc(p.description)}</li>
              <li><strong>Technologies:</strong> ${esc(p.technologies)}</li>
              ${p.keyContributions.length ? `<li><strong>Key Contributions:</strong><ul>${p.keyContributions.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></li>` : ''}
            </ul>
          </li>`).join('')}</ul>` : ''}
      </div>`).join('')}` : ''}
    ${cv.personalProjects.length ? `<h2>Personal Projects</h2><ul>${cv.personalProjects.map((p) => `
      <li><strong>${esc(p.title)}</strong>
        <ul>
          <li><strong>Description:</strong> ${esc(p.description)}</li>
          <li><strong>Technologies:</strong> ${esc(p.technologies)}</li>
          ${p.keyFeatures && p.keyFeatures.length ? `<li><strong>Key Features:</strong><ul>${p.keyFeatures.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></li>` : ''}
        </ul>
      </li>`).join('')}</ul>` : ''}
    ${cv.education ? `<h2>Education</h2><p style="white-space:pre-wrap;">${esc(cv.education)}</p>` : ''}
    ${cv.additionalInfo ? `<h2>Additional Info</h2><p style="white-space:pre-wrap;">${esc(cv.additionalInfo)}</p>` : ''}
  </body></html>`;
}

function renderTemplate2(cv: CVData, accent: string): string {
  const css = baseCss(accent) + `
    .banner { background: ${accent}; color: #fff; padding: 14pt 16pt; margin: -14mm -14mm 12pt; display: flex; align-items: center; gap: 16pt; }
    .banner h1 { color: #fff; }
    .banner .accent { color: #fff; opacity: 0.92; }
    .banner .muted { color: #fff; opacity: 0.85; }
    h2 { border-bottom: none; background: ${accent}10; padding: 4pt 8pt; border-left: 3pt solid ${accent}; }
  `;
  return `<!doctype html><html><head><meta charset="utf-8"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
  <style>${css}</style></head>
  <body>
    <div class="banner">
      <div style="flex:1">
        <h1>${esc(cv.header.fullName)}</h1>
        <div class="accent" style="font-size:13pt;">${esc(cv.header.specialization)}</div>
        <div class="muted">${[cv.header.email, cv.header.phone, cv.header.address].filter(Boolean).map(esc).join(' &middot; ')}</div>
      </div>
      ${cv.header.photoUrl ? `<img src="${cv.header.photoUrl}" style="width:72pt;height:72pt;border-radius:50%;border:2pt solid rgba(255,255,255,0.5);object-fit:cover;flex-shrink:0;" />` : ''}
    </div>
    ${cv.abstract ? `<h2>Profile</h2><p>${esc(cv.abstract)}</p>` : ''}
    ${cv.skills.length ? `<h2>Core Skills</h2><div class="chips">${cv.skills.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>` : ''}
    ${cv.career.length ? `<h2>Professional Experience</h2>${cv.career.map((j) => `
      <div style="margin-bottom:12pt;">
        <div class="row">
          <h3>${esc(j.workSpecialization)} (${esc(j.jobType)})</h3>
          <span class="muted">${esc(j.startDate)} – ${j.isPresent ? 'Present' : esc(j.endDate || '')}</span>
        </div>
        <div class="accent" style="font-size:10.5pt;">${esc(j.companyName)}${j.location ? ' &middot; ' + esc(j.location) : ''}</div>
        ${j.summarization ? `<p style="opacity:0.8;">${esc(j.summarization)}</p>` : ''}
        ${j.projects.length ? `<p><strong>Projects:</strong></p><ul>${j.projects.map((p) => `
          <li><strong>${esc(p.name)}</strong>
            <ul>
              <li><strong>Description:</strong> ${esc(p.description)}</li>
              <li><strong>Technologies:</strong> ${esc(p.technologies)}</li>
              ${p.keyContributions.length ? `<li><strong>Key Contributions:</strong><ul>${p.keyContributions.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></li>` : ''}
            </ul>
          </li>`).join('')}</ul>` : ''}
      </div>`).join('')}` : ''}
    ${cv.personalProjects.length ? `<h2>Personal Projects</h2><ul>${cv.personalProjects.map((p) => `
      <li><strong>${esc(p.title)}</strong>
        <ul>
          <li><strong>Description:</strong> ${esc(p.description)}</li>
          <li><strong>Technologies:</strong> ${esc(p.technologies)}</li>
          ${p.keyFeatures && p.keyFeatures.length ? `<li><strong>Key Features:</strong><ul>${p.keyFeatures.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></li>` : ''}
        </ul>
      </li>`).join('')}</ul>` : ''}
    ${cv.education ? `<h2>Education</h2><p style="white-space:pre-wrap;">${esc(cv.education)}</p>` : ''}
  </body></html>`;
}

function renderTemplate3(cv: CVData, accent: string): string {
  const css = `
    @page { size: A4; margin: 14mm; }
    body { font-family: 'Inter', sans-serif; color: #111; font-size: 10.5pt; line-height: 1.55; margin: 0; }
    h1 { font-size: 32pt; font-weight: 700; letter-spacing: -0.03em; margin: 0; }
    .lead { font-size: 12pt; color: #444; margin: 0 0 4pt; font-weight: 500; }
    .muted { color: #777; font-size: 9.5pt; }
    h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 600; color: #111; margin: 18pt 0 6pt; padding-bottom: 4pt; border-bottom: 1pt solid #111; }
    h3 { font-size: 11pt; font-weight: 600; margin: 8pt 0 0; }
    .row { display:flex; justify-content:space-between; gap:12pt; }
    .chips { display:flex; flex-wrap:wrap; gap:4pt 12pt; }
    .chip { font-size: 10pt; }
    .chip::after { content: ' /'; color: #999; }
    .chip:last-child::after { content: ''; }
  `;
  return `<!doctype html><html><head><meta charset="utf-8"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
  <style>${css}</style></head>
  <body>
    <header>
      <h1>${esc(cv.header.fullName)}</h1>
      <p class="lead">${esc(cv.header.specialization)}</p>
      <div class="muted">${[cv.header.email, cv.header.phone, cv.header.address].filter(Boolean).map(esc).join('  &middot;  ')}</div>
    </header>
    ${cv.abstract ? `<h2>About</h2><p>${esc(cv.abstract)}</p>` : ''}
    ${cv.skills.length ? `<h2>Stack</h2><div class="chips">${cv.skills.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>` : ''}
    ${cv.career.length ? `<h2>Work</h2>${cv.career.map((j) => `
      <div style="margin-bottom:12pt;">
        <div class="row">
          <h3>${esc(j.workSpecialization)} (${esc(j.jobType)})</h3>
          <span class="muted">${esc(j.startDate)} – ${j.isPresent ? 'Present' : esc(j.endDate || '')}</span>
        </div>
        <div class="muted">${esc(j.companyName)}${j.location ? `, ${esc(j.location)}` : ''}</div>
        ${j.summarization ? `<p>${esc(j.summarization)}</p>` : ''}
        ${j.projects.length ? `<p><strong>Projects:</strong></p><ul>${j.projects.map((p) => `
          <li><strong>${esc(p.name)}</strong>
            <ul>
              <li><strong>Description:</strong> ${esc(p.description)}</li>
              <li><strong>Technologies:</strong> ${esc(p.technologies)}</li>
              ${p.keyContributions.length ? `<li><strong>Key Contributions:</strong><ul>${p.keyContributions.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></li>` : ''}
            </ul>
          </li>`).join('')}</ul>` : ''}
      </div>`).join('')}` : ''}
    ${cv.personalProjects.length ? `<h2>Projects</h2><ul>${cv.personalProjects.map((p) => `
      <li><strong>${esc(p.title)}</strong>
        <ul>
          <li><strong>Description:</strong> ${esc(p.description)}</li>
          <li><strong>Technologies:</strong> ${esc(p.technologies)}</li>
          ${p.keyFeatures && p.keyFeatures.length ? `<li><strong>Key Features:</strong><ul>${p.keyFeatures.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></li>` : ''}
        </ul>
      </li>`).join('')}</ul>` : ''}
    ${(cv.educationEntries?.length ?? 0) > 0
  ? `<h2>Education</h2>${cv.educationEntries!.map((e) => `<div style="margin-bottom:8pt;"><h3 style="margin:0 0 2pt;">${esc(e.degree)}</h3><div class="muted">${esc(e.institution)}${e.location ? `, ${esc(e.location)}` : ''}</div>${e.graduationYear ? `<div class="muted">${esc(e.graduationYear)}</div>` : ''}</div>`).join('')}`
  : cv.education ? `<h2>Education</h2><p style="white-space:pre-wrap;">${esc(cv.education)}</p>` : ''}
    ${cv.certifications ? `<h2>Certifications</h2><p style="white-space:pre-wrap;">${esc(cv.certifications)}</p>` : ''}
  </body></html>`;
}

export function buildCvHtml(cv: CVData, templateId: TemplateId = 'template1'): string {
  const accent = `#${cv.sectionTitleColor || '017A8C'}`;
  switch (templateId) {
    case 'template2': return renderTemplate2(cv, accent);
    case 'template3': return renderTemplate3(cv, accent);
    default: return renderTemplate1(cv, accent);
  }
}

export async function exportCvPdf(cv: CVData, templateId?: TemplateId): Promise<void> {
  const html = buildCvHtml(cv, templateId || cv.templateId || 'template1');
  const { base64 } = await Print.printToFileAsync({ html, base64: true });

  if (Platform.OS === 'android') {
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) return;
    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      `CV_${Date.now()}.pdf`,
      'application/pdf',
    );
    await FileSystem.writeAsStringAsync(fileUri, base64!, { encoding: FileSystem.EncodingType.Base64 });
  } else {
    const cacheUri = `${FileSystem.cacheDirectory}CV_${Date.now()}.pdf`;
    await FileSystem.writeAsStringAsync(cacheUri, base64!, { encoding: FileSystem.EncodingType.Base64 });
    await Sharing.shareAsync(cacheUri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf', dialogTitle: 'Save your CV' });
  }
}
