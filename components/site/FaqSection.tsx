"use client";

import { useEffect, useRef, useState } from "react";
import { FAQ, type FaqItem } from "./copy";

// The old site's FAQ, working the same way, in the new type. The family photo on the right
// keeps its own proportions and sets the section's height on a computer; the questions sit in
// a scroll area on the cream half with a Signal scrollbar on its left edge, so opening an
// answer scrolls, never stretches the section. One answer open at a time; the first folds out
// on its own once the section is in view, unless the visitor got there first. On a phone the
// first four questions show, with "Vis flere" for the rest.
const MOBILE_VISIBLE = 4;

function Answer({ item }: { item: FaqItem }) {
  if (!item.link) return <p>{item.a}</p>;
  const [before, after] = item.a.split(item.link.text);
  return (
    <p>
      {before}
      <a href={item.link.href}>{item.link.text}</a>
      {after}
    </p>
  );
}

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const section = useRef<HTMLElement>(null);
  const touched = useRef(false);

  useEffect(() => {
    const openFirst = () => {
      if (!touched.current) setOpen((o) => (o === null ? 0 : o));
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      openFirst();
      return;
    }
    const el = section.current as HTMLElement;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(openFirst, 650);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  // The scrollbar's thumb, from the scroll area's own numbers; it fills the track when
  // nothing overflows.
  const scroller = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ top: 0, height: 1 });
  const measure = () => {
    const el = scroller.current;
    if (!el) return;
    setThumb({
      top: el.scrollTop / el.scrollHeight,
      height: el.clientHeight / el.scrollHeight,
    });
  };
  useEffect(() => {
    measure();
    const el = scroller.current as HTMLDivElement;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, []);

  return (
    <section ref={section} id="spoergsmaal" data-b="faq" className="q">
      <div className="q-grid">
        <div className="q-main">
          <div className="q-inner">
            <h2 className="t-h2">{FAQ.title}</h2>
            <div className="q-area">
              <div className="q-track" aria-hidden="true">
                <div
                  className="q-thumb"
                  style={{
                    top: `${thumb.top * 100}%`,
                    height: `${thumb.height * 100}%`,
                  }}
                />
              </div>
              <div ref={scroller} onScroll={measure} className="q-scroll">
                <div className="q-list">
                  {FAQ.items.map((item, i) => {
                    const isOpen = open === i;
                    return (
                      <div
                        key={item.q}
                        className="q-item"
                        data-more={
                          i >= MOBILE_VISIBLE && !showAll ? "true" : undefined
                        }
                      >
                        <h3>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`q-answer-${i}`}
                            onClick={() => {
                              touched.current = true;
                              setOpen(isOpen ? null : i);
                            }}
                          >
                            <span>{item.q}</span>
                            <svg
                              viewBox="0 0 14 14"
                              width="14"
                              height="14"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M7 1v12M1 7h12"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </h3>
                        <div
                          id={`q-answer-${i}`}
                          className="q-answer"
                          data-open={isOpen ? "true" : undefined}
                          aria-hidden={!isOpen}
                        >
                          <div>
                            <Answer item={item} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="q-more"
              aria-expanded={showAll}
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? "Vis færre" : "Vis flere"}
              <svg
                viewBox="0 0 12 12"
                width="12"
                height="12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* The family photo from the old site's FAQ (Figma 5533:3843), at its own proportions. */}
        <div className="q-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/faq-familie.jpg"
            alt="Far med datter på skuldrene i stuen"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
