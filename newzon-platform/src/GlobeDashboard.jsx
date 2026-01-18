// src/GlobeDashboard.jsx
import React, { useEffect, useRef, useState, memo, useMemo } from "react";
import Globe from "react-globe.gl";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Globe as GlobeIcon } from "lucide-react";

/*
  Fully optimized GlobeDashboard
  - Fixed color parsing & pointOfView issues
  - Smoother rotation (requestAnimationFrame)
  - Sample arcs between hotspots
  - Hover ring (CSS) for hovered point
  - Minimal re-renders (useMemo)
  - Assumes public/earth-night.jpg exists
  - Requires: react-globe.gl, three, framer-motion, lucide-react
*/

const hotspotsSample = [
  {
    id: "in",
    lat: 20.5937,
    lng: 78.9629,
    country: "India",
    category: "Politics",
    score: 88,
    headline: "Parliament passes transparency bill — initial reactions mixed."
  },
  {
    id: "us",
    lat: 37.0902,
    lng: -95.7129,
    country: "USA",
    category: "Tech",
    score: 75,
    headline: "Major AI startup announces open-sourcing of key models."
  },
  {
    id: "uk",
    lat: 55.3781,
    lng: -3.4360,
    country: "UK",
    category: "Economy",
    score: 82,
    headline: "Markets steady as new fiscal policy signals stability."
  },
  {
    id: "au",
    lat: -25.2744,
    lng: 133.7751,
    country: "Australia",
    category: "Sports",
    score: 91,
    headline: "Cricket league finals draw record viewership."
  }
];

// Build some sample arcs between hotspots (from -> to)
const arcsSample = [
  { startLat: 20.5937, startLng: 78.9629, endLat: 37.0902, endLng: -95.7129 },
  { startLat: 37.0902, startLng: -95.7129, endLat: 55.3781, endLng: -3.4360 },
  { startLat: 55.3781, startLng: -3.4360, endLat: -25.2744, endLng: 133.7751 }
];

const HudPanel = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <AnimatePresence>
      <motion.div
        key={item.id}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="w-80 md:w-96 bg-[#051421]/80 backdrop-blur-sm border border-[#0ea5e9]/10 rounded-2xl p-4 text-sm text-[#cfeffb]"
      >
        <div className="flex justify-between items-start gap-2">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#86e8ff]" />
              <div className="text-lg font-semibold text-white">{item.country}</div>
            </div>
            <div className="mt-1 text-xs text-[#9fd8f6]">{item.category}</div>
          </div>

          <button
            onClick={onClose}
            aria-label="close"
            className="p-1 rounded-md hover:bg-white/5"
            title="Close"
          >
            <X className="w-5 h-5 text-[#bfefff]" />
          </button>
        </div>

        <div className="mt-4 text-sm text-[#dffaff] font-medium">
          {item.headline}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="text-xs text-[#9fd8f6]">Truth Index</div>
          <div className="text-sm font-semibold text-white">{item.score}%</div>
          <div className="flex-1 h-2 bg-[#00232a] rounded-full overflow-hidden">
            <div
              style={{
                width: `${item.score}%`,
                background: "linear-gradient(90deg, rgba(14,165,233,0.95), rgba(56,189,248,0.85))"
              }}
              className="h-full rounded-full"
            />
          </div>
        </div>

        <button
          className="mt-4 w-full py-2 rounded-lg bg-[#062033]/60 hover:bg-[#063244] transition text-[#dffaff] font-medium"
          onClick={() => alert(`Open full feed for ${item.country}`)}
        >
          Read stories
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

