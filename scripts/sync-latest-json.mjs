import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');
const docsJsonDir = path.join(rootDir, 'docs', 'json');

function getHighestVersionDir(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && /^v\d+$/.test(entry.name))
        .map((entry) => ({ name: entry.name, version: Number(entry.name.slice(1)) }))
        .sort((a, b) => b.version - a.version);

    if (entries.length === 0) {
        throw new Error(`No versioned folders (v1, v2, ...) found in ${directory}`);
    }
    return entries[0].name;
}

function copyJsonFiles(fromDir, toDir) {
    fs.mkdirSync(toDir, { recursive: true });
    let count = 0;

    for (const entry of fs.readdirSync(fromDir, { withFileTypes: true })) {
        const srcPath = path.join(fromDir, entry.name);
        const dstPath = path.join(toDir, entry.name);
        if (entry.isDirectory()) {
            count += copyJsonFiles(srcPath, dstPath);
        } else if (entry.name.endsWith('.json')) {
            fs.copyFileSync(srcPath, dstPath);
            count += 1;
        }
    }
    return count;
}

const latestVersion = getHighestVersionDir(srcDir);
const sourceVersionDir = path.join(srcDir, latestVersion);
const targetVersionDir = path.join(docsJsonDir, latestVersion);

if (fs.existsSync(targetVersionDir)) {
    fs.rmSync(targetVersionDir, { recursive: true, force: true });
}

const copied = copyJsonFiles(sourceVersionDir, targetVersionDir);
console.log(`Synced ${copied} JSON file(s) from src/${latestVersion} to docs/json/${latestVersion}`);
