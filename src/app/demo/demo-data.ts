import { Categoria, CursoDetalle } from '../models/curso';
import { Pagina } from '../models/pagina';
import { RespuestaDetalle } from '../models/respuesta';
import { StatusTopico, TopicoDetalle, TopicoResumen } from '../models/topico';
import { LoginRequest, Perfil, UsuarioDetalle, UsuarioRegistroRequest } from '../models/usuario';

interface RespuestaDemo {
  id: number;
  mensaje: string;
  fechaCreacion: string;
  autorId: number;
  solucion: boolean;
}

interface TopicoDemo {
  id: number;
  titulo: string;
  mensaje: string;
  fechaCreacion: string;
  status: StatusTopico;
  autorId: number;
  cursoId: number;
  respuestas: RespuestaDemo[];
}

function horaDesdeAhora(horasAtras: number): string {
  return new Date(Date.now() - horasAtras * 60 * 60 * 1000).toISOString();
}

const cursos: CursoDetalle[] = [
  { id: 1, nombre: 'Spring Boot: Fundamentos', categoria: 'BACKEND', activo: true },
  { id: 2, nombre: 'Angular: Componentes Avanzados', categoria: 'FRONTEND', activo: true },
  { id: 3, nombre: 'JavaScript para Principiantes', categoria: 'FRONTEND', activo: true },
  { id: 4, nombre: 'Docker y Contenedores', categoria: 'DEVOPS', activo: true },
  { id: 5, nombre: 'CI/CD con GitHub Actions', categoria: 'DEVOPS', activo: true },
  { id: 6, nombre: 'PostgreSQL en producción', categoria: 'BACKEND', activo: true },
  { id: 7, nombre: 'React Native: Tu primera app', categoria: 'MOBILE', activo: true },
  { id: 8, nombre: 'Machine Learning con Python', categoria: 'IA', activo: true },
  { id: 9, nombre: 'Arquitectura REST con Spring', categoria: 'BACKEND', activo: true },
  { id: 10, nombre: 'Tailwind CSS en la práctica', categoria: 'FRONTEND', activo: true },
  { id: 11, nombre: 'Arquitectura Hexagonal', categoria: 'BACKEND', activo: true },
  { id: 12, nombre: 'IA Generativa: Fundamentos', categoria: 'IA', activo: true },
];

const usuarios: UsuarioDetalle[] = [
  { id: 1, nombre: 'Daniel Herrera', email: 'demo@forohub.com', perfil: 'ADMIN', activo: true, avatarUrl: null, fechaIngreso: '2024-11-03' },
  { id: 2, nombre: 'María González', email: 'maria.gonzalez@example.com', perfil: 'ESTUDIANTE', activo: true, avatarUrl: null, fechaIngreso: '2025-02-19' },
  { id: 3, nombre: 'Carlos Pérez', email: 'carlos.perez@example.com', perfil: 'MODERADOR', activo: true, avatarUrl: null, fechaIngreso: '2025-01-08' },
  { id: 4, nombre: 'Lucía Fernández', email: 'lucia.fernandez@example.com', perfil: 'ESTUDIANTE', activo: true, avatarUrl: null, fechaIngreso: '2025-06-30' },
  { id: 5, nombre: 'Jorge Ramírez', email: 'jorge.ramirez@example.com', perfil: 'ESTUDIANTE', activo: true, avatarUrl: null, fechaIngreso: '2025-04-12' },
  { id: 6, nombre: 'Ana Torres', email: 'ana.torres@example.com', perfil: 'MODERADOR', activo: true, avatarUrl: null, fechaIngreso: '2024-12-22' },
  { id: 7, nombre: 'Diego Sánchez', email: 'diego.sanchez@example.com', perfil: 'ESTUDIANTE', activo: true, avatarUrl: null, fechaIngreso: '2025-05-05' },
  { id: 8, nombre: 'Valentina Ríos', email: 'valentina.rios@example.com', perfil: 'ESTUDIANTE', activo: true, avatarUrl: null, fechaIngreso: '2025-07-14' },
  { id: 9, nombre: 'Ricardo Mendoza', email: 'ricardo.mendoza@example.com', perfil: 'ESTUDIANTE', activo: true, avatarUrl: null, fechaIngreso: '2025-03-03' },
  { id: 10, nombre: 'Sofía Castillo', email: 'sofia.castillo@example.com', perfil: 'ESTUDIANTE', activo: true, avatarUrl: null, fechaIngreso: '2025-08-09' },
  { id: 11, nombre: 'Emilio Vargas', email: 'emilio.vargas@example.com', perfil: 'MODERADOR', activo: true, avatarUrl: null, fechaIngreso: '2024-10-17' },
  { id: 12, nombre: 'Camila Núñez', email: 'camila.nunez@example.com', perfil: 'ESTUDIANTE', activo: true, avatarUrl: null, fechaIngreso: '2025-09-02' },
  { id: 13, nombre: 'Mateo Aguirre', email: 'mateo.aguirre@example.com', perfil: 'ESTUDIANTE', activo: true, avatarUrl: null, fechaIngreso: '2025-06-11' },
  { id: 14, nombre: 'Renata Duarte', email: 'renata.duarte@example.com', perfil: 'ESTUDIANTE', activo: true, avatarUrl: null, fechaIngreso: '2025-08-25' },
];

