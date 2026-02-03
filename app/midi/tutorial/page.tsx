"use client";

import { useEffect, useRef } from "react";

export default function Page() {
  const oscRef = useRef<OscillatorNode | null>(null);
  useEffect(() => {
    const ctx = new AudioContext();

    navigator.requestMIDIAccess().then((access) => {
      const inputs = access.inputs;
      inputs.forEach((input) => {
        input.onmidimessage = (m) => {
          if (!m.data) return;
          const [status, data1, data2] = m.data;
          if (status == 153 && data1 == 40) {
            const osc = ctx.createOscillator();
            osc.frequency.value = 440;
            osc.connect(ctx.destination);
            osc.start();
            oscRef.current = osc;
          }
          if (status == 137 && data1 == 40) {
            oscRef?.current?.stop();
            oscRef.current = null;
          }
        };
      });
    });
  }, []);

  return <></>;
}
