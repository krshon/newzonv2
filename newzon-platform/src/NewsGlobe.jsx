import Globe from "react-globe.gl";

export default function NewsGlobe() {
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"
        animateIn={true}
      />
    </div>
  );
}
