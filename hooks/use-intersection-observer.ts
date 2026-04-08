"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseIntersectionObserverOptions {
  /** Percentage of the element that must be visible (0-1). Default: 0 */
  threshold?: number;
  /** Margin around the root element. e.g. "200px 0px" loads 200px before entering viewport */
  rootMargin?: string;
  /** Once triggered, stop observing. Default: true */
  triggerOnce?: boolean;
}

/**
 * Custom hook that uses the Intersection Observer API to detect
 * when an element enters the viewport. Optimized to avoid
 * unnecessary re-renders by disconnecting after first trigger.
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0, rootMargin = "200px 0px", triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already triggered and triggerOnce is true, skip
    if (isIntersecting && triggerOnce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, isIntersecting]);

  return [ref, isIntersecting];
}
