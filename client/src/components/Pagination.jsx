function pageWindow(current, last) {

  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

  const wanted = new Set([1, 2, current - 1, current, current + 1, last - 1, last]);
  const sorted = [...wanted].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);

  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

export default function Pagination({ page, pageSize, total, onPage }) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;

  return (
    <nav className="pagination" aria-label="Hotel list pages">
      <button type="button" className="page-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>
        Prev
      </button>

      {pageWindow(page, pageCount).map((item, i) =>
        item === '…' ? (
          <span key={`gap-${i}`} className="page-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            type="button"
            key={item}
            className={`page-btn${item === page ? ' is-active' : ''}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPage(item)}
          >
            {item}
          </button>
        )
      )}

      <button type="button" className="page-btn" disabled={page === pageCount} onClick={() => onPage(page + 1)}>
        Next
      </button>
    </nav>
  );
}
