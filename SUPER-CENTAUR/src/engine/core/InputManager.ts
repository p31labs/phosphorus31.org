/**
 * Input Manager - Keyboard and mouse state tracking
 * Provides a polling interface for the game loop.
 */

export class InputManager {
  private keys: Set<string> = new Set();
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private mouseButtons: Set<number> = new Set();
  private keydownHandler: (e: KeyboardEvent) => void;
  private keyupHandler: (e: KeyboardEvent) => void;
  private mousemoveHandler: (e: MouseEvent) => void;
  private mousedownHandler: (e: MouseEvent) => void;
  private mouseupHandler: (e: MouseEvent) => void;

  constructor() {
    this.keydownHandler = (e) => this.keys.add(e.key.toLowerCase());
    this.keyupHandler = (e) => this.keys.delete(e.key.toLowerCase());
    this.mousemoveHandler = (e) => { this.mousePosition.x = e.clientX; this.mousePosition.y = e.clientY; };
    this.mousedownHandler = (e) => this.mouseButtons.add(e.button);
    this.mouseupHandler = (e) => this.mouseButtons.delete(e.button);
  }

  async init(): Promise<void> {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
    window.addEventListener('mousemove', this.mousemoveHandler);
    window.addEventListener('mousedown', this.mousedownHandler);
    window.addEventListener('mouseup', this.mouseupHandler);
  }

  update(): void {
    // Polling interface — state is already kept up to date by listeners
  }

  isKeyDown(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  isMouseButtonDown(button: number): boolean {
    return this.mouseButtons.has(button);
  }

  dispose(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    window.removeEventListener('mousemove', this.mousemoveHandler);
    window.removeEventListener('mousedown', this.mousedownHandler);
    window.removeEventListener('mouseup', this.mouseupHandler);
  }
}

export default InputManager;
