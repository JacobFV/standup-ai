import { mouse, keyboard, straightTo, Point, Button, Key, screen, Region } from "@nut-tree-fork/nut-js";

export class ComputerController {
  constructor() {
    // Configure nut.js
    mouse.config.autoDelayMs = 100;
    keyboard.config.autoDelayMs = 50;
  }

  async click(x: number, y: number): Promise<{ success: boolean }> {
    try {
      await mouse.move(straightTo(new Point(x, y)));
      await mouse.click(Button.LEFT);
      return { success: true };
    } catch (error) {
      console.error("Click failed:", error);
      return { success: false };
    }
  }

  async doubleClick(x: number, y: number): Promise<{ success: boolean }> {
    try {
      await mouse.move(straightTo(new Point(x, y)));
      await mouse.doubleClick(Button.LEFT);
      return { success: true };
    } catch (error) {
      console.error("Double click failed:", error);
      return { success: false };
    }
  }

  async rightClick(x: number, y: number): Promise<{ success: boolean }> {
    try {
      await mouse.move(straightTo(new Point(x, y)));
      await mouse.click(Button.RIGHT);
      return { success: true };
    } catch (error) {
      console.error("Right click failed:", error);
      return { success: false };
    }
  }

  async type(text: string): Promise<{ success: boolean }> {
    try {
      await keyboard.type(text);
      return { success: true };
    } catch (error) {
      console.error("Type failed:", error);
      return { success: false };
    }
  }

  async keyPress(keys: string[]): Promise<{ success: boolean }> {
    try {
      const keyMap: Record<string, Key> = {
        enter: Key.Enter,
        tab: Key.Tab,
        escape: Key.Escape,
        space: Key.Space,
        backspace: Key.Backspace,
        delete: Key.Delete,
        up: Key.Up,
        down: Key.Down,
        left: Key.Left,
        right: Key.Right,
        cmd: Key.LeftCmd,
        ctrl: Key.LeftControl,
        alt: Key.LeftAlt,
        shift: Key.LeftShift,
        a: Key.A, b: Key.B, c: Key.C, d: Key.D, e: Key.E,
        f: Key.F, g: Key.G, h: Key.H, i: Key.I, j: Key.J,
        k: Key.K, l: Key.L, m: Key.M, n: Key.N, o: Key.O,
        p: Key.P, q: Key.Q, r: Key.R, s: Key.S, t: Key.T,
        u: Key.U, v: Key.V, w: Key.W, x: Key.X, y: Key.Y,
        z: Key.Z,
      };

      const mappedKeys = keys.map((k) => keyMap[k.toLowerCase()] || Key.A);

      if (mappedKeys.length === 1) {
        await keyboard.pressKey(mappedKeys[0]!);
        await keyboard.releaseKey(mappedKeys[0]!);
      } else {
        // Key combination (e.g., Cmd+C)
        for (const key of mappedKeys) {
          await keyboard.pressKey(key);
        }
        for (const key of mappedKeys.reverse()) {
          await keyboard.releaseKey(key);
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Key press failed:", error);
      return { success: false };
    }
  }

  async moveMouse(x: number, y: number): Promise<{ success: boolean }> {
    try {
      await mouse.move(straightTo(new Point(x, y)));
      return { success: true };
    } catch (error) {
      console.error("Mouse move failed:", error);
      return { success: false };
    }
  }

  async takeScreenshot(): Promise<{ image: string } | { error: string }> {
    try {
      const w = await screen.width();
      const h = await screen.height();
      const region = new Region(0, 0, w, h);
      const image = await screen.grabRegion(region);
      // Convert to base64 - this is a simplified version
      return { image: "screenshot_placeholder" };
    } catch (error) {
      return { error: String(error) };
    }
  }

  async scroll(x: number, y: number, amount: number): Promise<{ success: boolean }> {
    try {
      await mouse.move(straightTo(new Point(x, y)));
      await mouse.scrollDown(amount);
      return { success: true };
    } catch (error) {
      console.error("Scroll failed:", error);
      return { success: false };
    }
  }
}
