import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodePropertyOptions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

/**
 * Make a request to the Webflow API
 */
export async function webflowApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
) {
	const options: IHttpRequestOptions = {
		method,
		qs,
		body,
		url: uri || `https://api.webflow.com/v2${resource}`,
		json: true,
		returnFullResponse: true,
	};

	// Merge in any additional options
	Object.assign(options, option);

	// Remove empty query string or body
	if (Object.keys(options.qs as IDataObject).length === 0) {
		delete options.qs;
	}
	if (Object.keys(options.body as IDataObject).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'webflowOAuth2Api', options);
	} catch (error) {
		if (error.response?.body) {
			const message = error.response.body.message || error.response.body.msg || error.message;
			throw new NodeApiError(this.getNode(), error, { message: `Webflow API error: ${message}` });
		}
		throw error;
	}
}

/**
 * Make a request to the Webflow API and return all results
 */
export async function webflowApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let responseData;

	query.limit = query.limit || 100;
	query.offset = query.offset || 0;

	do {
		responseData = await webflowApiRequest.call(this, method, endpoint, body, query);
		const items = responseData.body?.items;

		if (items && Array.isArray(items)) {
			returnData.push(...items);
		}

		if (responseData.body?.pagination?.offset !== undefined) {
			query.offset = (query.offset as number) + (query.limit as number);
		} else {
			break;
		}
	} while (returnData.length < responseData.body.pagination.total);

	return returnData;
}

/**
 * Load Webflow sites for dropdown options
 */
export async function getSites(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];
	const response = await webflowApiRequest.call(this, 'GET', '/sites');

	const sites = response.body?.sites || [];

	for (const site of sites) {
		returnData.push({
			name: site.displayName || site.name,
			value: site.id,
			description: site.domain ? `Domain: ${site.domain}` : undefined,
		});
	}
	return returnData;
}

/**
 * Load collections for a specific site
 */
export async function getCollections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];
	const siteId = this.getCurrentNodeParameter('siteId') as string;

	if (!siteId) {
		return [];
	}

	try {
		const response = await webflowApiRequest.call(this, 'GET', `/sites/${siteId}/collections`);
		const collections = response.body?.collections || [];

		for (const collection of collections) {
			returnData.push({
				name: collection.displayName || collection.name,
				value: collection.id,
				description: collection.slug ? `Slug: ${collection.slug}` : undefined,
			});
		}
	} catch (error) {
		throw new NodeOperationError(this.getNode(), `Error loading collections: ${error.message}`);
	}

	return returnData;
}

/**
 * Load fields for a specific collection
 */
export async function getFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];
	const collectionId = this.getCurrentNodeParameter('collectionId') as string;

	if (!collectionId) {
		return [];
	}

	try {
		const response = await webflowApiRequest.call(this, 'GET', `/collections/${collectionId}`);
		const fields = response.body?.fields || [];

		if (!Array.isArray(fields)) {
			throw new NodeOperationError(this.getNode(), 'Invalid collection schema format');
		}

		for (const field of fields) {
			// Filter out system fields that shouldn't be modified directly
			const systemFields = ['_archived', '_draft', '_cid', '_id'];
			if (systemFields.includes(field.slug as string)) {
				continue;
			}

			const fieldId = field.slug || field.id;
			let name = field.displayName || field.name || fieldId;

			// Mark required fields
			if (field.required) {
				name += ' (required)';
			}

			// Add type information
			if (field.type) {
				name += ` (${field.type})`;
			}

			returnData.push({
				name: name as string,
				value: fieldId as string,
				description: field.helpText as string,
			});
		}
	} catch (error) {
		throw new NodeOperationError(this.getNode(), `Error loading fields: ${error.message}`);
	}

	return returnData;
}

/**
 * Helper function to process field values from the UI
 */
export function processFieldData(fields: Array<{ fieldId: string; fieldValue: unknown }>): IDataObject {
	const fieldData: IDataObject = {};

	for (const field of fields) {
		const { fieldId, fieldValue } = field;

		// Skip empty fields
		if (!fieldId || fieldValue === undefined || fieldValue === '') {
			continue;
		}

		// Handle special field types based on value patterns
		if (typeof fieldValue === 'string') {
			// Boolean handling (if value is a string "true"/"false")
			if (fieldValue === 'true' || fieldValue === 'false') {
				fieldData[fieldId] = fieldValue === 'true';
				continue;
			}

			// Number handling
			if (!isNaN(Number(fieldValue)) && fieldValue.trim() !== '') {
				fieldData[fieldId] = Number(fieldValue);
				continue;
			}

			// Array/Object handling (JSON strings)
			if ((fieldValue.startsWith('[') && fieldValue.endsWith(']')) ||
				(fieldValue.startsWith('{') && fieldValue.endsWith('}'))) {
				try {
					fieldData[fieldId] = JSON.parse(fieldValue);
					continue;
				} catch (e) {
					// If not valid JSON, treat as string
				}
			}
		}

		// Default case: keep the original value
		fieldData[fieldId] = fieldValue;
	}

	return fieldData;
}

/**
 * Utility to wrap data in the expected format
 */
export function wrapData(data: IDataObject | IDataObject[]): INodeExecutionData[] {
	if (!Array.isArray(data)) {
		return [{ json: data }];
	}
	return data.map((item) => ({
		json: item,
	}));
}