const topicos: TopicoDemo[] = [
  {
    id: 1,
    titulo: '¿Cómo manejar correctamente los errores de validación en Spring Boot?',
    mensaje:
      'Estoy construyendo una API REST y al lanzar una excepción de validación mi cliente recibe un formato poco amigable.\n\n¿Cuál es la forma más limpia de devolver un cuerpo de error estandarizado con @RestControllerAdvice? He visto ejemplos con ResponseEntityExceptionHandler pero no sé si es la mejor opción para un proyecto nuevo.',
    fechaCreacion: horaDesdeAhora(2),
    status: 'ABIERTO',
    autorId: 1,
    cursoId: 9,
    respuestas: [
      { id: 1, mensaje: 'Usa @RestControllerAdvice con ResponseEntityExceptionHandler y sobreescribe handlerMethodArgumentNotValid. Devuelve una estructura {timestamp, status, error, campos} que el frontend pueda leer campo por campo.', autorId: 2, fechaCreacion: horaDesdeAhora(1.6), solucion: true },
      { id: 2, mensaje: 'Complemento: en el frontend también puedes mostrar directamente el mensaje del primer error del mapa "campos" para no marear al usuario.', autorId: 6, fechaCreacion: horaDesdeAhora(1.1), solucion: false },
      { id: 3, mensaje: 'Y recuerda capturar también MethodArgumentTypeMismatchException, que es la que más se le escapa a la gente y devuelve 500 en vez de 400.', autorId: 3, fechaCreacion: horaDesdeAhora(0.8), solucion: false },
    ],
  },
  {
    id: 2,
    titulo: 'Diferencia entre @Component, @Service y @Repository',
    mensaje:
      'Sé que los tres son estereotipos de Spring, pero me cuesta decidir cuándo usar cada uno en un proyecto real.\n\n¿Es solo una cuestión semántica o hay diferencias técnicas que afecten al comportamiento (traducción de excepciones, proxys, etc.)?',
    fechaCreacion: horaDesdeAhora(22),
    status: 'RESUELTO',
    autorId: 2,
    cursoId: 1,
    respuestas: [
      { id: 4, mensaje: '@Repository registra además la traducción de excepciones de persistencia a DataAccessException. @Service solo marca la capa de negocio. Usa @Component solo para utilidades genéricas sin capa clara.', autorId: 1, fechaCreacion: horaDesdeAhora(21), solucion: true },
      { id: 5, mensaje: 'Y el escaneo de componentes trata los tres igual: puedes inyectar cualquier estereotipo sin problema. Lo que sí cambia es el "@aliasFor" de la anotación base y el componente que resuelve el proxy.', autorId: 5, fechaCreacion: horaDesdeAhora(19), solucion: false },
    ],
  },
  {
    id: 3,
    titulo: 'Carga perezosa de páginas con componentes standalone en Angular',
    mensaje:
      'Vengo de proyectos con NgModules y ahora todos mis componentes son standalone.\n\n¿Cómo debo estructurar las rutas para que se cargue perezosamente una pantalla completa con varios componentes? ¿Sigue haciendo falta un módulo de routing?',
    fechaCreacion: horaDesdeAhora(8),
    status: 'ABIERTO',
    autorId: 4,
    cursoId: 2,
    respuestas: [
      { id: 6, mensaje: 'Con loadComponent en las rutas solo se descarga la página; si quieres agrupar varias rutas usa loadChildren + canMatch, o simplemente un objeto de rutas con component y children. Los componentes standalone anidan sin módulos.', autorId: 3, fechaCreacion: horaDesdeAhora(5), solucion: false },
      { id: 7, mensaje: 'Ojo con las guardas: en rutas standalone usa canActivateFn en vez de clases; el árbol de dependencias se resuelve con inject() dentro de la función.', autorId: 1, fechaCreacion: horaDesdeAhora(3), solucion: false },
    ],
  },
  {
    id: 4,
    titulo: '¿Cuándo usar Reactive Forms en vez de template-driven?',
    mensaje:
      'Llevo un tiempo usando formularios con ngModel y me parecen cómodos, pero el equipo propone migrar a Reactive Forms.\n\n¿En qué casos realmente se nota la diferencia y cuál recomiendan para un formulario largo con validación dinámica?',
    fechaCreacion: horaDesdeAhora(49),
    status: 'RESUELTO',
    autorId: 3,
    cursoId: 2,
    respuestas: [
      { id: 8, mensaje: 'Validación dinámica y formularios anidados: sí, Reactive Forms. El control programático, el testing y el FormArray no existen de forma cómoda con template-driven.', autorId: 1, fechaCreacion: horaDesdeAhora(47), solucion: true },
      { id: 9, mensaje: 'Si el formulario tiene lógica cruzada entre campos (p. ej. validar dos contraseñas), Reactive Forms te deja hacer validators a nivel de FormGroup que en template-driven son un dolor.', autorId: 4, fechaCreacion: horaDesdeAhora(44), solucion: false },
    ],
  },
  {
    id: 5,
    titulo: 'Límite de memoria en Docker para una API Java 21',
    mensaje:
      'Al ejecutar mi contenedor de la API con -Xmx256m a veces el proceso termina con OOMKilled a pesar de que el heap nunca llega a ese límite.\n\n¿Qué ajustes de contenedor y de JVM debería revisar? He oído que los límites de cgroup afectan a Java.',
    fechaCreacion: horaDesdeAhora(75),
    status: 'ABIERTO',
    autorId: 5,
    cursoId: 4,
    respuestas: [
      { id: 10, mensaje: 'Java puede usar memoria fuera del heap (metaspace, threads, JIT). Deja -XX:MaxRAMPercentage=75 para que la JVM respete el cgroup y reserva un margen de overhead en el límite de Docker.', autorId: 6, fechaCreacion: horaDesdeAhora(70), solucion: false },
      { id: 11, mensaje: 'Además, si usas Buildpacks o la imagen base de Eclipse Temurin, verifica el UseContainerSupport: a veces los flags -Xmx antiguos en el Dockerfile saltan el ajuste automático.', autorId: 11, fechaCreacion: horaDesdeAhora(66), solucion: false },
    ],
  },
  {
    id: 6,
    titulo: 'GitHub Actions: cachear dependencias y acelerar los builds',
    mensaje:
      'Mis pipelines tardan mucho porque cada run vuelve a instalar dependencias. Estoy usando npm ci y un job estándar para Angular.\n\n¿Cuál es la práctica recomendada para cachear dependencias y la salida de build de forma segura?',
    fechaCreacion: horaDesdeAhora(120),
    status: 'RESUELTO',
    autorId: 6,
    cursoId: 5,
    respuestas: [
      { id: 12, mensaje: 'Usa la action setup-node con cache: "npm", que ya gestiona el cache de ~/.npm. La clave del lockfile hace que npm ci siga siendo la mejor opción para reproducibilidad.', autorId: 1, fechaCreacion: horaDesdeAhora(118), solucion: true },
      { id: 13, mensaje: 'Y recuerda invalidar el cache cuando cambies la versión de Node: la clave debe incluirla, si no tendrás caches cruzados "mágicos".', autorId: 7, fechaCreacion: horaDesdeAhora(115), solucion: false },
    ],
  },
  {
    id: 7,
    titulo: 'Índices en PostgreSQL: ¿cómo elegir las columnas correctas?',
    mensaje:
      'Tengo una tabla con millones de filas y las consultas empiezan a ir lentas. Estoy tentado a crear muchos índices, pero leí que también frenan los INSERT.\n\n¿Cómo identifico qué consultas justifican un índice sin caer en el sobre-índice?',
    fechaCreacion: horaDesdeAhora(30),
    status: 'ABIERTO',
    autorId: 1,
    cursoId: 6,
    respuestas: [
      { id: 14, mensaje: 'Mira el plan con EXPLAIN ANALYZE y busca "Seq Scan" en tablas grandes. Un índice compuesto bien pensado en las columnas del WHERE suele bastar; deja que EXPLAIN valide cada candidato.', autorId: 2, fechaCreacion: horaDesdeAhora(28), solucion: false },
      { id: 15, mensaje: 'Cuidado con los índices parciales: si filtras siempre por activo=true, un índice WHERE activo es muchísimo más barato de mantener.', autorId: 6, fechaCreacion: horaDesdeAhora(26), solucion: false },
    ],
  },
  {
    id: 8,
    titulo: 'Consumir una API REST desde React Native sin librerías pesadas',
    mensaje:
      'Vengo del mundo web y me choca que en RN no exista un cliente HTTP estándar salvo fetch.\n\n¿Merece la pena añadir axios o algo como react-query para una app pequeña? Quiero minimizar el package.json.',
    fechaCreacion: horaDesdeAhora(150),
    status: 'CERRADO',
    autorId: 8,
    cursoId: 7,
    respuestas: [
      { id: 16, mensaje: 'fetch nativo cubre el 90% de los casos. Añade axios solo si necesitas interceptores avanzados o ya lo usas en el equipo.', autorId: 3, fechaCreacion: horaDesdeAhora(140), solucion: false },
    ],
  },
  {
    id: 9,
    titulo: 'Empezando con Python para Machine Learning tras años de Java',
    mensaje:
      'Vengo de un perfil backend en Java y quiero migrar a ML. He visto que todo es Python: pandas, scikit-learn, PyTorch.\n\n¿Qué ruta me recomiendan? ¿Debo dominar el lenguaje a fondo o basta con el ecosistema de Data Science?',
    fechaCreacion: horaDesdeAhora(200),
    status: 'ABIERTO',
    autorId: 2,
    cursoId: 8,
    respuestas: [
      { id: 17, mensaje: 'No necesitas dominar Python: conoce tipos, listas/dicts, funciones y comprehensions. El 80% del tiempo irás en pandas y scikit-learn. Haz un mini-proyecto de clasificación para anclar todo.', autorId: 8, fechaCreacion: horaDesdeAhora(190), solucion: true },
      { id: 18, mensaje: 'Ojo: no apliques patrones de Java 1:1 (un objeto por "clase"). En notebooks el estilo es mucho más imperativo y exploratorio.', autorId: 10, fechaCreacion: horaDesdeAhora(180), solucion: false },
    ],
  },
  {
    id: 10,
    titulo: 'Versionar una API REST sin romper a los consumidores',
    mensaje:
      'Estructuro la API como /api/v1/... pero cambiar el contrato de un recurso me obliga a decidir rápido: ¿versiono en la URL o uso headers?\n\nBusco la opción más pragmática para una API interna en una empresa mediana.',
    fechaCreacion: horaDesdeAhora(25),
    status: 'ABIERTO',
    autorId: 1,
    cursoId: 9,
    respuestas: [
      { id: 19, mensaje: 'Para API interna, versión en la URL es la más pragmática: visible, cacheable y sin complicar al cliente. Los headers tipo Accept solo los veo para cosas muy públicas y estables.', autorId: 6, fechaCreacion: horaDesdeAhora(20), solucion: false },
      { id: 20, mensaje: 'Y si puedes, "evolve, don\'t version": añade campos con defaults, deprecaciones y un changelog. Versionar para siempre multiplica el coste de mantenimiento.', autorId: 1, fechaCreacion: horaDesdeAhora(18), solucion: false },
    ],
  },
  {
    id: 11,
    titulo: '¿Tailwind CSS o CSS puro? Experiencia real en producción',
    mensaje:
      'En un proyecto con varios desarrolladores la hoja de estilos terminó siendo un caos de clases y !important.\n\n¿Merece la pena migrar a Tailwind v4 en un proyecto Angular existente? Cuenten su experiencia real, pros y contras.',
    fechaCreacion: horaDesdeAhora(260),
    status: 'RESUELTO',
    autorId: 7,
    cursoId: 10,
    respuestas: [
      { id: 21, mensaje: 'Sí, y en Angular 21 la integración con Vite es de un solo archivo. La clave es definir bien tu design system en @theme para que el equipo no invente valores nuevos.', autorId: 1, fechaCreacion: horaDesdeAhora(250), solucion: true },
      { id: 22, mensaje: 'Ojo con las clases responsivas: acostumbra al equipo a mobile-first, porque al inicio es fácil escribir desktop-first y luego emparchar con breakpoints invertidos.', autorId: 5, fechaCreacion: horaDesdeAhora(240), solucion: false },
    ],
  },
  {
    id: 12,
    titulo: 'JWT desde cero con Spring Security 6: el filtro que se me escapa',
    mensaje:
      'Configuro la cadena de Spring Security 6 con un filtro JWT propio y, aunque valido el token perfectamente, a veces se pierde el contexto de autenticación en rutas públicas.\n\n¿Dónde suele estar el error típico al encadenar filtros en esta versión?',
    fechaCreacion: horaDesdeAhora(100),
    status: 'ABIERTO',
    autorId: 1,
    cursoId: 1,
    respuestas: [
      { id: 23, mensaje: 'Recuerda que SecurityContextHolderFilter en la 6.3+ es el responsable de limpiar el contexto por request. No instancies el filtro como bean dos veces, y ponlo tras UsernamePasswordAuthenticationFilter. Traza la cadena con un logger en DEBUG.', autorId: 3, fechaCreacion: horaDesdeAhora(95), solucion: false },
      { id: 24, mensaje: 'Un clásico: permitir todos en /public con permitAll pero que el SecurityFilterChain haga authentication entry point y devuelva 403. Verifica también que no tenga dos cadenas compitiendo por el mismo matcher.', autorId: 11, fechaCreacion: horaDesdeAhora(90), solucion: false },
    ],
  },
  {
    id: 13,
    titulo: 'Migrar un monolito a arquitectura hexagonal sin reescribirlo',
    mensaje:
      'El proyecto creció hasta volverse difícil de testear: todo depende de la base de datos y de librerías externas.\n\n¿Por dónde empezar una adopción gradual de puertos y adaptadores manteniendo la app en producción a diario?',
    fechaCreacion: horaDesdeAhora(300),
    status: 'ABIERTO',
    autorId: 9,
    cursoId: 11,
    respuestas: [
      { id: 25, mensaje: 'Empieza por extraer las reglas de negocio a casos de uso puros con interfaces (puertos) y mueve los frameworks a la periferia. Hazlo paquete a paquete sin tocar el dominio.', autorId: 1, fechaCreacion: horaDesdeAhora(290), solucion: false },
      { id: 26, mensaje: 'Añade tests de contrato entre puerto y adaptador; así romper el acoplamiento sale barato. Y no migres los bundles de infraestructura de golpe.', autorId: 2, fechaCreacion: horaDesdeAhora(280), solucion: false },
    ],
  },
  {
    id: 14,
    titulo: 'RAG sencillo: cómo alimentar un modelo con documentos propios',
    mensaje:
      'Quiero que un LLM responda preguntas sobre la documentación interna de la empresa sin reentrenar.\n\n¿Cuál es el flujo mínimo de Retrieval-Augmented Generation con el que arrancar y qué librerías usáis?',
    fechaCreacion: horaDesdeAhora(400),
    status: 'ABIERTO',
    autorId: 10,
    cursoId: 12,
    respuestas: [
      { id: 27, mensaje: 'Flujo mínimo: divide documentos en fragmentos → embeddings → store vectorial → recupera top-k según la pregunta → arma el prompt con contexto → respondes. Empezaría con LangChain o LlamaIndex encima de FAISS.', autorId: 8, fechaCreacion: horaDesdeAhora(390), solucion: false },
    ],
  },
  {
    id: 15,
    titulo: 'Testing E2E de una SPA Angular con Playwright',
    mensaje:
      'Cubrimos bien los unit tests, pero los flujos completos (login → crear → listar) se nos prueban a mano.\n\n¿Cómo montáis los tests E2E con Playwright para que no sean frágiles con el CI?',
    fechaCreacion: horaDesdeAhora(340),
    status: 'RESUELTO',
    autorId: 1,
    cursoId: 2,
    respuestas: [
      { id: 28, mensaje: 'Separa los datos de prueba por test (aislamiento), usa webServer en el config para levantar el proyecto, y evita sleep: espera por red o por selector explicito.', autorId: 4, fechaCreacion: horaDesdeAhora(330), solucion: true },
      { id: 29, mensaje: 'Emula el backend con intercept de rutas cuando el flujo no requiera probar la API real; así el E2E es determinista y no depende de un entorno.', autorId: 3, fechaCreacion: horaDesdeAhora(320), solucion: false },
    ],
  },
  {
    id: 16,
    titulo: '¿Por qué mi JOIN en SQL se ralentiza tras unos meses?',
    mensaje:
      'Una consulta que siempre fue rápida empezó a tardar 10 veces más sin haber tocado nada.\n\nSospecho del planificador y de la cardinalidad, pero no quiero forzar índices a ciegas. ¿Qué métricas debiera revisar primero?',
    fechaCreacion: horaDesdeAhora(510),
    status: 'ABIERTO',
    autorId: 13,
    cursoId: 6,
    respuestas: [
      { id: 30, mensaje: 'Revisa las estadísticas con ANALYZE, las páginas dirty y también el índice de la columna del JOIN. A veces el problema es una columna con valores NULL que destroza la estimación.', autorId: 7, fechaCreacion: horaDesdeAhora(500), solucion: false },
    ],
  },
  {
    id: 17,
    titulo: 'Configurar CORS para una API Spring con frontend en otro dominio',
    mensaje:
      'Desplegué el frontend en su propio dominio y desde el navegador las llamadas a mi API fallan por CORS.\n\n¿La forma recomendada de configuración CORS en Spring es @CrossOrigin por controlador o una beans global? Y, ¿qué valor pongo en allowedOrigins?',
    fechaCreacion: horaDesdeAhora(560),
    status: 'CERRADO',
    autorId: 14,
    cursoId: 9,
    respuestas: [
      { id: 31, mensaje: 'Configura un CorsConfigurationSource bean con allowedOriginPatterns y allowedMethods explícitos. No uses "*" con allowCredentials=true, es una combinación inválida que falla en producción.', autorId: 1, fechaCreacion: horaDesdeAhora(550), solucion: false },
    ],
  },
  {
    id: 18,
    titulo: 'Herencia de entidades en JPA: @Inheritance JOINED vs SINGLE_TABLE',
    mensaje:
      'Tengo una jerarquía de entidades y no sé qué estrategia elegir para una aplicación que analiza datos.\n\n¿Cuándo conviene cada una en términos de consultas, tamaño y migración?',
    fechaCreacion: horaDesdeAhora(640),
    status: 'RESUELTO',
    autorId: 1,
    cursoId: 1,
    respuestas: [
      { id: 32, mensaje: 'SINGLE_TABLE es más rápida en consultas simples y evita JOINs, pero desperdicia columnas y hace difícil aplicar CHECKs por tipo. JOINED normaliza mejor y es más fácil de migrar cuando la jerarquía es estable.', autorId: 6, fechaCreacion: horaDesdeAhora(630), solucion: true },
      { id: 33, mensaje: 'Para jerarquías que casi nunca cambian, JOINED; para tablas de catálogo con mucha lectura, SINGLE_TABLE. Evita TABLE_PER_CLASS salvo que sepas exactamente lo que haces.', autorId: 11, fechaCreacion: horaDesdeAhora(620), solucion: false },
    ],
  },
];

