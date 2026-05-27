import { useMemo } from 'react';

const ITEMS = ['⬤', '◯', '●', '○', '◉', '◎', '⊙', '⊚'];

export default function FloatingNumbers() {
  const elements = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      content: ITEMS[i % ITEMS.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 20}s`,
      duration: `${15 + Math.random() * 15}s`,
      size: `${2 + Math.random() * 2}rem`,
    })),
  []);

  return (
    <div className="floating-numbers">
      {elements.map(el => (
        <span
          key={el.id}
          className="floating-number"
          style={{
            left: el.left,
            animationDelay: el.delay,
            animationDuration: el.duration,
            fontSize: el.size,
          }}
        >
          {el.content}
        </span>
      ))}
    </div>
  );
}
