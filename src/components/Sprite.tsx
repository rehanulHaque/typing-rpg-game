import { useEffect, useState } from "react";

export function CssSprite({ frameCount, frameWidth, frameHeight, fps, imgSrc, scale, position }: {
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  fps: number;
  imgSrc: string;
  scale: number;
  position: number
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % frameCount);
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [frameCount, fps]);

  const x = -frame * frameWidth;
  return (
    <div
      aria-hidden
      style={{
        width: frameWidth,
        height: frameHeight,
        backgroundImage: `url(${imgSrc})`,
        backgroundPosition: `${x}px ${position}px`,
        imageRendering: "pixelated" /* good for pixel art */,
        scale: scale,
        transform: "scaleX(-1)"
      }}
    />
  );
}
