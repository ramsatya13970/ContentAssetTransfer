require('dotenv').config();
const axios = require('axios');

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;


const contentful = require('contentful-management');
const fs = require('fs');
// const spaceId = process.env.CONTENTFUL_SPACE_ID;
// const environmentId = process.env.CONTENTFUL_ENVIRONMENT;
// const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

const client = contentful.createClient({
  accessToken: ACCESS_TOKEN,
});


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
      console.warn(`[⚠️ DRAFT ASSET SKIPPED] ${draftMsg}`);
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





async function getContentfulEntry(entryId,spaceId,environmentId) {
  
  try {
      const space = await client.getSpace(spaceId);
    console.log(`[🔗 CONNECTED] Space ID: ${space.sys.id}`);
    const env = await space.getEnvironment(environmentId);
    console.log(`[🔗 CONNECTED] Environment ID: ${env.sys.id}`);

    const mainEntry = await env.getEntry(entryId);  
    console.log('[🔗 FETCHED] Main Entry:', mainEntry);
    return mainEntry;

  } catch (error) {
    throw error.response?.data || error.message||'unknown error';
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
  } while (skip < total);

  return all;
};

// Wrapper to handle CMS calls with custom error
 const safeCall = async (fn, errorMsg) => {
      try {
        return await fn();
      } catch {
        throw new Error(errorMsg);
      }
    };

const transferAssetToAppEntry = async ({
  mainEntry,
  env,
  imageFieldId,
  mediaFieldId,
  bynderAssetFieldId,
  mediaContentTypeId,
  mainContentTypeId,
  locale,
}) => {
  const logFile = 'contentful-error.log';
  const mainEntryId = mainEntry.sys.id;

  try {
    //  Get image asset from respective image field
    const imageAssetLink = mainEntry.fields?.[imageFieldId]?.[locale];
   
    if (!imageAssetLink?.sys?.id) {
      const noAssetMsg = `⚠️ [NO ASSET] in field '${imageFieldId}' of entry "${mainEntryId}", in main content type '${mainContentTypeId}'`;
      console.warn(noAssetMsg);
      fs.appendFileSync(logFile, `${new Date().toISOString()} - ${noAssetMsg}\n`);
      return; // Skip this entry if no asset found

    }

    const assetId = imageAssetLink.sys.id;
    const asset = await env.getAsset(assetId);

    const isDraft = !asset.sys.publishedVersion || asset.sys.publishedCounter === 0;
    if (isDraft) {
      const draftMsg = `📝 [DRAFT ASSET] Asset ID '${assetId}' in field '${imageFieldId}' of entry '${mainEntryId}', in main Content type '${mainContentTypeId}',  is in draft state (not published). Skipping...`;
      console.warn(`${draftMsg}`);
      fs.appendFileSync(logFile, `${new Date().toISOString()} - ${draftMsg}\n`);
      return;
    }

    const file = asset.fields?.file?.[locale];
    if (!file) {
      const noFileMsg = `Asset ID '${assetId}' in field '${imageFieldId}' of entry '${mainEntryId}' has no file. Skipping...`;
      console.warn(`[📄❓ NO FILE] ${noFileMsg}`);
      fs.appendFileSync(logFile, `${new Date().toISOString()} - ${noFileMsg}\n`);
      return;
    }

    if (!file.contentType.startsWith('image/')) {
      const nonImageMsg = `Asset ID '${assetId}' in field '${imageFieldId}' of entry '${mainEntryId}', in main Content type '${mainContentTypeId}', is not an image (its a: '${file.contentType}'). Skipping...`;
      console.warn(`[🚫 NON-IMAGE ASSET] ${nonImageMsg}`);
      fs.appendFileSync(logFile, `${new Date().toISOString()} - ${nonImageMsg}\n`);
      return;
    }

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

    // Check if media wrapper already exists with same asset ID in global array allMediaWrapperEntries
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

    if(mainEntry.sys?.publishedVersion == null ){ // in Draft status
        console.log(`[✍️Draft Entry - NOT PUBLISHED] Main Entry ${mainEntryId} is not published yet (In Draft status).`);
        fs.appendFileSync(logFile, `${new Date().toISOString()} - [✍️ Draft - NOT PUBLISHED] Main Entry ${mainEntryId} is not published yet (In Draft status).\n`);
        console.log(`[✅ UPDATED Only] Entry ${mainEntryId} linked to media wrapper.`);
    }else if( mainEntry.sys?.version > mainEntry.sys?.publishedVersion+1 ){ //for changed or scheduled entries
        console.log(`[✏️CHANGED/Scheduled Entry] Main Entry ${mainEntryId} is in changed/scheduled status.`);
        fs.appendFileSync(logFile, `${new Date().toISOString()} - [✏️ CHANGED/Scheduled] Main Entry ${mainEntryId} is in changed/scheduled status.\n`);
        console.log(`[✅ UPDATED Only] Entry ${mainEntryId} linked to media wrapper.`);
    }else{
       await safeCall(() => updatedMain.publish(), ` Error publishing main entry ${mainEntryId}`);
       console.log(`[✅ UPDATED + ✅PUBLISHED] Entry ${mainEntryId} linked to media wrapper.`);
    }

  }catch (err) {
    const timestamp = new Date().toISOString();
    const errorMessage = err?.message || JSON.stringify(err) || 'Unknown error';
    const msg = `❌ Error with Main Entry ${mainEntryId} - ${errorMessage}`;
    console.error(msg);
    fs.appendFileSync('contentful-error.log', `${timestamp} - ${msg}\n`);
  }

};