let proximoTopicoId = 100;
let proximaRespuestaId = 100;
let proximoUsuarioId = 100;

export function buscarUsuario(id: number): UsuarioDetalle | null {
  return usuarios.find((u) => u.id === id) ?? null;
}

function nombreAutor(id: number): string {
  return buscarUsuario(id)?.nombre ?? 'Usuario eliminado';
}

function perfilAutor(id: number): Perfil {
  return buscarUsuario(id)?.perfil ?? 'ESTUDIANTE';
}

function ingresoAutor(id: number): string {
  return buscarUsuario(id)?.fechaIngreso ?? '';
}

function avatarAutor(id: number): string | null {
  return buscarUsuario(id)?.avatarUrl ?? null;
}

function aResumen(topico: TopicoDemo): TopicoResumen {
  return {
    id: topico.id,
    titulo: topico.titulo,
    fechaCreacion: topico.fechaCreacion,
    status: topico.status,
    autorNombre: nombreAutor(topico.autorId),
    cursoNombre: cursos.find((c) => c.id === topico.cursoId)?.nombre ?? 'Curso',
    autorAvatar: avatarAutor(topico.autorId),
    autorPerfil: perfilAutor(topico.autorId),
    autorIngreso: ingresoAutor(topico.autorId),
  };
}

