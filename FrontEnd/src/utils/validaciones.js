// Reglas de AntD compartidas entre formularios

// Contraseña: minimo 8 caracteres, con al menos una letra y un numero (la misma regla que el back)
export const reglaPassword = {
  pattern: /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
  message: 'Mínimo 8 caracteres, con letras y números',
};
