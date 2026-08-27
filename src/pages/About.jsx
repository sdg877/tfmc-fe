import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#faf9f7", paddingBottom: "5rem" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #f3e5f5 0%, #e3f2fd 60%, #e8f5e9 100%)",
        padding: "3rem 1.5rem 4rem",
        textAlign: "center",
      }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "20px",
          background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.25rem", fontSize: "1.75rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}>
          🧠
        </div>
        <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.5px", marginBottom: "0.5rem" }}>
          The Fast Minds Club
        </h1>
        <p style={{ color: "#aaa", fontSize: "0.9rem", maxWidth: "320px", margin: "0 auto" }}>
          Built by someone who needed it. For everyone who does.
        </p>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem 1.25rem 0" }}>

        {/* Origin story */}
        <div style={{
          backgroundColor: "white", borderRadius: "20px",
          padding: "1.75rem", marginBottom: "1rem",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0",
        }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#bbb", marginBottom: "0.75rem" }}>
            The story
          </p>
          <p style={{ color: "#444", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "1rem" }}>
            The Fast Minds Club was created by <strong style={{ color: "#1a1a2e" }}>Sylvia Drake-Gill</strong>, a sole developer from London, England.
            Sylvia was diagnosed with severe ADHD-C in 2025.
          </p>
          <p style={{ color: "#444", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: 0 }}>
            After her diagnosis, she struggled to find an app that had everything she needed — so she built one from scratch.
            Drawing on her own experiences and a focus group of people with ADHD, she created a planner that doesn't just
            schedule tasks, it tracks your energy too, so you can actually get things done without burning out.
          </p>
        </div>

        {/* What it does */}
        <div style={{
          backgroundColor: "white", borderRadius: "20px",
          padding: "1.75rem", marginBottom: "1rem",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0",
        }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#bbb", marginBottom: "1rem" }}>
            What it does
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { emoji: "⚡", title: "Energy tracking", desc: "Every task has an energy cost. See how much you're taking on before you burn out." },
              { emoji: "📅", title: "Calendar sync", desc: "Connect Google Calendar or any iCal feed so your appointments count too." },
              { emoji: "🎯", title: "Plan your day", desc: "Star tasks to pull them into today's list. Focus on what matters right now." },
              { emoji: "📊", title: "See your wins", desc: "A heatmap of completed tasks so you can see your consistency over time." },
            ].map(({ emoji, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0,
                  background: "linear-gradient(135deg, #f3e5f5, #e3f2fd)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem",
                }}>
                  {emoji}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.9rem", marginBottom: "0.15rem" }}>{title}</p>
                  <p style={{ color: "#aaa", fontSize: "0.82rem", lineHeight: 1.5, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Built for */}
        <div style={{
          background: "linear-gradient(135deg, #f3e5f5, #e8f5e9)",
          borderRadius: "20px", padding: "1.75rem",
          marginBottom: "1rem",
        }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#aaa", marginBottom: "0.5rem" }}>
            Built for
          </p>
          <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1a1a2e", marginBottom: "0.5rem" }}>
            Fast minds everywhere.
          </p>
          <p style={{ color: "#666", fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>
            Whether you have ADHD, anxiety, or just struggle with overwhelm — this app is for anyone who needs
            a gentler, more honest way to manage their day.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", paddingTop: "0.5rem" }}>
          <Link to="/signup" style={{
            display: "inline-block", padding: "0.85rem 2.5rem",
            backgroundColor: "#1a1a2e", color: "white",
            borderRadius: "100px", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem",
            marginBottom: "0.75rem",
          }}>
            Join the club
          </Link>
          <p style={{ color: "#ccc", fontSize: "0.75rem" }}>Free to use. No nonsense.</p>
        </div>

      </div>
    </div>
  );
};

export default About;