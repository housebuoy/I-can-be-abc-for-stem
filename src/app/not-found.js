export default function NotFound() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "white", // Set white background
          color: "black", // Text color
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>404</h1>
          <p style={{ fontSize: "1.5rem" }}>Page Not Found</p>
          <a
            href="/"
            style={{
              marginTop: "1rem",
              display: "inline-block",
              padding: "0.5rem 2rem",
              borderRadius: "5px",
              backgroundColor: "#4f46e5",
              color: "white",
              textDecoration: "none",
            }}
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }
  