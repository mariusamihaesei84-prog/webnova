/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_gemini from "../actions/gemini.js";
import type * as actions_indexing from "../actions/indexing.js";
import type * as crons from "../crons.js";
import type * as crons_processPendingIndexing from "../crons/processPendingIndexing.js";
import type * as mutations_admin from "../mutations/admin.js";
import type * as mutations_indexing from "../mutations/indexing.js";
import type * as mutations_init from "../mutations/init.js";
import type * as pages from "../pages.js";
import type * as queries_pages from "../queries/pages.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/gemini": typeof actions_gemini;
  "actions/indexing": typeof actions_indexing;
  crons: typeof crons;
  "crons/processPendingIndexing": typeof crons_processPendingIndexing;
  "mutations/admin": typeof mutations_admin;
  "mutations/indexing": typeof mutations_indexing;
  "mutations/init": typeof mutations_init;
  pages: typeof pages;
  "queries/pages": typeof queries_pages;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
