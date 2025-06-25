declare module '@postlight/parser' {
  interface ParseOptions {
    html?: string;
  }

  interface ParseResult {
    title?: string;
    content?: string;
    author?: string;
    date_published?: string;
    lead_image_url?: string;
    dek?: string;
    next_page_url?: string;
    url?: string;
    domain?: string;
    excerpt?: string;
    word_count?: number;
    direction?: string;
    total_pages?: number;
    rendered_pages?: number;
  }

  function parse(url: string, options?: ParseOptions): Promise<ParseResult | null>;
  
  export default { parse };
} 