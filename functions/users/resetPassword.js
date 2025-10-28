require('dotenv').config();
const axios = require('axios');


async function setOktaUserPassword(userId, newPassword, expireNow = false) {
    const config = {
        url: `${process.env.OKTA_ORG_URL}/api/v1/users/${userId}`,
        method: 'put',
        headers: {
            'Authorization': `SSWS ${process.env.OKTA_API_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: {
            credentials: {
                password: { value: newPassword }
            }
        }
    }

    try{
        let promise = await axios(config);
        if (expireNow) {
            const expireConfig = {
                url: `${process.env.OKTA_ORG_URL}/api/v1/users/${userId}/lifecycle/expire_password`,
                method: 'post',
                headers: {
                    'Authorization': `SSWS ${process.env.OKTA_API_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            promise = await axios(expireConfig);
        }
        return promise;
    }
    catch(error){
        throw new Error(`Error setting password: ${error.response ? error.response.data.errorSummary : error.message}`);
    }
}

module.exports = { setOktaUserPassword };