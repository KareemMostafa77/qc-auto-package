// qc-dompath.util.ts
export function domPathWithinHost(el: Element, host: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;

  while (node && node !== host && node.nodeType === Node.ELEMENT_NODE) {
    const tag = node.tagName.toLowerCase();
    // nth-of-type among element siblings with the same tag (more stable than nth-child)
    let index = 1;
    let sib = node.previousElementSibling;
    while (sib) {
      if (sib.tagName.toLowerCase() === tag) index++;
      sib = sib.previousElementSibling;
    }
    parts.push(`${tag}:${index}`);
    node = node.parentElement;
  }

  return parts.reverse().join('>');
}
