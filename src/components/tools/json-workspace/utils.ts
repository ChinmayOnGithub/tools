export interface ParseResult {
  success: boolean;
  output: string;
  error?: string;
  detailedError?: string;
  line?: number;
  column?: number;
  snippet?: string;
}

export function parseJSONError(errorMsg: string, jsonStr: string): { 
  message: string; 
  detailedError: string;
  line?: number; 
  column?: number;
  snippet?: string;
} {
  let line = 1;
  let column = 1;
  const message = errorMsg;

  // Match Firefox format: "line 1 column 10"
  const lineColRegex = /line\s+(\d+)\s+column\s+(\d+)/i;
  const match = errorMsg.match(lineColRegex);
  
  if (match) {
    line = parseInt(match[1], 10);
    column = parseInt(match[2], 10);
  } else {
    // Match Chrome format: "at position 45"
    const posRegex = /position\s+(\d+)/i;
    const posMatch = errorMsg.match(posRegex);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = jsonStr.slice(0, pos).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }
  }

  // Diagnostic pattern analysis to give plain-English developer guidance
  let detailedError = errorMsg;
  const lines = jsonStr.split('\n');
  const errorLineContent = lines[line - 1] || '';

  if (errorMsg.includes('Unexpected token }') || errorMsg.includes('Unexpected token ]') || /trailing comma/i.test(errorMsg)) {
    detailedError = 'Trailing comma detected before closing bracket or brace. JSON RFC 8259 forbids trailing commas in objects and arrays.';
  } else if (/Expected double-quoted property name/i.test(errorMsg) || /Unexpected token '\w+'/i.test(errorMsg)) {
    detailedError = 'Unquoted or single-quoted key name. JSON keys must strictly use double quotes (e.g. "key": "value").';
  } else if (errorLineContent.includes("'")) {
    detailedError = 'Single quote detected. JSON strings and keys must always use standard double quotes (").';
  } else if (/Unexpected end of JSON input/i.test(errorMsg) || /Unexpected end of data/i.test(errorMsg)) {
    detailedError = 'Unexpected end of input. You may have an unclosed curly brace "}" or bracket "]", or unclosed string quote.';
  } else if (/Bad control character/i.test(errorMsg)) {
    detailedError = 'Unescaped control character (such as a raw newline or tab inside a string value). Use \\n or \\t escape sequences.';
  }

  const snippet = errorLineContent ? errorLineContent.trim() : undefined;

  return { message, detailedError, line, column, snippet };
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
      detailedError: parsedErr.detailedError,
      line: parsedErr.line,
      column: parsedErr.column,
      snippet: parsedErr.snippet,
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
      detailedError: parsedErr.detailedError,
      line: parsedErr.line,
      column: parsedErr.column,
      snippet: parsedErr.snippet,
    };
  }
}
