import api from '../api'

const ieService = {}

ieService.autorizacionUsuario = async (usuario) => {return await api.post('/auth', usuario)};

export default ieService