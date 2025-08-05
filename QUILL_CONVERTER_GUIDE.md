# Quill Delta to Markdown Converter Guide for Angular

This guide explains how to use Quill Delta conversion libraries in your Angular 12 application to convert between Quill Delta format and Markdown (as well as other formats like HTML and plain text).

## Overview

While there isn't a direct `quill-delta-to-markdown` package, we've implemented a comprehensive solution using these libraries:
- `quill-delta-to-html` - Converts Quill Delta to HTML
- `deltaconvert` - Multi-format converter for Delta, HTML, and text

## Installation

The required packages have already been installed in your project:

```bash
npm install quill-delta-to-html deltaconvert --legacy-peer-deps
```

## Project Structure

The following files have been created for you:

```
src/app/
├── services/
│   └── quill-converter.service.ts     # Main conversion service
├── components/
│   └── quill-converter-demo.component.ts  # Demo component
├── types/
│   └── quill-delta.types.ts          # TypeScript type definitions
```

## Usage Examples

### 1. Basic Service Usage

```typescript
import { QuillConverterService } from './services/quill-converter.service';

// In your component
constructor(private converterService: QuillConverterService) {}

// Sample Quill Delta data
const deltaOps = [
  { insert: "Hello World!" },
  { insert: "\n", attributes: { header: 1 } },
  { insert: "This is " },
  { insert: "bold", attributes: { bold: true } },
  { insert: " text.\n" }
];

// Convert to different formats
const html = this.converterService.deltaToHtml(deltaOps);
const markdown = this.converterService.deltaToMarkdown(deltaOps);
const plainText = this.converterService.deltaToText(deltaOps);
```

### 2. Converting Delta to Markdown

```typescript
// Example Delta operations
const deltaOps = [
  { insert: "Introduction" },
  { insert: "\n", attributes: { header: 1 } },
  { insert: "This is a " },
  { insert: "sample", attributes: { bold: true } },
  { insert: " document with " },
  { insert: "italic", attributes: { italic: true } },
  { insert: " text.\n" },
  { insert: "Check out this " },
  { insert: "link", attributes: { link: "https://example.com" } },
  { insert: ".\n" }
];

const markdown = this.converterService.deltaToMarkdown(deltaOps);
console.log(markdown);
// Output:
// # Introduction
// 
// This is a **sample** document with *italic* text.
// Check out this [link](https://example.com).
```

### 3. Converting HTML to Delta

```typescript
const htmlContent = '<h1>Title</h1><p>This is <strong>bold</strong> text.</p>';
const deltaOps = this.converterService.htmlToDelta(htmlContent);
console.log(deltaOps);
// Output: Array of Delta operations
```

### 4. Validation and Error Handling

```typescript
// Validate Delta format
if (this.converterService.isValidDelta(deltaOps)) {
  const markdown = this.converterService.deltaToMarkdown(deltaOps);
} else {
  console.error('Invalid Delta format');
}
```

## Service Methods

### QuillConverterService Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `deltaToHtml(deltaOps)` | `DeltaOperation[]` | `string` | Converts Delta to HTML |
| `deltaToMarkdown(deltaOps)` | `DeltaOperation[]` | `string` | Converts Delta to Markdown |
| `deltaToText(deltaOps)` | `DeltaOperation[]` | `string` | Converts Delta to plain text |
| `htmlToDelta(html)` | `string` | `DeltaOperation[]` | Converts HTML to Delta |
| `textToDelta(text)` | `string` | `DeltaOperation[]` | Converts text to Delta |
| `isValidDelta(deltaOps)` | `any` | `boolean` | Validates Delta format |

## Demo Component

To see the converter in action, add the demo component to your app:

### 1. Add to App Module

```typescript
// In app.module.ts
import { QuillConverterDemoComponent } from './components/quill-converter-demo.component';

@NgModule({
  declarations: [
    // ... your existing components
    QuillConverterDemoComponent
  ],
  // ... rest of your module
})
export class AppModule { }
```

### 2. Add Route (Optional)

```typescript
// In app-routing.module.ts
{
  path: 'quill-demo',
  component: QuillConverterDemoComponent
}
```

### 3. Use in Template

```html
<!-- In any component template -->
<app-quill-converter-demo></app-quill-converter-demo>
```

## Common Quill Delta Formats

### Text Formatting
```typescript
{ insert: "bold text", attributes: { bold: true } }
{ insert: "italic text", attributes: { italic: true } }
{ insert: "underlined text", attributes: { underline: true } }
{ insert: "code text", attributes: { code: true } }
```

### Headers
```typescript
{ insert: "Header 1" }
{ insert: "\n", attributes: { header: 1 } }
```

### Lists
```typescript
{ insert: "List item 1" }
{ insert: "\n", attributes: { list: "bullet" } }
```

### Links
```typescript
{ insert: "link text", attributes: { link: "https://example.com" } }
```

### Images
```typescript
{ insert: { image: "https://example.com/image.jpg" } }
```

## Advanced Configuration

### Custom HTML Converter Options

```typescript
const config = {
  paragraphTag: 'p',
  encodeHtml: true,
  multiLineBlockquote: true,
  multiLineHeader: true,
  multiLineCodeblock: true,
  multiLineParagraph: true,
  linkTarget: '_blank'
};

const converter = new QuillDeltaToHtmlConverter(deltaOps, config);
const html = converter.convert();
```

## Error Handling Best Practices

```typescript
try {
  const markdown = this.converterService.deltaToMarkdown(deltaOps);
  // Use the markdown...
} catch (error) {
  console.error('Conversion failed:', error);
  // Handle error appropriately
}
```

## Integration with Quill Editor

If you're using Quill editor in your Angular app:

```typescript
// Get Delta from Quill editor
const delta = quillEditor.getContents();
const markdown = this.converterService.deltaToMarkdown(delta.ops);

// Set content from markdown (convert back to Delta)
const html = this.markdownToHtml(markdown); // You'll need a markdown parser
const deltaOps = this.converterService.htmlToDelta(html);
quillEditor.setContents(deltaOps);
```

## Notes and Limitations

1. **Markdown Conversion**: The current implementation converts Delta → HTML → Markdown. For more sophisticated markdown conversion, consider using dedicated markdown libraries.

2. **Complex Formatting**: Some complex Quill formatting may not translate perfectly to Markdown due to Markdown's limitations.

3. **Custom Blots**: If you're using custom Quill blots, you'll need to extend the conversion logic.

4. **Performance**: For large documents, consider implementing conversion in a Web Worker.

## Troubleshooting

### Common Issues

1. **Module Not Found**: Make sure packages are installed with `--legacy-peer-deps` flag for Angular 12.

2. **Type Errors**: Import and use the provided TypeScript types from `quill-delta.types.ts`.

3. **Conversion Errors**: Always validate Delta format before conversion using `isValidDelta()`.

## Alternative Libraries

If you need more sophisticated markdown conversion, consider these alternatives:

- `@disyakidneyshot/quill-markdown-delta` - Direct Delta to Markdown conversion (may have dependency conflicts)
- `markdown-to-quill-delta` - Converts Markdown to Delta
- `turndown` - HTML to Markdown converter (can be used with our HTML output)

## Next Steps

1. Test the demo component to understand the conversion capabilities
2. Integrate the service into your existing components
3. Customize the HTML to Markdown conversion logic if needed
4. Consider adding markdown preview functionality to your app

This setup provides a robust foundation for converting between Quill Delta and Markdown formats in your Angular application.