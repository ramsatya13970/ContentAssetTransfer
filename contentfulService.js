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

const allMediaWrapperEntries=[];
async function transferImageToAppEntry({    //final one
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
    console.log("Asset fetched:", asset.fields.file);

    // ❗ Enhanced Draft Check
    const isDraft = !asset.sys.publishedVersion || asset.sys.publishedCounter === 0;
    if (isDraft) {
      const draftMsg = `Asset ID '${assetId}' in field '${imageFieldId}' of entry '${mainEntryId}' is in draft state (not published). Skipping...`;
      console.warn(`[⚠️ DRAFT SKIPPED] ${draftMsg}`);
      fs.appendFileSync(logFile, `${new Date().toISOString()} - ${draftMsg}\n`);
      return; // Skip further processing if asset is draft
    }

    const file = asset.fields.file?.[locale];
    // if (!file) {
    //   const noFileMsg = `Asset ID '${assetId}' in field '${imageFieldId}' of entry '${mainEntryId}' has no file. Skipping...`;
    //   console.warn(`[❌ NO FILE] ${noFileMsg}`);
    //   fs.appendFileSync(logFile, `${new Date().toISOString()} - ${noFileMsg}\n`);
    //   return;
    // }

    if (!file.contentType.startsWith('image/')) {  //limiting to images only
      const nonImageMsg = `Asset ID '${assetId}' in field '${imageFieldId}' of entry '${mainEntryId}' is not an image (its a: '${file.contentType}'). Skipping...`;
      console.warn(`[🚫 NON-IMAGE ASSET] ${nonImageMsg}`);
      fs.appendFileSync(logFile, `${new Date().toISOString()} - ${nonImageMsg}\n`);
      return;
    }
    console.log("✅ File fetched (image):", file);

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

    const existingMediaWrapperEntries = await env.getEntries({
      content_type: mediaContentTypeId,
      // 'fields.name': title,
      // limit: 1,
    });
    allMediaWrapperEntries.length = 0;
    allMediaWrapperEntries.push(...existingMediaWrapperEntries.items);
    console.log(`📦 Fetched ${existingMediaWrapperEntries.items.length} existing media wrapper entries.`);
    // const existingEntries=allMediaWrapperEntries.filter(entry => entry.fields[bynderAssetFieldId]?.[locale]?.id === assetId);
    // console.log("Existing entries with same asset ID:", existingEntries.length);
    const existingEntry = allMediaWrapperEntries.find(
      entry => entry.fields?.[bynderAssetFieldId]?.[locale]?.id === assetId
    );
    console.log("existingEntry:", existingEntry);
    // console.log("existingEntries:>>>>>>>>>>>>>>>>>>>",  existingEntries.items[0]);
    // const existingEntries = await env.getEntries({ //check if media wrapper already exists with same asset ID
    //   content_type: mediaContentTypeId,
    //   [`fields.${bynderAssetFieldId}.en.id`]: assetId,
    //   // 'fields.mediaId': assetId, // Use mediaId to check for existing entries
    //   limit: 1,
    // });

    let mediaEntry;
    if (existingEntry) {
      mediaEntry = existingEntry;
      console.log(`[♻️ REUSED] Existing media wrapper entry ID: ${mediaEntry.sys.id}`);
    }  else {
      // Create new media wrapper entry
      mediaEntry = await env.createEntry(mediaContentTypeId, {
        fields: {
          name: {
            [locale]: title,
          },
          // mediaId:cmsAssetJSON.id, // Add mediaId field to fetch it without fetching all the media wrapperentries
          [bynderAssetFieldId]: {
            [locale]: cmsAssetJSON,
          },
        },
      });
      allMediaWrapperEntries.push(mediaEntry);

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
    console.log("meeting place:", mainEntry.metadata?.tags);
    const bynderRef = mainEntry.fields?.[bynderAssetFieldId];
    // const bynderRef = mainEntry.fields?.coverImage;
    console.log('fetched  bynderRef:', bynderRef );
  } catch (error) {
    throw error.response?.data || error.message;
  }
}



const fetchAllEntries = async (environment, contentTypeId) => {
  const all = [];
  let skip = 0;
  let total = 0;
  const limit = 1000;

  do {
    const res = await environment.getEntries({
      content_type: contentTypeId,
      limit,
      skip,
    });
    total = res.total;
    all.push(...res.items);
    skip += limit;
    console.log(`📦 Fetched ${res.items.length} entries (total so far: ${all.length}) for ${contentTypeId}`);
  } while (skip < total);

  return all;
};

const transferAssetToAppEntry = async ({
  mainEntry,
  env,
  imageFieldId = 'coverImage',
  mediaFieldId = 'mediaField',
  bynderAssetFieldId = 'jsonBynderAsset',
  mediaContentTypeId = 'mediaWrapper',
  locale = 'en',
}) => {
  const logFile = 'contentful-error.log';
  const mainEntryId = mainEntry.sys.id;

  try {
    // Step 2: Get image asset from coverImage
    const imageAssetLink = mainEntry.fields?.[imageFieldId]?.[locale];
    if (!imageAssetLink?.sys?.id) {
      throw new Error(`No asset found in field '${imageFieldId}' of entry "${mainEntryId}"`);
    }

    const assetId = imageAssetLink.sys.id;
    const asset = await env.getAsset(assetId);
    console.log("Asset fetched:", asset.fields.file);

    const isDraft = !asset.sys.publishedVersion || asset.sys.publishedCounter === 0;
    if (isDraft) {
      const draftMsg = `Asset ID '${assetId}' in field '${imageFieldId}' of entry '${mainEntryId}' is in draft state (not published). Skipping...`;
      console.warn(`[⚠️ DRAFT SKIPPED] ${draftMsg}`);
      fs.appendFileSync(logFile, `${new Date().toISOString()} - ${draftMsg}\n`);
      return;
    }

    const file = asset.fields.file?.[locale];
    // if (!file) {
    //   const noFileMsg = `Asset ID '${assetId}' in field '${imageFieldId}' of entry '${mainEntryId}' has no file for locale '${locale}'. Skipping...`;
    //   console.warn(`[❌ NO FILE] ${noFileMsg}`);
    //   fs.appendFileSync(logFile, `${new Date().toISOString()} - ${noFileMsg}\n`);
    //   return;
    // }

    if (!file.contentType.startsWith('image/')) {
      const nonImageMsg = `Asset ID '${assetId}' in field '${imageFieldId}' of entry '${mainEntryId}' is not an image (its a: '${file.contentType}'). Skipping...`;
      console.warn(`[🚫 NON-IMAGE ASSET] ${nonImageMsg}`);
      fs.appendFileSync(logFile, `${new Date().toISOString()} - ${nonImageMsg}\n`);
      return;
    }

    console.log("✅ Valid image asset:", file);
    console.log("✅ File fetched (image):", file);
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

    // const existingEntries = await env.getEntries({
    //   content_type: mediaContentTypeId,
    //   'fields.name': title,
    //   limit: 1,
    // });
    
    const existingEntry = allMediaWrapperEntries.find(
      entry => entry.fields?.[bynderAssetFieldId]?.[locale]?.id === assetId
    );

    let mediaEntry;
    if (existingEntry) {
      mediaEntry = existingEntry;
      console.log(`[♻️ REUSED] Existing media wrapper entry ID: ${mediaEntry.sys.id}`);
    } else {
      mediaEntry = await env.createEntry(mediaContentTypeId, {
        fields: {
          name: { [locale]: title },
          [bynderAssetFieldId]: { [locale]: cmsAssetJSON },
        },
      });
      allMediaWrapperEntries.push(mediaEntry);
      await mediaEntry.publish();
      console.log(`[🚀 PUBLISHED] New media wrapper entry.`);
    }

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

    console.log(`[✅ UPDATED + PUBLISHED] Entry ${mainEntryId} linked to media wrapper.`);

  } catch (err) {
    const msg = `[❌ ERROR] Entry ${mainEntryId} - ${err.message}`;
    console.error(msg);
    fs.appendFileSync('contentful-error.log', `${new Date().toISOString()} - ${msg}\n`);
  }
};

const migrateAllEntries = async ({
  spaceId,
  environmentId,
  // client,
  contentTypeList,
  MP_TAG_PREFIX,
  imageFieldId = 'coverImage',
  mediaFieldId = 'mediaField',
  bynderAssetFieldId = 'jsonBynderAsset',
  mediaContentTypeId = 'mediaWrapper',
  locale = 'en',
}) => {
  try {
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);
    console.log(`[🔗 CONNECTED] Space: ${space.sys.id}, Env: ${environment.sys.id}`);

    const allEntries = [];
    for (const contentTypeId of contentTypeList) {
      const entries = await fetchAllEntries(environment, contentTypeId);
      allEntries.push(...entries);
    }
    console.log(`📦 Fetched ${allEntries.length} entries across content types: ${contentTypeList.join(', ')}`);

    let filteredEntries = allEntries.filter(entry => !entry.sys.archivedAt);
    console.log(`🔎 Filtered out archived entries: ${filteredEntries.length} remaining`);
    // console.log("structure of filteredEntries:", JSON.stringify(filteredEntries[1], null, 2));
    if (MP_TAG_PREFIX) {
      filteredEntries = filteredEntries.filter(entry =>
        entry.metadata?.tags?.some(tag => tag.sys.id.includes(MP_TAG_PREFIX))//tag.sys.id.startsWith(MP_TAG_PREFIX))
      );
      // filteredEntries = filteredEntries.filter(entry =>
      //   entry.metadata?.tags?.some(tag => tag.sys.id === MP_TAG_PREFIX)
      // );
      // const MP = 'Matosinhos';

      //  filteredEntries = filteredEntries.filter(entry => {
      //   const internalName = entry.fields?.internalName?.en || '';
      //   return internalName.toLowerCase().includes(MP_TAG_PREFIX.toLowerCase());
      // });
      console.log(`🔎 Filtered entries by tag prefix '${MP_TAG_PREFIX}': ${filteredEntries.length}`);
    }

    console.log(`📦 Total entries to process: ${filteredEntries.length}`);
    // console.log("First 2 entries of filteredEntries:", JSON.stringify(filteredEntries.slice(0, 2), null, 2));

     const existingMediaWrapperEntries = await environment.getEntries({
      content_type: mediaContentTypeId,
      // 'fields.name': title,
      // limit: 1,
    });
    allMediaWrapperEntries.length = 0;
    allMediaWrapperEntries.push(...existingMediaWrapperEntries.items);
    console.log(`📦 Fetched ${existingMediaWrapperEntries.items.length} existing media wrapper entries.`);

    //  return; // Uncomment this line to skip processing for debugging

    for (const entry of filteredEntries) {
      console.log(`🔄 Processing entry>>>>>>>>>>: ${entry.sys.id}`);
      await transferAssetToAppEntry({
        mainEntry: entry,
        env: environment,
        imageFieldId,
        mediaFieldId,
        bynderAssetFieldId,
        mediaContentTypeId,
        locale,
      });
    }

    console.log(`[🎉 DONE] Migrated ${filteredEntries.length} entries.`);
  } catch (err) {
    console.error(`[❌ ERROR] Migration failed: ${err.message}`);
  }
};


module.exports = { getContentfulEntry,transferImageToAppEntry,migrateAllEntries };

// === USAGE ===
// transferImageToAppEntry({
//   mainEntryId:''    //'ENTRY_ID_OF_JOB_OFFERS_6', // e.g., "xyz123abc456"
// });
