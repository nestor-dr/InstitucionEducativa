import api from '../api'

const usuarioService = {}

usuarioService.obtenerUsuarios = async () => {return await api.get('/usuarios')};
usuarioService.obtenerUsuario = async (usuarioId) => {return await api.get(`/usuarios/${usuarioId}`)};
usuarioService.actualizarUsuario = async (usuarioId, usuario) => {return await api.put(`/usuarios/${usuarioId}`, usuario)};

export default usuarioService
