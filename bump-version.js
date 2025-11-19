import { readFileSync, writeFileSync } from 'fs';

const packagePath = './package.json';
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
const bumpType = process.argv[2] || 'patch'; // patch, minor, or major

const [major, minor, patch] = pkg.version.split('.').map(Number);

let newVersion;
switch (bumpType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
}

const oldVersion = pkg.version;
pkg.version = newVersion;

writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`Version bumped from ${oldVersion} to ${newVersion}`);
