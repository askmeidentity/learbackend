const axios = require('axios');

const OKTA_ORG_URL = process.env.OKTA_ORG_URL;
const API_TOKEN = process.env.OKTA_API_TOKEN;
const headers = {
  Authorization: `SSWS ${API_TOKEN}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

//Fetch user by usermame
// Fetch Okta user ID by username (login)
async function getUserIdByUsername(username) {
  const url = `${OKTA_ORG_URL}/api/v1/users/${username}`;
  try {
    // Okta allows filtering users by login using query parameters
    const response = await axios.get(url, {
      headers
    });
    const user = response.data;
    console.log(`Found user:`, user.id);
    return user.id; // Return userId of the first matched user
  } catch (error) {
    throw new Error(`Failed to get userId for username ${username}: ${error.response?.data?.errorSummary || error.message}`);
  }
}


// Fetch all enrolled factors for a user
async function getUserEnrolledFactors(userId) {
  // console.log("Received userId for factors:", userId);
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
async function resetMatchedFactors(username, factorsToReset) {
  try {
    // console.log("Searching for user:", username);
    const userId = await getUserIdByUsername(username);
    // console.log("Got userId:", userId);
    const enrolledFactors = await getUserEnrolledFactors(userId);
    const results = [];
    // console.log("Enrolled factors:", enrolledFactors);
    for (const factor of enrolledFactors) {
  
      // factor.factorType examples: 'push', 'sms', 'question', 'token:software:totp'
      console.log("Checking factor:", factorsToReset);
      if (factorsToReset[factor.factorType]) {
       
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

module.exports = { getUserEnrolledFactors, resetMatchedFactors, getUserIdByUsername };
