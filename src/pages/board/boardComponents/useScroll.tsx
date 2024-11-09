// ./boardComponents/useScroll.ts

import { useState, useRef } from 'react';

const SCROLL_STEP = 10;
const SCROLL_ZONE_HEIGHT = 100;
const SCROLL_ZONE_WIDTH = 100;

export const useScroll = (isDraggingCard: boolean) => {
  const [scrolling, setScrolling] = useState<boolean>(false);
  const scrollAnimationRef = useRef<number | null>(null);

  const handleScroll = (e: any) => {
    if (!isDraggingCard) return;

    const { clientY, clientX } = e;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    if (clientY < SCROLL_ZONE_HEIGHT) {
      startScrolling(0, -SCROLL_STEP);
    } else if (clientY > viewportHeight - SCROLL_ZONE_HEIGHT) {
      startScrolling(0, SCROLL_STEP);
    }

    if (clientX < SCROLL_ZONE_WIDTH) {
      startScrolling(-SCROLL_STEP, 0);
    } else if (clientX > viewportWidth - SCROLL_ZONE_WIDTH) {
      startScrolling(SCROLL_STEP, 0);
    }
  };

  const startScrolling = (scrollXAmount: number, scrollYAmount: number) => {
    if (!scrolling) {
      setScrolling(true);
      scrollAnimationRef.current = window.requestAnimationFrame(() =>
        scrollWindow(scrollXAmount, scrollYAmount)
      );
    }
  };

  const scrollWindow = (scrollXAmount: number, scrollYAmount: number) => {
    window.scrollBy(scrollXAmount, scrollYAmount);
    scrollAnimationRef.current = window.requestAnimationFrame(() =>
      scrollWindow(scrollXAmount, scrollYAmount)
    );
  };

  const stopScrolling = () => {
    setScrolling(false);
    if (scrollAnimationRef.current) {
      window.cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
  };

  return { handleScroll, stopScrolling };
};
