import Image from "next/image";
import { FAQ, type FaqItem } from "./copy";

// As on the old site: the questions on the cream half, the family photo filling the other
// half to the edge. Native
// details, several may stay open, the first is open in the HTML. Plain words: the
// JSON-LD reads the same data, so what a search engine sees is what a person reads.
function Answer({ item }: { item: FaqItem }) {
  if (!item.link) return <p>{item.a}</p>;
  const [before, after] = item.a.split(item.link.text);
  const external = item.link.href.startsWith("http");
  return (
    <p>
      {before}
      <a
        href={item.link.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {item.link.text}
      </a>
      {after}
    </p>
  );
}

export default function FaqSection() {
  return (
    <section id="spoergsmaal" data-b="faq" className="q">
      <div className="q-grid">
        <div className="q-main">
          <h2 className="t-h2">{FAQ.title}</h2>
          <div className="q-list">
            {FAQ.items.map((item, i) => (
              <details key={item.q} open={i === 0} className="q-item">
                <summary>
                  <span>{item.q}</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <Answer item={item} />
              </details>
            ))}
          </div>
        </div>
        {/* The family photo from the old site's FAQ (Figma 5533:3843), edge to edge on the right. */}
        <div className="q-photo">
          <Image
            src="/faq-familie.jpg"
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 45vw"
            quality={80}
            style={{ objectFit: "cover", objectPosition: "50% 30%" }}
          />
          <Image
            src="/app-badge.png"
            alt=""
            width={88}
            height={88}
            className="q-icon"
          />
        </div>
      </div>
    </section>
  );
}
