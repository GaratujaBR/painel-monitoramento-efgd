const config = {
  auth: {
    clientId: process.env.SHAREPOINT_CLIENT_ID,
    clientSecret: process.env.SHAREPOINT_CLIENT_SECRET,
    tenantId: 'mtegovbr',
    siteUrl: 'https://mtegovbr.sharepoint.com/sites/CGGOV534',
  },
  file: {
    id: '6308C256-9159-4D4C-BA44-830D061400D8',
    name: 'AcompanhaEFGD.xlsx',
    path: '_layouts/15/Doc.aspx'
  },
  cache: {
    ttl: 300, // 5 minutes cache
    maxSize: 100 // Maximum items in cache
  }
};

module.exports = config;
