const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Let's just find all heading tags and reduce their font weight class
  content = content.replace(/(<h[1-6][^>]*class(?:Name)?=["'])([^"']+)(["'])/g, (match, p1, p2, p3) => {
    let classes = p2.split(' ');
    let newClasses = classes.map(c => {
      if (c === 'font-black') return 'font-extrabold';
      if (c === 'font-extrabold') return 'font-bold';
      if (c === 'font-bold') return 'font-semibold';
      if (c === 'font-semibold') return 'font-medium';
      if (c === 'font-medium') return 'font-normal';
      if (c === 'font-normal') return 'font-light';
      return c;
    });
    return p1 + newClasses.join(' ') + p3;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

walkDir('src');
