require('dotenv').config();
const axios = require('axios');

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;


const contentful = require('contentful-management');
const fs = require('fs');
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT;
const ACCESS_TOKEN1 = process.env.CONTENTFUL_ACCESS_TOKEN;

const client = contentful.createClient({
  accessToken: ACCESS_TOKEN1,
});

// async function transferImageToAppEntry({
//   // spaceId,
//   // environmentId,
//   mainEntryId,
//   imageFieldId = 'coverImage',
//   bynderRefFieldId = 'mediaField',
//   bynderAssetFieldId = 'jsonBynderAsset',
//   locale = 'en',
// }) {
//   const logFile = 'contentful-error.log';

//   try {
//     const space = await client.getSpace(spaceId);
//     console.log(`[🔗 CONNECTED] Space ID: ${space.sys.id}`);
//     const env = await space.getEnvironment(environmentId);
//     console.log(`[🔗 CONNECTED] Environment ID: ${env.sys.id}`);

//     // Get Main Entry
//     const mainEntry = await env.getEntry(mainEntryId);
//     console.log(`[🔗 FETCHED] Main Entry ID: ${mainEntry.sys.id}`);
//     // console.log('[🧾 DEBUG] mainEntry.fields:', JSON.stringify(mainEntry.fields, null, 2));


//     // Step 1: Get the image reference from 'image' field
//     const imageAsset = mainEntry.fields?.[imageFieldId]?.[locale];
//     console.log(`[🔗 FETCHED] Image Asset from field '${imageFieldId}':`, imageAsset);
//     if (!imageAsset?.sys?.id) {
//       throw new Error(`No asset found in '${imageFieldId}' of entry "${mainEntryId}"`);
//     }
//     console.log(`[✅ ASSET FOUND] Asset ID: ${imageAsset.sys.id}`);

//     // Step 2: Get reference to the Bynder app entry
//     const bynderRef = mainEntry.fields?.[bynderRefFieldId]?.[locale];
//     if (!bynderRef?.sys?.id) {
//       throw new Error(`No reference found in '${bynderRefFieldId}' of entry "${mainEntryId}"`);
//     }
//     const bynderEntryId = bynderRef.sys.id;
//     console.log('fetched  AppEntryId:', bynderEntryId );
    

//     // Step 3: Update jsonBynderAsset field in the Bynder entry
//     const bynderEntry = await env.getEntry(bynderEntryId);
//     console.log('Got app entry:',bynderEntry);

//     bynderEntry.fields[bynderAssetFieldId] = {
//       [locale]: {
//         sys: {
//           type: 'Link',
//           linkType: 'Asset',
//           id: imageAsset.sys.id,
//           name: 'cms Asset title',
//         },
//       },
//     };

//     console.log("bynderEntryNow:---->>>>>",bynderEntry.fields[bynderAssetFieldId])


//     const updatedBynder = await bynderEntry.update();
//     console.log(`[✅ UPDATED] Bynder entry "${bynderEntryId}" updated.`);
//     return;

//     // === COMMIT POINT ===
//     // await updatedBynder.publish();
//     // console.log(`[🚀 PUBLISHED] Bynder entry "${bynderEntryId}" published.`);

//   } catch (err) {
//     const msg = `[❌ ERROR] ${err.message}`;
//     console.error(msg);
//     fs.appendFileSync(logFile, `${new Date().toISOString()} - ${msg}\n`);
//   }
// }

// async function transferImageToAppEntry({
//   mainEntryId,
//   imageFieldId = 'coverImage',
//   bynderRefFieldId = 'mediaField',
//   bynderAssetFieldId = 'jsonBynderAsset',
//   locale = 'en',
// }) {
//   const logFile = 'contentful-error.log';

//   try {
//     const space = await client.getSpace(spaceId);
//     console.log(`[🔗 CONNECTED] Space ID: ${space.sys.id}`);
//     const env = await space.getEnvironment(environmentId);
//     console.log(`[🔗 CONNECTED] Environment ID: ${env.sys.id}`);

//     // Step 1: Get the main entry
//     const mainEntry = await env.getEntry(mainEntryId);
//     console.log(`[📥 FETCHED] Main Entry ID: ${mainEntry.sys.id}`);

//     // Step 2: Get the image asset reference
//     const imageAssetLink = mainEntry.fields?.[imageFieldId]?.[locale];
//     if (!imageAssetLink?.sys?.id) {
//       throw new Error(`No asset found in field '${imageFieldId}' of entry "${mainEntryId}"`);
//     }

//     const assetId = imageAssetLink.sys.id;
//     console.log(`[📸 ASSET LINK FOUND] Asset ID: ${assetId}`);

