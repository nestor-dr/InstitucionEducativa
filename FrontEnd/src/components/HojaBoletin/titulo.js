// Pasa a mayuscula la primera letra de cada palabra (ej: "del rio" -> "Del Rio")
const capitalizar = (texto) => (texto || '').replace(/(^|\s)\S/g, (letra) => letra.toUpperCase());

// Texto del encabezado de impresion y del titulo de la pestaña
// Ej: "Institución Educativa - Del Rio, Nestor"
export function tituloBoletin(boletin) {
  const { alumno } = boletin;
  if (!alumno) return 'Institución Educativa';
  return `Institución Educativa - ${capitalizar(alumno.apellido)}, ${capitalizar(alumno.nombre)}`;
}
