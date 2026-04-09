const defaultEventCatalog = [
  {
    slug: "weddings",
    name: "Weddings",
    desc: "Full-stack planning from sangeet to reception with local and destination options.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Venue, decor, and photography shortlists with galleries and reviews.",
      "Budget alignment for multi-day ceremonies with transparent add-ons.",
      "Coordinated timelines across makeup, entertainment, and logistics.",
    ],
    packages: [
      {
        name: "Essential",
        price: "$4,500+",
        items: ["Venue scouting", "Decorator shortlist", "Photography day-coverage", "Basic coordinator"],
      },
      {
        name: "Signature",
        price: "$8,500+",
        items: ["End-to-end decor & lighting", "Premium photography + film", "Artist/DJ booking", "Dedicated planner & on-day team"],
      },
      {
        name: "Destination",
        price: "Custom",
        items: ["Travel logistics", "Multi-day schedules", "Local vendor sourcing", "Guest hospitality desk"],
      },
    ],
  },
  {
    slug: "corporate-mice",
    name: "Corporate & MICE",
    desc: "Offsites, launches, conferences, and hybrid summits with vendor RFP support.",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Agenda-ready AV, stage, decor, and catering layouts.",
      "RFP-style vendor outreach with availability confirmations.",
      "Hybrid streaming and badge/check-in coordination.",
    ],
    packages: [
      {
        name: "Team Offsite",
        price: "$3,000+",
        items: ["Venue + stay options", "Icebreaker experiences", "Meals + AV"],
      },
      {
        name: "Product Launch",
        price: "$7,500+",
        items: ["Stage + lighting", "Press kit support", "Livestream setup"],
      },
      {
        name: "Conference",
        price: "Custom",
        items: ["Multi-track agenda", "Registration & badges", "Speaker logistics", "Sponsorship booths"],
      },
    ],
  },
  {
    slug: "social-celebrations",
    name: "Social Celebrations",
    desc: "Birthdays, anniversaries, baby showers, and intimate gatherings with themed decor.",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Theme-first moodboards and decor bundles.",
      "Quick-turn catering, cake, and entertainment pairing.",
      "Guest flow and seating plans for intimate spaces.",
    ],
    packages: [
      {
        name: "Cozy",
        price: "$1,200+",
        items: ["Decor kit", "Cake & dessert table", "Music playlist + PA"],
      },
      {
        name: "Celebration",
        price: "$2,500+",
        items: ["Custom decor", "Live music/DJ", "Photo corner + props"],
      },
      {
        name: "Premium",
        price: "$4,000+",
        items: ["Full theme build", "Catering coordination", "Host + photographer"],
      },
    ],
  },
  {
    slug: "concerts-live",
    name: "Concerts & Live Shows",
    desc: "Stage, sound, lighting, talent booking, and crowd services in one trackable plan.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Artist/talent booking coordination with tech riders.",
      "Integrated sound, lighting, and stage management.",
      "Security, crowd control, and ticketing partner handoffs.",
    ],
    packages: [
      {
        name: "Indie Night",
        price: "$6,000+",
        items: ["Stage + PA", "Lighting basics", "On-ground manager"],
      },
      {
        name: "Festival",
        price: "$15,000+",
        items: ["Multi-stage layout", "Pro lighting & visuals", "Security + barricading"],
      },
      {
        name: "Arena",
        price: "Custom",
        items: ["Full production", "Talent liaison", "Ticketing + FOH/BOH teams"],
      },
    ],
  },
  {
    slug: "cultural-community",
    name: "Cultural & Community",
    desc: "Festivals, college fests, and public gatherings with compliance-friendly workflows.",
    image:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Permit and compliance checklist support.",
      "Volunteer, booth, and vendor rostering in one plan.",
      "Local vendor sourcing with budget-conscious options.",
    ],
    packages: [
      {
        name: "Campus Fest",
        price: "$3,500+",
        items: ["Stage + sound", "Stalls layout", "Volunteer scheduling"],
      },
      {
        name: "Community Fair",
        price: "$5,000+",
        items: ["Permits support", "Security + crowd", "Decor + signage"],
      },
      {
        name: "City Festival",
        price: "Custom",
        items: ["Multi-day planning", "Public safety coordination", "Press & media desk"],
      },
    ],
  },
  {
    slug: "virtual-hybrid",
    name: "Virtual & Hybrid",
    desc: "Streaming, 360-degree venue tours, and guest engagement for remote-first formats.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Broadcast platform setup and show-flow scripts.",
      "360-degree venue tours for remote approvals.",
      "Remote guest engagement kits and live chat moderation.",
    ],
    packages: [
      {
        name: "Virtual Essentials",
        price: "$1,000+",
        items: ["Platform setup", "Host script", "Basic graphics"],
      },
      {
        name: "Hybrid",
        price: "$3,500+",
        items: ["Venue + streaming", "AV crew", "Audience Q&A tools"],
      },
      {
        name: "Premium Live",
        price: "Custom",
        items: ["Multi-camera", "Custom overlays", "Live moderation team"],
      },
    ],
  },
];

export default defaultEventCatalog;
