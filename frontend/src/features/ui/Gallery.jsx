import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Gallery.css";

const COLORS = ["#e9e4d8", "#c9694a", "#d99a2b", "#4f6b46", "#5f82a8", "#efe9dd", "#2b2b2b", "#e8742c"];

const placeholder = (c) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 200"><rect width="150" height="200" fill="#d9dcdf"/>
     <rect y="160" width="150" height="40" fill="#eceeef"/><path d="M45 85 L55 40 H95 L105 85Z" fill="${c}"/>
     <rect x="73" y="85" width="4" height="65" fill="${c}"/><ellipse cx="75" cy="152" rx="24" ry="5" fill="${c}"/></svg>`
  );

const mod = (a, n) => ((a % n) + n) % n;

const layoutSphere = (d) => {
  const lat = mod(d * 37 + 50, 100) - 50;
  return {
    t: `rotateY(${d * 137.5}deg) rotateX(${-lat * 0.9}deg) translateZ(300px)`,
    o: 1,
    z: 50,
  };
};

export default function Gallery({ items }) {
  if (!items || items.length === 0) return null;

  const n = items.length;
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const [broken, setBroken] = useState({});

  useEffect(() => {
    setActive(0);
  }, [items]);

  const stageRef = useRef(null);
  const drag = useRef({ on: false, startX: 0, startActive: 0, moved: false });

  const onPointerDown = (e) => {
    drag.current = { on: true, startX: e.clientX, startActive: active, moved: false };
  };

  useEffect(() => {
    const move = (e) => {
      const d = drag.current;
      if (!d.on || n === 0) return;
      const dx = e.clientX - d.startX;
      if (Math.abs(dx) > 6) d.moved = true;
      setActive(mod(d.startActive - Math.round(dx / 40), n));
    };

    const up = () => {
      drag.current.on = false;
      setTimeout(() => (drag.current.moved = false), 0);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [n]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || n === 0) return undefined;
    const wheel = (e) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      setActive((a) => mod(a + Math.sign(e.deltaX), n));
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [n]);

  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (openIndex !== null || n === 0) return;
      if (e.key === "ArrowRight") setActive((a) => mod(a + 1, n));
      if (e.key === "ArrowLeft") setActive((a) => mod(a - 1, n));
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [openIndex, n]);

  const srcOf = (i) => (broken[i] || !items[i]?.src ? placeholder(COLORS[i % COLORS.length]) : items[i].src);

  const onItemClick = (i) => {
    if (drag.current.moved) return;
    const shortest = mod(i - active + n / 2, n) - n / 2;
    if (shortest === 0) {
      setOpenIndex(i);
    } else {
      setActive(mod(active + shortest, n));
    }
  };

  return (
    <section className="gx" aria-label="Hotel Showcase 3D Sphere">
      <div className="gx-live">
        <i /> Hotel Showcase
      </div>

      <div className="gx-stage" ref={stageRef} onPointerDown={onPointerDown}>
        {items.map((it, i) => {
          const d = mod(i - active + n / 2, n) - n / 2;
          const r = layoutSphere(d);
          return (
            <button
              key={it.id || i}
              type="button"
              className="gx-item"
              aria-label={`${it.title}${it.location ? ` in ${it.location}` : ''}`}
              onClick={() => onItemClick(i)}
              style={{
                transform: r.t,
                opacity: r.o,
                zIndex: r.z,
                pointerEvents: r.o ? "auto" : "none",
              }}
            >
              <img
                src={srcOf(i)}
                alt={it.title}
                draggable={false}
                onError={() => setBroken((b) => ({ ...b, [i]: true }))}
              />
              <div className="gx-item__overlay">
                <span className="gx-item__title">{it.title}</span>
                {it.location && (
                  <span className="gx-item__loc">
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {it.location}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {openIndex !== null && items[openIndex] && (
        <div
          className="gx-open"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setOpenIndex(null)}
        >
          <img src={srcOf(openIndex)} alt={items[openIndex].title} />
          <div className="gx-bar">
            <div className="gx-bar__info">
              <span className="gx-bar__title">{items[openIndex].title}</span>
              {items[openIndex].location && (
                <span className="gx-bar__loc">
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {items[openIndex].location}
                </span>
              )}
              {items[openIndex].price !== undefined && (
                <span className="gx-bar__price">
                  ₹{Number(items[openIndex].price).toFixed(2)}/night
                </span>
              )}
              {items[openIndex].description && (
                <p className="gx-bar__desc">{items[openIndex].description}</p>
              )}
            </div>
            <div className="gx-bar__actions">
              {items[openIndex].id && (
                <Link
                  to={`/hotels/${items[openIndex].id}`}
                  className="btn btn--primary btn--sm"
                  style={{ textDecoration: "none" }}
                  onClick={() => setOpenIndex(null)}
                >
                  View Details
                </Link>
              )}
              <button
                type="button"
                className="btn btn--outline btn--sm"
                autoFocus
                onClick={() => setOpenIndex(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
