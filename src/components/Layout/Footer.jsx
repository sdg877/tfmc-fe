import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="d-none d-md-block"
      style={{
        backgroundColor: "#faf9f7",
        borderTop: "1px solid #f0f0f0",
        padding: "1rem 0",
      }}
    >
      <div className="container text-center">
        <div className="d-flex justify-content-center gap-3 mb-1">
          <Link
            to="/about"
            style={{
              fontSize: "0.75rem",
              color: "#bbb",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            About
          </Link>
          <Link
            to="/contact"
            style={{
              fontSize: "0.75rem",
              color: "#bbb",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Contact
          </Link>
        </div>
        <div
          style={{ fontSize: "0.65rem", letterSpacing: "0.5px", color: "#ccc" }}
        >
          &copy; {currentYear} ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
