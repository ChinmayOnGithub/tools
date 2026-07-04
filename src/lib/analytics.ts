import { addHistoryEntry } from './history';
import { TOOLS_REGISTRY } from '@/config/tools-registry';

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

interface GtagWindow extends Window {
  gtag?: (command: string, target: string, params?: Record<string, string | number | boolean | undefined>) => void;
}

export function pageview(url: string) {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    const gWindow = window as unknown as GtagWindow;
    if (gWindow.gtag) {
      gWindow.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    }
  }
}

export function event(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    const gWindow = window as unknown as GtagWindow;
    if (gWindow.gtag) {
      gWindow.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  }
}

export function trackToolLaunch(toolId: string) {
  event('tool_open', 'tool', toolId);
}

export function trackCopyAction(toolId: string) {
  event('copy', 'tool', toolId);
}

export function trackDownloadAction(toolId: string) {
  event('download', 'tool', toolId);
}

export function trackValidationError(toolId: string, errorType: string) {
  event('tool_error', 'tool', `${toolId}: ${errorType}`);
}

interface CustomWindow extends Window {
  __isInitializing?: boolean;
}

export function trackToolCompletion(toolId: string) {
  event('tool_complete', 'tool', toolId);
  
  // Skip history logging during mount-time initializations
  if (typeof window !== 'undefined') {
    const customWindow = window as unknown as CustomWindow;
    if (customWindow.__isInitializing) {
      return;
    }
  }

  try {
    const tool = TOOLS_REGISTRY.find((t) => t.id === toolId);
    const toolName = tool ? tool.name : toolId;

    // Build a user-friendly action description based on the type of tool
    let action = 'Processed output';
    if (toolId.includes('generator')) {
      action = 'Generated output';
    } else if (toolId.includes('formatter') || toolId.includes('beautify')) {
      action = 'Formatted content';
    } else if (toolId.includes('compress')) {
      action = 'Compressed file';
    } else if (toolId.includes('convert') || toolId.includes('encoder')) {
      action = 'Converted values';
    } else if (toolId.includes('counter')) {
      action = 'Analyzed text';
    } else if (toolId.includes('timer') || toolId.includes('stopwatch')) {
      action = 'Completed session';
    } else if (toolId.includes('decoder')) {
      action = 'Decoded key';
    } else if (toolId.includes('picker')) {
      action = 'Selected color';
    } else if (toolId.includes('cropper') || toolId.includes('resizer')) {
      action = 'Edited image';
    } else if (toolId.includes('merge')) {
      action = 'Merged files';
    } else if (toolId.includes('split')) {
      action = 'Split file';
    }

    addHistoryEntry(toolId, toolName, action);
  } catch (err) {
    console.error('Failed to auto-log history:', err);
  }
}

export function trackRelatedToolClick(fromTool: string, toTool: string) {
  event('related_tool_click', 'tool', `${fromTool} -> ${toTool}`);
}

export function trackInternalSearch(query: string) {
  event('internal_search', 'search', query);
}

const analytics = {
  pageview,
  event,
  trackToolLaunch,
  trackCopyAction,
  trackDownloadAction,
  trackValidationError,
  trackToolCompletion,
  trackRelatedToolClick,
  trackInternalSearch,
};

export default analytics;
