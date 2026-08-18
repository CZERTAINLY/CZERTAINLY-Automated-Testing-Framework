/**
 * customAttributeUtils — API wrappers for Custom Attribute definitions in ILM.
 *
 * WHAT: helpers to find and delete Custom Attribute definitions via ILM REST API.
 * WHY: SMK-008 creates and manages Custom Attributes via UI as the primary flow;
 *      API is used only for afterEach cleanup — remove leftover definition
 *      if the test failed mid-way.
 * HOW: GET /api/v1/attributes/custom returns all definitions; DELETE with body
 *      array of UUIDs removes them (204 on success).
 */

import { APIRequestContext } from '@playwright/test';
import { Logger } from './Logger';

const logger = new Logger('CustomAttributeUtils');

const CUSTOM_ATTRIBUTES_API = '/api/v1/attributes/custom';

export async function findCustomAttributeByName(
    request: APIRequestContext,
    name: string,
): Promise<{ uuid: string } | null> {
    logger.info(`Searching for custom attribute with name: ${name}`);
    const response = await request.get(CUSTOM_ATTRIBUTES_API);
    if (!response.ok()) {
        const errBody = await response.text();
        throw new Error(`Failed to list custom attributes: ${response.status()} - ${errBody}`);
    }
    const attributes = await response.json() as Array<{ uuid: string; name: string }>;
    const found = attributes.find(a => a.name === name);
    if (!found) {
        logger.info(`No custom attribute found with name: ${name}`);
        return null;
    }
    return { uuid: found.uuid };
}

export async function deleteCustomAttribute(
    request: APIRequestContext,
    uuid: string,
): Promise<void> {
    logger.info(`Deleting custom attribute: ${uuid}`);
    const response = await request.delete(CUSTOM_ATTRIBUTES_API, {
        data: [uuid],  // API accepts an array of UUIDs for batch delete
    });
    if (!response.ok() && response.status() !== 204 && response.status() !== 404) {
        const errBody = await response.text();
        throw new Error(`Failed to delete custom attribute ${uuid}: ${response.status()} - ${errBody}`);
    }
}