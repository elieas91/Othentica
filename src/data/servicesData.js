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
      'One-of-its-kind wellness app that makes growth simple and engaging. With gamified learning, quick science-backed practices, daily "mind cookies" and inspiring stories, Othentica helps you build focus, energy, and balance at work and beyond.',
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
