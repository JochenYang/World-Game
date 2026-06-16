// Capture polar screenshots to verify the new arctic label is visible
const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--use-angle=swiftshader', '--window-size=1280,800']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(800);
  await page.click('#start-btn');
  await sleep(1500);

  // ARCTIC: directly drive the camera + globe to view the arctic label
  // We want: camera straight above (0, R, 0) looking down (-Y); globe rotated so
  // (lat=80, lon=-150) is at the top.
  await page.evaluate(() => {
    const wg = window.__worldGame;
    if (!wg) return;
    wg.globe.setAutoRotate(false);
    const cam = wg.camera;
    cam.position.set(0, 4, 0);
    cam.up.set(0, 0, -1);
    cam.lookAt(0, 0, 0);
    // Globe: rotate so the (lat=80, lon=-150) surface point ends up at world Y+.
    // The unrotated globe has lat=0 on equator (y=0) and lat=90 at (0, 1, 0).
    // lon=0 at +Z, lon=90 at +X.
    // We need (lat=80, lon=-150) to map to world (0, 1, 0).
    // In object space, the point is:
    //   x_obj = R * cos(80) * sin(-150) = R * 0.174 * -0.5 = -0.087 R
    //   y_obj = R * sin(80) = R * 0.985
    //   z_obj = R * cos(80) * cos(-150) = R * 0.174 * -0.866 = -0.151 R
    // We want this point rotated to (0, R, 0).
    // The rotation axis is cross(point, target) = cross((-0.087, 0.985, -0.151), (0,1,0))
    //   = (0.985*0 - -0.151*1, -0.151*0 - -0.087*0, -0.087*1 - 0.985*0)
    //   = (0.151, 0, -0.087)
    // The rotation angle: cos(θ) = dot/(|a||b|) = 0.985 / 1 = 0.985  =>  θ ≈ 10°
    // This is the lat offset, as expected.
    // Use a helper: THREE.Quaternion.setFromUnitVectors
    // But we don't have THREE in scope; use the camera's quaternion and apply.
    // Or just use Euler with proper order.
    // Approach: set rotation.x = -(90 - 80)° in rad = -0.175, rotation.y = (-150 - 90 - 180)° in rad
    // Hmm, that's wrong because the globe already has rotation.y = PI default.
    // Cleanest: reset globe rotation to identity, then apply only the desired Euler.
    wg.globe.group.rotation.set(0, 0, 0);
    // Now with identity, the (lat=80, lon=-150) object point is as computed.
    // Rotation needed to bring it to (0, 1, 0):
    //   x rotation: bring the point's y up to 1 (i.e. lift the lat=80 ring to "up")
    //   Since the point is already at y=0.985 R, we need to rotate around X axis by
    //   angle θ_x = atan2(z, y) = atan2(-0.151, 0.985) ≈ -8.7° = -0.152 rad
    //   After this x rotation, the point is at (x, 0, sqrt(x²+z²))
    //   Then rotate around Y to bring x to 0: angle θ_y = atan2(x, z) = atan2(-0.087, -0.151)
    //     ≈ -180 + 30 = -150° (in the third quadrant) = -2.618 rad
    //   Wait, the point was at (-0.087, 0, -0.151) (after x rotation; we lift y to 0, no,
    //   we lift y to max which means the point is at y=1, x=0, z=0 after rotation).
    //   Easier: just use latLonToVector3 helper from utils if exported.
    // For now, set Euler to (PI/2 - 80*PI/180, -150*PI/180, 0) and see if that works
    //   (this is "rotate from straight up to lat=80", then "rotate around vertical by -150°").
    // Hmm, not quite. Let me just compute via atan2 of the point and use Euler YXZ.
    const latRad = 80 * Math.PI / 180;
    const lonRad = -150 * Math.PI / 180;
    // After identity, the point is (cos lat * sin lon, sin lat, cos lat * cos lon)
    // We want world matrix * (cos lat * sin lon, sin lat, cos lat * cos lon) = (0, 1, 0)
    // The world matrix is R_x(a) R_y(b) R_z(c) in some order. THREE default is XYZ.
    // For XYZ order:
    //   R_x(a) R_y(b) R_z(c) * (x, y, z) -> (0, 1, 0)
    // This is hard to solve analytically. Use a different approach: apply the
    // rotation in object space.
    //   1) First rotate around X to bring the lat=80 ring to the equator.
    //      Angle = -(90 - 80) = -10° = -0.175 rad (in XYZ order, x is applied last
    //      to the original vector, but actually in THREE, rotation.x is applied first).
    //      THREE Euler XYZ applies as: R = R_x * R_y * R_z, and the matrix multiplies
    //      the vector on the LEFT: R*v. So R_x is applied to v first.
    //   After R_x(α): point becomes (x', y', z') where y' = y*cos(α) - z*sin(α)
    //                                                z' = y*sin(α) + z*cos(α)
    //      We want y' = 0, so α = atan2(z, y) = atan2(-0.151, 0.985) = -0.152 rad
    //   After that, the point is at (x, 0, -0.984) (since y'≈0)
    //   2) Then rotate around Y to bring x to 0: angle = atan2(x, z) = atan2(-0.087, -0.984) = -3.03 rad
    //      But atan2 returns in (-π, π]; -3.03 is the same as 3.25 (mod 2π)
    //   3) Then rotate around Z if needed to face up: should already be (0, 0, -0.984) which is +Y? No.
    // Hmm, this is getting messy. Let me use a different approach: just set the
    // globe's rotation using lookAt to point at (0, 1, 0) from (cos lat * sin lon, sin lat, cos lat * cos lon).
    // But THREE.Group doesn't have lookAt. We can use a temporary Object3D.
    // Simpler: directly use the THREE library via wg.scene. Look at THREE's source:
    // wg.scene is THREE.Scene. THREE is a global module. We can require it.
    // Actually, wg.scene.children includes the globe.group. We can call wg.globe.group.lookAt.
    // Wait - Group extends Object3D which has lookAt. So:
    //   1. Save current position
    //   2. Set position to the surface point
    //   3. lookAt(0, 1, 0)  - but lookAt makes -Z point at target; we need to invert
    //   4. Hmm, this is for orienting an object, not rotating a group
    //   5. Just use setFromUnitVectors
  });

  // Apply the rotation via hand-computed quaternion (no THREE import)
  // We do NOT touch the camera because applyToCamera() rewrites cam.position every
  // frame from the spherical (theta, phi, radius) state. Instead, we rotate the
  // globe so the (lat=72, lon=30) point ends up at the camera-facing direction.
  // Default camera: spherical (radius=8, phi=PI/2.5≈72°, theta=0).
  //   camera position in world = setFromSpherical(8, 72°, 0)
  //   = (8*sin(72°)*cos(0), 8*cos(72°), 8*sin(72°)*sin(0)) = (7.61, 2.47, 0)
  //   normalised = (0.951, 0.309, 0)
  //   The "centre of the image" direction (from origin to surface point under
  //   camera) is (0.951, 0.309, 0) (same as camera position normalised).
  // We want the (lat=72, lon=30) surface point, which has world coord
  //   latLonToVector3(72, 30) = (cos(18°)*cos(210°)*(-1), cos(18°), sin(18°)*sin(210°))
  //   Note the THREE convention: x = -sin(phi)*cos(theta), y = cos(phi), z = sin(phi)*sin(theta)
  //   For lat=72, lon=30: phi=(90-72)=18°, theta=(30+180)=210°
  //   x = -sin(18°)*cos(210°) = -0.309 * (-0.866) = 0.268
  //   y = cos(18°) = 0.951
  //   z = sin(18°)*sin(210°) = 0.309 * (-0.5) = -0.155
  // So the surface point is at (0.268, 0.951, -0.155).
  // We need to rotate the globe so this point ends up at (0.951, 0.309, 0).
  await page.evaluate(() => {
    const wg = window.__worldGame;
    if (!wg) return;
    wg.globe.setAutoRotate(false);
    // Reset globe rotation to identity first
    wg.globe.group.quaternion.set(0, 0, 0, 1);

    // Source point: lat=72, lon=30
    const latRad = 72 * Math.PI / 180;
    const lonRad = 30 * Math.PI / 180;
    const phiS = (90 - 72) * Math.PI / 180;  // = 18°
    const thetaS = (30 + 180) * Math.PI / 180;  // = 210°
    const ax = -Math.sin(phiS) * Math.cos(thetaS);
    const ay = Math.cos(phiS);
    const az = Math.sin(phiS) * Math.sin(thetaS);

    // Target: camera direction in world (phi=PI/2.5, theta=0)
    const phiT = Math.PI / 2.5;
    const thetaT = 0;
    const tx = Math.sin(phiT) * Math.cos(thetaT);
    const ty = Math.cos(phiT);
    const tz = Math.sin(phiT) * Math.sin(thetaT);

    // Quaternion from a to t
    const d = ax * tx + ay * ty + az * tz;
    const vx = ay * tz - az * ty;
    const vy = az * tx - ax * tz;
    const vz = ax * ty - ay * tx;
    let qx, qy, qz, qw;
    if (d > 0.99999) {
      qx = 0; qy = 0; qz = 0; qw = 1;
    } else if (d < -0.99999) {
      qx = 1; qy = 0; qz = 0; qw = 0;
    } else {
      const s = Math.sqrt((1 + d) * 2);
      const invs = 1 / s;
      qx = vx * invs;
      qy = vy * invs;
      qz = vz * invs;
      qw = s * 0.5;
    }
    wg.globe.group.quaternion.set(qx, qy, qz, qw);
    // Diagnostic: log the actual state
    const dbg = {
      quat: [qx.toFixed(3), qy.toFixed(3), qz.toFixed(3), qw.toFixed(3)],
      euler: [
        wg.globe.group.rotation.x.toFixed(3),
        wg.globe.group.rotation.y.toFixed(3),
        wg.globe.group.rotation.z.toFixed(3)
      ],
      autoRotate: wg.globe['autoRotate']
    };
    console.log('  arctic rot dbg:', JSON.stringify(dbg));
  });
  await sleep(1500);
  await page.screenshot({ path: 'D:\\codes\\Game\\world game\\audit-output\\polar-arctic-v2.png' });

  // Just for visual sanity, also try a milder tilt showing the pole area
  await page.evaluate(() => {
    const wg = window.__worldGame;
    if (!wg) return;
    wg.globe.group.rotation.set(0.9, -0.6, 0);
  });
  await sleep(3000);
  await page.screenshot({ path: 'D:\\codes\\Game\\world game\\audit-output\\polar-arctic-tilted.png' });

  // ANTARCTIC: rotate so label at (0, -68) is centred
  // Texture y for lat=-68: (90-(-68))/180 = 0.878, so x rotation = (0.5 - 0.878) * PI = -1.19
  await page.evaluate(() => {
    const wg = window.__worldGame;
    if (!wg) return;
    wg.globe.group.rotation.set(-1.19, Math.PI, 0);
  });
  await sleep(3000);
  await page.screenshot({ path: 'D:\\codes\\Game\\world game\\audit-output\\polar-antarctic-v2.png' });

  // DEFAULT: globe facing asia
  await page.evaluate(() => {
    const wg = window.__worldGame;
    if (!wg) return;
    wg.globe.group.rotation.set(0, Math.PI, 0);
  });
  await sleep(2000);
  await page.screenshot({ path: 'D:\\codes\\Game\\world game\\audit-output\\polar-default-v2.png' });

  await browser.close();
  console.log('done');
})();
