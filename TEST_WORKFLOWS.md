# Testing the Webflow CMS Node

This document provides step-by-step instructions for testing the Webflow CMS node functionality to ensure proper operation.

## Prerequisites

Before testing, make sure you have:

1. A valid Webflow account with CMS-enabled site
2. Authentication set up with one of the following:
   - A Site API Token with proper permissions (sites:read, cms:read, cms:write)
   - OAuth2 credentials from a Webflow Developer Application
3. n8n installed with the Webflow CMS node added
4. At least one CMS collection in your Webflow site

## Test 1: Authentication and Dynamic Loading Verification

This test ensures proper authentication and that the node correctly loads sites, collections, and fields from your Webflow account.

### Steps for API Token Authentication:

1. Create a new workflow in n8n
2. Add a "Start" node
3. Add the Webflow CMS node
4. Create new Webflow API credentials
   - Enter your Site API Token
   - Select API version (v1 or v2)
5. Verify Sites dropdown populates with your Webflow sites
6. Continue with dynamic loading tests below

### Steps for OAuth2 Authentication:

1. Create a new workflow in n8n
2. Add a "Start" node
3. Add the Webflow CMS node
4. Create new Webflow OAuth2 API credentials
   - Enter Client ID and Client Secret from your Webflow Developer Application
   - Follow the OAuth2 authorization flow
5. Verify Sites dropdown populates with your Webflow sites
6. Continue with dynamic loading tests below

### Dynamic Loading Tests:

1. Select a site and verify Collections dropdown populates
2. Select a collection and add a field
3. Verify Field dropdown populates with the collection's fields

### Expected Result:

- Sites dropdown shows all sites accessible with your API token
- Collections dropdown shows collections in the selected site
- Fields dropdown shows all available fields for the selected collection
- Required fields are marked with "(required)" in their names
- Field descriptions show the field types

## Test 2: Create Item Operation

This test verifies the ability to create new items in a Webflow collection.

### Steps:

1. Create a new workflow with a "Start" node
2. Add the Webflow CMS node
3. Select "Create Item" operation
4. Choose a site and collection
5. Add fields (at minimum, a "name" field)
6. Keep "Publish to Live Site" toggled off for testing
7. Execute the workflow
8. View the output to verify the item was created successfully
9. Check in Webflow to confirm the item appears in the specified collection

### Test with Various Field Types:

Try the following field configurations to test different field types:

- **Text Fields**: Add a simple string value
- **Rich Text**: Add HTML-formatted text
- **Reference Field**: Add an existing item ID
- **Multi-Reference**: Add a JSON array of item IDs as a string
- **Boolean Field**: Enter "true" or "false"
- **Number Field**: Enter a numeric value
- **Date Field**: Enter an ISO date string

### Expected Result:

- n8n shows successful execution
- Output contains the created item details, including its ID
- Item appears in the Webflow CMS as a draft (if publish disabled)
- All field types are correctly stored in Webflow

## Test 3: Update Item Operation

This test verifies the ability to update existing CMS items.

### Steps:

1. First, make sure you have an existing item (use Test 2 if needed)
2. Create a new workflow with a "Start" node
3. Add the Webflow CMS node
4. Select "Item" as the resource and "Update" as the operation
5. Choose the same site and collection from Test 2
6. Enter the Item ID from the previously created item
7. Add fields you want to update
8. Execute the workflow
9. View the output to verify the update was successful
10. Check in Webflow to confirm the changes

### Expected Result:

- n8n shows successful execution
- Output contains the updated item details
- Item in Webflow shows the updated field values
- Unchanged fields retain their original values

## Test 4: Delete Item Operation

This test verifies the ability to delete CMS items.

### Steps:

1. First, make sure you have an existing item you can delete (use Test 2 if needed)
2. Create a new workflow with a "Start" node
3. Add the Webflow CMS node
4. Select "Item" as the resource and "Delete" as the operation
5. Choose the site and collection containing the item
6. Enter the Item ID of the item to delete
7. Execute the workflow
8. View the output to verify the deletion was successful
9. Check in Webflow to confirm the item has been removed

### Expected Result:

- n8n shows successful execution
- Output contains a success message with the deleted item ID
- Item no longer appears in the Webflow CMS collection

