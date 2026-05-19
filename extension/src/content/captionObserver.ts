// characterData 뮤테이션만 감시 → 실제로 변경된 텍스트 노드만 추적
// (설정 패널, 언어 드롭다운 등 정적 UI 텍스트는 변경 이벤트 없으므로 자동 제외)

const DEBOUNCE_MS = 2000; // 2초간 변화 없으면 최종 자막으로 확정

export class CaptionObserver {
  private buffer: string[] = [];
  private observer: MutationObserver | null = null;
  // 변경된 텍스트 노드 → debounce 타이머
  private activeNodes: Map<Node, ReturnType<typeof setTimeout>> = new Map();

  start(): void {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          // 실제로 바뀐 텍스트 노드 = 자막 텍스트
          this.onSpeechNodeChange(mutation.target);
        } else if (mutation.type === 'childList') {
          // 노드가 DOM에서 제거될 때 즉시 캡처 (발화 완료 시)
          mutation.removedNodes.forEach((n) => this.captureOnRemove(n));
        }
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private onSpeechNodeChange(node: Node): void {
    const existing = this.activeNodes.get(node);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      // 발화가 2초간 멈추면 해당 텍스트 노드의 최종 값을 저장
      const text = this.extractCleanText(node);
      if (text) this.buffer.push(text);
      this.activeNodes.delete(node);
    }, DEBOUNCE_MS);

    this.activeNodes.set(node, timer);
  }

  private captureOnRemove(removedNode: Node): void {
    // 추적 중인 노드가 DOM에서 제거될 때 → debounce 기다리지 않고 즉시 저장
    this.activeNodes.forEach((timer, trackedNode) => {
      const isRemoved =
        removedNode === trackedNode ||
        (removedNode instanceof Element && removedNode.contains(trackedNode));

      if (isRemoved) {
        clearTimeout(timer);
        const text = this.extractCleanText(trackedNode);
        if (text) this.buffer.push(text);
        this.activeNodes.delete(trackedNode);
      }
    });
  }

  private extractCleanText(node: Node): string {
    const raw = node.textContent?.trim() ?? '';
    // 너무 짧거나(단순 공백/구두점) 너무 긴 경우(설정 패널 전체 덤프) 제외
    if (raw.length < 3 || raw.length > 400) return '';
    return raw;
  }

  flush(): string[] {
    const captured = [...this.buffer];
    this.buffer = [];
    return captured;
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.activeNodes.forEach((timer) => clearTimeout(timer));
    this.activeNodes.clear();
    this.buffer = [];
  }

  isActive(): boolean {
    return this.observer !== null;
  }
}
