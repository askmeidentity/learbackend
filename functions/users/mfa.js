const axios = require('axios');

const OKTA_ORG_URL = process.env.OKTA_ORG_URL;
const API_TOKEN = process.env.OKTA_API_TOKEN;
const headers = {
  Authorization: `SSWS ${API_TOKEN}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// Fetch all enrolled factors for a user
async function getUserEnrolledFactors(userId) {
  const url = `${OKTA_ORG_URL}/api/v1/users/${userId}/factors`;
  try {
    const response = await axios.get(url, { headers });
    return response.data; // Array of factor objects
  } catch (error) {
    throw new Error(`Failed to get factors for ${userId}: ${error.response?.data?.errorSummary || error.message}`);
  }
}

// Reset factors that match the given factor types list
// factorsToReset is an array of factorType strings, e.g. ['push', 'sms', 'question']
async function resetMatchedFactors(userId, factorsToReset) {
  try {
    const enrolledFactors = await getUserEnrolledFactors(userId);
    const results = [];

    for (const factor of enrolledFactors) {
      // factor.factorType examples: 'push', 'sms', 'question', 'token:software:totp'
      if (factorsToReset.includes(factor.factorType)) {
        const url = `${OKTA_ORG_URL}/api/v1/users/${userId}/factors/${factor.id}`;
        try {
          await axios.delete(url, { headers });
          results.push({ factorType: factor.factorType, status: 'reset-success' });
        } catch (err) {
          results.push({ factorType: factor.factorType, status: 'reset-failed', error: err.response?.data?.errorSummary || err.message });
        }
      }
    }
    return results;
  } catch (err) {
    throw new Error(`Error resetting factors for ${userId}: ${err.message}`);
  }
}

module.exports = { getUserEnrolledFactors, resetMatchedFactors };
