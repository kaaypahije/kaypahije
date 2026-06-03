import { useEffect, useRef, useState, type ReactNode } from "react";

export function DeferredSection({
  children,
  placeholder = null,
  className = "",
  onVisible,
}: {
  children: ReactNode;
  placeholder?: ReactNode;
  className?: string;
  onVisible?: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          onVisible?.();
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [onVisible, shouldRender]);

  return (
    <div ref={ref} className={className}>
      {shouldRender ? children : placeholder}
    </div>
  );
}
