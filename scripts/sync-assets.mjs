import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imageRoot = path.join(root, 'public', 'images');
const teamDir = path.join(imageRoot, 'team');
const galleryDir = path.join(imageRoot, 'gallery');
const teamBase = 'https://lobbyingandlaw.com/images/team';
const galleryBase = 'https://lobbyingandlaw.com/images/gallery';

const teamFiles = [
  'brit-robin.jpg','brigadier-shamsul-salekin.jpg','md-rashed-ali.jpg','md-harun-or-rashid.jpg','ramis-maliyat-sreonty.jpg','md-fariduzzaman.jpg','shah-md-khasruzzaman.jpg','abm-ziauddin.jpg','md-ruhul-amin-khondker.jpg','md-abdur-rob-howlader.jpg','dr-md-abdur-rahman.jpg','mohammad-ali-azam.jpg','mohammad-fakruddin-ahmed.jpg','mir-fakruddin.jpg','nahid-farzana-mukti.jpg','ali-ahsan-mullah.jpg','wakid-b-azad.jpg','rakibul-alam-lincoln.jpg','abdullah-kamal.jpg','nusrat-sharmin-mouri.jpg','saydujjaman-shamim.jpg','md-masudur-rahman.jpg','kamal-hossain-miah.jpg','tarun-kumar-biswas.jpg','ahammed-hossain-babu.jpg','mamonoor-rashid.jpg','amlan-ahmed-shampad.jpg','md-sulaiman.jpg','jahidul-hoque-talukder.jpg','nur-a-jannat.jpg','md-asaduzzaman.jpg','mohammad-rifat-hossain.jpg','abdul-awal-elamdi.jpg','tasmim-jahan-neeha.jpg','sm-jamil-boktiar.jpg'
];

await mkdir(teamDir, { recursive: true });
await mkdir(galleryDir, { recursive: true });
const manifest = { generatedAt: new Date().toISOString(), assets: [] };
const forceSync = process.env.SYNC_REMOTE_ASSETS === '1';

async function exists(filePath) {
  try { await access(filePath); return true; } catch { return false; }
}

async function fetchBinary(url) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return Buffer.from(await response.arrayBuffer());
}

for (const filename of teamFiles) {
  const localPath = path.join(teamDir, filename);
  if (!forceSync && await exists(localPath)) {
    manifest.assets.push({ filename, local: `/images/team/${filename}`, source: `${teamBase}/${filename}`, status: 'local' });
    continue;
  }
  try {
    const file = await fetchBinary(`${teamBase}/${filename}`);
    await writeFile(localPath, file);
    manifest.assets.push({ filename, local: `/images/team/${filename}`, source: `${teamBase}/${filename}`, status: 'downloaded' });
    console.log(`Downloaded ${filename}`);
  } catch (error) {
    manifest.assets.push({ filename, local: `/images/team/${filename}`, source: `${teamBase}/${filename}`, status: 'remote-fallback', error: String(error) });
    console.warn(`Could not download ${filename}; runtime fallback remains enabled.`);
  }
}


const galleryFiles = Array.from({ length: 15 }, (_, index) => `image_${index + 1}.jpeg`);
for (const filename of galleryFiles) {
  const localPath = path.join(galleryDir, filename);
  if (!forceSync && await exists(localPath)) {
    manifest.assets.push({ filename, local: `/images/gallery/${filename}`, source: `${galleryBase}/${filename}`, status: 'local' });
    continue;
  }
  try {
    const file = await fetchBinary(`${galleryBase}/${filename}`);
    await writeFile(localPath, file);
    manifest.assets.push({ filename, local: `/images/gallery/${filename}`, source: `${galleryBase}/${filename}`, status: 'downloaded' });
    console.log(`Downloaded gallery ${filename}`);
  } catch (error) {
    manifest.assets.push({ filename, local: `/images/gallery/${filename}`, source: `${galleryBase}/${filename}`, status: 'remote-fallback', error: String(error) });
    console.warn(`Could not download gallery ${filename}; runtime fallback remains enabled.`);
  }
}

// Keep the main hero image local for full-site replacement deployments.
const heroPath = path.join(imageRoot, 'hero-banner.jpeg');
if (!forceSync && await exists(heroPath)) {
  manifest.assets.push({ filename: 'hero-banner.jpeg', local: '/images/hero-banner.jpeg', source: 'https://lobbyingandlaw.com/images/hero-banner.jpeg', status: 'local' });
} else try {
  const file = await fetchBinary('https://lobbyingandlaw.com/images/hero-banner.jpeg');
  await writeFile(heroPath, file);
  manifest.assets.push({ filename: 'hero-banner.jpeg', local: '/images/hero-banner.jpeg', source: 'https://lobbyingandlaw.com/images/hero-banner.jpeg', status: 'downloaded' });
  console.log('Downloaded hero-banner.jpeg');
} catch (error) {
  manifest.assets.push({ filename: 'hero-banner.jpeg', local: '/images/hero-banner.jpeg', source: 'https://lobbyingandlaw.com/images/hero-banner.jpeg', status: 'remote-fallback', error: String(error) });
  console.warn('Could not download hero-banner.jpeg; runtime fallback remains enabled.');
}

await writeFile(path.join(root, 'public', 'images', 'asset-manifest.json'), JSON.stringify(manifest, null, 2));
