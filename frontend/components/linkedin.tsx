// Shared building blocks for the LinkedIn posts shown on the Home page
// ("home" variant, compact) and on /digital-footprint ("page" variant, roomier).
// Both read the same posts from Sanity; only the styling differs.

export type LinkedInPost = {
  _key: string;
  text?: string | null;
  timeAgo?: string | null;
  likes?: number | null;
  reposts?: number | null;
  url?: string | null;
};

export type LinkedInVariant = "home" | "page";

// Shown on every card (the posts are always from the company page)
const PAGE_NAME = "Copyright Integrity";
const PAGE_SUFFIX = "International";

// Used when the CMS field is still empty
export const DEFAULT_LINKEDIN_URL =
  "https://www.linkedin.com/company/copyright-integrity-international/posts/";

const formatCount = (n: number) => n.toLocaleString("en-US");

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

const STYLES = {
  home: {
    button: `inline-flex shrink-0 items-center gap-2.5 self-start rounded-full border border-[#2F63B5] bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#123a85] ${FOCUS} focus-visible:outline-brand-blue sm:self-auto`,
    buttonIcon: "h-[18px] w-[18px]",
    card: "flex flex-col rounded-2xl border border-[#E6EBF4] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.04)]",
    avatar:
      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue text-[15px] font-bold leading-none text-white",
    name: "text-sm font-semibold leading-tight text-[#0E1D48]",
    meta: "mt-0.5 text-xs text-[#475467]",
    body: "mt-3.5 whitespace-pre-line text-sm leading-[1.65] text-[#1A2547]",
    footer: "mt-auto pt-5",
    stats:
      "flex items-center justify-between border-t border-[#EEF1F6] pt-4 text-xs text-[#2C4A7C]",
    link: `font-bold text-brand-blue transition-colors hover:text-[#0E2F6E] hover:underline ${FOCUS} focus-visible:outline-brand-blue`,
    icon: "h-3.5 w-3.5",
  },
  page: {
    button: `inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-[#244598] px-6 py-3 text-sm font-semibold leading-[21px] text-white transition-colors duration-200 hover:bg-[#1A3577] ${FOCUS} focus-visible:outline-[#244598] sm:self-auto`,
    buttonIcon: "h-[17px] w-[17px]",
    card: "flex flex-col rounded-[20px] border border-[#DCE3EF] bg-white p-8",
    avatar:
      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2D64BC] text-[15px] font-bold leading-none text-white",
    name: "text-[13.75px] font-semibold leading-tight text-[#081F5C]",
    meta: "mt-1 text-[11.5px] text-[#2A4879]",
    body: "mt-5 whitespace-pre-line text-[14.5px] leading-[1.62] text-[#3A4C7D]",
    footer: "mt-auto pt-6",
    stats:
      "flex items-center justify-between border-t border-[#EDF1F7] pt-5 text-[13px] text-[#2A4879]",
    link: `font-semibold text-[#244598] transition-colors hover:text-[#16306E] hover:underline ${FOCUS} focus-visible:outline-[#244598]`,
    icon: "h-4 w-4",
  },
} satisfies Record<LinkedInVariant, Record<string, string>>;

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function HeartIcon({ variant, className }: { variant: LinkedInVariant; className: string }) {
  if (variant === "page") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function RepostIcon({ variant, className }: { variant: LinkedInVariant; className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={variant === "page" ? 1.8 : 2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {variant === "page" ? (
        <>
          <path d="M17 1l4 4-4 4" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <path d="M7 23l-4-4 4-4" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </>
      ) : (
        <>
          <path d="M20 12a8 8 0 1 1-2.5-5.8" />
          <path d="M20 4v5h-5" />
        </>
      )}
    </svg>
  );
}

export function LinkedInFollowButton({
  href,
  label,
  variant,
}: {
  href?: string | null;
  label?: string | null;
  variant: LinkedInVariant;
}) {
  const s = STYLES[variant];
  return (
    <a
      href={href || DEFAULT_LINKEDIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={s.button}
    >
      <LinkedInIcon className={s.buttonIcon} />
      {label || "Follow Us on LinkedIn"}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function LinkedInPostCard({
  post,
  variant,
}: {
  post: LinkedInPost;
  variant: LinkedInVariant;
}) {
  const s = STYLES[variant];

  return (
    <article className={s.card}>
      <header className="flex items-center gap-3">
        <span aria-hidden className={s.avatar}>
          in
        </span>
        <div className="min-w-0">
          <p className={s.name}>{PAGE_NAME}</p>
          <p className={s.meta}>
            {PAGE_SUFFIX}
            {post.timeAgo ? ` · ${post.timeAgo}` : ""}
          </p>
        </div>
      </header>

      <p className={s.body}>{post.text}</p>

      {/* mt-auto keeps the divider + stats on one line across cards */}
      <footer className={s.footer}>
        <div className={s.stats}>
          <div className="flex items-center gap-4">
            {typeof post.likes === "number" && (
              <span
                className="inline-flex items-center gap-1.5"
                aria-label={`${formatCount(post.likes)} likes`}
              >
                <HeartIcon variant={variant} className={s.icon} />
                {formatCount(post.likes)}
              </span>
            )}
            {typeof post.reposts === "number" && (
              <span
                className="inline-flex items-center gap-1.5"
                aria-label={`${formatCount(post.reposts)} reposts`}
              >
                <RepostIcon variant={variant} className={s.icon} />
                {formatCount(post.reposts)}
              </span>
            )}
          </div>

          {post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
            >
              View post
              {variant === "page" && (
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 inline-block h-3 w-3 align-[-1px]"
                >
                  <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
                </svg>
              )}
              <span className="sr-only"> on LinkedIn (opens in a new tab)</span>
            </a>
          )}
        </div>
      </footer>
    </article>
  );
}