function aDetalle(topico: TopicoDemo): TopicoDetalle {
  return {
    ...aResumen(topico),
    mensaje: topico.mensaje,
    totalRespuestas: topico.respuestas.length,
  };
}

function aRespuesta(topicoId: number, respuesta: RespuestaDemo): RespuestaDetalle {
  return {
    id: respuesta.id,
    mensaje: respuesta.mensaje,
    topicoId,
    topticoTitulo: topicos.find((t) => t.id === topicoId)?.titulo ?? '',
    fechaCreacion: respuesta.fechaCreacion,
    autorNombre: nombreAutor(respuesta.autorId),
    solucion: respuesta.solucion,
    autorAvatar: avatarAutor(respuesta.autorId),
    autorPerfil: perfilAutor(respuesta.autorId),
    autorIngreso: ingresoAutor(respuesta.autorId),
  };
}

export function paginar<T>(elementos: T[], pagina: number, tamanio: number): Pagina<T> {
  const desde = pagina * tamanio;
  const content = elementos.slice(desde, desde + tamanio);
  return {
    content,
    totalPages: Math.ceil(elementos.length / tamanio) || 1,
    totalElements: elementos.length,
    last: desde + tamanio >= elementos.length,
    first: pagina === 0,
    empty: content.length === 0,
    number: pagina,
    size: tamanio,
    numberOfElements: content.length,
  };
}

