'use client'

import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/slices/userSlice.js';
import { loginUser} from '@/redux/slices/authSlice.js';
import { FaArrowRight } from "react-icons/fa"
import '../auth.css'

export default function Register() {
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const [errorMessage, setErrorMessage] = useState()
	const router = useRouter();
	const dispatch = useDispatch();
	const { loading, error } = useSelector(state => state.auth)
	
	const initialValues = {
		userName: "",
		password: ""
	}

	const validationSchema = () =>
		Yup.object().shape({
			userName: Yup.string("Formato incorrecto").required("Campo obligatorio").min(6, "Debe tener al menos 6 caracteres"),
			password: Yup.string().required("Campo obligatorio")
		})

	const onSubmit = async (values) => {
		setErrorMessage(null)
		
		try {
			const body = {
				userName: values.userName,
				password: values.password,
				id: uuidv4(),
				alias: values.userName,
				tag: 'LAS',
				title: 'Novice',
				champions: [],
				skins: [],
				messages: [],
				level: 1,
				EXP: 0,
				BE: 20000,
				RP: 3000,
				rank: {
					name: "Bronze",
					level: 4,
					points: 100
				},
				profileIcon: '5909',
				background: 'Aatrox_30',
			}

			const response = await fetch(`${API_URL}pokemons/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			})

			const data = await response.json()

			if (!data.message) {
				// Registro exitoso, hacer login automático
				const loginResult = await dispatch(loginUser({
					userName: values.userName,
					password: values.password
				})).unwrap()

				// Actualizar user slice
				dispatch(setUser(loginResult.user))
				
				// Redirigir al dashboard
				router.push('/leagueoflegends')
			} else {
				setErrorMessage("Usuario actualmente registrado.")
			}
		} catch (error) {
			setErrorMessage("Error al registrar usuario.")
			console.error('Registration failed:', error)
		} finally {
			console.log("simulator utility")
		}
	}

	const formik = useFormik({ initialValues, validationSchema, onSubmit });
	const { handleChange, handleSubmit, errors, handleBlur, touched, values } = formik;

	useEffect(() => {
		// Limpiar error cuando cambian los valores
		if (errorMessage) {
			setErrorMessage(null)
		}
	}, [values.password, values.userName])

	return (
		<div className="main-menu register">
			<form className="login-form" onSubmit={handleSubmit}>
				<h2>Registrarse</h2>
				<div className="error-box">{errorMessage ? errorMessage : null}</div>
					<input
							className={`input-div ${error ? 'errorMessage' : null}`}
							type="text"
							name="userName"
							placeholder="Nombre de usuario"
							onBlur={handleBlur}
							onChange={handleChange}
						/>
					{errors.userName && touched.userName && <div className="error-message">{errors.userName}</div>}

					<input
							className={`input-div ${error ? 'errorMessage' : null}`}
							type="password"
							name="password"
							placeholder="Contraseña"
							onBlur={handleBlur}
							onChange={handleChange}
						/>
					{errors.password && touched.password && <div className="error-message">{errors.password}</div>}

				<div className="actions-box"><button 
					type="submit"
					disabled={!values.password || !values.userName || loading} 
					className={`login-button ${(!values.userName || !values.password || loading) ? 'disabled' : null}`}
				>
					<FaArrowRight />
				</button>
				</div>
				<span>¿Ya tenés una cuenta? <a onClick={() => router.push('/login')}>Iniciar Sesión</a></span>
			</form>
		</div>
	)
}
