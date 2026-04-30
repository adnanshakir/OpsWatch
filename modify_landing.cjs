const fs = require('fs');
const lines = fs.readFileSync('client/src/pages/public/Landing.jsx', 'utf8').split('\n');

const imports = `
import { FAQ_DATA, STATS, STEPS } from '@/data/landingData';
import { FAQItem } from '@/components/landing/FAQItem';
import { CreativeAIBriefShowcase } from '@/components/landing/CreativeAIBriefShowcase';
import { ScrollRevealParagraph } from '@/components/landing/ScrollReveal';
import { SpotlightGrid } from '@/components/landing/SpotlightGrid';
import { DualMarquee } from '@/components/landing/DualMarquee';
import { WorkspacePreview } from '@/components/landing/WorkspacePreview';
import { SocialIcon } from '@/components/shared/SocialIcon';
`;

const newLines = [
  ...lines.slice(0, 30),
  imports.trim(),
  '',
  ...lines.slice(92, 627)
];

fs.writeFileSync('client/src/pages/public/Landing.jsx', newLines.join('\n'));
console.log('Done modifying Landing.jsx!');
