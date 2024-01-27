import { BLANK, Drawing, Timing, Window } from "raylib";
import config from "./config.json" with { type: "json" };

Timing.setTargetFPS(60);

export function eventLoop(func: () => void) {
  Window.init(1000, 1000, "Hey", {
    transparent: true,
    undecorated: true,
    topmost: true,
    mousePassthrough: true,
    resizable: true,
  });
  Window.setPosition(0, 0);
  Window.setSize(config.screen.width, config.screen.height);
  while (!Window.shouldClose()) {
    Drawing.beginDrawing();
    Drawing.clearBackground(BLANK);
    func();
    Drawing.endDrawing();
  }
  Window.close();
}
