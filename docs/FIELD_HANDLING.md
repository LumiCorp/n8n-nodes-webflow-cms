# Webflow CMS Field Handling Guide

This document provides detailed information on how to handle different field types when using the Webflow CMS node in n8n.

## Field Type Overview

Webflow CMS supports various field types for structuring content. The n8n Webflow CMS node automatically handles type conversion for many field types, but some require specific formatting.

## Basic Field Types

### Plain Text Fields

**Type in Webflow**: Plain Text, Email, Password, URL, Phone, etc.

**Expected Format**: Simple string value

**Example**:
```
Hello World
```

**Notes**:
- Character limits set in Webflow are not enforced by the API, but they will apply when viewing in the Webflow designer

### Rich Text Fields

**Type in Webflow**: Rich Text

**Expected Format**: HTML-formatted string

**Example**:
```
<p>This is a <strong>paragraph</strong> with <em>formatting</em>.</p>
<h2>Subheading</h2>
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>
```

**Notes**:
- Webflow accepts standard HTML for rich text fields
- Complex formatting may be simplified by Webflow's renderer
- Images and other embedded content should use proper HTML tags

## Media Field Types

### Image Fields

**Type in Webflow**: Image

**Expected Format**: URL or Asset ID

**URL Example**:
```
https://example.com/image.jpg
```

**Asset ID Example** (if the image is already in Webflow's assets):
```
5f8d2e7d3a0641a69f88ce35
```

**Notes**:
- Using external URLs requires the image to be publicly accessible
- For more control, upload images to Webflow first and use the asset ID
- The API does not currently support direct binary uploads through this node

### File Fields

**Type in Webflow**: File

**Expected Format**: URL or Asset ID (similar to images)

**Notes**:
- Similar to image fields, but can reference any file type
- File size limits from Webflow still apply

## Reference Field Types

### Single Reference

**Type in Webflow**: Reference (to another collection)

**Expected Format**: Item ID of the referenced item

**Example**:
```
615f3af778b74c8d24f733e1
```

**Notes**:
- You must provide a valid item ID from the referenced collection
- Invalid references may cause validation errors

### Multi-Reference

**Type in Webflow**: Multi-Reference (to other collection items)

**Expected Format**: JSON array of item IDs as a string

**Example**:
```
["615f3af778b74c8d24f733e1", "615f3b0d3a81786bbcdb3546"]
```

**Notes**:
- The node will automatically parse this string into a proper array
- Empty arrays are represented as `[]`
- Each ID must exist in the referenced collection

## Special Field Types

### Option Fields

**Type in Webflow**: Option (dropdown, radio, checkboxes)

**Expected Format**: String matching one of the defined options

**Example**:
```
Red
```

**Notes**:
- The value must exactly match one of the options defined in Webflow
- Case sensitivity applies

### Boolean Fields

**Type in Webflow**: Switch (true/false)

**Expected Format**: "true" or "false" as strings

**Example**:
```
true
```

**Notes**:
- The n8n node automatically converts these string values to actual boolean values
- You can also use the boolean values directly in expressions

### Number Fields

**Type in Webflow**: Number

**Expected Format**: Numeric value as a string

**Example**:
```
42
```

**Notes**:
- The node automatically converts string values to numbers
- Decimals are supported using the period character (e.g., "3.14")

### Date and Time Fields

**Type in Webflow**: Date, Date/Time

**Expected Format**: ISO 8601 format date string

**Example**:
```
2025-04-04T12:30:00Z
```

**Notes**:
- Using ISO format ensures proper date handling
- The time zone component is important for Date/Time fields

## Color Fields

**Type in Webflow**: Color

**Expected Format**: Hex color code

**Example**:
```
#FF5733
```

**Notes**:
- Standard hex color format with # prefix
- RGB and other formats may not be correctly interpreted

## Working with Required Fields

Fields marked as required in Webflow must be provided when creating items. The n8n node adds "(required)" to these field names in the UI dropdown to help identify them.

At minimum, the "name" field is always required for item creation. We recommend also providing a "slug" field, though Webflow can sometimes auto-generate this from the name.

## Tips for Field Mapping

1. **Use Expressions**: Use n8n expressions to dynamically set field values based on incoming data
   ```
   {{ $json.fieldFromPreviousNode }}
   ```

2. **Type Conversion**: For complex data types, you can use expressions to format the data correctly:
   ```
   {{ JSON.stringify($json.arrayOfIds) }} // For multi-reference fields
   ```

3. **Field Testing**: Test with simple values first before working with complex field types

4. **Error Handling**: Enable "Continue on Fail" in your workflow to see detailed error messages for field validation issues

## Troubleshooting

- **Invalid field value**: Check that your value matches the expected format for the field type
- **Missing required field**: Ensure all required fields have values
- **Reference errors**: Verify that referenced item IDs exist in the correct collection
- **Date/time errors**: Ensure your date strings follow ISO 8601 format
