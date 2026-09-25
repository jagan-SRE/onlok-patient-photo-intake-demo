"use client";

import { useEffect } from "react";

export default function Home() {
  const target = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/photo-intake/`;
  useEffect(() => {
    window.location.replace(target);
  }, [target]);
  return <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}><p>Opening the demo…</p><a href={target}>Continue to Patient Photo Intake</a></main>;
}
