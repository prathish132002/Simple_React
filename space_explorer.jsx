import { useState, useEffect } from "react";

const API_URL =
  "https://api.sampleapis.com/coffee/hot";

// We'll use the Open Meteo + wttr for a public no-key API
// Actually use restcountries — totally public, no key needed
const COUNTRIES_API = "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,languages,area";

const fmt = (n) =>
  n ? n.toLocaleString() : "N/A";

const regionColors = {
  Africa: "#F97316",
  Americas: "#06B6D4",
  Asia: "#8B5CF6",
  Europe: "#10B981",
  Oceania: "#F59E0B",
  Antarctic: "#64748B",
};

const regionEmoji = {
  Africa: "🌍",
  Americas: "🌎",
  Asia: "🌏",
  Europe: "🏛️",
  Oceania: "🌊",
  Antarctic: "🧊",
};

export default function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(COUNTRIES_API)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setCountries(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const regions = ["All", ...Array.from(new Set(countries.map((c) => c.region).filter(Boolean))).sort()];

  const filtered = countries
    .filter((c) => {
      const name = c.name?.common?.toLowerCase() || "";
      const cap = (c.capital?.[0] || "").toLowerCase();
      const q = search.toLowerCase();
      return (
        (regionFilter === "All" || c.region === regionFilter) &&
        (name.includes(q) || cap.includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.name?.common || "").localeCompare(b.name?.common || "");
      if (sortBy === "population") return (b.population || 0) - (a.population || 0);
      if (sortBy === "area") return (b.area || 0) - (a.area || 0);
      return 0;
    });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#E8E4DC",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background grain texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        opacity: 0.6,
      }} />

      {/* Accent blobs */}
      <div style={{
        position: "fixed", top: -200, right: -200, width: 600, height: 600,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: -300, left: -200, width: 700, height: 700,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header style={{
          borderBottom: "1px solid rgba(232,228,220,0.1)",
          padding: "32px 40px 24px",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <h1 style={{
              margin: 0, fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 400, letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "#E8E4DC",
            }}>
              World Atlas
            </h1>
            <span style={{
              fontSize: "clamp(11px, 1.5vw, 13px)",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#10B981", fontFamily: "'Courier New', monospace",
              fontWeight: 400,
            }}>
              {loading ? "Loading…" : `${filtered.length} countries`}
            </span>
          </div>
          <p style={{
            margin: 0, color: "rgba(232,228,220,0.4)",
            fontSize: "clamp(12px, 1.5vw, 14px)",
            fontFamily: "'Courier New', monospace", letterSpacing: "0.05em",
          }}>
            Live data via REST Countries API
          </p>
        </header>

        {/* Controls */}
        <div style={{
          padding: "20px 40px",
          display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
          borderBottom: "1px solid rgba(232,228,220,0.06)",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
            <span style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
              color: "rgba(232,228,220,0.3)", fontSize: 14, pointerEvents: "none",
            }}>⌕</span>
            <input
              placeholder="Search country or capital…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(232,228,220,0.04)",
                border: "1px solid rgba(232,228,220,0.1)",
                borderRadius: 6, padding: "10px 14px 10px 34px",
                color: "#E8E4DC", fontSize: 14,
                fontFamily: "'Courier New', monospace",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(16,185,129,0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(232,228,220,0.1)"}
            />
          </div>

          {/* Region filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {regions.map((r) => (
              <button key={r} onClick={() => setRegionFilter(r)} style={{
                padding: "8px 14px",
                background: regionFilter === r ? "rgba(16,185,129,0.15)" : "transparent",
                border: regionFilter === r
                  ? "1px solid rgba(16,185,129,0.5)"
                  : "1px solid rgba(232,228,220,0.1)",
                borderRadius: 4, color: regionFilter === r ? "#10B981" : "rgba(232,228,220,0.5)",
                fontSize: 12, fontFamily: "'Courier New', monospace",
                letterSpacing: "0.08em", cursor: "pointer",
                transition: "all 0.15s",
              }}>
                {r === "All" ? "All" : `${regionEmoji[r] || ""} ${r}`}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: "rgba(232,228,220,0.04)",
              border: "1px solid rgba(232,228,220,0.1)",
              borderRadius: 6, padding: "10px 14px",
              color: "rgba(232,228,220,0.7)", fontSize: 12,
              fontFamily: "'Courier New', monospace",
              cursor: "pointer", outline: "none",
            }}
          >
            <option value="name">Sort: A–Z</option>
            <option value="population">Sort: Population</option>
            <option value="area">Sort: Area</option>
          </select>
        </div>

        {/* States */}
        {loading && (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            minHeight: "50vh", gap: 20,
          }}>
            <div style={{
              width: 48, height: 48,
              border: "2px solid rgba(232,228,220,0.1)",
              borderTop: "2px solid #10B981",
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
            }} />
            <p style={{
              color: "rgba(232,228,220,0.3)",
              fontFamily: "'Courier New', monospace",
              fontSize: 13, letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>Fetching world data…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && (
          <div style={{
            margin: 40,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8, padding: "24px 28px",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <span style={{ fontSize: 24 }}>⚠</span>
            <p style={{ margin: 0, color: "#FCA5A5", fontWeight: 600 }}>Failed to fetch</p>
            <p style={{ margin: 0, color: "rgba(232,228,220,0.4)", fontSize: 13, fontFamily: "'Courier New', monospace" }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: 8, alignSelf: "flex-start",
                padding: "8px 18px", background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 4, color: "#FCA5A5", cursor: "pointer",
                fontSize: 12, fontFamily: "'Courier New', monospace",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div style={{
            padding: "28px 40px 60px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: 16,
          }}>
            {filtered.length === 0 && (
              <div style={{
                gridColumn: "1/-1", textAlign: "center",
                padding: "60px 20px", color: "rgba(232,228,220,0.25)",
                fontFamily: "'Courier New', monospace", fontSize: 14,
              }}>
                No countries match your search.
              </div>
            )}
            {filtered.map((country) => {
              const name = country.name?.common || "Unknown";
              const capital = country.capital?.[0] || "—";
              const pop = fmt(country.population);
              const region = country.region || "Unknown";
              const accent = regionColors[region] || "#64748B";
              const langs = Object.values(country.languages || {}).slice(0, 2).join(", ") || "—";

              return (
                <div
                  key={name}
                  onClick={() => setSelected(country)}
                  style={{
                    background: "rgba(232,228,220,0.03)",
                    border: "1px solid rgba(232,228,220,0.07)",
                    borderRadius: 8,
                    padding: "18px 20px",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(232,228,220,0.06)";
                    e.currentTarget.style.borderColor = `${accent}44`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(232,228,220,0.03)";
                    e.currentTarget.style.borderColor = "rgba(232,228,220,0.07)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Accent line */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: accent, opacity: 0.6, borderRadius: "8px 8px 0 0",
                  }} />

                  {/* Flag + Name */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                    <img
                      src={country.flags?.svg || country.flags?.png}
                      alt={`Flag of ${name}`}
                      style={{
                        width: 40, height: 28, objectFit: "cover",
                        borderRadius: 3, border: "1px solid rgba(232,228,220,0.12)",
                        flexShrink: 0,
                      }}
                      loading="lazy"
                    />
                    <div>
                      <h3 style={{
                        margin: 0, fontSize: 15, fontWeight: 600,
                        lineHeight: 1.2, color: "#E8E4DC",
                      }}>{name}</h3>
                      <span style={{
                        fontSize: 11, color: accent, fontFamily: "'Courier New', monospace",
                        letterSpacing: "0.1em", textTransform: "uppercase",
                      }}>{region}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {[
                      ["Capital", capital],
                      ["Population", pop],
                      ["Languages", langs],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span style={{
                          fontSize: 11, color: "rgba(232,228,220,0.3)",
                          fontFamily: "'Courier New', monospace",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                          flexShrink: 0,
                        }}>{label}</span>
                        <span style={{
                          fontSize: 12, color: "rgba(232,228,220,0.75)",
                          textAlign: "right",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          maxWidth: "60%",
                        }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(10,10,15,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#12121A",
              border: "1px solid rgba(232,228,220,0.1)",
              borderRadius: 12,
              padding: "36px 40px",
              maxWidth: 520, width: "100%",
              position: "relative",
              maxHeight: "90vh", overflowY: "auto",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "transparent",
                border: "1px solid rgba(232,228,220,0.15)",
                borderRadius: 4, color: "rgba(232,228,220,0.4)",
                width: 32, height: 32, cursor: "pointer",
                fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >×</button>

            {/* Flag */}
            <img
              src={selected.flags?.svg || selected.flags?.png}
              alt=""
              style={{
                width: "100%", height: 180, objectFit: "cover",
                borderRadius: 6, marginBottom: 24,
                border: "1px solid rgba(232,228,220,0.08)",
              }}
            />

            <h2 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em" }}>
              {selected.name?.common}
            </h2>
            {selected.name?.official && selected.name.official !== selected.name?.common && (
              <p style={{ margin: "0 0 24px", color: "rgba(232,228,220,0.35)", fontSize: 13, fontStyle: "italic" }}>
                {selected.name.official}
              </p>
            )}

            {/* Detail grid */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px",
              borderTop: "1px solid rgba(232,228,220,0.08)", paddingTop: 20,
            }}>
              {[
                ["Region", selected.region],
                ["Capital", selected.capital?.[0] || "—"],
                ["Population", fmt(selected.population)],
                ["Area", selected.area ? `${fmt(selected.area)} km²` : "—"],
                ["Languages", Object.values(selected.languages || {}).join(", ") || "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{
                    fontSize: 10, letterSpacing: "0.15em",
                    textTransform: "uppercase", color: "rgba(232,228,220,0.3)",
                    fontFamily: "'Courier New', monospace", marginBottom: 4,
                  }}>{k}</div>
                  <div style={{ fontSize: 14, color: "#E8E4DC" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
