#!/usr/bin/env node

const https = require('https');

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

const testKey = 'sk_prod_gGBtannC3LcP76L3QIlmxLkyWpDuCuDnJfB9095je-I';

console.log('🧪 Testing API Key Validation\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`Testing with key: ${testKey.substring(0, 20)}...\n`);

validateApiKey(testKey)
    .then((storeData) => {
        console.log('✅ Validation Successful!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Store Data:\n');
        console.log(`  Store ID: ${storeData.storeId}`);
        console.log(`  Store Name: ${storeData.store.name}`);
        console.log(`  Owner: ${storeData.store.owner.name}`);
        console.log(`  Key Type: ${storeData.type}`);
        console.log(`  Permissions: ${storeData.permissions.join(', ')}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('✅ Test Passed!\n');
    })
    .catch((error) => {
        console.error('❌ Validation Failed!\n');
        console.error(`Error: ${error.message}\n`);
        process.exit(1);
    });
