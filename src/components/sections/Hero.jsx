import React from "react";
import Button from "../ui/Button";
import Animation from "../../assets/video/hero/othentica-flame-animation.mp4";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-start px-8 lg:px-16">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          className="w-full h-full object-cover"
          src={Animation}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-opacity-20 "></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xl">
        <h1 className="capitalize text-5xl lg:text-7xl font-bold text-neutral dark:text-white mb-8 leading-tight">
          Step into your authentic self
        </h1>
        <p className="text-xl lg:text-2xl text-neutral dark:text-gray-200 mb-10 leading-relaxed max-w-3xl">
          Empowering your mind, body, and spirit with balance. Discover the
          transformative power of authentic wellness practices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="accent" size="large">
            Start Your Journey
          </Button>
          <Button variant="secondary" size="large">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
