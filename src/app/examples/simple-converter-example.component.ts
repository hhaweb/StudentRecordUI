import { Component } from '@angular/core';
import { QuillConverterService } from '../services/quill-converter.service';
import { DeltaOperation } from '../types/quill-delta.types';

@Component({
  selector: 'app-simple-converter-example',
  template: `
    <div class="converter-example">
      <h3>Simple Quill Delta to Markdown Example</h3>
      
      <div class="example-section">
        <h4>Convert Your Data:</h4>
        <button (click)="convertSampleData()" class="convert-btn">
          Convert Sample Delta to Markdown
        </button>
        
        <div *ngIf="markdownResult" class="result-section">
          <h4>Markdown Result:</h4>
          <pre class="markdown-output">{{ markdownResult }}</pre>
          
          <h4>HTML Preview:</h4>
          <div class="html-preview" [innerHTML]="htmlResult"></div>
        </div>
      </div>

      <div class="example-section">
        <h4>How to use in your components:</h4>
        <pre class="code-example">{{ usageExample }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .converter-example {
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .example-section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .convert-btn {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .convert-btn:hover {
      background-color: #0056b3;
    }

    .result-section {
      margin-top: 20px;
    }

    .markdown-output {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      padding: 15px;
      border-radius: 4px;
      white-space: pre-wrap;
      font-family: 'Courier New', monospace;
    }

    .html-preview {
      border: 1px solid #ddd;
      padding: 15px;
      background-color: white;
      border-radius: 4px;
    }

    .code-example {
      background-color: #f4f4f4;
      border: 1px solid #ccc;
      padding: 15px;
      border-radius: 4px;
      font-size: 12px;
      white-space: pre-wrap;
      overflow-x: auto;
    }

    h3, h4 {
      color: #333;
      margin-bottom: 10px;
    }
  `]
})
export class SimpleConverterExampleComponent {
  markdownResult: string = '';
  htmlResult: string = '';
  
  usageExample = `// 1. Inject the service in your component
constructor(private converterService: QuillConverterService) {}

// 2. Convert Quill Delta to Markdown
convertToMarkdown(deltaOps: DeltaOperation[]) {
  const markdown = this.converterService.deltaToMarkdown(deltaOps);
  console.log(markdown);
}

// 3. Convert Quill Delta to HTML
convertToHtml(deltaOps: DeltaOperation[]) {
  const html = this.converterService.deltaToHtml(deltaOps);
  return html;
}

// 4. Validate Delta before conversion
if (this.converterService.isValidDelta(deltaOps)) {
  const markdown = this.converterService.deltaToMarkdown(deltaOps);
}`;

  constructor(private converterService: QuillConverterService) {}

  convertSampleData(): void {
    // Sample Quill Delta operations that might come from a real Quill editor
    const sampleDelta: DeltaOperation[] = [
      { insert: "Document Title" },
      { insert: "\n", attributes: { header: 1 } },
      { insert: "This is a sample document with various formatting:\n\n" },
      { insert: "Bold text", attributes: { bold: true } },
      { insert: " and " },
      { insert: "italic text", attributes: { italic: true } },
      { insert: " and even " },
      { insert: "code snippets", attributes: { code: true } },
      { insert: ".\n\n" },
      { insert: "Here's a " },
      { insert: "link to Angular docs", attributes: { link: "https://angular.io" } },
      { insert: ".\n\n" },
      { insert: "Key Points:" },
      { insert: "\n", attributes: { header: 2 } },
      { insert: "First important point" },
      { insert: "\n", attributes: { list: "bullet" } },
      { insert: "Second important point" },
      { insert: "\n", attributes: { list: "bullet" } },
      { insert: "Third important point" },
      { insert: "\n", attributes: { list: "bullet" } },
      { insert: "\nThis demonstrates the conversion capabilities!" }
    ];

    try {
      // Convert to markdown
      this.markdownResult = this.converterService.deltaToMarkdown(sampleDelta);
      
      // Also convert to HTML for preview
      this.htmlResult = this.converterService.deltaToHtml(sampleDelta);
      
      console.log('Conversion successful!');
      console.log('Markdown:', this.markdownResult);
      console.log('HTML:', this.htmlResult);
      
    } catch (error) {
      console.error('Conversion failed:', error);
      this.markdownResult = 'Error: Conversion failed. Check console for details.';
      this.htmlResult = '';
    }
  }
}