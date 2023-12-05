import api from '../api'

const usuarioService = {}

usuarioService.obtenerUsuarios = async () => {return await api.get('/materias')};
usuarioService.obtenerUsuario = async (usuarioId) => {return await api.get(`/materias/${usuarioId}`)};

export default usuarioService