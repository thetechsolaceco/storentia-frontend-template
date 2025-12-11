#!/usr/bin/env node

/**
 * Test script for API key validation
 * This script tests the validateApiKey function with the provided test key
 */

const https = require('https');

// Validate API Key with Storentia Backend
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

// Test with the provided key
const testKey = 'sk_prod_gGBtannC3LcP76L3QIlmxLkyWpDuCuDnJfB9095je-I';

console.log('🧪 Testing API Key Validation\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`Testing with key: ${testKey.substring(0, 20)}...\n`);
console.log('🔍 Validating...\n');

validateApiKey(testKey)
    .then((storeData) => {
        console.log('✅ Validation Successful!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Store Data Retrieved:\n');
        console.log('Store Information:');
        console.log(`  • Store ID: ${storeData.storeId}`);
        console.log(`  • Store Name: ${storeData.store.name}`);
        console.log(`  • Description: ${storeData.store.description || '(empty)'}`);
        console.log(`  • Created: ${storeData.store.createdAt}`);
        console.log(`  • Updated: ${storeData.store.updatedAt}\n`);

        console.log('Owner Information:');
        console.log(`  • Owner ID: ${storeData.store.ownerId}`);
        console.log(`  • Name: ${storeData.store.owner.name}`);
        console.log(`  • Email: ${storeData.store.owner.email}`);
        console.log(`  • Role: ${storeData.store.owner.role}\n`);

        console.log('API Key Information:');
        console.log(`  • Key ID: ${storeData.keyId}`);
        console.log(`  • Key Type: ${storeData.type}`);
        console.log(`  • Permissions: ${storeData.permissions.join(', ')}`);

        if (storeData.metadata) {
            console.log(`  • Metadata: ${JSON.stringify(storeData.metadata)}`);
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('✅ Test Passed! API validation is working correctly.\n');
    })
    .catch((error) => {
        console.error('❌ Validation Failed!\n');
        console.error(`Error: ${error.message}\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('❌ Test Failed!\n');
        process.exit(1);
    });