const migrateAllEntries = async ({
  spaceId,
  environmentId,
  MP_TAG_PREFIX,
  mainContentTypeId,
  // contentTypeList,
  imageFieldId,
  mediaFieldId,
  mediaContentTypeId,
  bynderAssetFieldId,
  locale,
}) => {
  try {

    console.log(`----------Starting Media Wrapper migration for content type: ${mainContentTypeId}, meeting place: ${MP_TAG_PREFIX}----------`);
    
    const space = await safeCall(
      () => client.getSpace(spaceId),
      `Issue while fetching space with provided spaceId: '${spaceId}'.`
    );
    if (!space) {
      throw new Error(`❌ Space with ID '${spaceId}' not found.`);
    }

    const environment = await safeCall(
      () => space.getEnvironment(environmentId),
      `Issue while fetching environment '${environmentId}' in space '${spaceId}'.`
    );
    if (!environment) {
      throw new Error(
        `Environment with ID '${environmentId}' not found in space '${spaceId}'.`
      );
    }

    // Validate that the content type has respective imageFieldId, mediaFieldId
    const theFetchedMainContentType= await safeCall(
      () => environment.getContentType(mainContentTypeId),
      `Issue while fetching content type '${mainContentTypeId}' in environment '${environmentId}'.`
    );

    const fieldIds = theFetchedMainContentType.fields.map(f => f.id);
    const missingFields = [];
    if (!fieldIds.includes(imageFieldId)) missingFields.push(imageFieldId);
    if (!fieldIds.includes(mediaFieldId)) missingFields.push(mediaFieldId);

    if (missingFields.length > 0) {
      console.error(
        ` Content type '${mainContentTypeId}' does not have field(s): ${missingFields.join(", ")}. Please check whether you passed correct ID(s).`
      );
      throw new Error(
        ` Content type '${mainContentTypeId}' does not have field(s): ${missingFields.join(", ")}. Please check whether you passed correct ID(s).`
      );
    }

    //fetching and filtering main entries
    const allEntries = [];
    const mainEntries = await safeCall(
      () => fetchAllEntries(environment, mainContentTypeId),
      `Issue while fetching entries for the content type with ID: '${mainContentTypeId}'`
    );
    allEntries.push(...mainEntries);
    console.log(`📦 Fetched ${allEntries.length} entries across content types: ${mainContentTypeId}`);

    //allowing only published and not archived entries (equal to entries fetched with CDA token)
    let filteredEntries = allEntries.filter(
      e => e.sys.publishedAt && !e.sys.archivedAt
    );
    
    console.log(`🔎 Filtered main entries: ${filteredEntries.length} remaining`);
    if (MP_TAG_PREFIX) {
      filteredEntries = filteredEntries.filter(entry =>
        entry.metadata?.tags?.some(tag => tag.sys.id.startsWith(MP_TAG_PREFIX.trim()))//tag.sys.id.startsWith(MP_TAG_PREFIX), tag.sys.id === MP_TAG_PREFIX)
      );

      console.log(`🔎 Filtered mainEntries by tag prefix '${MP_TAG_PREFIX}': ${filteredEntries.length}`);
      if(filteredEntries.length<1){
        // res.status(200).json({ message: `No entries found with tag prefix '${MP_TAG_PREFIX}' in content type '${mainContentTypeId}'.` });
        console.log(`No entries found with tag prefix '${MP_TAG_PREFIX}' in content type '${mainContentTypeId}'.`);
        return; 
      }
    }

    console.log(`📦 Total mainEntries to process: ${filteredEntries.length}`);

    //fetching existing media wrapper entries and storing in a global array
    const existingMediaWrapperEntries = await safeCall(
      () => fetchAllEntries(environment, mediaContentTypeId),
      ` Issue while fetching existing media wrapper entries for content type: '${mediaContentTypeId}'.`
    );

    allMediaWrapperEntries.length = 0;
    allMediaWrapperEntries.push(...existingMediaWrapperEntries);
    console.log(`📦 Fetched ${existingMediaWrapperEntries?.length} existing media wrapper entries.`);


    for (const entry of filteredEntries) {
      console.log(`🔄 Processing entry>>>>>>>>>>: ${entry.sys.id}`);
      await transferAssetToAppEntry({
        mainEntry: entry,
        env: environment,
        imageFieldId,
        mediaFieldId,
        bynderAssetFieldId,
        mediaContentTypeId,
        mainContentTypeId,
        locale,
      });
    }

    console.log(`[🎉 DONE] Migrated ${filteredEntries.length} entries.`);
    // return { message: `Migration completed for ${filteredEntries.length} entries.` };
  } catch (err) {
    // console.error(`[❌ ERROR] Migration failed: ${err}`);
    throw err; // <-- rethrow so outer try-catch can catch it
  }
};


module.exports = { getContentfulEntry,transferImageToAppEntry,migrateAllEntries };

