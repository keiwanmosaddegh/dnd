const supportedMatchesName:
  | 'matches'
  | 'msMatchesSelector'
  | 'webkitMatchesSelector' = (() => {
  const base = 'matches' as const;

  // Server side rendering
  if (typeof document === 'undefined') {
    return base;
  }

  // See https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  const candidates = [
    base,
    'msMatchesSelector' as const,
    'webkitMatchesSelector' as const,
  ];

  const value = candidates.find((name): boolean => name in Element.prototype);

  return value || base;
})();

function elementMatches(el: Element, selector: string): boolean {
  // Use the supported matches method name for IE11 compatibility
  return el[supportedMatchesName as 'matches'](selector);
}

export default function closest(el: Element, selector: string): Element | null {
  // For shadow DOM compatibility, we need to handle crossing shadow boundaries
  // Native closest() doesn't cross shadow boundaries, so we need our own implementation

  let current: Element | null = el;

  while (current) {
    // Check if current element matches
    if (elementMatches(current, selector)) {
      return current;
    }

    // Try to move up in the DOM
    if (current.parentElement) {
      current = current.parentElement;
    } else {
      // We might be at a shadow root boundary
      const root = current.getRootNode();
      if (root && root !== document && (root as ShadowRoot).host) {
        // Continue searching from the shadow host
        current = (root as ShadowRoot).host;
      } else {
        // No more parents to check
        current = null;
      }
    }
  }

  return null;
}
