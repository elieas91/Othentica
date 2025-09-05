import App from '../assets/img/services/app.webp';
import OneToOne from '../assets/img/services/one_to_one.webp';
import Programs from '../assets/img/services/programs.webp';
import Talks from '../assets/img/services/talks.webp';
import ProgramsImg from '../assets/img/services/programs_img.webp';
import WorkshopImg from '../assets/img/services/workshop.webp';
import WorkshopImg2 from '../assets/img/services/workshop_2.webp';
import OneToOneImg from '../assets/img/services/one_to_one_img.webp';
import AppImg from '../assets/img/services/app_img_new.webp';
import AppImgLong from '../assets/img/services/app_img_long.webp';

export const servicesData = [
  {
    id: 1,
    sectionId: 'app',
    icon: App,
    title: 'The Othentica App',
    description:
      'One-of-its-kind wellness app that makes growth simple and engaging. With gamified learning, quick science-backed practices, daily "mind cookies" and inspiring stories, Othentica helps you build focus, energy, and balance at work and beyond',
    modalDescription1:
      'Othentica is a comprehensive, gamified wellness platform designed for organizations seeking to elevate employee well-being and performance. With secure, streamlined onboarding for large teams, the app reduces HR administrative workload and errors. Employees engage in daily quests, personalized routines, and access a rich library of meditations and wellness resources—fostering authentic self-discovery, resilience, and stress management',
    modalDescription2:
      'HR leaders benefit from data-driven insights into brain health, energy, and mood trends, enabling proactive interventions and informed decision-making. The platform’s rewards system boosts motivation and participation, cultivating a positive workplace culture. Othentica integrates seamlessly with existing systems, supports diverse workforces, and ensures enterprise-grade security and privacy for all users—empowering organizations to drive productivity, retention, and employee satisfaction',
    descriptionBulletPoints: [
      'Gamified learning and quick science-backed practices',
      'Daily “mind cookies” and inspiring stories',
      'Builds focus, energy, and balance at work and beyond',
    ],
    quotation: 'Wellness made simple, engaging, and gamified.',
    buttonText: 'Explore Solution',
    image1: AppImg,
    image2: AppImgLong,
    backgroundColor: '#FEF0DC',
  },
  {
    id: 2,
    sectionId: 'programs',
    icon: Programs,
    title: 'Tailored Programs',
    description:
      'Corporate Health training journeys designed to reduce life pressures, build resilience, and spark thriving performance — delivered face-to-face, online, or blended with the ability to help organizations track growth and impact.',
    modalDescription1:
      'We design tailored programs—delivered face-to-face or online—customized to your organization’s unique needs. Each program blends evidence-based wellness practices with engaging experiences, supporting your team’s well-being, performance, and growth.',
    modalDescriptionBulletPoints: [
      'Mindfulness & Stress Management Workshops: Interactive sessions (online or face-to-face) designed to help teams build resilience, manage stress, and improve focus',
      'Leadership Well-being Bootcamps: Custom programs for managers to enhance emotional intelligence, decision-making, and team motivation',
      'Diversity & Inclusion Wellness Series: Initiatives supporting mental health and well-being for diverse teams, fostering belonging and engagement',
      'Digital Detox Challenges: Company-wide campaigns encouraging healthy tech habits and work-life balance',
      'Personalized Wellness Journeys: Individualized routines and challenges based on employee needs, tracked via the Othentica app',
    ],
    descriptionBulletPoints: [
      'Corporate health journeys to reduce life pressures and build resilience',
      'Delivered face-to-face, online, or blended formats',
      'Helps organizations track growth and performance impact',
    ],
    quotation: 'Resilience and performance, built to last.',
    buttonText: 'Explore Solution',
    image1: ProgramsImg,
    image2: ProgramsImg,
    backgroundColor: '#FEF0DC',
  },
  {
    id: 3,
    sectionId: 'talks',
    icon: Talks,
    title: 'Talks & Workshops',
    description:
      'Engaging sessions on brain health, resilience, and corporate health trends, inspiring teams to shift from coping to thriving.',
    modalDescription1:
      'Have you ever noticed how brain energy and performance can shift from day to day? Achieving more isn’t just about hard work—it’s about brain work. Our talks and workshops focus on brain health, resilience, and the latest corporate wellness trends.',
    modalDescriptionBulletPoints: [
      'Designed to inspire teams and foster thriving cultures',
      'Encourage a shift from coping to thriving',
      'Equip employees with practical tools for better focus, well-being, and performance',
    ],

    descriptionBulletPoints: [
      'Sessions on brain health, resilience, and corporate health trends',
      'Designed to inspire teams and foster thriving cultures',
      'Encourage a shift from coping to thriving',
    ],
    quotation: 'From coping to thriving, together.',
    buttonText: 'Explore Solution',
    image1: WorkshopImg,
    image2: WorkshopImg2,
    backgroundColor: '#FEF0DC',
  },
  {
    id: 4,
    sectionId: 'one-to-one',
    icon: OneToOne,
    title: '1:1 Guidance',
    description:
      'Personalized support through brain health coaching and training methods to help individuals become truly unstuckable.',
    modalDescription1: '1:1 Guidance for Executives & C-Suite',
    modalDescriptionBulletPoints: [
      'Personalized brain health coaching and training methods empower executives and C-suite leaders to unlock new ways of thinking, leading to more effective decision-making and influence',
      'Overcoming personal and professional obstacles is crucial at the top—our tailored support helps leaders break through barriers, adapt to change, and model resilience for their teams',
      'Building lasting resilience and an “unstuckable” mindset not only benefits the individual leader but also cascades throughout the organization, driving higher engagement, innovation, and sustained performance',
      'When leaders invest in their own growth and well-being, it sets a powerful example, fostering a culture where continuous improvement and mental agility are valued—directly impacting organizational success',
    ],
    descriptionBulletPoints: [
      'Personalized brain health coaching and training methods',
      'Helps individuals overcome obstacles and challenges',
      'Supports lasting resilience and “unstuckable” growth',
    ],
    quotation: 'Break free. Grow stronger. Be Unstuckable.',
    buttonText: 'Explore Solution',
    image1: OneToOneImg,
    image2: OneToOneImg,
    backgroundColor: '#FEF0DC',
  },
];