export function listarCursos(): CursoDetalle[] {
  return cursos.filter((c) => c.activo);
}

export function crearCurso(nombre: string, categoria: Categoria): CursoDetalle {
  const curso: CursoDetalle = { id: cursos.length + 100, nombre, categoria, activo: true };
  cursos.push(curso);
  return curso;
}

export function actualizarCurso(id: number, cambios: { nombre?: string; categoria?: Categoria }): CursoDetalle | null {
  const curso = cursos.find((c) => c.id === id);
  if (!curso) return null;
  if (cambios.nombre !== undefined) curso.nombre = cambios.nombre;
  if (cambios.categoria !== undefined) curso.categoria = cambios.categoria;
  return curso;
}

export function eliminarCurso(id: number): void {
  const curso = cursos.find((c) => c.id === id);
  if (curso) curso.activo = false;
}

export function listarUsuarios(): UsuarioDetalle[] {
  return usuarios.filter((u) => u.activo);
}

export function detalleUsuario(id: number): UsuarioDetalle | null {
  return buscarUsuario(id);
}

export function actualizarUsuario(id: number, cambios: { nombre?: string; email?: string; contrasena?: string; avatarUrl?: string | null }): UsuarioDetalle | null {
  const usuario = buscarUsuario(id);
  if (!usuario) return null;
  if (cambios.nombre !== undefined) usuario.nombre = cambios.nombre;
  if (cambios.email !== undefined) usuario.email = cambios.email;
  if (cambios.avatarUrl !== undefined) usuario.avatarUrl = cambios.avatarUrl;
  return usuario;
}

