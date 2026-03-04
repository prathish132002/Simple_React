import { useState, useEffect } from "react";

const COUNTRIES_API = "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,languages,area";

const fmt = (n) => (n ? n.toLocaleString() : "N/A");

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

  const fetchData = () => {
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
  };

  useEffect(() => { fetchData(); }, []);

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
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .card { animation: fadeIn 0.3s ease forwards; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0A0A0F; }
        ::-webkit-scrollbar-thumb { background: rgba(232,228,220,0.15); border-radius: 3px; }
        input::placeholder { color: rgba(232,228,220,0.25); }
        select option { background: #12121A; color: #E8E4DC; }
      `}</style>

      {/* Background blobs */}
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

        {/* ── Header ── */}
        <header style={{
          borderBottom: "1px solid rgba(232,228,220,0.08)",
          padding: "32px 40px 24px",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <h1 style={{
              fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 400,
              letterSpacing: "-0.02em", lineHeight: 1, color: "#E8E4DC",
            }}>
              World Atlas
            </h1>
            <span style={{
              fontSize: "clamp(11px, 1.5vw, 13px)", letterSpacing: "0.2em",
              textTransform: "uppercase", color: "#10B981",
              fontFamily: "'Courier New', monospace",
            }}>
              {loading ? "Loading…" : `${filtered.length} / ${countries.length} countries`}
            </span>
          </div>
          <p style={{
            marginTop: 6, color: "rgba(232,228,220,0.35)",
            fontSize: "clamp(11px, 1.5vw, 13px)",
            fontFamily: "'Courier New', monospace", letterSpacing: "0.05em",
          }}>
            Live data · REST Countries API · No API key required
          </p>
        </header>

        {/* ── Controls ── */}
        <div style={{
          padding: "20px 40px",
          display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
          borderBottom: "1px solid rgba(232,228,220,0.06)",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
            <span style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
              color: "rgba(232,228,220,0.3)", fontSize: 16, pointerEvents: "none",
            }}>⌕</span>
            <input
              placeholder="Search country or capital…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(232,228,220,0.04)",
                border: "1px solid rgba(232,228,220,0.1)",
                borderRadius: 6, padding: "10px 14px 10px 36px",
                color: "#E8E4DC", fontSize: 14,
                fontFamily: "'Courier New', monospace", outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(16,185,129,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(232,228,220,0.1)")}
            />
          </div>

          {/* Region filters */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {regions.map((r) => (
              <button key={r} onClick={() => setRegionFilter(r)} style={{
                padding: "8px 14px",
                background: regionFilter === r ? "rgba(16,185,129,0.12)" : "transparent",
                border: regionFilter === r
                  ? "1px solid rgba(16,185,129,0.45)"
                  : "1px solid rgba(232,228,220,0.1)",
                borderRadius: 4,
                color: regionFilter === r ? "#10B981" : "rgba(232,228,220,0.45)",
                fontSize: 12, fontFamily: "'Courier New', monospace",
                letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.15s",
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
              color: "rgba(232,228,220,0.65)", fontSize: 12,
              fontFamily: "'Courier New', monospace", cursor: "pointer", outline: "none",
            }}
          >
            <option value="name">Sort: A–Z</option>
            <option value="population">Sort: Population ↓</option>
            <option value="area">Sort: Area ↓</option>
          </select>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            minHeight: "50vh", gap: 20,
          }}>
            <div style={{
              width: 44, height: 44,
              border: "2px solid rgba(232,228,220,0.08)",
              borderTop: "2px solid #10B981",
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
            }} />
            <p style={{
              color: "rgba(232,228,220,0.3)",
              fontFamily: "'Courier New', monospace",
              fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
            }}>Fetching world data…</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div style={{
            margin: "40px", background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8, padding: "24px 28px",
          }}>
            <p style={{ fontSize: 22, marginBottom: 8 }}>⚠</p>
            <p style={{ color: "#FCA5A5", fontWeight: 600, marginBottom: 6 }}>Failed to fetch data</p>
            <p style={{ color: "rgba(232,228,220,0.4)", fontSize: 13, fontFamily: "monospace", marginBottom: 16 }}>
              {error}
            </p>
            <button onClick={fetchData} style={{
              padding: "9px 20px", background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)", borderRadius: 4,
              color: "#FCA5A5", cursor: "pointer", fontSize: 13,
              fontFamily: "'Courier New', monospace",
            }}>
              ↺ Retry
            </button>
          </div>
        )}

        {/* ── Grid ── */}
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
                padding: "80px 20px", color: "rgba(232,228,220,0.2)",
                fontFamily: "'Courier New', monospace", fontSize: 14,
              }}>
                No countries match "{search}"
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
                  className="card"
                  onClick={() => setSelected(country)}
                  style={{
                    background: "rgba(232,228,220,0.03)",
                    border: "1px solid rgba(232,228,220,0.07)",
                    borderRadius: 8, padding: "18px 20px",
                    cursor: "pointer", position: "relative",
                    overflow: "hidden", transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(232,228,220,0.06)";
                    e.currentTarget.style.borderColor = `${accent}55`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(232,228,220,0.03)";
                    e.currentTarget.style.borderColor = "rgba(232,228,220,0.07)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Accent top bar */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: accent, opacity: 0.6, borderRadius: "8px 8px 0 0",
                  }} />

                  {/* Flag + Name */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                    <img
                      src={country.flags?.svg || country.flags?.png}
                      alt={`Flag of ${name}`}
                      loading="lazy"
                      style={{
                        width: 42, height: 28, objectFit: "cover",
                        borderRadius: 3, border: "1px solid rgba(232,228,220,0.12)",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3, color: "#E8E4DC" }}>
                        {name}
                      </h3>
                      <span style={{
                        fontSize: 10, color: accent,
                        fontFamily: "'Courier New', monospace",
                        letterSpacing: "0.12em", textTransform: "uppercase",
                      }}>
                        {regionEmoji[region]} {region}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  {[["Capital", capital], ["Population", pop], ["Languages", langs]].map(([label, val]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
                      <span style={{
                        fontSize: 10, color: "rgba(232,228,220,0.28)",
                        fontFamily: "'Courier New', monospace",
                        letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0,
                      }}>{label}</span>
                      <span style={{
                        fontSize: 12, color: "rgba(232,228,220,0.72)",
                        textAlign: "right", overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%",
                      }}>{val}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(10,10,15,0.88)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#12121A", border: "1px solid rgba(232,228,220,0.1)",
              borderRadius: 12, padding: "36px 40px",
              maxWidth: 520, width: "100%",
              maxHeight: "90vh", overflowY: "auto", position: "relative",
            }}
          >
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "transparent", border: "1px solid rgba(232,228,220,0.15)",
                borderRadius: 4, color: "rgba(232,228,220,0.4)",
                width: 32, height: 32, cursor: "pointer", fontSize: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >×</button>

            <img
              src={selected.flags?.svg || selected.flags?.png}
              alt=""
              style={{
                width: "100%", height: 180, objectFit: "cover",
                borderRadius: 6, marginBottom: 24,
                border: "1px solid rgba(232,228,220,0.08)",
              }}
            />

            <h2 style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 4 }}>
              {selected.name?.common}
            </h2>
            {selected.name?.official !== selected.name?.common && (
              <p style={{ color: "rgba(232,228,220,0.3)", fontSize: 13, fontStyle: "italic", marginBottom: 24 }}>
                {selected.name?.official}
              </p>
            )}

            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 28px",
              borderTop: "1px solid rgba(232,228,220,0.08)", paddingTop: 22, marginTop: 8,
            }}>
              {[
                ["Region", selected.region],
                ["Capital", selected.capital?.[0] || "—"],
                ["Population", fmt(selected.population)],
                ["Area", selected.area ? `${fmt(Math.round(selected.area))} km²` : "—"],
                ["Languages", Object.values(selected.languages || {}).join(", ") || "—"],
                ["Subregion", selected.subregion || "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{
                    fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
                    color: "rgba(232,228,220,0.28)", fontFamily: "'Courier New', monospace",
                    marginBottom: 5,
                  }}>{k}</div>
                  <div style={{ fontSize: 14, color: "#E8E4DC", lineHeight: 1.4 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
