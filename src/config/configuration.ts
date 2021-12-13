import * as dotenv from 'dotenv';

dotenv.config();

export default () => ({
    mongo: {
        uri: process.env.MONGO_URI,
    },
    discord: {
        token: process.env.DISCORD_TOKEN,
    }
});
