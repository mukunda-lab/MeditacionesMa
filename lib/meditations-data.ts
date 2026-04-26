export interface Meditation {
  id: number;
  title: string;
  subtitle: string;
  date: Date;
  excerpt: string;
  imageUrl: string;
  slug: string;
}

export const meditations: Meditation[] = [
  {
    id: 1,
    title: "La verdad te ilumina",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2026-04-15"),
    excerpt: "Previo a todo, haz una breve y sentida invocación a tu Ser. Respira profunda y conscientemente, ni siquiera te nombres, despersonalízate en este momento.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "la-verdad-te-ilumina"
  },
  {
    id: 2,
    title: "Fuerzas para lo que soy",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2026-03-25"),
    excerpt: "Proponte hacia el respiro consciente, que esa sea tu propuesta para un momento así, solo el respiro consciente, atendido.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "fuerzas-para-lo-que-soy"
  },
  {
    id: 3,
    title: "Cada vida es el Ser",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2026-03-11"),
    excerpt: "Haz que toda respiración despeje, concentrándote. Haz ese ejercicio, despejarte, y observa lo que te produce tu visión interna.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "cada-vida-es-el-ser"
  },
  {
    id: 4,
    title: "Convéncete de tu existencia",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2026-02-18"),
    excerpt: "Simplemente recuérdate de ti e instálate ahí, respiro a respiro, en concentración, hazte presente, visualiza tu cuerpo.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "convencete-de-tu-existencia"
  },
  {
    id: 5,
    title: "Soy esto y me prometo más",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2026-01-28"),
    excerpt: "Simplemente recuérdate de ti e instálate ahí, respiro a respiro, en concentración, hazte presente, visualiza tu cuerpo, tu posición, tu postura.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "soy-esto-y-me-prometo-mas"
  },
  {
    id: 6,
    title: "Entrega, pureza y verdad",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2025-12-18"),
    excerpt: "Om Gam Ganapataye Namaha. Mantra sí, mantra, mantra. ¿Qué tanto crees me dice a mí y qué tanto a ti?",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "entrega-pureza-y-verdad"
  },
  {
    id: 7,
    title: "¿Tengo un alma entusiasta?",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2025-11-27"),
    excerpt: "Haz cada respiro sereno, muy conscientemente. Obsérvate paciente y amorosamente respirar y disfruta eso, celebra tu respiro y agradécelo también.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "tengo-un-alma-entusiasta"
  },
  {
    id: 8,
    title: "Permanece fiel a la luz",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2025-10-15"),
    excerpt: "Recurre siempre a tu respiro, obsérvate bien ahora y respira como quieres respirar, date esa libertad, sabiendo lo que precisas.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "permanece-fiel-a-la-luz"
  },
  {
    id: 9,
    title: "Tu magna inmensidad",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2025-09-22"),
    excerpt: "Haz tus respiraciones abdominales muy conscientemente y haz absorción de todo cuanto necesitas para establecerte en quietud.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "tu-magna-inmensidad"
  },
  {
    id: 10,
    title: "Produce amor desde tu calma",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2025-08-14"),
    excerpt: "Observa cómo respiras, lleva tu respiro a una serenidad, sin expectativa, sin tensión. Asiéntate, reposa ahí.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "produce-amor-desde-tu-calma"
  },
  {
    id: 11,
    title: "Eres pulso, latido, idea y acción",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2025-07-08"),
    excerpt: "Relaja el rostro, los hombros y asiéntate bien ahí. Reposa. Hazte presente, pronuncia tu nombre internamente.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "eres-pulso-latido-idea-y-accion"
  },
  {
    id: 12,
    title: "En mí quiero respeto y verdad",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2025-06-11"),
    excerpt: "Crea el momento, hazte presente, haz registro de tu situacionalidad, de lo que como cuerpo tienes y opera aquí en este sistema.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "en-mi-quiero-respeto-y-verdad"
  },
  {
    id: 13,
    title: "Quien sabe respirar, ama",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2025-05-21"),
    excerpt: "Dispénsate toda la atención y obsérvate profundamente. Haz revisión de tu interno, de tu ánimo, de tu sentir, de tu voluntad.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "quien-sabe-respirar-ama"
  },
  {
    id: 14,
    title: "El silencio es tu maestro",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2025-04-16"),
    excerpt: "En el silencio encontrarás las respuestas que buscas. Permite que la quietud te guíe hacia tu verdad interior.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "el-silencio-es-tu-maestro"
  },
  {
    id: 15,
    title: "Abraza tu ser interior",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2025-03-12"),
    excerpt: "Abrázate con compasión y amor. Reconoce tu luz interior y permite que brille sin reservas.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "abraza-tu-ser-interior"
  },
  {
    id: 16,
    title: "La paz habita en ti",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2025-02-05"),
    excerpt: "La paz no está afuera, está dentro de ti. Descúbrela en cada respiración consciente.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "la-paz-habita-en-ti"
  },
  {
    id: 17,
    title: "Despertar consciente",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2025-01-15"),
    excerpt: "Cada día es una oportunidad para despertar a una nueva conciencia. Comienza con tu respiración.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "despertar-consciente"
  },
  {
    id: 18,
    title: "Gratitud infinita",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2024-12-18"),
    excerpt: "La gratitud abre las puertas del alma. Agradece cada momento, cada respiración, cada latido.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "gratitud-infinita"
  },
  {
    id: 19,
    title: "Luz en la oscuridad",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2024-11-20"),
    excerpt: "Incluso en los momentos más oscuros, tu luz interior puede brillar. Confía en tu esencia divina.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "luz-en-la-oscuridad"
  },
  {
    id: 20,
    title: "Conexión universal",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2024-10-09"),
    excerpt: "Todos estamos conectados. En la meditación, esa conexión se hace evidente y palpable.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "conexion-universal"
  },
  {
    id: 21,
    title: "El poder del ahora",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2024-09-11"),
    excerpt: "El único momento real es el presente. Habítalo plenamente con cada respiración consciente.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "el-poder-del-ahora"
  },
  {
    id: 22,
    title: "Amor sin condiciones",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2024-08-14"),
    excerpt: "El amor verdadero no tiene condiciones. Emana desde tu centro y envuelve todo lo que existe.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "amor-sin-condiciones"
  },
  {
    id: 23,
    title: "Serenidad profunda",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2024-07-17"),
    excerpt: "La serenidad no depende de las circunstancias externas. Es un estado que cultivas desde dentro.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "serenidad-profunda"
  },
  {
    id: 24,
    title: "Confianza en el camino",
    subtitle: "Meditación con Mataji Shaktiananda",
    date: new Date("2024-06-12"),
    excerpt: "Tu camino está trazado. Confía en él y avanza con paso firme hacia tu realización.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "confianza-en-el-camino"
  }
];

export function getMeditationsByYear(): Record<number, Meditation[]> {
  const byYear: Record<number, Meditation[]> = {};
  
  meditations.forEach(meditation => {
    const year = meditation.date.getFullYear();
    if (!byYear[year]) {
      byYear[year] = [];
    }
    byYear[year].push(meditation);
  });
  
  // Sort meditations within each year by date (newest first)
  Object.keys(byYear).forEach(year => {
    byYear[Number(year)].sort((a, b) => b.date.getTime() - a.date.getTime());
  });
  
  return byYear;
}

export function getYears(): number[] {
  const years = [...new Set(meditations.map(m => m.date.getFullYear()))];
  return years.sort((a, b) => b - a);
}
