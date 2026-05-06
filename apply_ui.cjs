const fs = require('fs');
const path = require('path');

const buttonClasses = " transition-all duration-200 ease-in-out hover:scale-105 hover:bg-white/10 active:scale-95";
const cardClasses = " hover:shadow-xl hover:-translate-y-1 transition-all duration-300";
const inputClasses = " focus:ring-2 focus:ring-purple-400/40 outline-none";
const chatMsgClasses = " animate-[fadeInUp_0.4s_ease-out_forwards]";

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Add button classes
    const btnRegex = /<button[^>]*className=["']([^"']*)["'][^>]*>/g;
    content = content.replace(btnRegex, (match, classes) => {
        if (!classes.includes('hover:scale-105')) {
            modified = true;
            return match.replace(classes, classes + buttonClasses);
        }
        return match;
    });

    // Add input/textarea classes
    const inputRegex = /<(input|textarea)[^>]*className=["']([^"']*)["'][^>]*>/g;
    content = content.replace(inputRegex, (match, tag, classes) => {
        if (!classes.includes('focus:ring-2')) {
            modified = true;
            return match.replace(classes, classes + inputClasses);
        }
        return match;
    });

    // Add chat message classes (Chat.tsx specific)
    if (filePath.endsWith('Chat.tsx')) {
        const articleRegex = /<article[^>]*className=["']([^"']*)["'][^>]*>/g;
        content = content.replace(articleRegex, (match, classes) => {
            if (!classes.includes('animate-[')) {
                modified = true;
                return match.replace(classes, classes + chatMsgClasses);
            }
            return match;
        });
    }

    // Add card classes (Dashboard, Notes, Quiz)
    if (filePath.endsWith('Dashboard.tsx') || filePath.endsWith('Notes.tsx') || filePath.endsWith('Quiz.tsx')) {
        // Look for typical card containers like rounded-xl border bg-...
        const cardRegex = /<div[^>]*className=["']([^"']*(?:rounded-xl|rounded-2xl)[^"']*(?:bg-[^\s"']+)[^"']*)["'][^>]*>/g;
        content = content.replace(cardRegex, (match, classes) => {
            // we only want to apply to actual cards, maybe check for 'p-5' or 'p-6' or 'border'
            if (classes.includes('border') && !classes.includes('hover:-translate-y-1') && !classes.includes('min-h-[52svh]')) {
                modified = true;
                return match.replace(classes, classes + cardClasses);
            }
            return match;
        });
    }

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`Modified ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    }
}

walkDir('./src');

// Also inject keyframes into index.css
let css = fs.readFileSync('./src/index.css', 'utf8');
if (!css.includes('fadeInUp')) {
    css += `
@theme {
  --animate-fadeInUp: fadeInUp 0.4s ease-out forwards;
  @keyframes fadeInUp {
    0% { opacity: 0; transform: scale(0.95) translateY(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
}
`;
    fs.writeFileSync('./src/index.css', css);
    console.log("Modified index.css");
}

