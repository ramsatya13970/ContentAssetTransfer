require('dotenv').config();
const axios = require('axios');

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;



// async function getContentfulEntry(entryId) {
//   const url = `https://app.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/entries/${entryId}`;
 
//   console.log(`🔗 Fetching entry from: ${url}`);

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${ACCESS_TOKEN}`,
//       },
//     });
//     // console.log(`✅ Entry fetched successfully: ${response.data.sys.id}`);
//     console.log(`🔗 Entry fields:`, response);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// }

// module.exports = { getContentfulEntry };

const contentful = require('contentful-management');
const fs = require('fs');
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT;
const ACCESS_TOKEN1 = process.env.CONTENTFUL_ACCESS_TOKEN;

const client = contentful.createClient({
  accessToken: ACCESS_TOKEN1,
});

async function transferImageToAppEntry({
  // spaceId,
  // environmentId,
  mainEntryId,
  imageFieldId = 'image',
  bynderRefFieldId = 'bynberrefrence',
  bynderAssetFieldId = 'jsonBynderAsset',
  locale = 'en',
}) {
  const logFile = 'contentful-error.log';

  try {
    const space = await client.getSpace(spaceId);
    console.log(`[🔗 CONNECTED] Space ID: ${space.sys.id}`);
    const env = await space.getEnvironment(environmentId);
    console.log(`[🔗 CONNECTED] Environment ID: ${env.sys.id}`);

    // Get Main Entry
    const mainEntry = await env.getEntry(mainEntryId);
    console.log(`[🔗 FETCHED] Main Entry ID: ${mainEntry.sys.id}`);
    // console.log('[🧾 DEBUG] mainEntry.fields:', JSON.stringify(mainEntry.fields, null, 2));


    // Step 1: Get the image reference from 'image' field
    const imageAsset = mainEntry.fields?.[imageFieldId]?.[locale];
    console.log(`[🔗 FETCHED] Image Asset from field '${imageFieldId}':`, imageAsset);
    if (!imageAsset?.sys?.id) {
      throw new Error(`No asset found in '${imageFieldId}' of entry "${mainEntryId}"`);
    }
    console.log(`[✅ ASSET FOUND] Asset ID: ${imageAsset.sys.id}`);

    // Step 2: Get reference to the Bynder app entry
    const bynderRef = mainEntry.fields?.[bynderRefFieldId]?.[locale];
    if (!bynderRef?.sys?.id) {
      throw new Error(`No reference found in '${bynderRefFieldId}' of entry "${mainEntryId}"`);
    }
    const bynderEntryId = bynderRef.sys.id;
    console.log('fetched  AppEntryId:', bynderEntryId );
    

    // Step 3: Update jsonBynderAsset field in the Bynder entry
    const bynderEntry = await env.getEntry(bynderEntryId);
    console.log('Got app entry:',bynderEntry);

    bynderEntry.fields[bynderAssetFieldId] = {
      [locale]: {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: imageAsset.sys.id,
        },
      },
    };

    console.log("bynderEntryNow:---->>>>>",bynderEntry.fields[bynderAssetFieldId])


    const updatedBynder = await bynderEntry.update();
    console.log(`[✅ UPDATED] Bynder entry "${bynderEntryId}" updated.`);
    return;

    // === COMMIT POINT ===
    // await updatedBynder.publish();
    // console.log(`[🚀 PUBLISHED] Bynder entry "${bynderEntryId}" published.`);

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
