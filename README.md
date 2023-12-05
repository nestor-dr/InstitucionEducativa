# InstitucionEducativa

# Descripción general del módulo

Este proyecto tiene como objetivo la creación de un sistema destinado a una institución educativa. Este sistema permitirá el acceso a distintos roles, siendo el primero de ellos el administrador (con el usuario "admin"). El administrador será responsable de gestionar aspectos relacionados con los alumnos, incluyendo su registro en el sistema, la asignación a cursos y la modificación de sus datos. Además, se contará con una funcionalidad que permitirá visualizar un listado de los alumnos registrados.

Dentro de las responsabilidades del administrador, también estará la administración de cursos. Este rol podrá crear cursos, asociarlos a un año académico y asignarles materias según la elección del administrador. De manera similar a la gestión de alumnos, el administrador tendrá la capacidad de visualizar un listado de los cursos creados.

Otro rol que podrá acceder al sistema es el del profesor. El profesor será responsable de generar boletines para los alumnos, ingresando las notas correspondientes a las materias del curso al que cada alumno esté asociado. Además, el profesor podrá visualizar los boletines creados y, si es necesario, eliminarlos.

Cada usuario que acceda al sistema, independientemente de su rol, tendrá la posibilidad de consultar y, en el futuro, editar sus datos personales. Este enfoque brinda a los usuarios un control sobre su información y garantiza la precisión de los datos almacenados en el sistema.

# Como correr/levantar el proyecto localmente 

Para correr el proyecto se deberan abrir dos terminales.

En una de ellas correr el siguiente comando: 'cd .\BackEnd\', esto lo colocara en el directorio del backend luego debe correr el comando 'npm run migrate-dev up', de esta manera se realizaran las migraciones iniciales a la base de datos, por ultimo, se debe correr el comando 'npm run dev', asi se levantara el backend del proyecto.

En la otra terminal se debe correr el siguiente comando: 'cd .\FrontEnd\', esto lo colocara en el directorio del frontend luego debe correr el comando 'npm run dev', asi se levantara el frontend del proyecto.

Y listo, ahora en la terminal del frontend saldra una linea que dira : 'Local: "un link al sistema local"', debe hacer Ctrl+click izquierdo y eso lo llevara al proyecto para comenzar a probarlo.

Los usuarios para entrar en la aplicacion son:

+Mail: 'admin@baseapinode.com'
+Password: 'Password1'
Este tendra el rol de Admin.

+Mail: 'glarriera@baseapinode.com'
+Password: 'Password1'
Este tendra el rol de Profesor.

# La realidad es que la parte de la generacion de boletines esta bastante verde pero voy encaminado.