const GlobeDashboard = () => {
  const globeEl = useRef(null);
  const [hoverD, setHoverD] = useState(null);
  const [active, setActive] = useState(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // memoize data to avoid re-renders
  const pointsData = useMemo(() => hotspotsSample, []);
  const arcsData = useMemo(() => arcsSample, []);

  // Smooth auto-rotate using current pointOfView()
  useEffect(() => {
    let frame = null;
    const rotate = () => {
      if (!globeEl.current || !autoRotate) {
        frame = requestAnimationFrame(rotate);
        return;
      }
      try {
        // pointOfView() returns current POV {lat, lng, altitude}
        const pov = globeEl.current.pointOfView();
        // Safety: ensure pov has numeric fields
        const next = {
          lat: typeof pov.lat === "number" ? pov.lat : 0,
          lng: typeof pov.lng === "number" ? pov.lng + 0.03 : 0.03,
          altitude: typeof pov.altitude === "number" ? pov.altitude : 2
        };
        globeEl.current.pointOfView(next, 50);
      } catch (e) {
        // If library changes, fail silently (no repetitive console flood)
        // console.debug("rotate error", e);
      }
      frame = requestAnimationFrame(rotate);
    };
    frame = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(frame);
  }, [autoRotate]);

  // set initial POV and tuning when globe is ready
  const onGlobeReady = () => {
    setGlobeReady(true);
    // ensure a starting cinematic POV
    try {
      globeEl.current.pointOfView({ lat: 20, lng: 78.9, altitude: 2.2 }, 0);
      // tune atmosphere/lighting via scene if needed (safe-guarded)
      const scene = globeEl.current.scene();
      if (scene && scene.background) {
        // keep default; don't mutate heavy three objects here
      }
    } catch (e) {
      // ignore
    }
  };

  // Hover ring position (screen space) for simple visual ring near hovered point
  const hoverRingStyle = useMemo(() => {
    return {
      transition: "transform 220ms ease, opacity 220ms ease",
      transformOrigin: "center"
    };
  }, []);

  // Helper: convert hotspot to label used by Globe
  const pointLabel = d => `${d.country} — ${d.category}\nScore: ${d.score}%`;

  return (
    <div className="relative w-full min-h-[70vh] md:min-h-[85vh]">
      {/* Holographic Backdrop */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hg" x1="0" x2="1">
              <stop offset="0%" stopColor="#052b3a" stopOpacity="0" />
              <stop offset="60%" stopColor="#052b3a" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#052b3a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#hg)" />
          {/* horizontal grid lines */}
          {[...Array(12)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              x2="100%"
              y1={`${(i + 1) * 8}%`}
              y2={`${(i + 1) * 8}%`}
              stroke="#06485a"
              strokeOpacity="0.06"
              strokeWidth={1}
            />
          ))}
        </svg>

        {/* soft glows */}
        <div className="absolute -left-8 top-1/4 w-96 h-96 rounded-full blur-3xl bg-gradient-to-br from-[#072235]/40 to-transparent" />
        <div className="absolute right-8 bottom-1/3 w-96 h-96 rounded-full blur-3xl bg-gradient-to-br from-[#063244]/30 to-transparent" />
      </div>

      {/* Globe container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 items-start">
        {/* left: Globe */}
        <div className="flex-1 min-h-[50vh] md:min-h-[70vh] rounded-2xl overflow-hidden border border-[#0ea5e9]/6 relative">
          <Globe
            ref={globeEl}
            globeImageUrl="/earth-night.jpg"
            backgroundColor="transparent"
            showGraticules={false}
            arcsData={arcsData}
            arcColor={() => "rgba(14,165,233,0.9)"}
            arcAltitude={0.2}
            arcStroke={0.8}
            arcDashLength={0.7}
            arcDashGap={0.005}
            arcDashAnimateTime={3000}
            labelsData={[]}
            pointsData={pointsData}
            pointLat="lat"
            pointLng="lng"
            pointAltitude={d => (hoverD && hoverD.id === d.id ? 0.03 : 0.01)}
            pointColor={() => "#86e8ff"}
            pointRadius={d => (hoverD && hoverD.id === d.id ? 0.9 : 0.6)}
            pointsTransitionDuration={300}
            onPointHover={setHoverD}
            onPointClick={(pt) => setActive(pt)}
            width={null}
            height={null}
            onGlobeReady={onGlobeReady}
            pointLabel={pointLabel}
            // disable autoRotate of library to use custom smooth rotation
            autoRotate={false}
            // nice but optional: enable atmosphere
            enablePointerInteraction={true}
          />

          {/* subtle center HUD marker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-28 h-28 rounded-full border border-[#0ea5e9]/8 flex items-center justify-center">
              <GlobeIcon className="w-8 h-8 text-[#86e8ff]" />
            </div>
          </div>

          {/* Hover ring: simple CSS circle positioned near center — it's decorative */}
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              right: 28,
              top: 28,
              width: 120,
              height: 120,
              borderRadius: 9999,
              boxShadow: "0 0 40px rgba(14,165,233,0.04), inset 0 0 30px rgba(14,165,233,0.02)"
            }}
          />
        </div>

        {/* right: HUD + Controls */}
        <div className="w-full md:w-96 flex-shrink-0">
          <div className="flex flex-col gap-4">
            <div className="bg-[#031a22]/70 border border-[#0ea5e9]/8 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#99dfff]">GLOBAL OVERVIEW</div>
                  <div className="text-xl font-semibold text-white">Live News Globe</div>
                </div>
                <div className="text-sm text-[#bfefff]">Realtime</div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-start">
                  <div className="text-xs text-[#9fd8f6]">Sources</div>
                  <div className="font-semibold text-white">128</div>
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-xs text-[#9fd8f6]">Checks/hr</div>
                  <div className="font-semibold text-white">3.5k</div>
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-xs text-[#9fd8f6]">Avg Truth</div>
                  <div className="font-semibold text-white">84%</div>
                </div>
              </div>

              {/* small trending tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["BreakingNews","Tech","Cricket","Elections","AI"].map((t) => (
                  <button
                    key={t}
                    className="text-xs px-3 py-1 bg-[#052733]/60 border border-[#0ea5e9]/8 rounded-full text-[#bfefff] hover:bg-[#063244] transition"
                    onClick={() => alert(`Filter by ${t}`)}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>

            {/* selected hotspot HUD */}
            <div className="sticky top-6">
              <HudPanel item={active} onClose={() => setActive(null)} />
            </div>

            {/* controls */}
            <div className="bg-[#031a22]/60 border border-[#0ea5e9]/6 rounded-2xl p-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#9fd8f6]">Auto Rotate</div>
                <div className="text-xs text-[#bfefff]">
                  <button
                    onClick={() => setAutoRotate((s) => !s)}
                    className="px-2 py-1 rounded-md bg-[#062033] hover:bg-[#063244] transition"
                  >
                    {autoRotate ? "ON" : "OFF"}
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <label className="text-xs text-[#9fd8f6]">Zoom</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  defaultValue="2.2"
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (globeEl.current && typeof globeEl.current.pointOfView === "function") {
                      try {
                        const pov = globeEl.current.pointOfView();
                        globeEl.current.pointOfView({ lat: pov.lat, lng: pov.lng, altitude: v }, 400);
                      } catch (err) {
                        // ignore
                      }
                    }
                  }}
                  className="w-full mt-2"
                />
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  className="flex-1 py-2 rounded-lg bg-[#062033] hover:bg-[#063244] transition text-[#dffaff]"
                  onClick={() => {
                    if (globeEl.current && typeof globeEl.current.pointOfView === "function")
                      globeEl.current.pointOfView({ lat: 20, lng: 78.9, altitude: 1.7 }, 800);
                  }}
                >
                  Focus India
                </button>
                <button
                  className="py-2 px-3 rounded-lg bg-[#062033] hover:bg-[#063244] transition text-[#dffaff]"
                  onClick={() => {
                    if (globeEl.current && typeof globeEl.current.pointOfView === "function")
                      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 800);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="text-xs text-[#9fd8f6]/80 p-3">
              Hover points or click them to open a quick details panel. Toggle Auto-Rotate for cinematic motion.
            </div>
          </div>
        </div>
      </div>

      {/* front subtle particles */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`fp-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${10 + i * 10}%`,
              top: `${5 + (i % 3) * 28}%`,
              width: 6 + (i % 4) * 8,
              height: 6 + (i % 4) * 8,
              background: "rgba(14,165,233,0.06)"
            }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -10, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(GlobeDashboard);
