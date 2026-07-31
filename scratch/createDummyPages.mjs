import fs from 'fs';
import path from 'path';

const dirs = [
  'mines',
  'logins',
  'purchases',
  'exchanges',
  'check-cc',
  'check-cc/analytics',
  'saques',
  'suporte'
];

const basePath = path.join(process.cwd(), 'src/app/(admin)/admin');

for (const dir of dirs) {
  const dirPath = path.join(basePath, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const pagePath = path.join(dirPath, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, `export default function DummyPage() {
  return (
    <div className="p-8 text-center text-[#9ca3af]">
      <h1 className="text-2xl font-bold text-white mb-2">Em Breve</h1>
      <p>Esta página ainda está em construção e não possui funções.</p>
    </div>
  );
}
`);
  }
}
console.log("Dummy pages created!");
