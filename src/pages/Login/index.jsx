import { useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { FaArrowRight } from 'react-icons/fa';
import * as Yup from 'yup';

import { setUser } from '@/redux/slices/userSlice.js';
import './login.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const validationSchema = Yup.object({
  userName: Yup.string()
    .min(3, 'Mínimo 3 caracteres')
    .required('Nombre de usuario obligatorio'),
  password: Yup.string()
    .min(4, 'Mínimo 4 caracteres')
    .required('Contraseña obligatoria'),
});

export default memo(function Login({ setToken }) {
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

      try {
        const res = await fetch(`${API_URL}pokemons/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (data.id) {
          // Login exitoso
          localStorage.setItem('token', data.id);
          dispatch(setUser(data));
          setToken(data.id);
        } else {
          // Error del servidor (usuario no encontrado, contraseña incorrecta, etc.)
          setServerError(data.message || 'Error al iniciar sesión');
          setIsLoading(false);
        }
      } catch (err) {
        setServerError('Error de conexión. Inténtalo más tarde.');
        setIsLoading(false);
      }
    },
  });

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } = formik;
  const isDisabled = isLoading || !values.userName || !values.password;

  return (
    <div className="main-menu">
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <h2>Iniciar sesión</h2>

        {/* Mensaje de error del servidor */}
        {serverError && <div className="error-box">{serverError}</div>}

        {/* Campo usuario */}
        <input
          type="text"
          name="userName"
          placeholder="Nombre de usuario"
          className={`input-div ${touched.userName && errors.userName ? 'error' : ''}`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.userName}
          disabled={isLoading}
        />
        {touched.userName && errors.userName && (
          <div className="field-error">{errors.userName}</div>
        )}

        {/* Campo contraseña */}
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className={`input-div ${touched.password && errors.password ? 'error' : ''}`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          disabled={isLoading}
        />
        {touched.password && errors.password && (
          <div className="field-error">{errors.password}</div>
        )}

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

          <a onClick={() => router.push('/register')} className="register-link">
            Crear cuenta
          </a>
        </div>
      </form>
    </div>
  );
});