#!/usr/bin/env node

/**
 * Script to update all product areas of study according to revised taxonomy
 * Based on revised_taxonomy.md research-supported classifications
 */

const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'ojsvc60h',
  dataset: 'production',
  apiVersion: '2021-10-21',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

// Revised taxonomy mapping based on research evidence
const REVISED_AREAS_OF_STUDY = {
  '5-amino-1mq': ['weight-loss'],
  'aod-9604': ['weight-loss', 'muscle'],
  'bpc-157': ['healing', 'gut-health', 'neural'],
  'cagrilintide': ['weight-loss', 'diabetes'],
  'dsip': ['sleep', 'stress'],
  'epithalon': ['longevity', 'sleep'],
  'ghk-cu': ['healing', 'longevity', 'cosmetic'],
  'glutathione': ['immune', 'longevity', 'cosmetic'],
  'igf-1-lr3': ['muscle', 'healing'],
  'ipamorelin': ['muscle', 'longevity', 'sleep'],
  'melanotan-1': ['cosmetic'],
  'melanotan-2': ['cosmetic', 'weight-loss', 'sexual'],
  'mots-c': ['longevity', 'energy', 'weight-loss'],
  'nad-plus': ['energy', 'longevity', 'cognitive'],
  'oxytocin': ['sexual', 'stress'],
  'pinealon': ['cognitive', 'neural'],
  'pt-141': ['sexual'],
  'retatrutide': ['weight-loss', 'diabetes'],
  'selank': ['stress', 'cognitive', 'immune'],
  'semaglutide': ['weight-loss', 'diabetes'],
  'semax': ['cognitive', 'neural'],
  'sermorelin': ['muscle', 'longevity', 'sleep'],
  'snap-8': ['cosmetic'],
  'tb-500': ['healing', 'muscle', 'longevity'],
  'tirzepatide': ['weight-loss', 'diabetes']
};

// Function to normalize product names for matching
function normalizeProductName(name) {
  if (!name) return '';

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Function to update a single product
async function updateProduct(product, newCategories) {
  const productId = product._id;
  const productName = product.name || product.title;

  console.log(`Updating ${productName} (${productId}):`);
  console.log(`  Current categories: ${product.categories ? product.categories.join(', ') : 'none'}`);
  console.log(`  New categories: ${newCategories.join(', ')}`);

  try {
    await client
      .patch(productId)
      .set({ categories: newCategories })
      .commit();

    console.log(`  ✅ Successfully updated ${productName}`);
    return { success: true, product: productName };
  } catch (error) {
    console.error(`  ❌ Failed to update ${productName}:`, error.message);
    return { success: false, product: productName, error: error.message };
  }
}

// Main function
async function updateAllProductsAreasOfStudy() {
  console.log('🚀 Starting areas of study update based on revised taxonomy...\n');

  try {
    // Fetch all products
    const products = await client.fetch(`
      *[_type == "product"]{
        _id,
        name,
        title,
        categories,
        "slug": slug.current
      }
    `);

    console.log(`Found ${products.length} products to update.\n`);

    const results = {
      updated: [],
      skipped: [],
      failed: []
    };

    // Update each product
    for (const product of products) {
      const productName = product.name || product.title;
      const normalizedName = normalizeProductName(productName);
      const slugName = product.slug;

      // Try to match by normalized name first, then by slug
      let newCategories = REVISED_AREAS_OF_STUDY[normalizedName] || REVISED_AREAS_OF_STUDY[slugName];

      // Special cases for name matching
      if (!newCategories) {
        if (productName?.toLowerCase().includes('nad')) {
          newCategories = REVISED_AREAS_OF_STUDY['nad-plus'];
        } else if (productName?.toLowerCase().includes('5-amino')) {
          newCategories = REVISED_AREAS_OF_STUDY['5-amino-1mq'];
        } else if (productName?.toLowerCase().includes('aod')) {
          newCategories = REVISED_AREAS_OF_STUDY['aod-9604'];
        }
      }

      if (newCategories) {
        const result = await updateProduct(product, newCategories);
        if (result.success) {
          results.updated.push(result.product);
        } else {
          results.failed.push(result);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.log(`⏭️  Skipping ${productName} - no matching taxonomy entry found`);
        results.skipped.push(productName);
      }

      console.log(''); // Empty line for readability
    }

    // Summary
    console.log('📊 Update Summary:');
    console.log(`  ✅ Successfully updated: ${results.updated.length} products`);
    if (results.updated.length > 0) {
      results.updated.forEach(name => console.log(`    - ${name}`));
    }

    console.log(`  ⏭️  Skipped: ${results.skipped.length} products`);
    if (results.skipped.length > 0) {
      results.skipped.forEach(name => console.log(`    - ${name}`));
    }

    console.log(`  ❌ Failed: ${results.failed.length} products`);
    if (results.failed.length > 0) {
      results.failed.forEach(result => console.log(`    - ${result.product}: ${result.error}`));
    }

    console.log('\n🎉 Areas of study update completed!');

  } catch (error) {
    console.error('❌ Error updating products:', error);
    process.exit(1);
  }
}

// Run the update
if (process.env.SANITY_WRITE_TOKEN) {
  updateAllProductsAreasOfStudy();
} else {
  console.error('❌ SANITY_WRITE_TOKEN environment variable is required');
  console.log('Usage: SANITY_WRITE_TOKEN="your_token" node update-areas-of-study.js');
  process.exit(1);
}