export function desactivarUsuario(id: number): void {
  const usuario = buscarUsuario(id);
  if (usuario) usuario.activo = false;
}

export function loginMock(credenciales: LoginRequest): UsuarioDetalle {
  const usuario = usuarios.find((u) => u.perfil === 'ADMIN') ?? usuarios[0];
  usuario.email = credenciales.email;
  usuario.activo = true;
  return usuario;
}

export function registrarMock(datos: UsuarioRegistroRequest): UsuarioDetalle {
  const usuario: UsuarioDetalle = {
    id: proximoUsuarioId++,
    nombre: datos.nombre,
    email: datos.email,
    perfil: 'ESTUDIANTE',
    activo: true,
    avatarUrl: null,
    fechaIngreso: new Date().toISOString().slice(0, 10),
  };
  usuarios.push(usuario);
  return usuario;
}

export function listarTopicos(pagina = 0, tamanio = 10): Pagina<TopicoResumen> {
  const ordenados = [...topicos].sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion));
  return paginar(ordenados.map(aResumen), pagina, tamanio);
}

export function detalleTopico(id: number): TopicoDetalle | null {
  const topico = topicos.find((t) => t.id === id);
  return topico ? aDetalle(topico) : null;
}

export function crearTopico(titulo: string, mensaje: string, cursoId: number, autorId: number): TopicoDetalle {
  const topico: TopicoDemo = {
    id: proximoTopicoId++,
    titulo,
    mensaje,
    fechaCreacion: new Date().toISOString(),
    status: 'ABIERTO',
    autorId,
    cursoId,
    respuestas: [],
  };
  topicos.push(topico);
  return aDetalle(topico);
}

