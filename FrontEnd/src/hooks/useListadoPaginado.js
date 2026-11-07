import { useState, useEffect, useCallback } from 'react';

// Espera desde la ultima tecla antes de buscar (asi no se le pega al back con cada letra)
const ESPERA_BUSQUEDA = 400;

// Maneja un listado con busqueda y paginacion en el servidor
// obtenerPagina: funcion del servicio que recibe { pagina, limite, buscar } y devuelve { datos, total }
export default function useListadoPaginado(obtenerPagina, limiteInicial = 10) {
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0); // MUI cuenta las paginas desde 0, el back desde 1
  const [limite, setLimite] = useState(limiteInicial);
  const [busqueda, setBusqueda] = useState(''); // lo que se va escribiendo
  const [buscar, setBuscar] = useState(''); // lo que se manda al back (despues de la espera)
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cuando se deja de escribir, se busca y se vuelve a la primera pagina
  useEffect(() => {
    const espera = setTimeout(() => {
      setBuscar(busqueda.trim());
      setPagina(0);
    }, ESPERA_BUSQUEDA);
    return () => clearTimeout(espera);
  }, [busqueda]);

  // Pide al back la pagina actual
  const cargar = useCallback(() => {
    setCargando(true);
    obtenerPagina({ pagina: pagina + 1, limite, buscar })
      .then((res) => {
        // Si se borro el ultimo registro de una pagina, se vuelve a la anterior
        if (res.datos.length === 0 && res.total > 0 && pagina > 0) {
          setPagina(pagina - 1);
          return;
        }
        setDatos(res.datos);
        setTotal(res.total);
      })
      .catch((error) => {
        // Si falla (ej: servidor caido) la tabla queda vacia y se muestra el error
        setDatos([]);
        setTotal(0);
        setError(error.mensaje);
        setTimeout(() => setError(null), 2000);
      })
      .finally(() => setCargando(false));
  }, [obtenerPagina, pagina, limite, buscar]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Para la TablePagination de MUI
  const cambiarPagina = (evento, nuevaPagina) => setPagina(nuevaPagina);
  const cambiarLimite = (evento) => {
    setLimite(parseInt(evento.target.value, 10));
    setPagina(0);
  };

  return { datos, total, pagina, limite, busqueda, setBusqueda, cargando, error, setError, recargar: cargar, cambiarPagina, cambiarLimite };
}
