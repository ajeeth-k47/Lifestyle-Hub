// components/Home/Pagination.js
import Link from "next/link";

export default function Pagination({ currentPage, totalPages }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-end mt-4">
        {/* Previous Button */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <Link
            href={currentPage > 1 ? `/?page=${currentPage - 1}` : "#"}
            className="page-link"
            aria-label="Previous page"
          >
            Previous
          </Link>
        </li>

        {/* Page Numbers */}
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

        {/* Next Button */}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <Link
            href={currentPage < totalPages ? `/?page=${currentPage + 1}` : "#"}
            className="page-link"
            aria-label="Next page"
          >
            Next
          </Link>
        </li>
      </ul>
    </nav>
  );
}
