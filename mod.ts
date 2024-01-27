import { eventLoop } from "./window.ts";
import { BLACK, Shapes } from "raylib";
import config from "./config.json" with { type: "json" };
import RAPIER from "https://cdn.skypack.dev/@dimforge/rapier2d-compat";
await RAPIER.init();

const world = new RAPIER.World({ x: 0.0, y: 0.0 });

let balls = [];

for (let i = 0; i < 30; i++) {
  const size = Math.random() * 50 + 10;
  const rigidbody = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic().setTranslation(
      Math.random() * config.screen.width,
      Math.random() * config.screen.height,
    ).setLinvel(Math.random() * 100 - 50, Math.random() * 100 - 50),
  );
  const handle = world.createCollider(RAPIER.ColliderDesc.ball(size).setRestitution(1), rigidbody);
  balls.push({
    rigidbody,
    handle,
    size
  });
}

eventLoop(() => {
  world.step();

  for (let i = 0; i < balls.length; i++) {
    const ballPos = balls[i].handle.translation();

    for(let j = 0; j < balls.length; j++) {
      // Apply gravity-like force to the ball.
      const ball2Pos = balls[j].handle.translation();
      const diff = { x: ball2Pos.x - ballPos.x, y: ball2Pos.y - ballPos.y };
      const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);

      if (dist < 1.0) {
        continue;
      }
      const force = 1000000.0 / (dist * dist);
      const forceX = force * diff.x;
      const forceY = force * diff.y;

      balls[i].rigidbody.applyImpulse({ x: forceX, y: forceY }, true);
    }

    Shapes.drawCircle(Math.round(ballPos.x), Math.round(ballPos.y), balls[i].size, BLACK);
  }
});
