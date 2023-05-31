import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export default function verifyWebhook(body, hmacHeader) {
  // Assuming your shared secret is stored in an environment variable
  const sharedSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
  
  const calculatedHmac = crypto
    .createHmac('sha256', sharedSecret)
    .update(body, 'utf8')
    .digest('base64');
  
  return crypto.timingSafeEqual(
    Buffer.from(calculatedHmac),
    Buffer.from(hmacHeader)
  );
}