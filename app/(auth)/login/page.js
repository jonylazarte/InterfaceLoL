'use client'

import '@/pages/Login/login.css'
import { useState, useEffect, memo } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../../src/redux/slices/userSlice.js'
import { loginUser, clearError } from '../../../src/redux/slices/authSlice.js'
import { useFormik } from 'formik'
import { FaArrowRight } from "react-icons/fa"
import * as Yup from 'yup'

export default memo(function Login() {
	const router = useRouter()
	const dispatch = useDispatch()
	const { loading, error } = useSelector(state => state.auth)
	
	const initialValues = {
		userName: "",
		password: ""
	}

	/*useEffect(() => {
		if(isAuthenticated && !loading){
			router.push('/dashboard')
		}
	}, [isAuthenticated, loading])*/

	const validationSchema = () =>
		Yup.object().shape({
			userName: Yup.string().required("Campo obligatorio"),
			password: Yup.string().required("Campo obligatorio")
		})

	const onSubmit = async (values) => {
		try {
			const result = await dispatch(loginUser({
				userName: values.userName,
				password: values.password
			})).unwrap()
			
			// Si el login es exitoso, también actualizar el user slice
			dispatch(setUser(result))
			
			             // Redirigir al dashboard
             
		} catch (error) {
			// El error ya está manejado por el slice
			console.error('Login failed:', error)
		}
	}

	const formik = useFormik({ initialValues, validationSchema, onSubmit })
	const { handleChange, handleSubmit, errors, handleBlur, touched, values } = formik

	useEffect(() => { // Limpiar error cuando cambian los valores
	 if (error) { dispatch(clearError()) } 
	}, [values.password, values.userName])


	return (
		<div className="main-menu">
			<form onSubmit={handleSubmit} className="login-form">
				<img className="riot-games-logo" src="/riot-games.png"></img>
				<h2>Iniciar sesión</h2>
					<section className="form-interface" style={{display: loading ? 'none' : 'flex'}}>
						<div className="error-box">{error ? error : null}</div>
						<input
							className={`input-div ${error ? 'errorMessage' : null}`}
							type="text"
							name="userName"
							placeholder="Nombre de usuario"
							onBlur={handleBlur}
							onChange={handleChange}
						/>
						{errors.userName && touched.userName && <div className="error-text">{errors.userName}</div>}
						<input
							className={`input-div ${error ? 'errorMessage' : null}`}
							type="password"
							name="password"
							placeholder="Contraseña"
							onBlur={handleBlur}
							onChange={handleChange}
						/>
						{errors.password && touched.password && <div className="error-text">{errors.password}</div>}
						<div className="actions-box">
							<button 
								
								className={`login-button ${(!values.userName || !values.password) ? 'disabled' : null}`} 
								type="submit"
							>
								<FaArrowRight />
							</button>
							<a onClick={() => router.push('/register')}>Crear cuenta</a>
						</div>
					</section>

					<svg style={{color: '#d53235', height: "45px", width: "45px", marginTop: "10vh", display: !loading ? 'none' : null}} fill="hsl(228, 97%, 42%)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke='#d53235' styles={{stroke:'#d53235'}} d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
						<path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
							<animateTransform speed="1" attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
						</path>
					</svg>

			</form>
		</div>
	)
})
