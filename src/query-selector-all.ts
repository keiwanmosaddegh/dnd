function querySelectorAllWithShadowDOM(
  node: ParentNode | ShadowRoot,
  selector: string,
): HTMLElement[] {
  const results: HTMLElement[] = [];

  // First, find matches in the current node
  const directMatches = Array.from(
    node.querySelectorAll(selector),
  ) as HTMLElement[];
  results.push(...directMatches);

  // Then, traverse all elements to find shadow roots
  const allElements = Array.from(node.querySelectorAll('*'));
  for (const element of allElements) {
    // Check if element has a shadow root
    if (element.shadowRoot) {
      // Recursively search in the shadow DOM
      const shadowMatches = querySelectorAllWithShadowDOM(
        element.shadowRoot,
        selector,
      );
      results.push(...shadowMatches);
    }
  }

  return results;
}

export function querySelectorAll(
  parentNode: ParentNode,
  selector: string,
): HTMLElement[] {
  // If we're searching from document, we need to check all shadow roots
  if (parentNode === document) {
    return querySelectorAllWithShadowDOM(document, selector);
  }

  // For other parent nodes, just use standard querySelectorAll
  // but still check for shadow roots within
  return querySelectorAllWithShadowDOM(parentNode, selector);
}
