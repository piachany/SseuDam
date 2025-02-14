import Particles from "react-tsparticles";

export default function ParticleBackground() {
  return (
    <Particles
      options={{
        particles: {
          number: { value: 100 },
          size: { value: 3 },
          move: { speed: 1 },
          line_linked: { enable: false },
          opacity: { value: 0.3 },
        },
      }}
      className="absolute inset-0 w-full h-full"
    />
  );
}
