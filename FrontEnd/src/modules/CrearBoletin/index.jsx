import { Form, Input, Select, Button, Row, Col, Typography, Alert } from 'antd';
import { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';

import Container from '@mui/material/Container';

import alumnoService from '../../services/Alumno/alumnoapi';
import cursoService from '../../services/Curso/cursoapi';
import boletinService from '../../services/Boletin/boletinapi';

const { Title, Text } = Typography;
const { Option } = Select;

export default function IngresarNotas() {
  const [alumnos, setAlumnos] = useState([]);
  const [, setCursos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Obtener la lista de alumnos
    alumnoService.obtenerAlumnos().then((res) => {
      setAlumnos(res);
    });

    // Obtener la lista de cursos
    cursoService.obtenerCursos().then((res) => {
      setCursos(res);
    });
  }, []);

  const handleAlumnoChange = (alumnoId) => {
    const alumnoSeleccionado = alumnos.find((alumno) => alumno._id === alumnoId);
    
    // Obtener el curso asociado al alumno seleccionado
    const cursoId = alumnoSeleccionado ? alumnoSeleccionado.curso._id : null;

    const cursoNombre = alumnoSeleccionado.curso.nombre;

    setCursoSeleccionado(alumnoSeleccionado.curso)

    // Si hay un curso seleccionado, obtener las materias asociadas
    if (cursoId) {
      cursoService.obtenerMateriasPorCurso(cursoId).then((res) => {
        setMaterias(res);
      });

      form.setFieldsValue({
        cursoNombre: cursoNombre,
      });
    }
  };

  const onFinish = (values) => { 

    boletinService.crearBoletin(values).then((res) => {
        
      console.log('Boletín creado exitosamente:', res);
      setSuccess('Boletín creado exitosamente.');

      form.resetFields();

      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    })
    .catch((error) => {
      console.error('Error al crear boletín:', error);
      setError('Error al crear el Boletín. Asegúrate de que no exista un boletín para este alumno y curso.');

      setTimeout(() => {
        setError(null);
      }, 2000);
    });
  };

  return (
    <Container
      style={{
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        maxWidth: 'xl',
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
      <Title level={2} style={{ marginBottom: '20px', color: 'black', fontSize: '2em', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
        Ingreso de Notas
      </Title>

      <div style={{ marginBottom: '20px' }}>
        <UserOutlined style={{ fontSize: '50px', color: 'black' }} />
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
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
        name="IngresarNotas"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 50 }}
      >
        <Row gutter={200}>
          <Col span={12}>
            {/* Selección de Alumno */}
            <Form.Item label="Alumno" name="alumnoId" rules={[{ required: true, message: 'Seleccione un alumno' }]}>
              <Select onChange={handleAlumnoChange} style={{ width: '100%' }}>
                {alumnos.map((alumno) => (
                  <Option key={alumno._id} value={alumno._id}>
                    {`${alumno.nombre} ${alumno.apellido}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Selección de Curso */}
            <Form.Item label="Curso" name="cursoNombre">
              <Input readOnly value={cursoSeleccionado || ''} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Ingreso de Notas para cada Materia */}
            {materias.map((materia, index) => (
              <Row key={index} gutter={16} style={{ marginBottom: '16px' }}>
                <Col span={8}>
                  <Typography.Text strong>{`Nota de ${materia.nombre}:`}</Typography.Text>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name={['notas', materia._id]}
                    rules={[{ required: true, message: `Ingrese la nota de ${materia.nombre}` }]}
                  >
                    <Input placeholder={`Nota de ${materia.nombre}`} type="number" />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Col>
        </Row>

        <Text type="secondary" style={{ marginBottom: '20px', color: 'black' }}>
          Los campos con * son obligatorios.
        </Text>

        <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ borderRadius: '5px' }}>
            Ingresar Notas
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
}