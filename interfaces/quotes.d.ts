declare module 'success-motivational-quotes' {
  export interface Quote {
    quote?: string;
    text?: string;
    author?: string;
  }
  export function getAllQuotes(): Quote[];
  export function getallCategories(): string[];
  export function fetchQuotesByAuthor(author: string): Quote[];
}
