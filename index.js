require('dotenv').config();
const express = require('express');
const { getContentfulEntry ,migrateAllEntries} = require('./contentfulService');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 


app.get('/entry/:id', async (req, res) => {
  const entryId = req.params.id;
  const { spaceId, environmentId } = req.query;
  console.log(`🔗 Fetching entry with ID: ${entryId} for space: ${spaceId}, environment: ${environmentId}`);

  if (!spaceId || !environmentId) {
    return res.status(400).json({ error: 'spaceId and environmentId are required query parameters.' });
  }

  try {
    const entry = await getContentfulEntry(entryId, spaceId, environmentId);
    res.json(entry);
    console.log(`✅ Fetched entry: ${entryId}`);
  } catch (error) {
    console.error(`❌ Error fetching entry: ${entryId}`, error);
    res.status(500).json({ error: error.message || error });
  }
});


app.post('/transfer-image-forAll', async (req, res) => {
  const {
    spaceId,
    environmentId,
    // contentTypeList,
    mainContentTypeId,
    MP_TAG_PREFIX,
    imageFieldId = 'coverImage',
    mediaFieldId = 'mediaField',
    bynderAssetFieldId = 'jsonBynderAsset',
    mediaContentTypeId = 'mediaWrapper',
    locale = 'en',
  } = req.body;

  // Collect missing parameters if any
  const missingParams = [];

  if (!spaceId || spaceId.trim().length<1) missingParams.push('spaceId');
  if (!environmentId || environmentId.trim().length<1) missingParams.push('environmentId');
  // if (!contentTypeList || !Array.isArray(contentTypeList) || contentTypeList.length === 0) missingParams.push('contentTypeList');
  if (!mainContentTypeId || mainContentTypeId.trim().length<1) missingParams.push('mainContentTypeId');
  if (!MP_TAG_PREFIX || MP_TAG_PREFIX.trim().length<1) missingParams.push('MP_TAG_PREFIX');
  if (!imageFieldId || imageFieldId.trim().length<1) missingParams.push('imageFieldId');
  if (!mediaFieldId || mediaFieldId.trim().length<1) missingParams.push('mediaFieldId');
  if (!bynderAssetFieldId || bynderAssetFieldId.trim().length<1) missingParams.push('bynderAssetFieldId');
  if (!mediaContentTypeId || mediaContentTypeId.trim().length<1) missingParams.push('mediaContentTypeId');
  if (!locale || locale.trim().length<1) missingParams.push('locale');

  if (missingParams.length > 0) {
    console.error(`❌ Missing or invalid parameters: ${missingParams.join(', ')}`);
    return res.status(400).json({
      error: `Missing or invalid parameters: ${missingParams.join(', ')}`,
    });
  }

  if(mediaContentTypeId !== 'mediaWrapper') {
      console.error(`❌ Invalid mediaContentTypeId: ${mediaContentTypeId}. Expected 'mediaWrapper'.`);
      return res.status(400).json({ error: 'Invalid mediaContentTypeId. It should be: mediaWrapper' });
  }
  if(bynderAssetFieldId !== 'jsonBynderAsset') {
    console.error(`❌ Invalid bynderAssetFieldId: ${bynderAssetFieldId}. Expected 'jsonBynderAsset'.`);
    return res.status(400).json({ error: 'Invalid bynderAssetFieldId. It should be: jsonBynderAsset' });
  }

  if(environmentId !== 'TEST') {
    console.error(`❌ Invalid environmentId: ${environmentId}. Expected 'TEST'.`);
    return res.status(400).json({ error: 'Invalid environmentId. For now it works only for: TEST' });
  }

  try {

    await migrateAllEntries({
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
    });

    res.json({ message: 'Bulk image transfer API executed successfully.' });
    // console.log(`✅ Bulk image transfer completed for content types: ${contentTypeList.join(', ')}`);
    console.log(`✅ Bulk image transfer API executed successfully for Content type: ${mainContentTypeId}`);
  } catch (error) {
    console.error(`❌ Bulk image transfer failed:`, error);
    res.status(500).json({
      error: 'Bulk image transfer failed.',
      details: error.message,
    });
  }
});


app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
