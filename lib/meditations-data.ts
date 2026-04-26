export interface Meditation {
  id: number;
  title: string;
  subtitle: string;
  dateString: string; // ISO date string YYYY-MM-DD to avoid timezone issues
  excerpt: string;
  imageUrl: string;
  slug: string;
}

// Helper to parse date string consistently
export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Format date for display
export function formatDateDisplay(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day} · ${month} · ${year}`;
}

// All meditations from shaktianandama.com/meditaciones
// Images are loaded from the website with consistent styling
export const meditations: Meditation[] = [
  // 2026
  {
    id: 1,
    title: "La verdad te ilumina",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-04-16",
    excerpt: "Previo a todo, haz una breve y sentida invocación a tu Ser. Respira profunda y conscientemente.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/04/MeditacionShaktiananda-2026-04-16.jpg",
    slug: "la-verdad-te-ilumina"
  },
  {
    id: 2,
    title: "Fuerzas para lo que soy",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-04-09",
    excerpt: "Proponte hacia el respiro consciente, que esa sea tu propuesta para un momento así.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/04/MeditacionShaktiananda-2026-04-09.jpg",
    slug: "fuerzas-para-lo-que-soy"
  },
  {
    id: 3,
    title: "Cada vida es el Ser",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-04-02",
    excerpt: "Haz que toda respiración despeje, concentrándote. Haz ese ejercicio, despejarte, y observa lo que te produce tu visión interna.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/04/MeditacionShaktiananda-2026-04-02.jpg",
    slug: "cada-vida-es-el-ser"
  },
  {
    id: 4,
    title: "Soy esto y me prometo más",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-03-26",
    excerpt: "Simplemente recuérdate de ti e instálate ahí, respiro a respiro, en concentración, hazte presente, visualiza tu cuerpo.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/03/MeditacionShaktiananda-2026-03-26.jpg",
    slug: "soy-esto-y-me-prometo-mas"
  },
  {
    id: 5,
    title: "Entrega, pureza y verdad",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-03-19",
    excerpt: "Om Gam Ganapataye Namaha. Mantra sí, mantra, mantra. ¿Qué tanto crees me dice a mí y qué tanto a ti?",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/03/MeditacionShaktiananda-2026-03-19.jpg",
    slug: "entrega-pureza-y-verdad"
  },
  {
    id: 6,
    title: "¿Tengo un alma entusiasta?",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-03-12",
    excerpt: "Haz cada respiro sereno, muy conscientemente. Obsérvate paciente y amorosamente respirar.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/03/MeditacionShaktiananda-2026-03-12.jpg",
    slug: "tengo-un-alma-entusiasta"
  },
  {
    id: 7,
    title: "Permanece fiel a la luz",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-03-05",
    excerpt: "Recurre siempre a tu respiro, obsérvate bien ahora y respira como quieres respirar.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/03/MeditacionShaktiananda-2026-03-05.jpg",
    slug: "permanece-fiel-a-la-luz"
  },
  {
    id: 8,
    title: "Tu magna inmensidad",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-02-26",
    excerpt: "Haz tus respiraciones abdominales muy conscientemente y haz absorción de todo cuanto necesitas.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/02/MeditacionShaktiananda-2026-02-26.jpg",
    slug: "tu-magna-inmensidad"
  },
  {
    id: 9,
    title: "Convéncete de tu existencia",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-02-18",
    excerpt: "Simplemente recuérdate de ti e instálate ahí, respiro a respiro, en concentración.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/02/MeditacionShaktiananda-2026-02-18.jpg",
    slug: "convencete-de-tu-existencia"
  },
  {
    id: 10,
    title: "Produce amor desde tu calma",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-02-12",
    excerpt: "Observa cómo respiras, lleva tu respiro a una serenidad, sin expectativa, sin tensión.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/02/MeditacionShaktiananda-2026-02-12.jpg",
    slug: "produce-amor-desde-tu-calma"
  },
  {
    id: 11,
    title: "Eres pulso, latido, idea y acción",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-02-05",
    excerpt: "Relaja el rostro, los hombros y asiéntate bien ahí. Reposa. Hazte presente.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/02/MeditacionShaktiananda-2026-02-05.jpg",
    slug: "eres-pulso-latido-idea-y-accion"
  },
  {
    id: 12,
    title: "En mí quiero respeto y verdad",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-01-29",
    excerpt: "Crea el momento, hazte presente, haz registro de tu situacionalidad.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/01/MeditacionShaktiananda-2026-01-29.jpg",
    slug: "en-mi-quiero-respeto-y-verdad"
  },
  {
    id: 13,
    title: "Quien sabe respirar, ama",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-01-22",
    excerpt: "Dispénsate toda la atención y obsérvate profundamente. Haz revisión de tu interno.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/01/MeditacionShaktiananda-2026-01-22.jpg",
    slug: "quien-sabe-respirar-ama"
  },
  {
    id: 14,
    title: "Lo más valiente de ti es tu alma",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-01-15",
    excerpt: "Hazte presente con el respiro. Hazte presente y haz que el presente sea en ti.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/01/MeditacionShaktiananda-2026-01-15.jpg",
    slug: "lo-mas-valiente-de-ti-es-tu-alma"
  },
  {
    id: 15,
    title: "Obra con dignidad",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2026-01-08",
    excerpt: "El respiro profundo, sereno, que te llegue, que lo sientas.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2026/01/MeditacionShaktiananda-2026-01-08.jpg",
    slug: "obra-con-dignidad"
  },
  // 2025
  {
    id: 16,
    title: "El alma resiste sin resentir",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-12-18",
    excerpt: "Permanece atento a tu respiración, a lo consciente que la haces.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/12/MeditacionShaktiananda-2025-12-18.jpg",
    slug: "el-alma-resiste-sin-resentir"
  },
  {
    id: 17,
    title: "Pide luz para esta Tierra",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-12-11",
    excerpt: "Mantén el respiro para sostener lo logrado. Observa cada respiro y profundízalo.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/12/MeditacionShaktiananda-2025-12-11.jpg",
    slug: "pide-luz-para-esta-tierra"
  },
  {
    id: 18,
    title: "Quiero todo lo que soy",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-12-04",
    excerpt: "Observa el respiro. Pronuncia cada respiro en ti y haz que sea un disfrute.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/12/MeditacionShaktiananda-2025-12-04.jpg",
    slug: "quiero-todo-lo-que-soy"
  },
  {
    id: 19,
    title: "Elige respirar por tu vida",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-11-27",
    excerpt: "Atiende el respiro, céntrate ahí y obsérvate. Ve percibiendo cómo estás.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/11/MeditacionShaktiananda-2025-11-27.jpg",
    slug: "elige-respirar-por-tu-vida"
  },
  {
    id: 20,
    title: "Firme es mi verdad",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-11-20",
    excerpt: "El rostro altivo en tu presente, dando la cara, y tu pecho abierto, que describa tu alma.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/11/MeditacionShaktiananda-2025-11-20.jpg",
    slug: "firme-es-mi-verdad"
  },
  {
    id: 21,
    title: "Mi fuerza soy",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-11-13",
    excerpt: "Saludo y agradezco a tu divinidad, a tu alma atenta y abierta.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/11/MeditacionShaktiananda-2025-11-13.jpg",
    slug: "mi-fuerza-soy"
  },
  {
    id: 22,
    title: "La fe se logra",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-11-06",
    excerpt: "Llevas tu respiro a tu pronunciamiento consciente. Que lo que expresas en este instante sea solo tu respiro.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/11/MeditacionShaktiananda-2025-11-06.jpg",
    slug: "la-fe-se-logra"
  },
  {
    id: 23,
    title: "Reserva fuerzas de tus buenas obras",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-10-30",
    excerpt: "Te visualizas ahí donde estás, dibujándote con la mejor idea que tengas de ti.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/10/MeditacionShaktiananda-2025-10-30.jpg",
    slug: "reserva-fuerzas-de-tus-buenas-obras"
  },
  {
    id: 24,
    title: "Sé implacable con la oscuridad",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-10-23",
    excerpt: "Concéntrate en el respiro y cuida su tránsito. Si alcanzas, visualiza su recorrido.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/10/MeditacionShaktiananda-2025-10-23.jpg",
    slug: "se-implacable-con-la-oscuridad"
  },
  {
    id: 25,
    title: "Proclama paz y dispensa amor",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-10-16",
    excerpt: "Hazte presente y observa atentamente tu respiración. Asimismo ubícate bien en ti.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/10/MeditacionShaktiananda-2025-10-16.jpg",
    slug: "proclama-paz-y-dispensa-amor"
  },
  {
    id: 26,
    title: "Entrega es alma en regocijo",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-10-09",
    excerpt: "Estás aquí hoy. Asegúrate de estar aquí, de sentirte aquí, de saberte en ti.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/10/MeditacionShaktiananda-2025-10-09.jpg",
    slug: "entrega-es-alma-en-regocijo"
  },
  {
    id: 27,
    title: "Odiseas para expresar al Ser",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-10-02",
    excerpt: "El cuerpo aplomado, bien centrado. Visualízate en una postura perfecta.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/10/MeditacionShaktiananda-2025-10-02.jpg",
    slug: "odiseas-para-expresar-al-ser"
  },
  {
    id: 28,
    title: "Ya no pregunto, sé que me amas",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-09-25",
    excerpt: "Hazte consciente del respiro, cada inhalación, firme y sentida.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/09/MeditacionShaktiananda-2025-09-25.jpg",
    slug: "ya-no-pregunto-se-que-me-amas"
  },
  {
    id: 29,
    title: "Conducto y Fuente de tu fuerza",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-09-18",
    excerpt: "Haciendo tu esfuerzo, produce la respiración desde el abdomen.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/09/MeditacionShaktiananda-2025-09-18.jpg",
    slug: "conducto-y-fuente-de-tu-fuerza"
  },
  {
    id: 30,
    title: "¿Sabes bien lo que necesitas liberar?",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-09-11",
    excerpt: "Dale un ritmo a tu respiro, si quieres juega profundamente a sentirlo.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/09/MeditacionShaktiananda-2025-09-11.jpg",
    slug: "sabes-bien-lo-que-necesitas-liberar"
  },
  {
    id: 31,
    title: "Revisa tu relación contigo",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-09-04",
    excerpt: "Respira con cierta intensidad, tanto para inhalar como para exhalar.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/09/MeditacionShaktiananda-2025-09-04.jpg",
    slug: "revisa-tu-relacion-contigo"
  },
  {
    id: 32,
    title: "Ser la acción de amar",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-08-28",
    excerpt: "Abre esta meditación con respiros serenos, profundos, ubicándote en lo que tu Ser es.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/08/MeditacionShaktiananda-2025-08-28.jpg",
    slug: "ser-la-accion-de-amar"
  },
  {
    id: 33,
    title: "Entrégate a lo que realmente eres",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-08-21",
    excerpt: "Alimenta sanamente tu respiro, depurando pensamientos.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/08/MeditacionShaktiananda-2025-08-21.jpg",
    slug: "entregate-a-lo-que-realmente-eres"
  },
  {
    id: 34,
    title: "El juego limpio del alma",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-08-14",
    excerpt: "Haz con tu respiro que todo se integre a ti y que tú te integres a todo.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/08/MeditacionShaktiananda-2025-08-14.jpg",
    slug: "el-juego-limpio-del-alma"
  },
  {
    id: 35,
    title: "El amoroso acto de creerte",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-08-07",
    excerpt: "Haz contacto, en principio, con tu respiro. Cuando el contacto es consciente, se experimenta satisfacción.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/08/MeditacionShaktiananda-2025-08-07.jpg",
    slug: "el-amoroso-acto-de-creerte"
  },
  {
    id: 36,
    title: "Demoler lo que me atrapa",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-07-31",
    excerpt: "Abastécete plenamente de prana. Hasta la cualidad del aire se transforma con tu propia modulación.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/07/MeditacionShaktiananda-2025-07-31.jpg",
    slug: "demoler-lo-que-me-atrapa"
  },
  {
    id: 37,
    title: "Acato el silencio y habito el vacío",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-07-24",
    excerpt: "Hazte consciente del momento, de lo que estás haciendo. Marca un eje, un centro, un foco.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/07/MeditacionShaktiananda-2025-07-24.jpg",
    slug: "acato-el-silencio-y-habito-el-vacio"
  },
  {
    id: 38,
    title: "Tus ciclos son obstrucciones",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-07-17",
    excerpt: "El respiro constante, consciente, haciendo buen registro de lo que tu respiro es.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/07/MeditacionShaktiananda-2025-07-17.jpg",
    slug: "tus-ciclos-son-obstrucciones"
  },
  {
    id: 39,
    title: "Valiente fórmula: amor y silencio",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-07-10",
    excerpt: "Tú no busques nada, que te encuentre tu respiro. Así que déjate ganar por tu respiro.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/07/MeditacionShaktiananda-2025-07-10.jpg",
    slug: "valiente-formula-amor-y-silencio"
  },
  {
    id: 40,
    title: "Un fractal consciente",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-07-03",
    excerpt: "Has venido y, antes que nada, tal y como te agradeces, te agradezco.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/07/MeditacionShaktiananda-2025-07-03.jpg",
    slug: "un-fractal-consciente"
  },
  {
    id: 41,
    title: "Logra amor y entrégate",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-06-26",
    excerpt: "Busca siempre estabilizarte respirando, haz control amoroso de lo que tu respiro es.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/06/MeditacionShaktiananda-2025-06-26.jpg",
    slug: "logra-amor-y-entregate"
  },
  {
    id: 42,
    title: "Soy en la voluntad del Ser",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-06-19",
    excerpt: "Atiendo el tono y permito que me inunde, que se introduzca en mi.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/06/MeditacionShaktiananda-2025-06-19.jpg",
    slug: "soy-en-la-voluntad-del-ser"
  },
  {
    id: 43,
    title: "Clamo por ser lo que soy",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-06-12",
    excerpt: "Sigue revisando un poco tu postura, tu actitud, y podría decirte que hasta tu ánimo.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/06/MeditacionShaktiananda-2025-06-12.jpg",
    slug: "clamo-por-ser-lo-que-soy"
  },
  {
    id: 44,
    title: "Mi forma de sanar",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-06-05",
    excerpt: "Percíbete ahí donde estás, haciendo presencia. Haz consciente cómo estableces tu Ser.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/06/MeditacionShaktiananda-2025-06-05.jpg",
    slug: "mi-forma-de-sanar"
  },
  {
    id: 45,
    title: "Conciencia eres, aunque finjas",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-05-29",
    excerpt: "Hazte presente, sitúate acá, haz una breve introducción íntima.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/05/MeditacionShaktiananda-2025-05-29.jpg",
    slug: "conciencia-eres-aunque-finjas"
  },
  {
    id: 46,
    title: "Ocúpate en obrar en bien",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-05-22",
    excerpt: "Si es que tienes, si es que has traído, preservas, conservas, algún murti que me represente.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/05/MeditacionShaktiananda-2025-05-22.jpg",
    slug: "ocupate-en-obrar-en-bien"
  },
  {
    id: 47,
    title: "Soy presente en luz",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-05-15",
    excerpt: "Te concentras en tu respiración y en el tono, te centras ahí, permitiéndote vibrar.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/05/MeditacionShaktiananda-2025-05-15.jpg",
    slug: "soy-presente-en-luz"
  },
  {
    id: 48,
    title: "Tu voluntad de contacto",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-05-08",
    excerpt: "Antes de comenzar, hago un humilde llamado a San Miguel Arcángel.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/05/MeditacionShaktiananda-2025-05-08.jpg",
    slug: "tu-voluntad-de-contacto"
  },
  {
    id: 49,
    title: "Nunca más elijas esto",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-05-01",
    excerpt: "Refléjate en tu respiro y haz que él se refleje en ti.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/05/MeditacionShaktiananda-2025-05-01.jpg",
    slug: "nunca-mas-elijas-esto"
  },
  {
    id: 50,
    title: "Hago registro de mi amor",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-04-24",
    excerpt: "Visualízate un instante ahí donde estás, debes saberte en tu compañía.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/04/MeditacionShaktiananda-2025-04-24.jpg",
    slug: "hago-registro-de-mi-amor"
  },
  {
    id: 51,
    title: "Cuando eres en bien, superas todo",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-04-17",
    excerpt: "Que nuestra cita sea productiva, como siempre, desde lo que hemos entendido.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/04/MeditacionShaktiananda-2025-04-17.jpg",
    slug: "cuando-eres-en-bien-superas-todo"
  },
  {
    id: 52,
    title: "Nos hemos elegido para acompañarnos",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-04-10",
    excerpt: "Concéntrate en el tono y en tu respiración. Perdona hoy nuestros recursos.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/04/MeditacionShaktiananda-2025-04-10.jpg",
    slug: "nos-hemos-elegido-para-acompanarnos"
  },
  {
    id: 53,
    title: "Madre perdóname. Madre bendíceme",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-04-03",
    excerpt: "Respira sin temor, sin dudas, sin ansiedad. Más bien, relájate y concéntrate en tu respiro.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/04/MeditacionShaktiananda-2025-04-03.jpg",
    slug: "madre-perdoname-madre-bendiceme"
  },
  {
    id: 54,
    title: "Shiva, una fuerza en tu Ser",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-03-27",
    excerpt: "¿Estás respirando? Es que a veces parecieras que no lo sientes.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/03/MeditacionShaktiananda-2025-03-27.jpg",
    slug: "shiva-una-fuerza-en-tu-ser"
  },
  {
    id: 55,
    title: "Celebrar lo que esta vida es",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-03-20",
    excerpt: "Alcanza a mantener una respiración firme y consciente.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/03/MeditacionShaktiananda-2025-03-20.jpg",
    slug: "celebrar-lo-que-esta-vida-es"
  },
  {
    id: 56,
    title: "Meditas para amarte y restarte maldad",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-03-13",
    excerpt: "¿Me cuentas cómo estás? En un breve pensamiento acércame.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/03/MeditacionShaktiananda-2025-03-13.jpg",
    slug: "meditas-para-amarte-y-restarte-maldad"
  },
  {
    id: 57,
    title: "Conciencia mía, respira en mi",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-03-06",
    excerpt: "Concéntrate. Se trata de que te centres en ti, priorizando atención en el respiro.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/03/MeditacionShaktiananda-2025-03-06.jpg",
    slug: "conciencia-mia-respira-en-mi"
  },
  {
    id: 58,
    title: "La cuenta regresiva a tu retorno",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-02-27",
    excerpt: "Con tu propio respiro invoca a tu Ser, lo que sientas eres, lo que creas eres.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/02/MeditacionShaktiananda-2025-02-27.jpg",
    slug: "la-cuenta-regresiva-a-tu-retorno"
  },
  {
    id: 59,
    title: "Resiste con fuerza tu lado negador",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-02-20",
    excerpt: "Atiende solo tu respiro, concéntrate. Sensibilízate a esta acción.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/02/MeditacionShaktiananda-2025-02-20.jpg",
    slug: "resiste-con-fuerza-tu-lado-negador"
  },
  {
    id: 60,
    title: "Resuelve todo, para amarte más",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-02-13",
    excerpt: "Haz mentalmente un recorrido breve de tu trayecto hasta aquí.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/02/MeditacionShaktiananda-2025-02-13.jpg",
    slug: "resuelve-todo-para-amarte-mas"
  },
  {
    id: 61,
    title: "Cuando ocurre el Ser",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-02-06",
    excerpt: "Amado Ser, tú que estás de alguna manera tan cerca.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/02/MeditacionShaktiananda-2025-02-06.jpg",
    slug: "cuando-ocurre-el-ser"
  },
  {
    id: 62,
    title: "No te contamines, respétate más",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-01-30",
    excerpt: "Haz cada respiro consciente, sabiendo exactamente lo que inhalas.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/01/MeditacionShaktiananda-2025-01-30.jpg",
    slug: "no-te-contamines-respetate-mas"
  },
  {
    id: 63,
    title: "No oculto el temor, lo resuelvo",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-01-23",
    excerpt: "Busco mantener una respiración sutil, sublime, suave.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/01/MeditacionShaktiananda-2025-01-23.jpg",
    slug: "no-oculto-el-temor-lo-resuelvo"
  },
  {
    id: 64,
    title: "Un juego en el que siempre ganas",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-01-16",
    excerpt: "Concéntrate en la respiración, ocúpate de eso, en este momento, de nada más.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/01/MeditacionShaktiananda-2025-01-16.jpg",
    slug: "un-juego-en-el-que-siempre-ganas"
  },
  {
    id: 65,
    title: "Gánate tu propia confianza",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2025-01-09",
    excerpt: "Atiende solo tu respiro, concéntrate y sensibilízate a esta acción.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2025/01/MeditacionShaktiananda-2025-01-09.jpg",
    slug: "ganate-tu-propia-confianza"
  },
  // 2024
  {
    id: 66,
    title: "Existo en la Conciencia y en mi verdad",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-12-19",
    excerpt: "Solamente produce los respiros exactos que necesites para este momento.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/12/MeditacionShaktiananda-2024-12-19.jpg",
    slug: "existo-en-la-conciencia-y-en-mi-verdad"
  },
  {
    id: 67,
    title: "Respira hasta estallar y ser Aquello",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-12-12",
    excerpt: "Respira en firme, respira constante, respira conscientemente. Céntrate ahí.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/12/MeditacionShaktiananda-2024-12-12.jpg",
    slug: "respira-hasta-estallar-y-ser-aquello"
  },
  {
    id: 68,
    title: "Si tu alma duele, transfórmate",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-12-05",
    excerpt: "¿Cuántos respiros podrías atender? ¿Cuántos? Pero atiende al tuyo.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/12/MeditacionShaktiananda-2024-12-05.jpg",
    slug: "si-tu-alma-duele-transformate"
  },
  {
    id: 69,
    title: "Clama por tu orden",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-11-28",
    excerpt: "Respira en orden, respira en tu orden, en tu sistema tan perfecto.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/11/MeditacionShaktiananda-2024-11-28.jpg",
    slug: "clama-por-tu-orden"
  },
  {
    id: 70,
    title: "Soy el Universo todo",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-11-21",
    excerpt: "Observa cómo estás, percíbete, ¿cómo te sientes?",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/11/MeditacionShaktiananda-2024-11-21.jpg",
    slug: "soy-el-universo-todo"
  },
  {
    id: 71,
    title: "Viniste al planeta a saber amar",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-11-14",
    excerpt: "Sería oportuno y prudente que pronuncies internamente tu nombre.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/11/MeditacionShaktiananda-2024-11-14.jpg",
    slug: "viniste-al-planeta-a-saber-amar"
  },
  {
    id: 72,
    title: "Cuando el propósito te alcanza",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-11-07",
    excerpt: "Guarda entera concentración en tu respiración, a tu ritmo natural.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/11/MeditacionShaktiananda-2024-11-07.jpg",
    slug: "cuando-el-proposito-te-alcanza"
  },
  {
    id: 73,
    title: "Que nazca en mí lo que soy",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-10-31",
    excerpt: "¿Sabes lo que viene bien de vez en cuando? Que creas nacer.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/10/MeditacionShaktiananda-2024-10-31.jpg",
    slug: "que-nazca-en-mi-lo-que-soy"
  },
  {
    id: 74,
    title: "Sé libre, hasta de ti",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-10-24",
    excerpt: "Haz el ejercicio de mirar adentro, sin presión, sin tensión.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/10/MeditacionShaktiananda-2024-10-24.jpg",
    slug: "se-libre-hasta-de-ti"
  },
  {
    id: 75,
    title: "Si estás aquí es porque crees en la luz",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-10-17",
    excerpt: "Trata de estar lo más presente posible, y eso lo logras respirando conscientemente.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/10/MeditacionShaktiananda-2024-10-17.jpg",
    slug: "si-estas-aqui-es-porque-crees-en-la-luz"
  },
  {
    id: 76,
    title: "Rudra, exprésate en mí",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-10-10",
    excerpt: "Reverencio al Padre Supremo, Señor Rudra. Reverencio tu ira.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/10/MeditacionShaktiananda-2024-10-10.jpg",
    slug: "rudra-expresate-en-mi"
  },
  {
    id: 77,
    title: "Guardo la Ley y la Ley me guarda",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-10-03",
    excerpt: "En este momento me dispongo a hacer justo lo que quiero.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/10/MeditacionShaktiananda-2024-10-03.jpg",
    slug: "guardo-la-ley-y-la-ley-me-guarda"
  },
  {
    id: 78,
    title: "Tu mundo más libre",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-09-26",
    excerpt: "Siempre que te propongas hacer este ejercicio, llámalo como puedas.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/09/MeditacionShaktiananda-2024-09-26.jpg",
    slug: "tu-mundo-mas-libre"
  },
  {
    id: 79,
    title: "Tu compromiso es amarte",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-09-19",
    excerpt: "Ante el compromiso de vida, queda respirar.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/09/MeditacionShaktiananda-2024-09-19.jpg",
    slug: "tu-compromiso-es-amarte"
  },
  {
    id: 80,
    title: "Coincidir, reconocer y amar más",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-09-12",
    excerpt: "Atiende la actitud, la voluntad, la intención y céntrate en tu respiro.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/09/MeditacionShaktiananda-2024-09-12.jpg",
    slug: "coincidir-reconocer-y-amar-mas"
  },
  {
    id: 81,
    title: "Conciencia en el hermoso vacío",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-09-05",
    excerpt: "Disponte, toma aliento y proponte a respirar.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/09/MeditacionShaktiananda-2024-09-05.jpg",
    slug: "conciencia-en-el-hermoso-vacio"
  },
  {
    id: 82,
    title: "Tu respiro es la fórmula perfecta",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-08-29",
    excerpt: "Cuando respiras así, ¿cómo te sientes? ¿Crees que logras alguna serenidad?",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/08/MeditacionShaktiananda-2024-08-29.jpg",
    slug: "tu-respiro-es-la-formula-perfecta"
  },
  {
    id: 83,
    title: "¿Respiras para vivir o para morir?",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-08-22",
    excerpt: "Brevemente me reviso, me percibo y, cualquier alteración, cualquier incomodidad.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/08/MeditacionShaktiananda-2024-08-22.jpg",
    slug: "respiras-para-vivir-o-para-morir"
  },
  {
    id: 84,
    title: "Pide fuerzas, valor, constancia y entrega mayor",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-08-15",
    excerpt: "¿Qué tanto le pides al Universo y qué tanto le das?",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/08/MeditacionShaktiananda-2024-08-15.jpg",
    slug: "pide-fuerzas-valor-constancia-y-entrega-mayor"
  },
  {
    id: 85,
    title: "La verdad anima más",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-08-08",
    excerpt: "Empieza a animarte. Haz que tus respiros te den ánimo.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/08/MeditacionShaktiananda-2024-08-08.jpg",
    slug: "la-verdad-anima-mas"
  },
  {
    id: 86,
    title: "Presérvate íntegro",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-08-01",
    excerpt: "Relaja el rostro, sintiéndote en complacencia.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/08/MeditacionShaktiananda-2024-08-01.jpg",
    slug: "preservate-integro"
  },
  {
    id: 87,
    title: "Esta vida para este encuentro",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-07-25",
    excerpt: "Permíteme un juego: abrirás brevemente los ojos.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/07/MeditacionShaktiananda-2024-07-25.jpg",
    slug: "esta-vida-para-este-encuentro"
  },
  {
    id: 88,
    title: "Todo lo que crees existe, no es",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-07-18",
    excerpt: "Búscate hasta que te encuentres respirando plácidamente.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/07/MeditacionShaktiananda-2024-07-18.jpg",
    slug: "todo-lo-que-crees-existe-no-es"
  },
  {
    id: 89,
    title: "Hago una proclama eterna",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-07-11",
    excerpt: "Atiende tu respiro con profunda concentración.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/07/MeditacionShaktiananda-2024-07-11.jpg",
    slug: "hago-una-proclama-eterna"
  },
  {
    id: 90,
    title: "Ejerce el poder de amarte",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-07-04",
    excerpt: "Atiende tu respiro, céntrate ahí y observa cómo respiras.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/07/MeditacionShaktiananda-2024-07-04.jpg",
    slug: "ejerce-el-poder-de-amarte"
  },
  {
    id: 91,
    title: "Renuncia al desamor",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-06-27",
    excerpt: "Respira sosegada y profundamente, a tu aire, en tus tiempos.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/06/MeditacionShaktiananda-2024-06-27.jpg",
    slug: "renuncia-al-desamor"
  },
  {
    id: 92,
    title: "Si te atreves, te liberas",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-06-20",
    excerpt: "Te vas aquietando con lo que tu respiro es.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/06/MeditacionShaktiananda-2024-06-20.jpg",
    slug: "si-te-atreves-te-liberas"
  },
  {
    id: 93,
    title: "Madre, hago presencia en ti",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-06-13",
    excerpt: "Ratifícate haciendo presencia con tu respiro consciente.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/06/MeditacionShaktiananda-2024-06-13.jpg",
    slug: "madre-hago-presencia-en-ti"
  },
  {
    id: 94,
    title: "Me brindo mi respiro y mi amor",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-06-06",
    excerpt: "Tu confianza en tu respiro, en lo fluido, en lo constante.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/06/MeditacionShaktiananda-2024-06-06.jpg",
    slug: "me-brindo-mi-respiro-y-mi-amor"
  },
  {
    id: 95,
    title: "Quiero quererme, necesito quererme",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-05-30",
    excerpt: "Atiende tu respiro, que lo único que te ocupe sea ese respirar.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/05/MeditacionShaktiananda-2024-05-30.jpg",
    slug: "quiero-quererme-necesito-quererme"
  },
  {
    id: 96,
    title: "Mi propuesta es amar",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-05-23",
    excerpt: "Empieza tus respiros, consciente como eres, presente como estás.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/05/MeditacionShaktiananda-2024-05-23.jpg",
    slug: "mi-propuesta-es-amar"
  },
  {
    id: 97,
    title: "Decide. Tu luz es posible",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-05-16",
    excerpt: "Es tan simple lo que tienes que hacer, saber estar ahí.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/05/MeditacionShaktiananda-2024-05-16.jpg",
    slug: "decide-tu-luz-es-posible"
  },
  {
    id: 98,
    title: "Ríndete y produce lo que eres: luz y verdad",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-05-09",
    excerpt: "En cualquier parte que esté, desde donde quiera que te hable.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/05/MeditacionShaktiananda-2024-05-09.jpg",
    slug: "rindete-y-produce-lo-que-eres-luz-y-verdad"
  },
  {
    id: 99,
    title: "Arde en luz, siempre en luz",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-05-02",
    excerpt: "Concéntrate en respirar, apartando pensamientos, remembranzas.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/05/MeditacionShaktiananda-2024-05-02.jpg",
    slug: "arde-en-luz-siempre-en-luz"
  },
  {
    id: 100,
    title: "A amar se aprende",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-04-25",
    excerpt: "Por el día, haz un recorrido interno, desde tus circuitos de luz.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/04/MeditacionShaktiananda-2024-04-25.jpg",
    slug: "a-amar-se-aprende"
  },
  {
    id: 101,
    title: "Aprecia tus latidos y libera amor",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-04-18",
    excerpt: "Notifica tu presencia, hazte saber que estás aquí.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/04/MeditacionShaktiananda-2024-04-18.jpg",
    slug: "aprecia-tus-latidos-y-libera-amor"
  },
  {
    id: 102,
    title: "Tu fruto más preciado es tu verdad",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-04-11",
    excerpt: "Respira con serenidad y pulcritud. Que cada respiro sea consciente.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/04/MeditacionShaktiananda-2024-04-11.jpg",
    slug: "tu-fruto-mas-preciado-es-tu-verdad"
  },
  {
    id: 103,
    title: "Meditar es la acción más sublime",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-04-04",
    excerpt: "¿Qué deberías considerar cuando estás así, cuando te sientes así?",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/04/MeditacionShaktiananda-2024-04-04.jpg",
    slug: "meditar-es-la-accion-mas-sublime"
  },
  {
    id: 104,
    title: "En este mundo haz el bien y aprende a amar",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-03-28",
    excerpt: "Observa bien con cuál disposición llegas aquí. ¿Qué te trae?",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/03/MeditacionShaktiananda-2024-03-28.jpg",
    slug: "en-este-mundo-haz-el-bien-y-aprende-a-amar"
  },
  {
    id: 105,
    title: "Guárdate para tu último respiro",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-03-21",
    excerpt: "Te concentras, haciendo cada respiro como si fuese el primero.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/03/MeditacionShaktiananda-2024-03-21.jpg",
    slug: "guardate-para-tu-ultimo-respiro"
  },
  {
    id: 106,
    title: "Expón tu sombra para no perderte",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-03-14",
    excerpt: "Hazte un espacio de fuerza y energía propia.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/03/MeditacionShaktiananda-2024-03-14.jpg",
    slug: "expon-tu-sombra-para-no-perderte"
  },
  {
    id: 107,
    title: "Te juegas la vida para ganar en luz",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-03-07",
    excerpt: "Hazte presente respirando, donde quiera que estés.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/03/MeditacionShaktiananda-2024-03-07.jpg",
    slug: "te-juegas-la-vida-para-ganar-en-luz"
  },
  {
    id: 108,
    title: "Eres la expresión pura del Ser",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-02-29",
    excerpt: "Alcanza cada respiro y, que te alcance, para que puedas gestionar todos tus fluidos internos.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/02/MeditacionShaktiananda-2024-02-29.jpg",
    slug: "eres-la-expresion-pura-del-ser"
  },
  {
    id: 109,
    title: "Sé que puedo. Sé que estoy. Sé que soy",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-02-22",
    excerpt: "Visualízate desde muy adentro, estando ahí. Visualiza tu figura, tu postura.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/02/MeditacionShaktiananda-2024-02-22.jpg",
    slug: "se-que-puedo-se-que-estoy-se-que-soy"
  },
  {
    id: 110,
    title: "Silencios que liberan. Silencios que condenan",
    subtitle: "Meditación con Mataji Shaktiananda",
    dateString: "2024-02-15",
    excerpt: "Hazte en tu atención, como debería ser siempre en un momento así.",
    imageUrl: "https://shaktianandama.com/wp-content/uploads/2024/02/MeditacionShaktiananda-2024-02-15.jpg",
    slug: "silencios-que-liberan-silencios-que-condenan"
  }
];

export function getMeditationsByYear(): Record<number, Meditation[]> {
  const byYear: Record<number, Meditation[]> = {};
  
  meditations.forEach(meditation => {
    const year = parseInt(meditation.dateString.split('-')[0]);
    if (!byYear[year]) {
      byYear[year] = [];
    }
    byYear[year].push(meditation);
  });
  
  // Sort meditations within each year by date (newest first)
  Object.keys(byYear).forEach(year => {
    byYear[Number(year)].sort((a, b) => b.dateString.localeCompare(a.dateString));
  });
  
  return byYear;
}

export function getYears(): number[] {
  const years = [...new Set(meditations.map(m => parseInt(m.dateString.split('-')[0])))];
  return years.sort((a, b) => b - a);
}
