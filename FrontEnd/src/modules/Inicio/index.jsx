import miImagen from '../../images/Fondo 6.png';

function Inicio() {
  return(
    <div>
      <img 
      src={miImagen}
      alt="Descripción de la imagen"
      style={{ maxWidth: '100%', height: '50vh', objectFit: 'contain' }}
      />
    </div>
  );
}

export default Inicio