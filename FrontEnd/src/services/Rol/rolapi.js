import api from '../api'

const rolService = {}

rolService.obtenerRoles = async () => {return await api.get('/roles')};

export default rolService
