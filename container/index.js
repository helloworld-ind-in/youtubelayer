const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { google } = require('googleapis');

const fs = require("fs/promises");
const fss = require("fs");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	}
});

const BUCKET = process.env.AWS_BUCKET;
const KEY = process.env.AWS_KEY;

async function getVideoFromS3Bucket() {
	try {
		const command = new GetObjectCommand({
			Bucket: BUCKET,
			Key: KEY,
		});
		const result = await s3Client.send(command);

		const filePath = "video.mp4";
		await fs.writeFile(filePath, result.Body);
		console.log("Video file downloaded successfully.")
	} catch (error) {
		console.log("Error: Unable to download video file.");
		console.log(error);
	}
}

const credentials = {
	web: {
		client_id: process.env.OAUTH_CLIENT_ID,
		client_secret: process.env.OAUTH_CLIENT_SECRET,
		redirect_uri: process.env.OAUTH_REDIRECT_URI
	}
}
const { client_id, client_secret, redirect_uri } = credentials.web;

const oauth2Client = new google.auth.OAuth2(
	client_id,
	client_secret,
	redirect_uri
);

const loadTokens = () => {
	tokenString = `{ "access_token": "${process.env.OAUTH_ACCESS_TOKEN}", "scope": "${process.env.OAUTH_SCOPE}", "token_type": "${process.env.OAUTH_TOKEN_TYPE}", "expiry_date": "${process.env.OAUTH_EXPIRY_DATE}" }`;
	fss.writeFileSync("tokens.json", tokenString);

	if (fss.existsSync('tokens.json')) {
		const tokens = JSON.parse(fss.readFileSync('tokens.json', 'utf8'));
		oauth2Client.setCredentials(tokens);
	} else {
		console.warn('No tokens found. Authenticate yourself first.');
	}
};

loadTokens();

async function publishVideoToYoutube() {
	if (!oauth2Client.credentials) {
		console.log('Unauthorized. Please authenticate first.');
		return;
	}

	try {
		const filePath = path.resolve("video.mp4");
		const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

		const videoMetadata = {
			snippet: {
				title: process.env.YT_TITLE,
				description: process.env.YT_DESCRIPTION,
				tags: process.env.YT_TAGS ? process.env.YT_TAGS.split(',') : [],
			},
			status: {
				privacyStatus: process.env.YT_PRIVACY,
			},
		};

		const response = await youtube.videos.insert({
			part: 'snippet,status',
			requestBody: videoMetadata,
			media: {
				body: fss.createReadStream(filePath),
			},
		});

		console.log("Video published to youtube successfully.");
	} catch (error) {
		console.log("Error: Unable to publish video to youtube.");
		console.log(error);
	}
}

async function main() {
	// get the video from s3 bucket.
	await getVideoFromS3Bucket();

	// upload the video to the youtube.
	await publishVideoToYoutube();
}

main();