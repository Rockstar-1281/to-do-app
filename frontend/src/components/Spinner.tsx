"use client";

import * as React from "react";

type SpinnerProps = {
  loading?: boolean;
  color?: string;
  speedMultiplier?: number;
  cssOverride?: React.CSSProperties;
  height?: number;
  width?: number;
};

function cssValue(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

function calculateRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function createAnimation(name: string, frames: string, key: string) {
  const animationName = `${name}-${key}`;
  if (typeof document !== "undefined" && !document.getElementById(animationName)) {
    const style = document.createElement("style");
    style.id = animationName;
    style.innerHTML = `
      @keyframes ${animationName} { ${frames} }
    `;
    document.head.appendChild(style);
  }
  return animationName;
}

const long = createAnimation(
  "BarLoader",
  `0% {left: -35%;right: 100%} 60% {left: 100%;right: -90%} 100% {left: 100%;right: -90%}`,
  "long"
);

const short = createAnimation(
  "BarLoader",
  `0% {left: -200%;right: 100%} 60% {left: 107%;right: -8%} 100% {left: 107%;right: -8%}`,
  "short"
);

export default function Spinner({
  loading = true,
  color = "#000000",
  speedMultiplier = 1,
  cssOverride = {},
  height = 4,
  width = 100,
  ...additionalprops
}: SpinnerProps) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [loading]);

  const wrapper: React.CSSProperties = {
    display: "block",
    position: "relative",
    width: cssValue(width),
    height: cssValue(height),
    overflow: "hidden",
    backgroundColor: calculateRgba(color, 0.2),
    backgroundClip: "padding-box",
    margin: "2rem auto",
    ...cssOverride,
  };

  const style = (i: number): React.CSSProperties => ({
    position: "absolute",
    height: cssValue(height),
    overflow: "hidden",
    backgroundColor: color,
    backgroundClip: "padding-box",
    display: "block",
    borderRadius: 2,
    willChange: "left, right",
    animationFillMode: "forwards",
    animation: `${i === 1 ? long : short} ${2.1 / speedMultiplier}s ${i === 2 ? `${1.15 / speedMultiplier}s` : ""} ${
      i === 1 ? "cubic-bezier(0.65, 0.815, 0.735, 0.395)" : "cubic-bezier(0.165, 0.84, 0.44, 1)"
    } infinite`,
  });

  if (!loading || !show) {
    return null;
  }

  return (
    <span style={wrapper} {...additionalprops}>
      <span style={style(1)} />
      <span style={style(2)} />
    </span>
  );
}
