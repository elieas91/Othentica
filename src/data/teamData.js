// import yogaPoseImg from '../assets/img/contact/yoga-pose.webp'; // Currently unused but kept for future implementation
import Hiba from '../assets/img/contact/hiba.webp';
import tarekImg from '../assets/img/contact/tarek.webp';

export const teamData = [
  {
    id: 1,
    name: 'Hiba Tarazi',
    role: 'Co-founder & CEO',
    subtitle: 'A Message from Our CEO',
    image: Hiba,
    socialMedia: {
      instagram: '@Hiba',
      facebook: 'Hiba',
      linkedin: 'Hiba',
    },
    flipped: false, // false = image on right, true = image on left
    description: [
      '"My purpose is simple: to help humans reak free from life pressures and become truly Unstuckable."',
      'For two decades in HR, training, and brain health, I walked alongside people carrying hidden struggles — fatigue, pressure, and emotional roadblocks that drained their brilliance. That journey led me to explore brain health, nutrition, and holistic healing — creating Glowing Synapse to help individuals reconnect, and Conscious Subconscious Training Solutions to spark deeper growth.',
      'Each step revealed a truth: humans are not broken — they are simply carrying weight they don’t yet know how to release. With the right tools, they can unlock clarity, energy, and resilience.',
      'Othentica is the evolution of that journey — a movement to redefine health at work and in life. We believe Corporate Health is the evolution of wellness: not a luxury, but the foundation of energy, resilience, and performance.',
      'My mission is bold and clear: to spark energy, clarity, and resilience so humans and workplaces alike can rise above pressures and truly thrive.',
    ],
  },
  {
    id: 2,
    name: 'Tarek Aad',
    role: ['Co-founder & COO', 'Founder at Mindful Crowd'],
    description: [
      'Every story has a beginning, and for Tarek, it started with a simple but powerful question: How does stress turn into weight gain?',
      'For years, he heard people say “it’s the stress” — but no one could explain the science behind it. That curiosity became a calling. In 2016, Tarek began researching, blending his background in nursing with certifications in mind-body eating coaching, stress mastery, and mindfulness.',
      'What he discovered was more than science — it was a way of life. Tarek believes the body cannot heal without the soul, and he now helps people master their stress, lift their mood, and rebuild their relationship with food through mindfulness, stress Mastery and meditation.',
      'His journey is one of curiosity turned into purpose: empowering others to find clarity, balance, and happiness by reconnecting mind and body.',
    ],
    image: tarekImg,
    socialMedia: {
      instagram: '@Tarek',
      facebook: 'Tarek',
      linkedin: 'Tarek',
    },
    flipped: true, // true = image on left, false = image on right
  },
];
