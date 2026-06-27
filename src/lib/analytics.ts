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

export function trackToolCompletion(toolId: string) {
  event('tool_complete', 'tool', toolId);
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
