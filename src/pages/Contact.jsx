import React, { useState } from "react";

const ContactForm = () => {
  const [result, setResult] = useState("");
  const [statusType, setStatusType] = useState(""); 

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    setStatusType("");

    const formData = new FormData(event.target);
    
    const accessKey = import.meta.env?.VITE_WEB3FORMS_ACCESS_KEY || process.env?.REACT_APP_WEB3FORMS_ACCESS_KEY;
    formData.append("access_key", accessKey); 

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
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
    <div className="card border-0 rounded-4 shadow-sm p-4 mx-auto" style={{ maxWidth: "480px", backgroundColor: "#fff" }}>
      <h4 className="fw-bold text-dark text-center mb-1">Get in Touch</h4>
      <p className="text-muted small text-center mb-4">Have a question or feedback? Drop a message below.</p>

      <form onSubmit={onSubmit} className="d-grid gap-3">
        <div>
          <label className="form-label small fw-bold text-secondary">Name</label>
          <input type="text" name="name" className="form-control rounded-3 border-light-subtle shadow-none p-2.5" required />
        </div>

        <div>
          <label className="form-label small fw-bold text-secondary">Email Address</label>
          <input type="email" name="email" className="form-control rounded-3 border-light-subtle shadow-none p-2.5" required />
        </div>

        <div>
          <label className="form-label small fw-bold text-secondary">Message</label>
          <textarea name="message" rows="4" className="form-control rounded-3 border-light-subtle shadow-none p-2.5" required></textarea>
        </div>

        <button type="submit" className="btn btn-dark rounded-pill py-2.5 fw-bold mt-2 shadow-sm">
          Send Message
        </button>
      </form>

      {result && (
        <div className={`alert mt-3 mb-0 small text-center rounded-3 border-0 ${
          statusType === "success" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"
        }`}>
          {result}
        </div>
      )}
    </div>
  );
};

export default ContactForm;