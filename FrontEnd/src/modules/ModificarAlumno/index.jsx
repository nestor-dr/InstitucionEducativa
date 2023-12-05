import { Form, Input, Select, Button, Row, Col, Typography, InputNumber, Alert  } from 'antd';
import { useState, useEffect } from 'react';
import { UserSwitchOutlined } from '@ant-design/icons';
import alumnoService from '../../services/Alumno/alumnoapi';
import cursoService from '../../services/Curso/cursoapi';
import miImagen from '../../images/Fondo 6.png';

const { Title, Text } = Typography;
const { Option } = Select;

const ModificarAlumno = () => {
  const [cursos, setCursos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [, setAlumnoData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Obtener la lista de cursos y legajos existentes al cargar el componente
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    // Obtener la lista de cursos
        cursoService.obtenerCursos().then(res => {setCursos(res);});

    // Obtener la lista de alumnos existentes
        alumnoService.obtenerAlumnos().then(res => {setAlumnos(res);}); 
  };

  const obtenerDatosAlumno = (alumnoLegajo) => {
    // Obtener datos del alumno por legajo
    alumnoService.obtenerAlumnoLegajo(alumnoLegajo)
      .then((res) => {
        setAlumnoData(res);

        const Curso = (res.curso == null) ? '' : res.curso._id;
        
        // Aquí, estableces los campos del formulario después de que se resuelva la promesa
        form.setFieldsValue({
          nombre: res.nombre,
          apellido: res.apellido,
          direccion: res.direccion,
          nroLegajo: res.nroLegajo,
          edad: res.edad,
          curso: Curso,
        });
      })
      .catch((error) => {
        console.error('Error al obtener datos del alumno:', error);
        // Manejar el error según sea necesario
      });
  };
    
    // Llenar el formulario con los datos del alumno



  const onFinish = (values) => {
    // Actualizar datos del alumno en el servidor
    const alumno = values;

    alumnoService.actualizarAlumno(alumno).then((res) => {
        console.log('Alumno modificado exitosamente:', res);
        setSuccess('Alumno modificado exitosamente.');
        
            form.resetFields();
        
            setTimeout(() => {
                setSuccess(null);
            }, 2000);
      })
      .catch((error) => {
        console.error('Error al modificar alumno:', error);
        setError('Error al Modificar el Alumno.');
      
            setTimeout(() => {
                setError(null);
            }, 2000);
      });
  };

  return (
    <div
    style={{
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: '50vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '20px',
      borderRadius: '50px', 
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', 
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
  }}
    >
      <div style={{ position: 'absolute', top: 240, opacity: 0.1}}>
        <img src={miImagen} alt="Descripción de la imagen" style={{ maxWidth: '100%' }} />
      </div>
      <Title level={2}
      style={{
        marginBottom: '20px',
        color: 'black',
        fontSize: '2em',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
    }}>Modificar Alumno</Title>
      <div style={{ marginBottom: '20px' }}>
            <UserSwitchOutlined style={{ fontSize: '50px', color: 'black' }} />
        </div>

        {error && (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)} // Limpiar el estado de error al cerrar la alerta
                style={{ position: 'fixed', bottom: 20, right: 20 }}
            />
        )}

        {success && (
            <Alert
                message="Éxito"
                description={success}
                type="success"
                showIcon
                style={{ position: 'fixed', bottom: 20, right: 20 }}
            />
        )}
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label="Seleccionar Legajo" name="nroLegajo" rules={[{ required: true, message: 'Seleccione el legajo' }]}>
          <Select onChange={obtenerDatosAlumno}>
            {alumnos.map((alumno) => (
              <Option key={alumno._id} value={alumno.nroLegajo}>
                {alumno.nroLegajo}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
            {/* Primera Columna */}
            <Col span={12}>
            
                <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Ingrese el nombre' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Apellido" name="apellido" rules={[{ required: true, message: 'Ingrese el apellido' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Edad" name="edad" rules={[{ required: true, message: 'Ingrese la edad' }]}>
                    <InputNumber min={18} max={70} />
                </Form.Item>

            </Col>

            {/* Segunda Columna */}
            <Col span={12}>

                <Form.Item label="Dirección" name="direccion" rules={[{ required: true, message: 'Ingrese la dirección' }]}>
                    <Input />
                </Form.Item>
                
                
                <Form.Item label="Curso" name="curso" rules={[{ required: true, message: 'Seleccione el curso' }]}>
                    <Select
                    >
                        {cursos.map((curso) => (
                        <Option key={curso._id} value={curso._id}>
                            {`${curso.nombre}`}
                        </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            </Row>
            <Text type="secondary" style={{ marginBottom: '10px', color: 'black', marginTop: '10px' }}>
            Los campos con * son obligatorios.
        </Text>
        
        <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Modificar Alumno
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ModificarAlumno;