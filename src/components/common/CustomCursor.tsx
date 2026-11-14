import React, { useEffect, useRef, useState } from 'react';

type CursorType = 'default' | 'button' | 'link' | 'card' | 'view' | 'drag' | 'text';

export function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Target mouse coordinates (updated instantly on mousemove)
  const targetPos = useRef({ x: -100, y: -100 });
  // Interpolated follower coordinates (smooth, snappy follow)
  const followerPos = useRef({ x: -100, y: -100 });

  // Track active cursor type to prevent duplicate React state updates
  const cursorTypeRef = useRef<CursorType>('default');
  const isVisibleRef = useRef(false);

  // Direct DOM references for 60-120fps GPU transforms with zero React overhead
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only activate custom cursor on desktop devices with a precision mouse or trackpad
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const checkIsDesktop = () => {
      const desktop = mediaQuery.matches;
      setIsDesktop(desktop);
      if (desktop) {
        document.body.classList.add('custom-cursor-enabled');
      } else {
        document.body.classList.remove('custom-cursor-enabled');
      }
    };

    checkIsDesktop();
    mediaQuery.addEventListener('change', checkIsDesktop);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Snappy tracking factor: 0.45 ensures outer follower stays tight to pointer with zero sluggishness
    const lerpFactor = prefersReducedMotion.matches ? 1.0 : 0.45;

    // High performance mousemove handler: NO React re-renders unless cursor hover type actually changes
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      targetPos.current.x = clientX;
      targetPos.current.y = clientY;

      // Ensure cursor is visible
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        followerPos.current.x = clientX;
        followerPos.current.y = clientY;
        if (rootRef.current) {
          rootRef.current.style.opacity = '1';
        }
      }

      // 1. Instant 0ms update for inner dot - zero lag, perfectly aligned with the pointer
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
      }

      // 2. Identify element under cursor
      const target = e.target as HTMLElement | null;
      let detectedType: CursorType = 'default';

      if (target) {
        if (
          target.closest(
            'input[type="text"], input[type="email"], input[type="password"], input[type="search"], textarea, [contenteditable="true"]'
          )
        ) {
          detectedType = 'text';
        } else if (target.closest('input[type="range"], [data-cursor="drag"]')) {
          detectedType = 'drag';
        } else if (
          target.closest('[data-cursor="view"]') ||
          (target.tagName === 'IMG' &&
            target.closest(
              '.group, [data-cursor="product-card"], .aspect-\\[3\\/4\\], .aspect-\\[16\\/10\\], .aspect-\\[4\\/5\\]'
            )) ||
          target.closest('.aspect-\\[3\\/4\\], .aspect-\\[16\\/10\\], .aspect-\\[4\\/5\\]')
        ) {
          detectedType = 'view';
        } else if (target.closest('button, [role="button"], input[type="submit"], input[type="button"], .btn')) {
          detectedType = 'button';
        } else if (target.closest('a, nav, header a, footer a')) {
          detectedType = 'link';
        } else if (target.closest('.group, [data-cursor="card"], article')) {
          detectedType = 'card';
        }
      }

      // ONLY trigger a React re-render when the cursor state actually transitions
      if (detectedType !== cursorTypeRef.current) {
        cursorTypeRef.current = detectedType;
        setCursorType(detectedType);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      if (rootRef.current) {
        rootRef.current.style.opacity = '0';
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      isVisibleRef.current = true;
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
      followerPos.current.x = e.clientX;
      followerPos.current.y = e.clientY;
      if (rootRef.current) {
        rootRef.current.style.opacity = '1';
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Fast, smooth interpolation animation loop for the outer follower
    const render = () => {
      if (isVisibleRef.current && followerRef.current) {
        // Fast exponential catch-up (stays close to pointer with subtle luxury smoothing)
        followerPos.current.x += (targetPos.current.x - followerPos.current.x) * lerpFactor;
        followerPos.current.y += (targetPos.current.y - followerPos.current.y) * lerpFactor;

        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      mediaQuery.removeEventListener('change', checkIsDesktop);
      document.body.classList.remove('custom-cursor-enabled');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // On touch / non-desktop devices, do not mount cursor markup
  if (!isDesktop) return null;

  // Snappy sizing and styling with fast 120ms transitions (no transition on transform)
  let followerClasses = 'w-8 h-8 border border-[#F2EFE7]/50 bg-transparent';
  let showViewText = false;
  let showDragIcon = false;

  switch (cursorType) {
    case 'button':
      followerClasses = 'w-11 h-11 border border-[#777B5A] bg-[#777B5A]/15 backdrop-blur-[1px]';
      break;
    case 'link':
      followerClasses = 'w-10 h-10 border border-[#F2EFE7]/70 bg-[#F2EFE7]/10';
      break;
    case 'card':
      followerClasses = 'w-12 h-12 border border-[#F2EFE7]/60 bg-transparent';
      break;
    case 'view':
      followerClasses = 'w-15 h-15 border border-[#777B5A] bg-[#292F23]/90 shadow-md backdrop-blur-[2px]';
      showViewText = true;
      break;
    case 'drag':
      followerClasses = 'w-11 h-11 border border-[#777B5A] bg-[#505840]/30';
      showDragIcon = true;
      break;
    case 'text':
      followerClasses = 'w-5 h-5 border border-[#F2EFE7]/30 bg-transparent';
      break;
    default:
      followerClasses = 'w-8 h-8 border border-[#F2EFE7]/45 bg-transparent';
      break;
  }

  // Fast click press scale
  const clickScale = isMouseDown ? 'scale-85' : 'scale-100';

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none opacity-0 transition-opacity duration-150 ease-out"
    >
      {/* 1. Fast Outer Follower Circle - CRITICAL: transform is animated via requestAnimationFrame ONLY, never CSS transition */}
      <div
        ref={followerRef}
        className={`absolute top-0 left-0 rounded-full flex items-center justify-center will-change-transform ${followerClasses} ${clickScale}`}
        style={{
          // Only size, colors, and borders have quick 120ms easing. Transform has 0ms delay for maximum responsiveness.
          transition:
            'width 120ms cubic-bezier(0.16, 1, 0.3, 1), height 120ms cubic-bezier(0.16, 1, 0.3, 1), background-color 120ms ease-out, border-color 120ms ease-out, transform 0ms',
        }}
      >
        {/* VIEW Badge for product photography */}
        {showViewText && (
          <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase font-brand-display text-[#F2EFE7] animate-in fade-in zoom-in-95 duration-100">
            VIEW
          </span>
        )}

        {/* Drag Indicator for sliders */}
        {showDragIcon && (
          <span className="text-[10px] font-bold text-[#F2EFE7] tracking-wider animate-in fade-in duration-100">
            &larr;&rarr;
          </span>
        )}
      </div>

      {/* 2. Inner Precise Solid Olive Cursor - ZERO transform transition, follows pointer instantly */}
      {!showViewText && cursorType !== 'text' && (
        <div
          ref={dotRef}
          className={`absolute top-0 left-0 rounded-full bg-[#777B5A] will-change-transform ${
            cursorType === 'button'
              ? 'w-2.5 h-2.5 bg-[#F2EFE7]'
              : cursorType === 'link'
              ? 'w-2 h-2 bg-[#777B5A]'
              : 'w-2 h-2'
          } ${isMouseDown ? 'scale-75' : 'scale-100'}`}
          style={{
            // Transform is set directly with 0ms transition for instant attachment to the mouse
            transition: 'width 100ms ease-out, height 100ms ease-out, background-color 100ms ease-out, transform 0ms',
          }}
        />
      )}

      {/* Clean vertical caret indicator for text inputs */}
      {cursorType === 'text' && (
        <div
          ref={dotRef}
          className="absolute top-0 left-0 w-0.5 h-3.5 bg-[#F2EFE7]/80 will-change-transform"
          style={{
            transition: 'transform 0ms',
          }}
        />
      )}
    </div>
  );
}
