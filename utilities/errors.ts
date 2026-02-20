/**
 * Custom error class for WakaTime API failures.
 * Encapsulates status codes and response text for better error handling.
 */
export class WakaTimeApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: string,
  ) {
    const message = `WakaTime API Error ${status}: ${statusText || 'Unknown Error'}`;
    super(message);
    this.name = 'WakaTimeApiError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WakaTimeApiError);
    }
  }

  /**
   * Helper to determine if the error is due to authentication issues.
   */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /**
   * Helper to parse the error body if it's JSON.
   */
  get json(): any {
    try {
      return JSON.parse(this.body);
    } catch {
      return null;
    }
  }
}
