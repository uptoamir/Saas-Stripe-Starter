import { FeatureLdg, InfoLdg, TeamLdg, TestimonialType } from "types";

export const infos: InfoLdg[] = [
  {
    title: "Empower your projects",
    description:
      "Unlock the full potential of your projects with our open-source SaaS platform. Collaborate seamlessly, innovate effortlessly, and scale limitlessly.",
    image: "/_static/illustrations/work-from-home.jpg",
    list: [
      {
        title: "Collaborative",
        description: "Work together with your team members in real-time.",
        icon: "laptop",
      },
      {
        title: "Innovative",
        description: "Stay ahead of the curve with access constant updates.",
        icon: "settings",
      },
      {
        title: "Scalable",
        description:
          "Our platform offers the scalability needed to adapt to your needs.",
        icon: "search",
      },
    ],
  },
  {
    title: "Seamless Integration",
    description:
      "Integrate our open-source SaaS seamlessly into your existing workflows. Effortlessly connect with your favorite tools and services for a streamlined experience.",
    image: "/_static/illustrations/work-from-home.jpg",
    list: [
      {
        title: "Flexible",
        description:
          "Customize your integrations to fit your unique requirements.",
        icon: "laptop",
      },
      {
        title: "Efficient",
        description: "Streamline your processes and reducing manual effort.",
        icon: "search",
      },
      {
        title: "Reliable",
        description:
          "Rely on our robust infrastructure and comprehensive documentation.",
        icon: "settings",
      },
    ],
  },
];

export const features: FeatureLdg[] = [
  {
    title: "Categories",
    description:
      "",
      features: [
        'passenger cars',
        'Average travel time using real-time Google Maps data',
        'Average speed from real-time Google Maps data',
        'Based on car-following models in microscopic traffic simulation'
      ],
    link: "/",
    icon: "car",
  },
  {
    title: "Emissions",
    description:
      "",
      features: [
        'CO2 (carbon dioxide)',
        'CO2-e (carbon dioxide equivalents)',
        'CO (carbon monoxide)',
        'NOx (nitrogen oxides)',
        'SOx (sulphur oxides)',
        'PM10 (particulate matters)',
        'Fuel consumption',
      ],
    link: "/",
    icon: "radiation",
  }
];


export const team: TeamLdg[] = [
  {
    name: "Amirhossein Karbasi",
    postition:
      "PhD Candidate at McMaster University",
    linkedin: "https://www.linkedin.com/in/amirhosseinkarbasi/",
    mail: "karbaa3@mcmaster.ca",
    image: "/_static/avatars/karbasi.png",
  },
  {
    name: "Amirhossein Khoshbin",
    postition:
      "Software Engineer",
    linkedin: "https://www.linkedin.com/in/amirhossein-khoshbin-4011a8198/",
    mail: "khoshbinamirhosein@gmail.com",
    image: "/_static/avatars/khoshbin.jpeg",
  },
];

export const testimonials: TestimonialType[] = [];
