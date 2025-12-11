#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const https = require('https');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function validateApiKey(apiKey) {
    return new Promise((resolve, reject) => {
        const url = `https://storekit.samarthh.me/v1/auth/key/validate?key=${encodeURIComponent(apiKey)}`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);

                    if (response.success && response.message === 'API key is valid') {
                        resolve(response.store_data);
                    } else {
                        reject(new Error(response.message || 'Invalid API key'));
                    }
                } catch (error) {
                    reject(new Error('Failed to parse API response'));
                }
            });
        }).on('error', (error) => {
            reject(new Error(`API validation failed: ${error.message}`));
        });
    });
}

async function main() {
    console.log('\n🎉 Welcome to Storentia Store Creator!\n');
    console.log('Let\'s set up your e-commerce store...\n');

    let storeName = process.argv[2];

    if (!storeName) {
        storeName = await question('📦 What will be your store name? ');

        if (!storeName || storeName.trim() === '') {
            console.error('❌ Error: Store name cannot be empty!');
            rl.close();
            process.exit(1);
        }

        storeName = storeName.trim();
    }

    const validStoreName = storeName.toLowerCase().replace(/\s+/g, '-');

    console.log(`\n✨ Creating store: ${validStoreName}\n`);

    const authKey = await question('🔐 Enter your Storentia authentication key: ');

    if (!authKey || authKey.trim() === '') {
        console.error('❌ Error: Authentication key cannot be empty!');
        rl.close();
        process.exit(1);
    }

    console.log('\n🔍 Validating your authentication key...');
    let storeData;
    try {
        storeData = await validateApiKey(authKey.trim());
        console.log('✅ Authentication successful!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Store Information:');
        console.log(`  • Store Name: ${storeData.store.name}`);
        console.log(`  • Store ID: ${storeData.storeId}`);
        console.log(`  • Owner: ${storeData.store.owner.name}`);
        console.log(`  • Key Type: ${storeData.type}`);
        console.log(`  • Permissions: ${storeData.permissions.join(', ')}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } catch (error) {
        console.error(`\n❌ Authentication failed: ${error.message}`);
        console.error('Please check your API key and try again.\n');
        rl.close();
        process.exit(1);
    }

    rl.close();

    const projectPath = path.join(process.cwd(), validStoreName);

    if (fs.existsSync(projectPath)) {
        console.error(`\n❌ Error: Directory "${validStoreName}" already exists!`);
        process.exit(1);
    }

    try {
        console.log('\n📦 Cloning Storentia template...');
        execSync(`git clone https://github.com/thetechsolaceco/Storentia-Init.git "${projectPath}"`, {
            stdio: 'inherit'
        });

        const gitDir = path.join(projectPath, '.git');
        if (fs.existsSync(gitDir)) {
            fs.rmSync(gitDir, { recursive: true, force: true });
        }

        const packageJsonPath = path.join(projectPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            packageJson.name = validStoreName;
            packageJson.version = '0.1.0';
            delete packageJson.bin;
            delete packageJson.files;
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        }

        console.log('\n🔧 Creating environment configuration...');
        const envLocalContent = `# Storentia Main Store Configuration
# Generated on ${new Date().toISOString()}

STORENTIA_AUTH=${authKey.trim()}

NEXT_PUBLIC_STORE_ID=${storeData.storeId}
NEXT_PUBLIC_STORE_NAME=${storeData.store.name}
NEXT_PUBLIC_STORE_DESCRIPTION=${storeData.store.description || ''}

STORE_OWNER_ID=${storeData.store.ownerId}
STORE_OWNER_NAME=${storeData.store.owner.name}
STORE_OWNER_EMAIL=${storeData.store.owner.email}

API_KEY_TYPE=${storeData.type}
API_KEY_PERMISSIONS=${storeData.permissions.join(',')}

NEXT_PUBLIC_API_URL=https://storekit.samarthh.me/v1
`;

        fs.writeFileSync(path.join(projectPath, '.env.local'), envLocalContent);
        console.log('  ✅ Created .env.local (Main Store)');

        const envDashboardContent = `# Storentia Dashboard Configuration
# Generated on ${new Date().toISOString()}

STORENTIA_AUTH=${authKey.trim()}

NEXT_PUBLIC_DASHBOARD_MODE=true

NEXT_PUBLIC_STORE_ID=${storeData.storeId}
NEXT_PUBLIC_STORE_NAME=${storeData.store.name}
NEXT_PUBLIC_STORE_DESCRIPTION=${storeData.store.description || ''}

STORE_OWNER_ID=${storeData.store.ownerId}
STORE_OWNER_NAME=${storeData.store.owner.name}
STORE_OWNER_EMAIL=${storeData.store.owner.email}

API_KEY_TYPE=${storeData.type}
API_KEY_PERMISSIONS=${storeData.permissions.join(',')}

NEXT_PUBLIC_API_URL=https://storekit.samarthh.me/v1

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${generateRandomSecret()}
`;

        fs.writeFileSync(path.join(projectPath, '.env.dashboard'), envDashboardContent);
        console.log('  ✅ Created .env.dashboard (Dashboard)');

        const envExampleContent = `# Storentia Environment Variables Example

STORENTIA_AUTH=sk_prod_your_authentication_key_here

NEXT_PUBLIC_STORE_ID=your_store_id
NEXT_PUBLIC_STORE_NAME=Your Store Name
NEXT_PUBLIC_STORE_DESCRIPTION=Your store description

STORE_OWNER_ID=owner_id
STORE_OWNER_NAME=Owner Name
STORE_OWNER_EMAIL=owner@example.com

API_KEY_TYPE=PROD
API_KEY_PERMISSIONS=READ,WRITE,MANAGE_PRODUCTS

NEXT_PUBLIC_API_URL=https://storekit.samarthh.me/v1

NEXT_PUBLIC_DASHBOARD_MODE=true
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
`;

        fs.writeFileSync(path.join(projectPath, '.env.example'), envExampleContent);
        console.log('  ✅ Created .env.example (Reference)');

        const gitignorePath = path.join(projectPath, '.gitignore');
        if (fs.existsSync(gitignorePath)) {
            let gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
            if (!gitignoreContent.includes('.env.local')) {
                gitignoreContent += '\n.env.local\n.env.dashboard\n.env*.local\n';
                fs.writeFileSync(gitignorePath, gitignoreContent);
            }
        }

        console.log('\n🧹 Cleaning up unnecessary files...');
        const filesToRemove = [
            'PUBLISHING_GUIDE.md',
            'NPM_2FA_SETUP.md',
            'SETUP_SUMMARY.md',
            'CLI_USAGE_EXAMPLES.md',
            'INTERACTIVE_CLI_UPDATE.md',
            'TESTING_BEFORE_PUBLISH.md',
            'WHY_NPM_CREATE_DOESNT_WORK.md',
            'NPX_USAGE_GUIDE.md',
            'PUBLISHED_SUCCESS.md',
            'publish.sh',
            'test-cli.sh',
            '.npmignore',
            'create-storentia-1.0.2.tgz',
            'storentia-create-1.0.1.tgz',
            'bin',
            'scripts'
        ];

        filesToRemove.forEach(file => {
            const filePath = path.join(projectPath, file);
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    fs.rmSync(filePath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(filePath);
                }
            }
        });
        console.log('  ✅ Removed unnecessary files');

        console.log('\n📥 Installing dependencies...');
        execSync('npm install', {
            cwd: projectPath,
            stdio: 'inherit'
        });

        console.log(`\n✅ Success! Created ${validStoreName} at ${projectPath}\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('📁 Environment Files Created:\n');
        console.log('  • .env.local      - Main store configuration');
        console.log('  • .env.dashboard  - Dashboard configuration');
        console.log('  • .env.example    - Reference template\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('🚀 Getting Started:\n');
        console.log(`  cd ${validStoreName}`);
        console.log('  npm run dev\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('🔐 Your authentication key has been saved securely.');
        console.log('⚠️  Never commit .env.local or .env.dashboard to version control!\n');

    } catch (error) {
        console.error('\n❌ Error creating Storentia store:', error.message);
        process.exit(1);
    }
}

function generateRandomSecret() {
    return require('crypto').randomBytes(32).toString('hex');
}

main().catch((error) => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
});
