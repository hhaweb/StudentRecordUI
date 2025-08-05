export interface DeltaOperation {
  insert: string | DeltaInsertEmbed;
  attributes?: DeltaAttributes;
  retain?: number;
  delete?: number;
}

export interface DeltaInsertEmbed {
  image?: string;
  video?: string;
  formula?: string;
  [key: string]: any;
}

export interface DeltaAttributes {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  blockquote?: boolean;
  header?: number;
  list?: 'ordered' | 'bullet' | 'checked' | 'unchecked';
  script?: 'sub' | 'super';
  indent?: number;
  direction?: 'rtl' | 'ltr';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  background?: string;
  font?: string;
  size?: string;
  link?: string;
  [key: string]: any;
}

export interface DeltaDocument {
  ops: DeltaOperation[];
}

export interface QuillConverterConfig {
  paragraphTag?: string;
  encodeHtml?: boolean;
  classPrefix?: string;
  inlineStyles?: boolean | object;
  multiLineBlockquote?: boolean;
  multiLineHeader?: boolean;
  multiLineCodeblock?: boolean;
  multiLineParagraph?: boolean;
  linkRel?: string;
  linkTarget?: string;
  allowBackgroundClasses?: boolean;
}

export interface ConversionResult {
  success: boolean;
  data: string | DeltaOperation[];
  error?: string;
}