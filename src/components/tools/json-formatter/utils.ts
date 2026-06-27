export interface ParseResult {
  success: boolean;
  output: string;
  error?: string;
  line?: number;
  column?: number;
}

export function parseJSONError(errorMsg: string, jsonStr: string): { message: string; line?: number; column?: number } {
  let line = 1;
  let column = 1;
  const message = errorMsg;

  // Match Firefox format: "line 1 column 10"
  const lineColRegex = /line\s+(\d+)\s+column\s+(\d+)/i;
  const match = errorMsg.match(lineColRegex);
  
  if (match) {
    line = parseInt(match[1]);
    column = parseInt(match[2]);
  } else {
    // Match Chrome format: "at position 45"
    const posRegex = /position\s+(\d+)/i;
    const posMatch = errorMsg.match(posRegex);
    if (posMatch) {
      const pos = parseInt(posMatch[1]);
      const lines = jsonStr.slice(0, pos).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }
  }

  return { message, line, column };
}

export function beautifyJSON(jsonStr: string, indent = 2): ParseResult {
  if (!jsonStr.trim()) {
    return { success: true, output: '' };
  }
  try {
    const parsed = JSON.parse(jsonStr);
    return { success: true, output: JSON.stringify(parsed, null, indent) };
  } catch (err) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    const parsedErr = parseJSONError(errorObj.message || 'Invalid JSON', jsonStr);
    return {
      success: false,
      output: '',
      error: parsedErr.message,
      line: parsedErr.line,
      column: parsedErr.column,
    };
  }
}

export function minifyJSON(jsonStr: string): ParseResult {
  if (!jsonStr.trim()) {
    return { success: true, output: '' };
  }
  try {
    const parsed = JSON.parse(jsonStr);
    return { success: true, output: JSON.stringify(parsed) };
  } catch (err) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    const parsedErr = parseJSONError(errorObj.message || 'Invalid JSON', jsonStr);
    return {
      success: false,
      output: '',
      error: parsedErr.message,
      line: parsedErr.line,
      column: parsedErr.column,
    };
  }
}
