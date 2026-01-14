
import dotenv from "dotenv";
import sendEmail from "./src/utils/sendEmail.js";
import path from "path";
import { fileURLToPath } from "url";

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

console.log("Testing Email Sending...");
console.log("SMTP Host:", process.env.SMTP_SERVICE);
console.log("SMTP User:", process.env.SMTP_MAIL);

const testSend = async () => {
    try {
        await sendEmail({
            email: "test@example.com",
            subject: "Test Email from Debugger",
            message: "This is a test email to verify the configuration.",
        });
        console.log("✅ Email sent successfully (check Ethereal if using that).");
    } catch (error) {
        console.error("❌ Email sending failed:", error);
    }
};

testSend();
