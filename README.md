# n8n-nodes-webflow-cms

This is an n8n community node. It lets you create and update items in Webflow CMS collections directly from your n8n workflows.

[Webflow](https://webflow.com/) is a no-code website builder platform that also includes a powerful CMS (Content Management System) for managing structured content.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Field Type Handling](#field-type-handling)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The Webflow CMS node supports the following operations:

### Item Operations
- **Create Item**: Create a new content item in a Webflow CMS collection
- **Update Item**: Update an existing content item in a Webflow CMS collection
- **Delete Item**: Delete an existing content item from a Webflow CMS collection
- **Get Item**: Retrieve a specific content item by ID
- **Get All Items**: Retrieve all content items from a collection

### Collection Operations
- **Get Fields**: Retrieve all fields defined in a collection

Create and Update operations support publishing to live site or creating/updating as draft.

## Credentials

The Webflow CMS node supports two authentication methods:

### API Token Authentication

You need a Webflow Site API token to use this authentication method. See the [API Token Guide](docs/API_TOKEN_GUIDE.md) for detailed instructions.

### OAuth2 Authentication

For enhanced security and user-specific access, the node also supports OAuth2 authentication:

1. Create a Webflow Developer Application at https://webflow.com/dashboard/workspace/integrations
2. Set up your application with:
   - A descriptive name and description
   - Redirect URI matching your n8n installation (e.g., `https://your-n8n-instance.com/rest/oauth2-credential/callback`)
   - Required scopes: `sites:read`, `cms:read`, `cms:write`
3. In n8n, go to Credentials > Add new
4. Search for "Webflow OAuth2 API"
5. Enter your Client ID and Client Secret from the Webflow Developer Application
6. Follow the OAuth2 authorization flow to grant access

The OAuth2 method is recommended for production environments and when building integrations for multiple users.

## Compatibility

This node has been developed and tested with n8n version 1.0.0 and later.

- Supports both Webflow API v1 and v2
- Compatible with all Webflow collection types
- Handles all standard Webflow CMS field types

## Usage

## Usage

### Item Operations

#### Creating a New Item

To create a new item in a Webflow CMS collection:

1. Add the Webflow CMS node to your workflow
2. Select "Item" as the resource and "Create" as the operation
3. Choose the site and collection from the dropdown menus
4. Toggle "Publish to Live Site" if you want to publish immediately
5. Add fields and values that you want to set
6. At minimum, you must provide a "name" field value
7. Run the workflow to create the item

![Create Item Example](https://example.com/path-to-image.png)

#### Updating an Existing Item

To update an existing item:

1. Add the Webflow CMS node to your workflow
2. Select "Item" as the resource and "Update" as the operation
3. Choose the site and collection
4. Enter the Item ID of the item you want to update
5. Add the fields and values you want to update
6. Toggle "Publish to Live Site" if you want to publish immediately
7. Run the workflow to update the item

#### Deleting an Item

To delete an existing item:

1. Add the Webflow CMS node to your workflow
2. Select "Item" as the resource and "Delete" as the operation
3. Choose the site and collection
4. Enter the Item ID of the item you want to delete
5. Run the workflow to permanently delete the item

#### Getting a Single Item

To retrieve a specific item:

1. Add the Webflow CMS node to your workflow
2. Select "Item" as the resource and "Get" as the operation
3. Choose the site and collection
4. Enter the Item ID of the item you want to retrieve
5. Run the workflow to get the item data

#### Getting All Items

To retrieve all items from a collection:

1. Add the Webflow CMS node to your workflow
2. Select "Item" as the resource and "Get All" as the operation
3. Choose the site and collection
4. Optionally set pagination limits
5. Run the workflow to get all items

### Collection Operations

#### Getting Collection Fields

To retrieve the field schema for a collection:

1. Add the Webflow CMS node to your workflow
2. Select "Collection" as the resource and "Get Fields" as the operation
3. Choose the site and collection
4. Run the workflow to get the complete field structure

### Example: Creating a Blog Post

This example creates a new blog post in a Webflow CMS collection:

1. Set resource to "Item" and operation to "Create"
2. Select your blog site and Posts collection
3. Add the following fields:
   - Field: name, Value: My New Blog Post
   - Field: slug, Value: my-new-blog-post
   - Field: post-body, Value: This is the content of my blog post.
   - Field: author, Value: Jane Doe
4. Toggle "Publish to Live Site" to true if you want to publish immediately
5. Run the workflow

### Example: Building a Content Sync Workflow

This example demonstrates how to sync content from another system to Webflow:

1. Start with a trigger node (e.g., Webhook, Database, or API)
2. Add a Webflow CMS node with "Item" resource and "Get All" operation
   - This retrieves existing items to check if updates are needed
3. Add a Function node to compare incoming data with existing items
4. Add a Webflow CMS node with "Item" resource and "Create" or "Update" operation
   - Use expressions to set field values dynamically: `{{ $json.fieldName }}`
5. Add error handling with the Error Trigger node

## Field Type Handling

The Webflow CMS node automatically handles various field types:

### Text Fields
Simple text input. Example: `Hello World`

### Rich Text Fields
HTML-formatted text is supported. Example: `<p>This is a <strong>paragraph</strong> with formatting.</p>`

### Image Fields
Provide either an image URL or an asset ID. Example: `https://example.com/image.jpg`

### Reference Fields
To link to another item, provide its item ID. Example: `615f3af778b74c8d24f733e1`

### Multi-Reference Fields
For multiple references, provide a JSON array of item IDs as a string. Example: `["615f3af778b74c8d24f733e1", "615f3b0d3a81786bbcdb3546"]`

### Boolean Fields
Use "true" or "false" string values, which will be automatically converted to boolean values.

### Number Fields
Provide numeric values as strings. Example: `42` or `3.14`

### Date Fields
Provide dates in ISO format. Example: `2025-04-04T12:30:00Z`

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Webflow CMS API Documentation](https://developers.webflow.com/docs/getting-started-with-webflows-cms-api)
* [Webflow API Reference](https://developers.webflow.com/reference/list-sites)
