require('dotenv').config();
const express = require('express');
const { getContentfulEntry,transferImageToAppEntry } = require('./contentfulService');

const app = express();
const port = process.env.PORT || 3000;

// ✅ Add this middleware
app.use(express.json()); // To parse JSON bodies



app.get('/entry/:id', async (req, res) => {
  const entryId = req.params.id;

  try {
    const entry = await getContentfulEntry(entryId);
    res.json(entry);
    console.log(`✅ Fetched entry: ${entryId}`);
  } catch (error) {
    console.log(`❌ Error fetching entry: ${entryId}`, error);
    res.status(500).json({ error });
  }
});

app.post('/transfer-image', async (req, res) => {
 
  const { mainEntryId, imageFieldId, bynderRefFieldId, bynderAssetFieldId, locale } = req.body;

  try {
    await transferImageToAppEntry({
      mainEntryId,
      imageFieldId,
      bynderRefFieldId,
      bynderAssetFieldId,
      locale
    });
    res.json({ message: 'Image transfer initiated successfully.' });
    console.log(`✅ Image transfer initiated for entry: ${mainEntryId}`);
  } catch (error) {
    console.log(`❌ Error during image transfer for entry: ${mainEntryId}`, error);
    res.status(500).json({ error });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
