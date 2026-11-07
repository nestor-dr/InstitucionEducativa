import { Form, Input, InputNumber, Select, Button, Row, Col, Typography, Alert } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

import Container from '@mui/material/Container';

import alumnoService from '../../services/Alumno/alumnoapi';
import cursoService from '../../services/Curso/cursoapi';
import boletinService from '../../services/Boletin/boletinapi';

const { Title, Text } = Typography;
const { Option } = Select;

export default function IngresarNotas() {
  const [alumnos, setAlumnos] = useState([]);
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const mostrarError = (mensaje) => {
    setError(mensaje);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };

  useEffect(() => {
    // Solo se puede hacer boletin a los alumnos que tienen curso
    alumnoService.obtenerAlumnos()
      .then((res) => setAlumnos(res.filter((alumno) => alumno.curso)))
      .catch((error) => mostrarError(error.mensaje));
  }, []);

  // Al elegir el alumno se trae su curso con el año y las materias
  const handleAlumnoChange = (alumnoId) => {
    const alumnoSeleccionado = alumnos.find((alumno) => alumno._id === alumnoId);
    form.setFieldsValue({ notas: {} });
    setCurso(null);

    cursoService.obtenerCurso(alumnoSeleccionado.curso._id)
      .then((res) => {
        setCurso(res);
        form.setFieldsValue({ cursoNombre: `${res.nombre}${res.anio ? ` - ${res.anio.nombre}` : ''}` });
      })
      .catch((error) => mostrarError(error.mensaje));
  };

  const onFinish = (values) => {
    // El form guarda las notas como { idMateria: nota } y el back espera [{ materia, nota }]
    const boletin = {
      alumno: values.alumnoId,
      curso: curso._id,
      notas: curso.materias.map((materia) => ({ materia: materia._id, nota: values.notas[materia._id] })),
    };

    boletinService.crearBoletin(boletin)
      .then((res) => {
        setSuccess('Boletín creado exitosamente.');

        // Despues de crearlo se muestra el boletin para verlo o imprimirlo
        setTimeout(() => {
          setSuccess(null);
          navigate(`/Boletines/Ver/${res._id}`);
        }, 1500);
      })
      .catch((error) => {
        console.error('Error al crear boletín:', error);
        mostrarError(error.mensaje);
      });
  };

  const materias = curso ? curso.materias : [];

  return (
    <Container
      style={{
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
        <Row gutter={100}>
          <Col span={12}>
            {/* Selección de Alumno */}
            <Form.Item label="Alumno" name="alumnoId" rules={[{ required: true, message: 'Seleccione un alumno' }]}>
              <Select onChange={handleAlumnoChange} style={{ width: '100%', minWidth: '220px' }} showSearch optionFilterProp="children">
                {alumnos.map((alumno) => (
                  <Option key={alumno._id} value={alumno._id}>
                    {`${alumno.apellido}, ${alumno.nombre} (${alumno.nroLegajo})`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Curso del alumno (solo lectura) */}
            <Form.Item label="Curso" name="cursoNombre">
              <Input readOnly style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Ingreso de Notas para cada Materia del curso */}
            {curso && materias.length === 0 && (
              <Text type="danger">El curso de este alumno no tiene materias asignadas.</Text>
            )}
            {materias.map((materia) => (
              <Row key={materia._id} gutter={16} style={{ marginBottom: '8px' }}>
                <Col span={14}>
                  <Typography.Text strong>{`Nota de ${materia.nombre}:`}</Typography.Text>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name={['notas', materia._id]}
                    rules={[{ required: true, message: 'Ingrese la nota' }, { type: 'number', min: 1, max: 10, message: 'Entre 1 y 10' }]}
                  >
                    <InputNumber min={1} max={10} step={0.5} placeholder="1 a 10" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Col>
        </Row>

        <Text type="secondary" style={{ marginBottom: '20px', color: 'black' }}>
          Los campos con * son obligatorios. Las notas van de 1 a 10.
        </Text>

        <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
          <Button type="primary" htmlType="submit" disabled={materias.length === 0} style={{ borderRadius: '5px' }}>
            Ingresar Notas
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
}
