import { Form, Input, Select, Button, Row, Col, Typography, Alert  } from 'antd';
import React, { useState, useEffect } from 'react';
import { ReadOutlined } from '@ant-design/icons';
import Container from '@mui/material/Container';

import miImagen from '../../images/Fondo 6.png';

import cursoService from '../../services/Curso/cursoapi';
import anioService from '../../services/Anio/anioapi';
import materiaService from '../../services/Materia/materiaapi';

const { Title, Text } = Typography;
const { Option } = Select;

const ModificarAlumno = () => {
  const [cursos, setCursos] = useState([]);
  const [anios, setAnios] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [, setAlumnoData] = useState(null);
  const [, setSelectedMateria] = React.useState([]);
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
        anioService.obtenerAnios().then(res => {setAnios(res);});
    
    // Obtener la lista de materias existentes
        materiaService.obtenerMaterias().then(res => {setMaterias(res);});
  };

  const obtenerDatosCurso = (cursoId) => {
    // Obtener datos del curso por ID
    cursoService.obtenerCurso(cursoId)
      .then((res) => {
        setAlumnoData(res);
        console.log(res); // Asegúrate de que los datos del alumno se impriman correctamente
  
        const nombresMaterias = res.materias.map(materia => materia._id);

        const Anio = (res.anio == null) ? '' : res.anio._id;

        // Aquí, estableces los campos del formulario después de que se resuelva la promesa
        form.setFieldsValue({
          nombre: res.nombre,
          anio: Anio,
          materias: nombresMaterias,
        });
      })
      .catch((error) => {
        console.error('Error al obtener datos del alumno:', error);
        // Manejar el error según sea necesario
      });
  };
    
    // Llenar el formulario con los datos del alumno

    const materiaseleccion = (nuevaMateria) => {
        setSelectedMateria(nuevaMateria)
      };


  const onFinish = (values) => {
    // Actualizar datos del alumno en el servidor

    cursoService.actualizarCurso(values).then((res) => {
        console.log('Curso modificado exitosamente:', res);
        setSuccess('Curso modificado exitosamente.');
        
            form.resetFields();
        
            setTimeout(() => {
                setSuccess(null);
            }, 2000);
      })
      .catch((error) => {
        console.error('Error al modificar Curso:', error);
        setError('Error al Modificar el Curso.');
      
            setTimeout(() => {
                setError(null);
            }, 2000);
      });
  };

  return (
    <Container 
        fixed
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
    }}>Modificar Curso <ReadOutlined style={{ margin: '10px', fontSize: '50px', color: 'black' }} />
    </Title>

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
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label="Seleccionar Curso" name="nombre" rules={[{ required: true, message: 'Seleccione el Curso' }]}>
          <Select onChange={obtenerDatosCurso}>
            {cursos.map((curso) => (
              <Option key={curso._id} value={curso._id}>
                {curso.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={100}>
            {/* Primera Columna */}
            <Col span={12}>           
                <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Ingrese el nombre' }]}>
                    <Input />
                </Form.Item>            
            </Col>

            {/* Segunda Columna */}
            <Col span={12}>           
                <Form.Item label="Materias" name="materias" rules={[{ required: true, message: 'Seleccione las materias' }]}>
                    <Select 
                    mode="multiple"
                    dropdownStyle={{ width: '16%' }}
                    style= {{width: '120%' }}
                    onChange = {materiaseleccion}
                    maxTagCount = 'responsive'
                    >
                        {materias.map((materia) => (
                        <Option key={materia._id} value={materia._id}>
                            {`${materia.nombre}`}
                        </Option>
                        ))}
                    </Select>
                </Form.Item>     
            </Col>   

            {/* Tercera Columna */}
            <Col span={12}>
            <Form.Item label="Año" name="anio" rules={[{ message: 'Seleccione el año' }]}>
                    <Select 
                        dropdownStyle={{ width: '11%' }}
                    >
                        {anios.map((anio) => (
                        <Option key={anio._id} value={anio._id}>
                            {`${anio.nombre}`}
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
            Modificar Curso
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default ModificarAlumno;