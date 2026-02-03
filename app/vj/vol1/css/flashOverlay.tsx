export const FlashOverlay = ({ isFlash }: { isFlash: boolean }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        // background: `hsl(${Math.random() * 360}, 50%, 50%)`,
        background: "white",
        opacity: isFlash ? 1 : 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};
