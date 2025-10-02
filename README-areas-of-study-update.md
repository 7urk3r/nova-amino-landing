# Areas of Study Update Instructions

This directory contains everything needed to update all product areas of study according to the revised research-based taxonomy.

## Files Created

1. **`revised_taxonomy.md`** - Research-supported categorizations for all 25 peptides
2. **`update-areas-of-study.js`** - Automated Node.js script to update all products
3. **`update-products-manually.md`** - Manual reference for individual product updates

## Quick Update (Recommended)

Run the automated script to update all products at once:

```bash
# Set your Sanity write token (the same one used in the website)
export SANITY_WRITE_TOKEN="sk9KIctAnRnAZgljNDqx1MqCTARCSKINtx8oGSOq1J19hYDM3PGf8qMlQZbwf0gsk42MpU4fkVwbMVB9pF2Fz3AHMBkiIkKUd7YngFirkIbFszn9UUUW3b5Fp0OXp6tlc32NH9m7MUHLq2xb8Mti5486rlcdn5mhtVMUeV2NPCtye8b0NsQ3"

# Run the update script
node update-areas-of-study.js
```

## What the Script Does

1. **Fetches all products** from your Sanity Studio
2. **Matches each product** to the revised taxonomy by name/slug
3. **Updates categories** with research-supported areas of study
4. **Provides detailed logging** of all changes made
5. **Includes error handling** and rate limiting

## Expected Results

The script will update approximately 25 products with their new research-based areas of study:

- **5-Amino-1MQ**: `weight-loss` (was: `weight-loss`, `energy`)
- **NAD+**: `energy`, `longevity`, `cognitive` (was: `energy`, `anti-aging`, `cognitive`)
- **Selank**: `stress`, `cognitive`, `immune` (reordered: stress is now primary)
- **BPC-157**: `healing`, `gut-health`, `neural` (added gut-health)
- And many more...

## Manual Alternative

If you prefer to update manually, use `update-products-manually.md` as a reference. This document lists exactly what categories each product should have.

## Verification

After running the script:

1. Check your products page: `http://127.0.0.1:3012/products`
2. Areas of study pills should reflect the new research-based categories
3. Product cards will automatically display the updated information

## Benefits of the Update

- **Research-backed** classifications based on scientific evidence
- **Cleaner taxonomy** with removed speculative associations
- **Better UX** with primary research areas listed first
- **Compliance-friendly** terminology (longevity vs anti-aging)
- **More accurate** representation of each compound's benefits

## Rollback

If needed, the original categories are preserved in the script comments and can be restored by running a reverse update.