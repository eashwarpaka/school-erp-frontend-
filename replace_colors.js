
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
    { from: /bg-\[#2563eb\]/g, to: 'bg-gradient-to-r from-amber-500 to-amber-600' },
    { from: /bg-\[#1e58d6\]/g, to: 'bg-gradient-to-r from-amber-500 to-amber-600' },
    { from: /hover:bg-blue-700/g, to: 'hover:from-amber-600 hover:to-amber-700' },
    { from: /text-blue-600/g, to: 'text-amber-600' },
    { from: /focus:ring-blue-500/g, to: 'focus:ring-amber-500' },
    { from: /focus:border-blue-500/g, to: 'focus:border-amber-500' },
    { from: /bg-blue-600/g, to: 'bg-amber-500' },
    { from: /bg-blue-50/g, to: 'bg-amber-50' },
    { from: /text-blue-700/g, to: 'text-amber-700' },
    { from: /border-blue-100/g, to: 'border-amber-200' },
    { from: /border-blue-200/g, to: 'border-amber-300' },
    { from: /border-blue-600/g, to: 'border-amber-500' },
    { from: /hover:text-blue-700/g, to: 'hover:text-amber-700' },
    { from: /ring-blue-500/g, to: 'ring-amber-500' },
    { from: /hover:text-blue-600/g, to: 'hover:text-amber-600' }
];

function processDirectory(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directory, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error stating file:', err);
                    return;
                }

                if (stats.isDirectory()) {
                    processDirectory(filePath);
                } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error('Error reading file:', err);
                            return;
                        }

                        let modifiedData = data;
                        let changed = false;

                        replacements.forEach(replacement => {
                            if (replacement.from.test(modifiedData)) {
                                modifiedData = modifiedData.replace(replacement.from, replacement.to);
                                changed = true;
                            }
                        });

                        if (changed) {
                            fs.writeFile(filePath, modifiedData, 'utf8', err => {
                                if (err) {
                                    console.error('Error writing file:', err);
                                } else {
                                    console.log('Updated:', filePath);
                                }
                            });
                        }
                    });
                }
            });
        });
    });
}

processDirectory(directoryPath);

