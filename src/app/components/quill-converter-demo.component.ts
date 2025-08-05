import { Component, OnInit } from '@angular/core';
import { QuillConverterService } from '../services/quill-converter.service';

@Component({
  selector: 'app-quill-converter-demo',
  template: `
    <div class="converter-demo">
      <h2>Quill Delta to Markdown Converter Demo</h2>
      
      <!-- Input Section -->
      <div class="section">
        <h3>Input Delta Operations</h3>
        <textarea 
          [(ngModel)]="deltaInput" 
          placeholder="Enter Quill Delta JSON here..."
          rows="10"
          cols="80">
        </textarea>
        <br>
        <button (click)="loadSampleDelta()">Load Sample Delta</button>
        <button (click)="parseDelta()">Parse & Convert</button>
      </div>

      <!-- Results Section -->
      <div class="section" *ngIf="deltaOps.length > 0">
        <h3>Conversion Results</h3>
        
        <!-- HTML Output -->
        <div class="output-section">
          <h4>HTML Output:</h4>
          <div class="html-output" [innerHTML]="htmlOutput"></div>
          <pre class="code-output">{{ htmlOutput }}</pre>
        </div>

        <!-- Markdown Output -->
        <div class="output-section">
          <h4>Markdown Output:</h4>
          <pre class="code-output">{{ markdownOutput }}</pre>
        </div>

        <!-- Plain Text Output -->
        <div class="output-section">
          <h4>Plain Text Output:</h4>
          <pre class="code-output">{{ textOutput }}</pre>
        </div>
      </div>

      <!-- Reverse Conversion Section -->
      <div class="section">
        <h3>Reverse Conversion (HTML to Delta)</h3>
        <textarea 
          [(ngModel)]="htmlInput" 
          placeholder="Enter HTML here..."
          rows="5"
          cols="80">
        </textarea>
        <br>
        <button (click)="convertHtmlToDelta()">Convert HTML to Delta</button>
        
        <div *ngIf="reverseDeltaOps.length > 0" class="output-section">
          <h4>Resulting Delta Operations:</h4>
          <pre class="code-output">{{ reverseDeltaOps | json }}</pre>
        </div>
      </div>

      <!-- Error Display -->
      <div *ngIf="error" class="error">
        <p>Error: {{ error }}</p>
      </div>
    </div>
  `,
  styles: [`
    .converter-demo {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .output-section {
      margin: 15px 0;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 3px;
    }

    .html-output {
      border: 1px solid #ccc;
      padding: 10px;
      background-color: white;
      margin-bottom: 10px;
      min-height: 50px;
    }

    .code-output {
      background-color: #f8f8f8;
      border: 1px solid #ddd;
      padding: 10px;
      white-space: pre-wrap;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      max-height: 200px;
      overflow-y: auto;
    }

    textarea {
      width: 100%;
      margin-bottom: 10px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }

    button {
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }

    .error {
      color: red;
      background-color: #ffe6e6;
      padding: 10px;
      border-radius: 3px;
    }

    h2, h3, h4 {
      color: #333;
    }
  `]
})
export class QuillConverterDemoComponent implements OnInit {
  deltaInput: string = '';
  htmlInput: string = '';
  deltaOps: any[] = [];
  reverseDeltaOps: any[] = [];
  htmlOutput: string = '';
  markdownOutput: string = '';
  textOutput: string = '';
  error: string = '';

  constructor(private converterService: QuillConverterService) { }

  ngOnInit(): void {
    this.loadSampleDelta();
  }

  loadSampleDelta(): void {
    const sampleDelta = [
      { insert: "Hello World!" },
      { insert: "\n", attributes: { header: 1 } },
      { insert: "This is a " },
      { insert: "bold", attributes: { bold: true } },
      { insert: " and " },
      { insert: "italic", attributes: { italic: true } },
      { insert: " text example.\n" },
      { insert: "Here's a " },
      { insert: "link", attributes: { link: "https://example.com" } },
      { insert: " to a website.\n" },
      { insert: "Code example: " },
      { insert: "console.log('Hello');", attributes: { code: true } },
      { insert: "\n" },
      { insert: "List item 1" },
      { insert: "\n", attributes: { list: "bullet" } },
      { insert: "List item 2" },
      { insert: "\n", attributes: { list: "bullet" } },
      { insert: "List item 3" },
      { insert: "\n", attributes: { list: "bullet" } }
    ];

    this.deltaInput = JSON.stringify(sampleDelta, null, 2);
    this.parseDelta();
  }

  parseDelta(): void {
    try {
      this.error = '';
      this.deltaOps = JSON.parse(this.deltaInput);
      
      if (!this.converterService.isValidDelta(this.deltaOps)) {
        throw new Error('Invalid Delta format');
      }

      // Convert to different formats
      this.htmlOutput = this.converterService.deltaToHtml(this.deltaOps);
      this.markdownOutput = this.converterService.deltaToMarkdown(this.deltaOps);
      this.textOutput = this.converterService.deltaToText(this.deltaOps);

    } catch (error) {
      this.error = 'Failed to parse Delta: ' + (error as Error).message;
      this.deltaOps = [];
      this.htmlOutput = '';
      this.markdownOutput = '';
      this.textOutput = '';
    }
  }

  convertHtmlToDelta(): void {
    try {
      this.error = '';
      if (!this.htmlInput.trim()) {
        throw new Error('Please enter some HTML');
      }

      this.reverseDeltaOps = this.converterService.htmlToDelta(this.htmlInput);
    } catch (error) {
      this.error = 'Failed to convert HTML to Delta: ' + (error as Error).message;
      this.reverseDeltaOps = [];
    }
  }
}