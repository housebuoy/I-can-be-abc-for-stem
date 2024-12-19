import Link from "next/link";


export default function Unauthorized() {
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
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>401</h1>
          <p style={{ fontSize: "1.5rem" }}>You are not authorized to have access to this route. <br /> Contact your service administrator<br /></p>
          <div className="flex items-center justify-center gap-4">
            <Link
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
            </Link>
            <Link
                href="/login"
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
                Login As Admin
            </Link>
          </div>          
        </div>
      </div>
    );
  }
  