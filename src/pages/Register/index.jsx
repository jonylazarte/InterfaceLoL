'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { FaArrowRight } from 'react-icons/fa';

import { setUser } from '@/redux/slices/userSlice.js';

import './register.css'; // Puedes usar el mismo CSS del login o uno nuevo

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const validationSchema = Yup.object({
  userName: Yup.string()
    .min(4, 'Mínimo 4 caracteres')
    .max(16, 'Máximo 16 caracteres')
    .matches(/^[a-zA-Z0-9]+$/, 'Solo letras y números')
    .required('Nombre de usuario obligatorio'),
  password: Yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('Contraseña obligatoria'),
});

export default function Register({ setToken }) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      userName: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError('');

      const newUser = {
        id: uuidv4(),
        userName: values.userName,
        password: values.password,
        alias: values.userName,
        tag: 'LAS',
        title: 'Novato',
        pokemon: [],
        items: [],
        messages: [],
        level: 1,
        EXP: 0,
        BE: 20000,
        RP: 3000,
        rank: {
          name: 'Bronze',
          level: 4,
          points: 0,
        },
        profileIcon: '5909',
        background: 'Aatrox_30',
      };

      try {
        const res = await fetch(`${API_URL}pokemons/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });

        const data = await res.json();

        if (data.id) {
          // Registro exitoso
          localStorage.setItem('token', data.id);
          setToken(data.id);
          dispatch(setUser(data));
          router.push('/');
        } else {
          setServerError(data.message || 'Este usuario ya existe');
          setIsLoading(false);
        }
      } catch (err) {
        setServerError('Error de conexión. Intenta más tarde.');
        setIsLoading(false);
      }
    },
  });

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } = formik;
  const isDisabled = isLoading || !values.userName || !values.password || Object.keys(errors).length > 0;

  return (
    <div className="main-menu">
      <form onSubmit={handleSubmit} className="register-form" noValidate>
        <h2>Crear cuenta</h2>

        {/* Error del servidor */}
        {serverError && <div className="error-box">{serverError}</div>}

        {/* Campo usuario */}
        <div className="input-wrapper">
          <input
            type="text"
            name="userName"
            placeholder="Nombre de usuario"
            value={values.userName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input-div ${touched.userName && errors.userName ? 'error' : ''}`}
            disabled={isLoading}
          />
          {touched.userName && errors.userName && (
            <span className="field-error">{errors.userName}</span>
          )}
        </div>

        {/* Campo contraseña */}
        <div className="input-wrapper">
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input-div ${touched.password && errors.password ? 'error' : ''}`}
            disabled={isLoading}
          />
          {touched.password && errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </div>

        {/* Botón y enlace */}
        <div className="actions-box">
          <button
            type="submit"
            disabled={isDisabled}
            className={`login-button ${isDisabled ? 'disabled' : ''}`}
          >
            {isLoading ? (
              <div className="spinner" />
            ) : (
              <FaArrowRight />
            )}
          </button>

          <a onClick={() => router.push('/login')} className="login-link">
            ¿Ya tienes cuenta? Iniciar sesión
          </a>
        </div>
      </form>
    </div>
  );
}