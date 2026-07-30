import fs from 'fs';

function replaceAlerts(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // add import if not present
  if (!content.includes('from "sonner"')) {
    content = content.replace(/(import .*?from.*?;\n)+/, "$&\nimport { toast } from \"sonner\";\n");
  }
  
  // replace alerts
  content = content.replace(/alert\((.*?)\);/g, (match, p1) => {
    if (p1.toLowerCase().includes('sucesso') || p1.toLowerCase().includes('copiado') || p1.toLowerCase().includes('atualizado') || p1.toLowerCase().includes('desconectados')) {
      return `toast.success(${p1});`;
    }
    return `toast.error(${p1});`;
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Replaced alerts in ${filePath}`);
}

replaceAlerts('./src/app/(dashboard)/settings/SettingsClient.tsx');
replaceAlerts('./src/app/(dashboard)/recharge/RechargeClient.tsx');
replaceAlerts('./src/app/(dashboard)/redeem/RedeemClient.tsx');
replaceAlerts('./src/app/(dashboard)/drops/DropsClient.tsx');
replaceAlerts('./src/app/(dashboard)/buy/cards/CardsClient.tsx');
