// Políticas, páginas de ayuda, cookies y reseñas (se combinan con es.js).
const extra = {
  meta: { adminReviews: { title: "Reseñas · Admin" } },

  auth: { welcomeBackName: "¡Hola de nuevo, {name}!", welcomeAdmin: "¡Bienvenido de nuevo, admin!" },

  footer: { company: "Empresa", legal: "Legal", cookieSettings: "Configurar cookies", rights: "Todos los derechos reservados." },

  cookies: {
    title: "Tu privacidad nos importa",
    text: "Usamos cookies para mantener tu sesión, recordar tu bolsa y tu idioma y, con tu permiso, entender cómo se usa la tienda.",
    learnMore: "Política de cookies",
    acceptAll: "Aceptar todo",
    decline: "Rechazar",
    customize: "Personalizar",
    settingsTitle: "Preferencias de cookies",
    settingsText: "Elige qué cookies podemos usar. Puedes cambiarlo cuando quieras desde el pie de página.",
    save: "Guardar preferencias",
    necessary: { title: "Estrictamente necesarias", text: "Inicio de sesión, seguridad, tu bolsa y tu idioma. Siempre activas." },
    analytics: { title: "Analíticas", text: "Estadísticas anónimas que nos ayudan a mejorar la tienda." },
    marketing: { title: "Marketing", text: "Ofertas personalizadas y medición de nuestras campañas." },
  },

  reviews: {
    title: "Opiniones de clientes",
    count: { one: "Basado en {count} opinión", other: "Basado en {count} opiniones" },
    write: "Escribe una opinión",
    signIn: "para escribir una opinión.",
    rating: "Tu valoración",
    titleLabel: "Título",
    titlePlaceholder: "Resúmelo en pocas palabras",
    body: "Tu opinión",
    bodyPlaceholder: "¿Qué te gustó? ¿Qué tal la talla y la calidad?",
    submit: "Publicar opinión",
    thanks: "¡Gracias por tu opinión!",
    empty: "Aún no hay opiniones: sé el primero en compartir la tuya.",
    alreadyReviewed: "Ya has opinado sobre este producto. ¡Gracias!",
    deleteTitle: "¿Eliminar opinión?",
    deleteText: "Esta opinión se quitará de la página del producto.",
  },

  validation: { rating: "Elige una valoración.", reviewLong: "La opinión debe tener 1000 caracteres como máximo." },

  errors: {
    tooManyRequests: "Demasiados intentos. Espera un momento y vuelve a intentarlo.",
    alreadyReviewed: "Ya has opinado sobre este producto.",
    trackNotFound: "No encontramos ningún pedido con ese número y correo.",
  },

  admin: {
    nav: { reviews: "Opiniones" },
    products: { noCategory: "Sin categoría" },
    reviews: { text: "Lo que dicen los clientes. Elimina cualquier contenido inapropiado.", all: { one: "{count} opinión", other: "{count} opiniones" }, empty: "Aún no hay opiniones" },
  },

  pages: {
    lastUpdated: "Última actualización: {date}",
    trackOrder: {
      title: "Seguimiento de pedido",
      description: "Consulta el estado de un pedido de Wear Zara con tu número de pedido y tu correo.",
      intro: "Introduce el número de pedido de tu confirmación (empieza por WZ-) y el correo que usaste al comprar.",
      number: "Número de pedido",
      submit: "Consultar",
    },
    shipping: {
      title: "Envíos y entregas",
      description: "Plazos, costes y cómo enviamos tu pedido de Wear Zara.",
      intro: "Cada pedido se prepara con cuidado en nuestro estudio. El envío es gratis en pedidos superiores a {amount}.",
      sections: [
        { title: "Costes de envío", body: "Los pedidos superiores a {amount} se envían gratis. Por debajo, se aplica una tarifa fija de {fee}, sea cual sea el tamaño del pedido." },
        { title: "Plazos de entrega", body: "Los pedidos realizados antes de las 14:00 salen el mismo día laborable. La mayoría llegan en 2–4 días laborables." },
        { title: "Seguimiento", body: "Sigue cada paso desde tu cuenta, en Pedidos, o en la página de seguimiento con tu número de pedido y correo." },
        { title: "Pago contra reembolso", body: "Paga en efectivo al recibir el paquete; ten preparado el importe exacto para el repartidor." },
        { title: "Entrega fallida", body: "Si no estás en casa, el repartidor te llamará y volverá a intentarlo el siguiente día laborable." },
      ],
    },
    returns: {
      title: "Devoluciones y reembolsos",
      description: "Cómo devolver un artículo y cuándo recibirás tu dinero.",
      intro: "¿No te convence? Devuelve cualquier artículo sin usar en los {days} días siguientes a la entrega y te reembolsamos el importe completo.",
      sections: [
        { title: "Qué se puede devolver", body: "Los artículos deben estar sin usar, sin lavar y con sus etiquetas. Por higiene, el baño y la ropa interior solo se aceptan con el precinto intacto." },
        { title: "Cómo devolver", body: "Escríbenos con tu número de pedido y los artículos que quieres devolver. Organizaremos una recogida gratuita en tu dirección." },
        { title: "Reembolsos", body: "Cuando recibimos tu devolución, la revisamos en 2 días y te reembolsamos en un máximo de 7 días." },
        { title: "Cambios", body: "¿Necesitas otra talla? Indícalo al contactarnos y te enviaremos la nueva en cuanto recojamos la devolución." },
        { title: "Artículos dañados o erróneos", body: "Si algo llega dañado o no es lo que pediste, avísanos en 48 horas y lo solucionaremos sin coste." },
      ],
    },
    sizeGuide: {
      title: "Guía de tallas",
      description: "Encuentra tu talla ideal con nuestras tablas para mujer y hombre.",
      intro: "Todas las medidas son corporales y en centímetros. Si estás entre dos tallas, te recomendamos la mayor.",
      table: { women: "Mujer", men: "Hombre", size: "Talla", chest: "Pecho (cm)", waist: "Cintura (cm)", hips: "Cadera (cm)" },
      sections: [
        { title: "Pecho", body: "Mide alrededor de la parte más ancha del pecho, con la cinta horizontal bajo los brazos." },
        { title: "Cintura", body: "Mide alrededor de tu cintura natural, la parte más estrecha del torso." },
        { title: "Cadera", body: "Con los pies juntos, mide alrededor de la parte más ancha de la cadera." },
        { title: "¿Tienes dudas?", body: "Nuestro equipo te ayuda a elegir: escribe a {email} con tus medidas." },
      ],
    },
    careers: {
      title: "Empleo",
      description: "Únete al equipo de Wear Zara.",
      intro: "Somos un equipo pequeño creando una forma mejor de comprar moda. Si te encantan los buenos productos y cuidas los detalles, queremos conocerte.",
      openRoles: "Puestos abiertos",
      roles: [
        { title: "Ingeniero/a frontend sénior", team: "Ingeniería", location: "Remoto" },
        { title: "Comprador/a de moda — Mujer", team: "Producto", location: "Londres" },
        { title: "Especialista en atención al cliente", team: "Soporte", location: "Lahore" },
        { title: "Fotógrafo/a de contenido", team: "Creativo", location: "Londres" },
      ],
      sections: [
        { title: "Cómo trabajamos", body: "Equipos pequeños, objetivos claros y mucha autonomía. La mayoría de puestos pueden ser en remoto." },
        { title: "Beneficios", body: "Salario competitivo, presupuesto generoso para ropa, horario flexible y 30 días de vacaciones pagadas." },
        { title: "¿No ves tu puesto?", body: "Envía tu CV y una breve nota a careers@wearzara.com: siempre nos alegra conocer a gente con talento." },
      ],
    },
    privacy: {
      title: "Política de privacidad",
      description: "Cómo Wear Zara recoge, usa y protege tus datos personales.",
      intro: "Tu privacidad nos importa. Esta política explica qué datos recogemos, para qué y qué opciones tienes.",
      sections: [
        { title: "Qué recogemos", body: "Datos de la cuenta (nombre, correo y contraseña guardada como hash seguro), datos de entrega del pago, tus pedidos, bolsa y favoritos, opiniones y mensajes que nos envías." },
        { title: "Para qué los usamos", body: "Para procesar y entregar pedidos, sincronizar tu cuenta y tu bolsa, responder a tus consultas y, solo si lo aceptas, enviarte ofertas." },
        { title: "Con quién los compartimos", body: "Solo con los transportistas y proveedores necesarios para operar la tienda. Nunca vendemos tus datos." },
        { title: "Cuánto tiempo los guardamos", body: "Los datos de la cuenta se guardan hasta que la eliminas. Al eliminar tu cuenta también se elimina tu historial de pedidos." },
        { title: "Tus derechos", body: "Puedes ver y actualizar tus datos en tu cuenta, eliminarla cuando quieras y escribir a {email} para cualquier solicitud de privacidad." },
        { title: "Seguridad", body: "Las contraseñas se cifran con bcrypt, las conexiones están cifradas y solo los administradores pueden acceder a los datos de clientes." },
      ],
    },
    terms: {
      title: "Términos del servicio",
      description: "Las condiciones que se aplican al usar Wear Zara.",
      intro: "Al usar Wear Zara aceptas estas condiciones. Léelas con atención.",
      sections: [
        { title: "Tu cuenta", body: "Mantén tu contraseña en secreto y tus datos actualizados. Eres responsable de la actividad de tu cuenta." },
        { title: "Pedidos y precios", body: "Los precios se muestran en dólares estadounidenses. Un pedido se confirma cuando recibes su número. Podemos cancelar pedidos afectados por errores de precio evidentes." },
        { title: "Pago", body: "Por ahora los pedidos se pagan contra reembolso. Pronto añadiremos el pago con tarjeta." },
        { title: "Cupones", body: "Los cupones no se canjean por dinero, pueden tener gasto mínimo y límite de usos, y pueden retirarse en cualquier momento." },
        { title: "Opiniones", body: "Las opiniones deben ser sinceras y respetuosas. Podemos eliminar las ofensivas, engañosas o ajenas al producto." },
        { title: "Responsabilidad", body: "Hacemos lo posible por mantener la tienda correcta y disponible, pero no podemos garantizar que esté siempre libre de errores." },
      ],
    },
    cookies: {
      title: "Política de cookies",
      description: "Qué cookies usa Wear Zara y cómo controlarlas.",
      intro: "Las cookies son pequeños archivos guardados en tu navegador. Así las usamos y así puedes cambiar tu elección.",
      sections: [
        { title: "Estrictamente necesarias", body: "Mantienen tu sesión, protegen los formularios y recuerdan tu bolsa, idioma y tema. No se pueden desactivar." },
        { title: "Analíticas", body: "Nos ayudan a saber qué páginas son populares para mejorar la tienda. Solo se usan si las permites." },
        { title: "Marketing", body: "Se usan para mostrarte ofertas relevantes. Solo se usan si las permites." },
        { title: "Cambiar tu elección", body: "Usa «Configurar cookies» en el pie de página cuando quieras o borra las cookies desde tu navegador." },
      ],
    },
  },
};

export default extra;
