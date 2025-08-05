import { Injectable } from '@angular/core';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { DeltaOperation, DeltaDocument, QuillConverterConfig, ConversionResult } from '../types/quill-delta.types';

@Injectable({
  providedIn: 'root'
})
export class QuillConverterService {

  constructor() { }

  /**
   * Convert Quill Delta to HTML
   * @param deltaOps - Array of Quill Delta operations
   * @returns HTML string
   */
  deltaToHtml(deltaOps: any[]): string {
    try {
      const converter = new QuillDeltaToHtmlConverter(deltaOps, {
        paragraphTag: 'p',
        encodeHtml: true,
        multiLineBlockquote: true,
        multiLineHeader: true,
        multiLineCodeblock: true,
        multiLineParagraph: true
      });
      return converter.convert();
    } catch (error) {
      console.error('Error converting delta to HTML:', error);
      return '';
    }
  }

  /**
   * Convert Quill Delta to plain text
   * @param deltaOps - Array of Quill Delta operations
   * @returns Plain text string
   */
  deltaToText(deltaOps: any[]): string {
    try {
      const { deltaToText } = require('deltaconvert');
      return deltaToText({ ops: deltaOps });
    } catch (error) {
      console.error('Error converting delta to text:', error);
      return '';
    }
  }

  /**
   * Convert Quill Delta to Markdown (simplified approach)
   * This method converts Delta to HTML first, then processes it to Markdown
   * @param deltaOps - Array of Quill Delta operations
   * @returns Markdown string
   */
  deltaToMarkdown(deltaOps: any[]): string {
    try {
      const html = this.deltaToHtml(deltaOps);
      return this.htmlToMarkdown(html);
    } catch (error) {
      console.error('Error converting delta to markdown:', error);
      return '';
    }
  }

  /**
   * Convert HTML to Markdown (basic implementation)
   * @param html - HTML string
   * @returns Markdown string
   */
  private htmlToMarkdown(html: string): string {
    let markdown = html;

    // Replace headers
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

    // Replace bold and italic
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

    // Replace links
    markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Replace images
    markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
    markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');

    // Replace code blocks
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n');
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

    // Replace blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
      return content.split('\n').map((line: string) => `> ${line.trim()}`).join('\n') + '\n\n';
    });

    // Replace lists
    markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, '$1\n');
    markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, '$1\n');
    markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

    // Replace line breaks and paragraphs
    markdown = markdown.replace(/<br[^>]*>/gi, '\n');
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

    // Clean up remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '');

    // Clean up extra whitespace
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.trim();

    return markdown;
  }

  /**
   * Convert HTML to Quill Delta
   * @param html - HTML string
   * @returns Array of Quill Delta operations
   */
  htmlToDelta(html: string): any[] {
    try {
      const { htmlToDelta } = require('deltaconvert');
      const delta = htmlToDelta(html);
      return delta.ops || [];
    } catch (error) {
      console.error('Error converting HTML to delta:', error);
      return [];
    }
  }

  /**
   * Convert plain text to Quill Delta
   * @param text - Plain text string
   * @returns Array of Quill Delta operations
   */
  textToDelta(text: string): any[] {
    try {
      const { textToDelta } = require('deltaconvert');
      const delta = textToDelta(text);
      return delta.ops || [];
    } catch (error) {
      console.error('Error converting text to delta:', error);
      return [];
    }
  }

  /**
   * Validate Quill Delta format
   * @param deltaOps - Array to validate
   * @returns Boolean indicating if it's a valid delta format
   */
  isValidDelta(deltaOps: any): boolean {
    if (!Array.isArray(deltaOps)) {
      return false;
    }

    return deltaOps.every(op => {
      return typeof op === 'object' && 
             op !== null && 
             'insert' in op;
    });
  }
}