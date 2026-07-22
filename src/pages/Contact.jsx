import React, { useState } from "react";

const Contact = () => {
  const [result, setResult] = useState("");
  const [statusType, setStatusType] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    setStatusType("");

    const formData = new FormData(event.target);

    const honeypot = formData.get("botcheck");
    if (honeypot) {
      setResult("Message sent successfully! Speak soon. ✨");
      setStatusType("success");
      event.target.reset();
      return;
    }

    const accessKey =
      import.meta.env?.VITE_WEB3FORMS_ACCESS_KEY ||
      process.env?.REACT_APP_WEB3FORMS_ACCESS_KEY;
    formData.append("access_key", accessKey);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Message sent successfully! Speak soon. ✨");
        setStatusType("success");
        event.target.reset();
      } else {
        console.error("Error", data);
        setResult(data.message);
        setStatusType("error");
      }
    } catch (error) {
      console.error("Submit error", error);
      setResult("Something went wrong. Please try again.");
      setStatusType("error");
    }
  };

  return (
    <div className="container mt-4">
      <div
        className="card border-0 rounded-4 shadow-sm p-4 mx-auto"
        style={{ maxWidth: "600px", backgroundColor: "#fff" }}
      >
        <h4 className="fw-bold text-dark text-center mb-2">Get in Touch</h4>

        <p
          className="text-muted small text-center mb-3 px-2"
          style={{ lineHeight: "1.5" }}
        >
          This application was built by a solo developer from concept to code.
          Feedback and collaboration are highly appreciated.
        </p>

        <hr className="mt-2 mb-3 opacity-10" />

        <form onSubmit={onSubmit} className="d-grid gap-3">
          <input
            type="text"
            name="botcheck"
            className="d-none"
            tabIndex="-1"
            autoComplete="off"
          />

          <div>
            <label className="form-label small fw-bold text-secondary mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control rounded-3 border-light-subtle shadow-none p-2.5"
              required
            />
          </div>

          <div>
            <label className="form-label small fw-bold text-secondary mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control rounded-3 border-light-subtle shadow-none p-2.5"
              required
            />
          </div>

          <div>
            <label className="form-label small fw-bold text-secondary mb-1">
              Subject
            </label>
            <select
              name="subject"
              className="form-select rounded-3 border-light-subtle shadow-none p-2.5"
              defaultValue=""
              required
              style={{ cursor: "pointer" }}
            >
              <option value="" disabled>
                Select a topic...
              </option>
              <option value="General Enquiry">General Enquiry</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Feature Suggestion">Feature Suggestion</option>
              <option value="Feedback">Feedback / Other</option>
            </select>
          </div>

          <div>
            <label className="form-label small fw-bold text-secondary mb-1">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              className="form-control rounded-3 border-light-subtle shadow-none p-2.5"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-dark rounded-pill py-2.5 fw-bold mt-1 shadow-sm"
          >
            Send Message
          </button>
        </form>

        {result && (
          <div
            className={`alert mt-3 mb-0 small text-center rounded-3 border-0 ${
              statusType === "success"
                ? "bg-success-subtle text-success"
                : "bg-danger-subtle text-danger"
            }`}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
