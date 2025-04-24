// echo-env.cjs
require('dotenv').config();
console.log('SANITY_PROJECT_ID:', process.env.SANITY_PROJECT_ID);
console.log('SANITY_DATASET:', process.env.SANITY_DATASET);
