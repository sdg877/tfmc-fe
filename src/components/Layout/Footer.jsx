import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light border-top py-2.5 mt-auto">
      <div className="container text-center">
        <div className="d-flex justify-content-center gap-3 mb-1">
          <Link
            to="/about"
            className="text-decoration-underline"
            style={{ fontSize: "0.75rem", color: "#8a9ba8", fontWeight: "500" }}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-decoration-underline"
            style={{ fontSize: "0.75rem", color: "#8a9ba8", fontWeight: "500" }}
          >
            Contact
          </Link>
        </div>

        <div
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.5px",
            color: "#a2b2be",
          }}
        >
          &copy; {currentYear} ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
