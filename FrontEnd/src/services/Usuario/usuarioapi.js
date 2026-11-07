import api from '../api'

const usuarioService = {}

usuarioService.obtenerUsuarios = async () => {return await api.get('/usuarios')};
usuarioService.obtenerUsuario = async (usuarioId) => {return await api.get(`/usuarios/${usuarioId}`)};
usuarioService.crearUsuario = async (usuario) => {return await api.post('/usuarios', usuario)};
usuarioService.actualizarUsuario = async (usuarioId, usuario) => {return await api.put(`/usuarios/${usuarioId}`, usuario)};
usuarioService.eliminarUsuario = async (usuarioId) => {return await api.delete(`/usuarios/${usuarioId}`)};

export default usuarioService
