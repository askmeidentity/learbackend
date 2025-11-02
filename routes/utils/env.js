const express = require('express');
const router = express.Router();
const {saveEnvConfig, readEnvConfigs, deleteEnvConfig} = require('../../functions/utils/envUtils');

router.post('/configure', (req, res) => {
  const { envName, oktaUrl, apiKey } = req.body;
  if (!envName || !oktaUrl || !apiKey)
    return res.status(400).send('Missing environment variables');

  try{
    saveEnvConfig(envName, oktaUrl, apiKey);
    res.send('Saved successfully');
  }catch(error){
    res.status(500).send(`Error saving environment: ${error.message}`);
  }
});

router.get('/read', (req, res) => {
 try{
    const envList = readEnvConfigs();
    res.json(envList);
 }catch(error){
    res.status(500).send(`Error reading environments: ${error.message}`);
 }
});

module.exports = router;