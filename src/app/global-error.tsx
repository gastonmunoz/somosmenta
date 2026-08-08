"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html lang="es">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          backgroundColor: "#284019",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Algo salió mal</h1>
        <p style={{ opacity: 0.7, maxWidth: "32rem", margin: 0 }}>
          {error.digest
            ? `Ocurrió un error inesperado (ref: ${error.digest}). Probá de nuevo o escribinos a hola@calton.com.ar.`
            : "Ocurrió un error inesperado. Probá de nuevo o escribinos a hola@calton.com.ar."}
        </p>
        <button
          onClick={() => unstable_retry()}
          style={{
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "9999px",
            padding: "0.5rem 1.5rem",
            color: "#ffffff",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
