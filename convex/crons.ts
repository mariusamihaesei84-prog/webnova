import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

/**
 * Cron jobs for WebNova.ro
 * 
 * Scheduled tasks that run automatically
 */

const crons = cronJobs();

/**
 * Hourly job to submit pending pages to Google Indexing API
 * 
 * This job:
 * 1. Finds all published pages with indexing_status = "pending"
 * 2. Submits them to Google Indexing API
 * 3. Updates their status to "submitted"
 */
crons.cron(
    "submit-to-google-indexing",
    "0 * * * *", // Run every hour at minute 0
    internal.crons.processPendingIndexing.processPendingIndexing
);

export default crons;
