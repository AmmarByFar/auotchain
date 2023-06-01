import { Session } from "@shopify/shopify-api";
import ShopifySession from '../models/shopifySession.js';

async function getSessionFromStorage(sessionId) {
  // Fetch the session data from your MySQL database
  const sessionData = await ShopifySession.findByPk(sessionId);

  if (!sessionData) {
    throw new Error(`No session found with id ${sessionId}`);
  }

  // Convert sessionData into a plain object
  const sessionObject = sessionData.get({ plain: true });

  // Convert the expires field from seconds (MySQL) to milliseconds (JavaScript)
  if (sessionObject.expires) {
    sessionObject.expires = sessionObject.expires * 1000;
  }

  // Create a new Session from the session data
  const session = new Session(sessionObject);

  return session;
}

export { getSessionFromStorage };
