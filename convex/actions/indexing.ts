"use node";
import { google } from "googleapis";
import { action } from "../_generated/server";
import { v } from "convex/values";

/**
 * Google Indexing API Integration
 * 
 * Submits URLs to Google for fast indexing
 */

/**
 * Submit a URL to Google Indexing API
 */
export const submitUrlToGoogle = action({
    args: {
        url: v.string(),
    },
    handler: async (ctx, args) => {
        const serviceAccountKey = process.env.GOOGLE_INDEXING_KEY;

        if (!serviceAccountKey) {
            throw new Error("GOOGLE_INDEXING_KEY not found in environment variables");
        }

        try {
            // Parse the service account JSON
            const credentials = JSON.parse(serviceAccountKey);

            // Create JWT client for authentication
            const jwtClient = new google.auth.JWT({
                email: credentials.client_email,
                key: credentials.private_key,
                scopes: ["https://www.googleapis.com/auth/indexing"],
            });

            // Authenticate
            await jwtClient.authorize();

            // Create Indexing API client
            const indexing = google.indexing({
                version: "v3",
                auth: jwtClient,
            });

            // Submit URL update notification
            const response = await indexing.urlNotifications.publish({
                requestBody: {
                    url: args.url,
                    type: "URL_UPDATED",
                },
            });

            console.log(`Successfully submitted ${args.url} to Google Indexing API`);

            return {
                success: true,
                url: args.url,
                response: response.data,
            };
        } catch (error) {
            console.error("Error submitting URL to Google:", error);

            return {
                success: false,
                url: args.url,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },
});

/**
 * Get indexing status from Google
 */
export const getIndexingStatus = action({
    args: {
        url: v.string(),
    },
    handler: async (ctx, args) => {
        const serviceAccountKey = process.env.GOOGLE_INDEXING_KEY;

        if (!serviceAccountKey) {
            throw new Error("GOOGLE_INDEXING_KEY not found in environment variables");
        }

        try {
            const credentials = JSON.parse(serviceAccountKey);

            const jwtClient = new google.auth.JWT({
                email: credentials.client_email,
                key: credentials.private_key,
                scopes: ["https://www.googleapis.com/auth/indexing"],
            });

            await jwtClient.authorize();

            const indexing = google.indexing({
                version: "v3",
                auth: jwtClient,
            });

            // Get URL notification metadata
            const response = await indexing.urlNotifications.getMetadata({
                url: args.url,
            });

            return {
                success: true,
                url: args.url,
                metadata: response.data,
            };
        } catch (error) {
            console.error("Error getting indexing status:", error);

            return {
                success: false,
                url: args.url,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },
});