//     // Step 3: Fetch the actual asset
//     const asset = await env.getAsset(assetId);
//     const file = asset.fields.file?.[locale];
//     const title = asset.fields.title?.[locale] || 'Untitled Asset';
//     const thumbnail = file?.url ? `https:${file.url}` : '';
//     const originalUrl = thumbnail;

//     const cmsAssetJSON = {
//       type: 'cms',
//       id: assetId,
//       title,
//       thumbnail,
//       originalUrl,
//     };

//     // Step 4: Get the referenced "Bynder App" entry
//     const bynderRef = mainEntry.fields?.[bynderRefFieldId]?.[locale];
//     if (!bynderRef?.sys?.id) {
//       throw new Error(`No reference found in '${bynderRefFieldId}' of entry "${mainEntryId}"`);
//     }

//     const bynderEntryId = bynderRef.sys.id;
//     const bynderEntry = await env.getEntry(bynderEntryId);
//     console.log(`[📥 FETCHED] Bynder App Entry ID: ${bynderEntryId}`);

//     // Step 5: Update the jsonBynderAsset field
//     bynderEntry.fields[bynderAssetFieldId] = {
//       [locale]: cmsAssetJSON,
//     };

//     const updatedEntry = await bynderEntry.update();
//     console.log(`[✅ UPDATED] Bynder entry "${bynderEntryId}" updated.`);

//     // Optionally publish
//     // await updatedEntry.publish();
//     // console.log(`[🚀 PUBLISHED] Bynder entry "${bynderEntryId}" published.`);
//   } catch (err) {
//     const msg = `[❌ ERROR] ${err.message}`;
//     console.error(msg);
//     fs.appendFileSync(logFile, `${new Date().toISOString()} - ${msg}\n`);
//   }
// }

// async function transferImageToAppEntry({     //function with auto ref media wrapper entry and auto publish
//   mainEntryId,
//   imageFieldId = 'coverImage',
//   mediaFieldId = 'mediaField',
//   bynderAssetFieldId = 'jsonBynderAsset',
//   mediaContentTypeId = 'mediaWrapper',
//   locale = 'en',
// }) {
//   const logFile = 'contentful-error.log';

//   try {
//     const space = await client.getSpace(spaceId);
//     console.log(`[🔗 CONNECTED] Space ID: ${space.sys.id}`);
//     const env = await space.getEnvironment(environmentId);
//     console.log(`[🔗 CONNECTED] Environment ID: ${env.sys.id}`);

//     // Step 1: Get the main entry
//     const mainEntry = await env.getEntry(mainEntryId);
//     console.log(`[📥 FETCHED] Main Entry ID: ${mainEntry.sys.id}`);

//     // Step 2: Get image asset from coverImage
//     const imageAssetLink = mainEntry.fields?.[imageFieldId]?.[locale];
//     if (!imageAssetLink?.sys?.id) {
//       throw new Error(`No asset found in field '${imageFieldId}' of entry "${mainEntryId}"`);
//     }

//     const assetId = imageAssetLink.sys.id;
//     const asset = await env.getAsset(assetId);
//     const file = asset.fields.file?.[locale];
//     const title = asset.fields.title?.[locale] || 'Untitled Asset';
//     const thumbnail = file?.url ? `https:${file.url}` : '';
//     const originalUrl = thumbnail;

//     const cmsAssetJSON = {
//       type: 'cms',
//       id: assetId,
//       title,
//       thumbnail,
//       originalUrl,
//     };

//     console.log(`[📸 CMS Asset Ready] ${JSON.stringify(cmsAssetJSON, null, 2)}`);

//     // Step 3: Create new media wrapper entry
//     const mediaEntry = await env.createEntry(mediaContentTypeId, {
//       fields: {
//         name: {
//           [locale]: title,
//         },
//         [bynderAssetFieldId]: {
//           [locale]: cmsAssetJSON,
//         },
//       },
//     });

//     console.log(`[🆕 CREATED] Media wrapper entry ID: ${mediaEntry.sys.id}`);

//     // Step 4: Link media wrapper in the main entry
//     mainEntry.fields[mediaFieldId] = {
//       [locale]: {
//         sys: {
//           type: 'Link',
//           linkType: 'Entry',
//           id: mediaEntry.sys.id,
//         },
//       },
//     };

//     const updatedMain = await mainEntry.update();
//     console.log(`[✅ UPDATED] Main entry now links media wrapper.`);

//     // Optional publishing
//     await mediaEntry.publish();
//     await updatedMain.publish();
//     console.log(`[🚀 PUBLISHED] Media wrapper + main entry.`);

