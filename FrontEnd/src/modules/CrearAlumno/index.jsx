import { Form, Input, Select, Button, Row, Col, Typography, InputNumber, Alert  } from 'antd';
import { useState, useEffect } from 'react';
import { UserAddOutlined } from '@ant-design/icons';

import alumnoService from '../../services/Alumno/alumnoapi';
import cursoService from '../../services/Curso/cursoapi';
import miImagen from '../../images/Fondo 6.png';

const { Title, Text } = Typography;
const { Option } = Select;

export default function CrearAlumno() {
    const [cursos, setCursos] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const selectCursos = async () => {
            cursoService.obtenerCursos().then(res => {setCursos(res);}); 
        };
        selectCursos();
    }, []);

    const onFinish = (values) => {
        console.log('Valores del formulario:', values);
        alumnoService.crearAlumno(values).then((res) => {
        console.log('Alumno creado exitosamente:', res);
        setSuccess('Alumno creado exitosamente.');
        
        form.resetFields();
        
        setTimeout(() => {
            setSuccess(null);
        }, 2000);
        }).catch((error) => {
            console.error('Error al crear alumno:', error);
            setError('Error al crear el Alumno. Nro de Legajo existente');

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
        <Title 
            level={2}
            style={{
                marginBottom: '20px',
                color: 'black',
                fontSize: '2em',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            Formulario de Alumno
        </Title>

        <div style={{ marginBottom: '20px' }}>
            <UserAddOutlined style={{ fontSize: '50px', color: 'black' }} />
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
            name="AltaAlumno"
            onFinish={onFinish}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
        >
            <Row gutter={16}>
            {/* Primera Columna */}
            <Col span={12}>
            
                <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Ingrese el nombre' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Apellido" name="apellido" rules={[{ required: true, message: 'Ingrese el apellido' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Legajo" name="nroLegajo" rules={[{ required: true, message: 'Ingrese el legajo' }]}>
                    <Input />
                </Form.Item>
            </Col>

            {/* Segunda Columna */}
            <Col span={12}>
                <Form.Item label="Dirección" name="direccion" rules={[{ required: true, message: 'Ingrese la dirección' }]}>
                    <Input />
                </Form.Item>
                
                <Form.Item label="Edad" name="edad" rules={[{ required: true, message: 'Ingrese la edad' }]}>
                    <InputNumber min={18} max={70} />
                </Form.Item>

                <Form.Item label="Curso" name="curso" rules={[{ message: 'Seleccione el curso' }]}>
                    <Select>
                        {cursos.map((curso) => (
                        <Option key={curso._id} value={curso._id}>
                            {`${curso.nombre}`}
                        </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            </Row>

        <Text type="secondary" style={{ marginBottom: '20px', color: 'black' }}>
            Los campos con * son obligatorios.
        </Text>

        <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
          {/* Mejora el estilo del botón */}
          <Button type="primary" htmlType="submit" style={{ borderRadius: '5px' }}>
            Agregar Alumno
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}