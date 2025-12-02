import { internalAction } from "../_generated/server";
import { internal, api } from "../_generated/api";

/**
 * Internal cron job handlers
 * 
 * These are called by the cron scheduler
 */

/**
 * Process all pages pending Google indexing
 */
export const processPendingIndexing = internalAction({
    args: {},
    handler: async (ctx): Promise<{ processed: number }> => {
        // Get all pages that need indexing
        const pendingPages = await ctx.runQuery(
            api.queries.pages.getPendingIndexingPages
        );

        console.log(`Found ${pendingPages.length} pages pending indexing`);

        // Process each page
        for (const page of pendingPages) {
            try {
                // Construct full URL
                const url = `https://webnova.ro/${page.slug}`;

                // Submit to Google Indexing API
                const result = await ctx.runAction(
                    api.actions.indexing.submitUrlToGoogle,
                    { url }
                );

                if (result.success) {
                    // Update page indexing status to submitted
                    await ctx.runMutation(
                        api.pages.updateIndexingStatus,
                        {
                            id: page._id,
                            indexing_status: "submitted",
                        }
                    );

                    // Create success log entry
                    await ctx.runMutation(internal.mutations.indexing.createLog, {
                        page_id: page._id,
                        url,
                        request_type: "URL_UPDATED",
                        status: "success",
                        response_data: result.response,
                    });

                    console.log(`Successfully submitted ${url} to Google`);
                } else {
                    // Create failure log entry
                    await ctx.runMutation(internal.mutations.indexing.createLog, {
                        page_id: page._id,
                        url,
                        request_type: "URL_UPDATED",
                        status: "failed",
                        error_message: result.error,
                    });

                    console.error(`Failed to submit ${url}: ${result.error}`);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';

                // Create failure log entry for exception
                await ctx.runMutation(internal.mutations.indexing.createLog, {
                    page_id: page._id,
                    url: `https://webnova.ro/${page.slug}`,
                    request_type: "URL_UPDATED",
                    status: "failed",
                    error_message: errorMessage,
                });

                console.error(`Error processing page ${page._id}:`, error);
            }
        }

        return {
            processed: pendingPages.length,
        };
    },
});
