export const motivationalQuotes = [
  "Tu cuerpo puede hacerlo. Es tu mente la que necesitas convencer.",
  "El progreso, no la perfección, es la meta.",
  "Cada entrenamiento te acerca a tu mejor versión.",
  "La disciplina es hacer lo que necesitas hacer, incluso cuando no quieres hacerlo.",
  "No busques excusas, busca resultados.",
  "Tu único límite eres tú mismo.",
  "El dolor de hoy es la fuerza de mañana.",
  "Invierte en tu cuerpo, es el único lugar que tienes para vivir.",
  "La constancia vence al talento cuando el talento no es constante.",
  "Cada día es una nueva oportunidad para ser mejor.",
  "No se trata de ser perfecto, se trata de ser mejor que ayer.",
  "La transformación comienza con el primer paso.",
  "Tu futuro yo te agradecerá por empezar hoy.",
  "La salud es riqueza real, no piezas de oro y plata.",
  "Fortalece tu cuerpo, fortalece tu mente.",
];

export const getRandomQuote = (): string => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};