//   } catch (err) {
//     const msg = `[❌ ERROR] ${err.message}`;
//     console.error(msg);
//     fs.appendFileSync('contentful-error.log', `${new Date().toISOString()} - ${msg}\n`);
//   }
// }


async function transferImageToAppEntry({
  mainEntryId,
  imageFieldId = 'coverImage',
  mediaFieldId = 'mediaField',
  bynderAssetFieldId = 'jsonBynderAsset',
  mediaContentTypeId = 'mediaWrapper',
  locale = 'en',
}) {
  const logFile = 'contentful-error.log';

  try {
    const space = await client.getSpace(spaceId);
    console.log(`[🔗 CONNECTED] Space ID: ${space.sys.id}`);
    const env = await space.getEnvironment(environmentId);
    console.log(`[🔗 CONNECTED] Environment ID: ${env.sys.id}`);

    // Step 1: Get the main entry
    const mainEntry = await env.getEntry(mainEntryId);
    console.log(`[📥 FETCHED] Main Entry ID: ${mainEntry.sys.id}`);

    // Step 2: Get image asset from coverImage
    const imageAssetLink = mainEntry.fields?.[imageFieldId]?.[locale];
    if (!imageAssetLink?.sys?.id) {
      throw new Error(`No asset found in field '${imageFieldId}' of entry "${mainEntryId}"`);
    }

    const assetId = imageAssetLink.sys.id;
    const asset = await env.getAsset(assetId);
    const file = asset.fields.file?.[locale];
    const title = asset.fields.title?.[locale] || 'Untitled Asset';
    const thumbnail = file?.url ? `https:${file.url}` : '';
    const originalUrl = thumbnail;

    const cmsAssetJSON = {
      type: 'cms',
      id: assetId,
      title,
      thumbnail,
      originalUrl,
    };

    console.log(`[📸 CMS Asset Ready] ${JSON.stringify(cmsAssetJSON, null, 2)}`);

    // Step 3: Check if media wrapper already exists with same name
    const existingEntries = await env.getEntries({
      content_type: mediaContentTypeId,
      'fields.name': title,
      limit: 1,
    });

    let mediaEntry;
    if (existingEntries.items.length > 0) {
      mediaEntry = existingEntries.items[0];
      console.log(`[♻️ REUSED] Existing media wrapper entry ID: ${mediaEntry.sys.id}`);
    } else {
      // Create new media wrapper entry
      mediaEntry = await env.createEntry(mediaContentTypeId, {
        fields: {
          name: {
            [locale]: title,
          },
          [bynderAssetFieldId]: {
            [locale]: cmsAssetJSON,
          },
        },
      });

      console.log(`[🆕 CREATED] Media wrapper entry ID: ${mediaEntry.sys.id}`);

      // Publish new media entry
      await mediaEntry.publish();
      console.log(`[🚀 PUBLISHED] New media wrapper entry.`);
    }

    // Step 4: Link media wrapper in the main entry
    mainEntry.fields[mediaFieldId] = {
      [locale]: {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: mediaEntry.sys.id,
        },
      },
    };

    const updatedMain = await mainEntry.update();
    await updatedMain.publish();

    console.log(`[✅ UPDATED + PUBLISHED] Main entry now links media wrapper.`);

  } catch (err) {
    const msg = `[❌ ERROR] ${err.message}`;
    console.error(msg);
    fs.appendFileSync(logFile, `${new Date().toISOString()} - ${msg}\n`);
  }
}




async function getContentfulEntry(entryId) {
  // const url = `https://app.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/entries/${entryId}`;
 
  // console.log(`🔗 Fetching entry from: ${url}`);
  const bynderAssetFieldId = 'jsonBynderAsset'

  try {
      const space = await client.getSpace(spaceId);
    console.log(`[🔗 CONNECTED] Space ID: ${space.sys.id}`);
    const env = await space.getEnvironment(environmentId);
    console.log(`[🔗 CONNECTED] Environment ID: ${env.sys.id}`);


    // Get Main Entry
    const mainEntry = await env.getEntry(entryId);
    console.log('[🔗 FETCHED] Main Entry:', mainEntry);
    const bynderRef = mainEntry.fields?.[bynderAssetFieldId];
    // const bynderRef = mainEntry.fields?.coverImage;
    console.log('fetched  bynderRef:', bynderRef );
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

module.exports = { getContentfulEntry,transferImageToAppEntry };

// === USAGE ===
// transferImageToAppEntry({
//   mainEntryId:''    //'ENTRY_ID_OF_JOB_OFFERS_6', // e.g., "xyz123abc456"
// });
