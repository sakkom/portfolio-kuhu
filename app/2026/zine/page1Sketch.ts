import * as THREE from "three";
import { item0, item1, item2, item3, item4, item5 } from "./shader";

export function zineSketch01(scene: THREE.Scene) {
  const group = new THREE.Group();

  const uniforms = {
    uTime: { value: 0.0 },
    uTex: { value: null },
  };

  const init = async (screenAspect: number) => {
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2654.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2655.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2656.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2657.JPG");
    //item1反応
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2658.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2659.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2660.JPG");
    //森 item0
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2661.JPG");
    //ジャッキー家　item3
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2662.JPG");
    //dragon item1
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2663.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2664.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2665.JPG");
    //item3反応
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2667.JPG");
    //sea shot item2
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2668.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2669.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2670.JPG");
    //item3反応
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2671.JPG");
    // item3反応
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2672.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2673.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2674.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2675.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2676.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2677.JPG");
    //item3反応
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2678.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2679.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2680.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2681.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2682.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2683.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2684.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2685.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2686.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2687.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2688.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2689.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2690.JPG");
    //item3反応
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2691.JPG");
    // item4
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2712.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2713.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2714.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2715.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2716.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2717.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2718.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2719.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2720.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2721.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2722.JPG");
    // item4保留
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2723.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2724.JPG");
    const tex = await new THREE.TextureLoader().loadAsync("/zine/IMG_2727.JPG");
    // const tex = await new THREE.TextureLoader().loadAsync(
    //   "/zine/zine_1775237066375.png",
    // );
    const imageW = tex.image.width;
    const imageH = tex.image.height;
    const aspect = imageW / imageH;
    console.log(imageW, imageH);

    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({
      vertexShader: item5.vertexShader,
      fragmentShader: item5.fragmentShader,
      uniforms,
      depthTest: false,
    });
    mat.uniforms.uTex.value = tex;
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    scene.add(group);
    return { imageW, imageH };
  };

  const update = () => {
    uniforms.uTime.value += 0.01;
  };

  return {
    get mesh() {
      return group;
    },
    init,
    update,
  };
}
