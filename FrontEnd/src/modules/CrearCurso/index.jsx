import { Form, Input, Button, Row, Col, Typography, Select,  Alert  } from 'antd';
import React, { useState, useEffect } from 'react';
import { ScheduleOutlined } from '@ant-design/icons';

import Container from '@mui/material/Container';

import cursoService from '../../services/Curso/cursoapi';
import materiaService from '../../services/Materia/materiaapi';
import anioService from '../../services/Anio/anioapi';
import miImagen from '../../images/Fondo 6.png';

const { Title, Text } = Typography;
const { Option } = Select;

export default function CrearAlumno() {
    const [materias, setMaterias] = useState([]);
    const [, setSelectedMateria] = React.useState([]);
    const [anios, setAnios] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const selectMaterias = async () => {
            materiaService.obtenerMaterias().then(res => {setMaterias(res);}); 
        };      
        selectMaterias();
    }, []);

    useEffect(() => {
        const selectAnios = async () => {
            anioService.obtenerAnios().then(res => {setAnios(res);}); 
        };
        selectAnios();
    }, []);

    const materiaseleccion = (nuevaMateria) => {
        setSelectedMateria(nuevaMateria)
    };

    const onFinish = (values) => {
        console.log('Valores del formulario:', values);
    
        cursoService.crearCurso(values).then((res) => {

            console.log('Curso creado exitosamente:', res);
            
            setSuccess('Curso creado exitosamente.');
        
            form.resetFields();
        
            setTimeout(() => {
                setSuccess(null);
            }, 2000);
        }).catch((error) => {

            console.error('Error al crear Curso:', error);

            setError('Error al crear el Curso. No se pudo crear el curso');
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
                Creación de Curso <ScheduleOutlined style={{ margin: '10px', fontSize: '50px', color: 'black' }} />
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
                name="AltaCurso"
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
            >
                <Row gutter={100}>
                    {/* Primera Columna */}
                    <Col span={12}>           
                        <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Ingrese el nombre' }]}>
                            <Input />
                        </Form.Item>
                    </Col>

                    {/* Segunda Columna */}
                    <Col span={12}>           
                        <Form.Item label="Materias" name="materias" rules={[{ message: 'Seleccione las materias' }]}>
                            <Select 
                                mode="multiple"
                                dropdownStyle={{ width: '16%' }}
                                style= {{width: '120%' }}
                                onChange = {materiaseleccion}
                                placeholder = 'Seleccione Materias...'
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
                            <Select dropdownStyle={{ width: '11%' }}>
                                {anios.map((anio) => (
                                    <Option key={anio._id} value={anio._id}>
                                        {anio.nombre}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>              
                    </Col>
                </Row>

                <Text type="secondary" style={{ marginBottom: '20px', color: 'black' }}>
                    Los campos con * son obligatorios.
                </Text>

                <Form.Item wrapperCol={{ offset: 21, span: 16 }}>
                    {/* Mejora el estilo del botón */}
                    <Button type="primary" htmlType="submit" style={{ borderRadius: '5px' }}>
                        Agregar Curso
                    </Button>
                </Form.Item>
            </Form>
        </Container>
    );
}