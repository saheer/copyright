import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
};

const href = (page: number) =>
  page <= 1 ? "/digital-digest" : `/digital-digest?page=${page}`;

// Page numbers to show: always first/last, the current page and its neighbours,
// with "…" for the gaps (e.g. 1 … 4 5 6 … 12)
function pageItems(page: number, total: number): (number | "gap")[] {
  const wanted = new Set([1, total, page - 1, page, page + 1]);
  const pages = [...wanted].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  pages.forEach((n, i) => {
    if (i > 0 && n - pages[i - 1] > 1) items.push("gap");
    items.push(n);
  });
  return items;
}

const BASE =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244598]";

export default function DigestPagination({ page, totalPages }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          rel="prev"
          className={`${BASE} border border-[#DCE3EF] text-[#244598] hover:bg-[#F6F7FB]`}
        >
          ← Previous
        </Link>
      ) : (
        <span aria-hidden className={`${BASE} border border-[#EDF1F7] text-[#B5C0D6]`}>
          ← Previous
        </span>
      )}

      <ul className="flex items-center gap-2">
        {pageItems(page, totalPages).map((item, i) =>
          item === "gap" ? (
            <li key={`gap-${i}`} aria-hidden className="px-1 text-[#7C8BA8]">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={href(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={`${BASE} ${
                  item === page
                    ? "bg-[#244598] text-white"
                    : "text-[#244598] hover:bg-[#F6F7FB]"
                }`}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>

      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          rel="next"
          className={`${BASE} border border-[#DCE3EF] text-[#244598] hover:bg-[#F6F7FB]`}
        >
          Next →
        </Link>
      ) : (
        <span aria-hidden className={`${BASE} border border-[#EDF1F7] text-[#B5C0D6]`}>
          Next →
        </span>
      )}
    </nav>
  );
}
