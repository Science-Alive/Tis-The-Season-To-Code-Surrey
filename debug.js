const fs = require('fs');
const path = require('path');

const targetFolder = 'projects'; 
const projectsPath = path.join(__dirname, targetFolder);

console.log("\n🕵️‍♀️ STARTING DEEP INSPECTION...\n");

if (!fs.existsSync(projectsPath)) {
    console.error("❌ Projects folder not found.");
    process.exit(1);
}

const folders = fs.readdirSync(projectsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

// Loop through every student folder
folders.forEach(folderName => {
    
    // 1. CHECK FOR BAD FOLDER NAMES
    // We use JSON.stringify to reveal hidden spaces like "Name "
    const visualName = JSON.stringify(folderName); 
    
    // Check if the folder has a dot (causes issues with some servers)
    const hasDot = folderName.includes('.');
    
    const studentPath = path.join(projectsPath, folderName);
    const files = fs.readdirSync(studentPath);

    // Look for index.html
    const indexFile = files.find(f => f.toLowerCase().includes('index'));

    // ONLY REPORT PROBLEMS (To keep log clean)
    if (hasDot || indexFile) {
        console.log(`📂 FOLDER: ${visualName}`); // Quotes show hidden spaces

        if (folderName.endsWith(' ') || folderName.startsWith(' ')) {
            console.error(`   🔴 CRITICAL: Folder name has extra spaces! Rename it.`);
            console.error(`      Current: "${folderName}" -> Rename to: "${folderName.trim()}"`);
        }

        if (hasDot) {
            console.warn(`   ⚠️ WARNING: Folder contains a DOT (.). This confuses 'npx serve'.`);
            console.warn(`      'serve' thinks "${folderName}" is a file, not a folder.`);
            console.warn(`      FIX: Rename folder to "Ada_w_website" (replace dot with underscore).`);
        }

        if (indexFile) {
            const visualFile = JSON.stringify(indexFile);
            console.log(`   📄 Found Index File: ${visualFile}`);

            if (indexFile !== 'index.html') {
                console.error(`   🔴 ERROR: File is named ${visualFile}, not "index.html"`);
                
                if (indexFile === 'Index.html') {
                    console.error(`      -> Fix: Rename "Index.html" to "index.html" (lowercase i)`);
                }
                if (indexFile.endsWith(' ')) {
                    console.error(`      -> Fix: Delete the trailing space at the end of the filename.`);
                }
                if (indexFile.includes('.txt')) {
                    console.error(`      -> Fix: Remove the hidden .txt extension.`);
                }
            } else {
                console.log(`   ✅ File name is perfect.`);
            }
        } else {
            console.error(`   ❌ NO index.html found in this folder.`);
        }
        console.log('--------------------------------------------------');
    }
});

console.log("\n🕵️‍♀️ INSPECTION COMPLETE.");
