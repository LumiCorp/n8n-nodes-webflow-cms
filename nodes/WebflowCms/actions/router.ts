import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Import resource operations
import * as create from './Item/create.operation';
import * as update from './Item/update.operation';
import * as del from './Item/delete.operation';
import * as get from './Item/get.operation';
import * as getAll from './Item/getAll.operation';
import * as getFieldsOp from './Collection/getFields.operation';

export type WebflowCmsType = {
	resource: 'item' | 'collection';
	operation: 'create' | 'update' | 'delete' | 'get' | 'getAll' | 'getFields';
};

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	let returnData: INodeExecutionData[] = [];

	const items = this.getInputData();
	const resource = this.getNodeParameter('resource', 0) as WebflowCmsType['resource'];
	const operation = this.getNodeParameter('operation', 0) as WebflowCmsType['operation'];

	// Type checking for resource/operation pairing is handled by the type system
	// We don't need to store this in a variable, just ensuring compatibility
	// with the WebflowCmsType
	void ({ resource, operation } as WebflowCmsType);

	if (resource === 'item') {
		switch (operation) {
			case 'create':
				returnData = await create.execute.call(this, items);
				break;
			case 'update':
				returnData = await update.execute.call(this, items);
				break;
			case 'delete':
				returnData = await del.execute.call(this, items);
				break;
			case 'get':
				returnData = await get.execute.call(this, items);
				break;
			case 'getAll':
				returnData = await getAll.execute.call(this, items);
				break;
			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported!`,
				);
		}
	} else if (resource === 'collection') {
		switch (operation) {
			case 'getFields':
				returnData = await getFieldsOp.execute.call(this, items);
				break;
			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported!`,
				);
		}
	} else {
		throw new NodeOperationError(
			this.getNode(),
			`The resource "${resource}" is not supported!`,
		);
	}

	return [returnData];
}
