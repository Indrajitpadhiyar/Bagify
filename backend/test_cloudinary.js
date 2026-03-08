import "dotenv/config";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Config set. Testing with cloud_name:", process.env.CLOUDINARY_NAME);

try {
    const result = await cloudinary.v2.api.ping();
    console.log("✅ Cloudinary Ping Success:", result);
} catch (error) {
    console.error("❌ Cloudinary Ping Failed:");
    console.log(JSON.stringify(error, null, 2));
    console.error(error);
}
