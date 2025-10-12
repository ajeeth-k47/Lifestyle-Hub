import Link from "next/link";

export default function Pagination({ currentPage, totalPages }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const previousHref = currentPage > 1 ? `/?page=${currentPage - 1}` : "#";
  const nextHref = currentPage < totalPages ? `/?page=${currentPage + 1}` : "#";

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-end mt-4">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <Link
            href={previousHref}
            className="page-link"
            aria-label="Previous page"
            aria-disabled={currentPage === 1}
          >
            Previous
          </Link>
        </li>

        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${currentPage === page ? "active" : ""}`}
          >
            <Link
              href={`/?page=${page}`}
              className="page-link"
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Link>
          </li>
        ))}

        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <Link
            href={nextHref}
            className="page-link"
            aria-label="Next page"
            aria-disabled={currentPage === totalPages}
          >
            Next
          </Link>
        </li>
      </ul>
    </nav>
  );
}
