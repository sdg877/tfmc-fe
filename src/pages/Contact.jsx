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
        setResult(data.message);
        setStatusType("error");
      }
    } catch (error) {
      setResult("Something went wrong. Please try again.");
      setStatusType("error");
    }
  };

  const inputStyle = {
    width: "100%",
    border: "1.5px solid #e8e8e8",
    borderRadius: "12px",
    padding: "0.65rem 0.85rem",
    fontSize: "0.9rem",
    fontWeight: 500,
    outline: "none",
    backgroundColor: "#faf9f7",
    color: "#1a1a2e",
    fontFamily: "inherit",
  };

  const labelStyle = {
    fontSize: "0.6rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#bbb",
    marginBottom: "0.3rem",
    display: "block",
  };

  return (
    <div style={{ backgroundColor: "#faf9f7", paddingBottom: "5rem" }}>
      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(160deg, #f3e5f5 0%, #e3f2fd 60%, #e8f5e9 100%)",
          padding: "1.5rem 1.25rem 3rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#b0b0b0",
            marginBottom: "0.15rem",
          }}
        >
          Say hello
        </p>
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#1a1a2e",
            letterSpacing: "-0.5px",
            marginBottom: "0.1rem",
          }}
        >
          Get in Touch
        </h1>
        <p style={{ color: "#aaa", fontSize: "0.78rem", margin: 0 }}>
          Built by one person. Feedback always welcome.
        </p>
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 1rem" }}>
        {/* Form card — pulled up over gradient */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "1.5rem",
            marginTop: "-1.5rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            border: "1px solid #f0f0f0",
          }}
        >
          <form
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              type="text"
              name="botcheck"
              style={{ display: "none" }}
              tabIndex="-1"
              autoComplete="off"
            />

            <div>
              <label style={labelStyle}>Name</label>
              <input type="text" name="name" required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" name="email" required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Subject</label>
              <select
                name="subject"
                required
                defaultValue=""
                style={{ ...inputStyle, cursor: "pointer" }}
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
              <label style={labelStyle}>Message</label>
              <textarea
                name="message"
                rows="4"
                required
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "100px",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "0.85rem",
                backgroundColor: "#1a1a2e",
                color: "white",
                borderRadius: "100px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                marginTop: "0.25rem",
              }}
            >
              Send Message
            </button>
          </form>

          {result && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                fontSize: "0.85rem",
                fontWeight: 600,
                textAlign: "center",
                backgroundColor:
                  statusType === "success" ? "#e8f5e9" : "#fce4ec",
                color: statusType === "success" ? "#2e7d32" : "#c2185b",
              }}
            >
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
