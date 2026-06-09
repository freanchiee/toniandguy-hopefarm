"use client";

import Script from "next/script";

const INSTAGRAM_URL = "https://www.instagram.com/toniandguy_whitefield/";
const FACEBOOK_URL = "https://www.facebook.com/toni.guy.whitefield/";
const FACEBOOK_PAGE = "https://www.facebook.com/toni.guy.whitefield";

export function InstagramFeed() {
  return (
    <>
      {/* Instagram Section — Behold.so live feed */}
      <section className="bg-[#0e0d0b] py-24 md:py-32">
        <div className="section-shell">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Instagram</p>
              <h2 className="mt-4 font-display text-4xl leading-none md:text-6xl">@toniandguy_whitefield</h2>
            </div>
            <div className="hidden shrink-0 items-center gap-3 md:flex">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/18 px-5 py-2.5 text-sm font-medium text-white transition hover:border-salon-gold hover:text-salon-gold"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.31.975.975 1.248 2.242 1.31 3.608.058 1.266.069 1.646.069 4.849s-.011 3.583-.069 4.85c-.062 1.366-.335 2.633-1.31 3.608-.975.975-2.242 1.248-3.608 1.31-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.633-.335-3.608-1.31-.975-.975-1.248-2.242-1.31-3.608C2.175 15.583 2.163 15.203 2.163 12s.012-3.584.07-4.85c.062-1.366.335-2.633 1.31-3.608.975-.975 2.242-1.248 3.608-1.31C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.81 2.257 6.09 2.243 6.498 2.243 12c0 5.502.014 5.91.072 7.19.059 1.278.353 2.451 1.32 3.418.967.967 2.14 1.261 3.418 1.32C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.278-.059 2.451-.353 3.418-1.32.967-.967 1.261-2.14 1.32-3.418.058-1.28.072-1.688.072-7.19 0-5.502-.014-5.91-.072-7.19-.059-1.278-.353-2.451-1.32-3.418C19.398.425 18.225.131 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
                Instagram
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/18 px-5 py-2.5 text-sm font-medium text-white transition hover:border-salon-gold hover:text-salon-gold"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                Facebook
              </a>
            </div>
          </div>

          {/* Behold.so live Instagram widget */}
          <behold-widget feed-id="Go9DOpvRYC4xzf61NoXA" />
          <Script
            id="behold-widget"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(()=>{const d=document,s=d.createElement("script");s.type="module";s.src="https://w.behold.so/widget.js";d.head.append(s);})();`,
            }}
          />
        </div>
      </section>

      {/* Facebook Page Section */}
      <section className="bg-salon-black py-24 md:py-32">
        <div className="section-shell">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Facebook</p>
              <h2 className="mt-4 font-display text-4xl leading-none md:text-6xl">Latest from our page</h2>
            </div>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden shrink-0 items-center gap-2 rounded-full border border-white/18 px-5 py-2.5 text-sm font-medium text-white transition hover:border-salon-gold hover:text-salon-gold md:flex"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              View Page
            </a>
          </div>

          {/* Facebook Page Plugin — iframe embed, no App ID required */}
          <div className="flex justify-center overflow-hidden rounded-xl border border-white/8 bg-white">
            <iframe
              src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FACEBOOK_PAGE)}&tabs=timeline&width=500&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`}
              width="500"
              height="600"
              style={{ border: "none", overflow: "hidden", maxWidth: "100%" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="Toni & Guy Hopefarm Facebook Page"
            />
          </div>
        </div>
      </section>
    </>
  );
}