## Test 5: Get Item Operation

This test verifies the ability to retrieve a specific CMS item.

### Steps:

1. First, make sure you have an existing item (use Test 2 if needed)
2. Create a new workflow with a "Start" node
3. Add the Webflow CMS node
4. Select "Item" as the resource and "Get" as the operation
5. Choose the site and collection containing the item
6. Enter the Item ID of the item to retrieve
7. Execute the workflow
8. View the output to verify all item data was retrieved correctly

### Expected Result:

- n8n shows successful execution
- Output contains the complete item data including all fields
- The data structure matches what you see in the Webflow CMS

## Test 6: Get All Items Operation

This test verifies the ability to retrieve all items from a collection.

### Steps:

1. Create a new workflow with a "Start" node
2. Add the Webflow CMS node
3. Select "Item" as the resource and "Get All" as the operation
4. Choose the site and collection
5. (Optional) Set limit parameters if you have a large collection
6. Execute the workflow
7. View the output to verify all items were retrieved correctly

### Expected Result:

- n8n shows successful execution
- Output contains an array of all items in the collection
- Each item includes its complete data structure
- If pagination parameters were set, verify they worked as expected

## Test 7: Get Collection Fields Operation

This test verifies the ability to retrieve the field schema for a collection.

### Steps:

1. Create a new workflow with a "Start" node
2. Add the Webflow CMS node
3. Select "Collection" as the resource and "Get Fields" as the operation
4. Choose the site and collection
5. Execute the workflow
6. View the output to verify the field schema was retrieved correctly

### Expected Result:

- n8n shows successful execution
- Output contains the complete field schema for the collection
- The schema includes field names, types, and other metadata
- The structure matches what you see in the Webflow Designer

## Test 8: Error Handling and Validation

This test verifies proper error handling and validation logic.

### Test Scenarios:

1. **Missing Required Field**
   - Try to create an item without a "name" field
   - Expected: Error message indicating name is required

2. **Invalid Item ID**
   - Try to get, update, or delete an item with a non-existent ID
   - Expected: Clear error message about invalid item ID

3. **Missing Collection ID**
   - Try to execute without selecting a collection
   - Expected: Error message about missing collection

4. **Invalid Field Value**
   - Try to add an invalid value type (e.g., string for a number field)
   - Verify the node either converts the value or shows an appropriate error

5. **Authentication Errors**
   - Try using invalid API token or OAuth credentials
   - Expected: Clear error message about authentication failure

### Expected Result:

- Each error case produces a clear, descriptive error message
- The workflow fails gracefully with helpful troubleshooting information
- With "Continue on Fail" enabled, the error should be captured in the output

## Advanced Testing

For more advanced testing, try these scenarios:

1. **Live Publishing**
   - Toggle "Publish to Live Site" on when creating/updating
   - Verify the item is published immediately

2. **Batch Processing**
   - Use a node that outputs multiple items (like "Split In Batches")
   - Verify the Webflow CMS node processes each item correctly

3. **Expression Support**
   - Use expressions to dynamically set field values
   - Verify expressions are evaluated correctly

4. **Data Transformation**
   - Create a workflow that gets items, transforms them, and updates them
   - Verify the entire data flow works correctly

5. **OAuth2 Multi-site Testing**
   - If using OAuth2, test accessing multiple sites with the same credentials
   - Verify proper site selection and operation

6. **Pagination with Get All Items**
   - Test retrieving large collections that require pagination
   - Verify all items are retrieved correctly

## Troubleshooting

If you encounter issues during testing:

- **Authentication Issues**
  - Verify your API token has the correct permissions
  - For OAuth2, check that your app has the right scopes configured
  - Try regenerating tokens if they may have expired

- **Rate Limiting**
  - Check for rate limiting issues (Webflow limits API requests)
  - Add delay nodes between operations for large batch processing

- **Data Format Problems**
  - Ensure your collection fields match what you're trying to set
  - Verify correct formatting for special field types (see Field Handling guide)

- **Operation Errors**
  - Review the error messages for specific guidance on what went wrong
  - Check the Webflow CMS node documentation for operation-specific requirements

- **API Version Compatibility**
  - Some features may work differently between v1 and v2 APIs
  - Try toggling the API version in your credentials settings
