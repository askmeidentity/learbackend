const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join('./env-config.json');

// Save or update an environment
function saveEnvConfig(envName, oktaUrl, apiKey) {
  const newEntry = { envName, oktaUrl, apiKey };

  let envList = [];
  if (fs.existsSync(CONFIG_PATH)) {
    const fileData = fs.readFileSync(CONFIG_PATH, 'utf-8');
    try {
      envList = JSON.parse(fileData) || [];
    } catch {
      envList = [];
    }
  }

  const index = envList.findIndex(e => e.envName === envName);
  if (index !== -1) {
    envList[index] = newEntry;
  } else {
    envList.push(newEntry);
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(envList, null, 2));
  return envList;
}

// Read all environments
function readEnvConfigs() {
  if (!fs.existsSync(CONFIG_PATH)) return [];
  try {
    const fileData = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const envList = JSON.parse(fileData);
    return Array.isArray(envList) ? envList : [];
  } catch {
    return [];
  }
}

// Delete an environment by name
function deleteEnvConfig(envName) {
  if (!fs.existsSync(CONFIG_PATH)) return [];

  const fileData = fs.readFileSync(CONFIG_PATH, 'utf-8');
  let envList = [];
  try {
    envList = JSON.parse(fileData) || [];
  } catch {
    envList = [];
  }

  const updatedList = envList.filter(e => e.envName !== envName);
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(updatedList, null, 2));
  return updatedList;
}

module.exports = { saveEnvConfig, readEnvConfigs, deleteEnvConfig };
