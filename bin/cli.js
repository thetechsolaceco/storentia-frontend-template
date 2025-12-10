#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the project name from command line arguments
const projectName = process.argv[2] || 'my-storentia-store';

console.log(`\n🚀 Creating Storentia store: ${projectName}\n`);

// Create project directory
const projectPath = path.join(process.cwd(), projectName);

if (fs.existsSync(projectPath)) {
    console.error(`❌ Error: Directory "${projectName}" already exists!`);
    process.exit(1);
}

try {
    // Clone the template
    console.log('📦 Cloning Storentia template...');
    execSync(`git clone https://github.com/thetechsolaceco/Storentia-Init.git "${projectPath}"`, {
        stdio: 'inherit'
    });

    // Remove .git directory
    const gitDir = path.join(projectPath, '.git');
    if (fs.existsSync(gitDir)) {
        fs.rmSync(gitDir, { recursive: true, force: true });
    }

    // Update package.json with project name
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageJson.name = projectName;
        packageJson.version = '0.1.0';
        delete packageJson.bin;
        delete packageJson.files;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    // Navigate to project directory and install dependencies
    console.log('\n📥 Installing dependencies...');
    execSync('npm install', {
        cwd: projectPath,
        stdio: 'inherit'
    });

    console.log(`\n✅ Success! Created ${projectName} at ${projectPath}\n`);
    console.log('Inside that directory, you can run several commands:\n');
    console.log('  npm run dev');
    console.log('    Starts the development server.\n');
    console.log('  npm run build');
    console.log('    Builds the app for production.\n');
    console.log('  npm start');
    console.log('    Runs the built app in production mode.\n');
    console.log('We suggest that you begin by typing:\n');
    console.log(`  cd ${projectName}`);
    console.log('  npm run dev\n');
    console.log('Happy coding! 🎉\n');

} catch (error) {
    console.error('❌ Error creating Storentia store:', error.message);
    process.exit(1);
}
