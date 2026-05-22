'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { asset } from '../../lib/asset';

export function FeatureVideoPlayer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dark, setDark] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  // Start playback only when the video first becomes visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset & play once visible (and whenever src changes after that)
  useEffect(() => {
    if (!hasBeenVisible) return;
    const video = videoRef.current;
    if (!video) return;
    setDark(false);
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [src, hasBeenVisible]);

  const handleEnded = () => {
    setDark(true);
    setTimeout(() => {
      setDark(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 1000);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-white/[0.10] bg-black"
    >
      <video
        ref={videoRef}
        src={asset(src)}
        muted
        playsInline
        preload="auto"
        onEnded={handleEnded}
        className="block h-auto w-full"
      />
      <AnimatePresence>
        {dark && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