export function actualizarTopico(id: number, cambios: { titulo?: string; mensaje?: string; status?: StatusTopico; cursoId?: number }): TopicoDetalle | null {
  const topico = topicos.find((t) => t.id === id);
  if (!topico) return null;
  if (cambios.titulo !== undefined) topico.titulo = cambios.titulo;
  if (cambios.mensaje !== undefined) topico.mensaje = cambios.mensaje;
  if (cambios.status !== undefined) topico.status = cambios.status;
  if (cambios.cursoId !== undefined) topico.cursoId = cambios.cursoId;
  return aDetalle(topico);
}

export function eliminarTopico(id: number): void {
  const indice = topicos.findIndex((t) => t.id === id);
  if (indice !== -1) topicos.splice(indice, 1);
}

export function listarRespuestas(topicoId: number, pagina = 0, tamanio = 20): Pagina<RespuestaDetalle> {
  const topico = topicos.find((t) => t.id === topicoId);
  if (!topico) return paginar([], pagina, tamanio);
  const ordenadas = [...topico.respuestas].sort((a, b) => a.fechaCreacion.localeCompare(b.fechaCreacion));
  return paginar(ordenadas.map((r) => aRespuesta(topicoId, r)), pagina, tamanio);
}

export function crearRespuesta(mensaje: string, topicoId: number, autorId: number): RespuestaDetalle | null {
  const topico = topicos.find((t) => t.id === topicoId);
  if (!topico) return null;
  const respuesta: RespuestaDemo = {
    id: proximaRespuestaId++,
    mensaje,
    fechaCreacion: new Date().toISOString(),
    autorId,
    solucion: false,
  };
  topico.respuestas.push(respuesta);
  return aRespuesta(topicoId, respuesta);
}

export function actualizarRespuesta(id: number, cambios: { mensaje?: string; solucion?: boolean }): RespuestaDetalle | null {
  for (const topico of topicos) {
    const respuesta = topico.respuestas.find((r) => r.id === id);
    if (!respuesta) continue;
    if (cambios.mensaje !== undefined) respuesta.mensaje = cambios.mensaje;
    if (cambios.solucion !== undefined) respuesta.solucion = cambios.solucion;
    return aRespuesta(topico.id, respuesta);
  }
  return null;
}

export function eliminarRespuesta(id: number): void {
  for (const topico of topicos) {
    const indice = topico.respuestas.findIndex((r) => r.id === id);
    if (indice !== -1) {
      topico.respuestas.splice(indice, 1);
      return;
    }
  }
}

export function construirToken(usuario: UsuarioDetalle): string {
  const base64url = (valor: string): string =>
    btoa(valor).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const encabezado = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const carga = base64url(
    JSON.stringify({
      id: usuario.id,
      perfil: usuario.perfil,
      sub: usuario.email,
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    }),
  );
  return `${encabezado}.${carga}.demo-firma`;
}