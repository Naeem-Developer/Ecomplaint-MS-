import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, 'src');

function traverseAndFix(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseAndFix(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('lucide-react')) {
        // Simple string replacements for icons
        content = content.replace(/from 'lucide-react'/g, "from '@phosphor-icons/react'");
        content = content.replace(/Trash2/g, 'Trash');
        content = content.replace(/LogOut/g, 'SignOut');
        content = content.replace(/Menu/g, 'List');
        content = content.replace(/ChevronDown/g, 'CaretDown');
        content = content.replace(/TrendingUp/g, 'TrendUp');
        content = content.replace(/PlusCircle/g, 'PlusCircle'); // exists in phosphor
        content = content.replace(/ArrowLeft/g, 'ArrowLeft');
        content = content.replace(/AlertCircle/g, 'WarningCircle');
        content = content.replace(/UserPlus/g, 'UserPlus');
        content = content.replace(/Camera/g, 'Camera');
        content = content.replace(/LogIn/g, 'SignIn');
        content = content.replace(/EyeOff/g, 'EyeSlash');
        
        fs.writeFileSync(fullPath, content);
        console.log('Fixed icons in:', fullPath);
      }
    }
  }
}

traverseAndFix(srcDir);
