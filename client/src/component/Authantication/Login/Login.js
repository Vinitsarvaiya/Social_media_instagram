import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';

const schema = Yup.object().shape({
    email: Yup.string().email().required('email is required'),
    password: Yup.string().required('password is required'),
});

const Login = () => {
    const navigate = useNavigate()
    const [impError, setimpErorr] = useState()

    const handleSubmit = async (values) => {
        setimpErorr('')
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/login`, values)
            .then((res) => {
                console.log(res)
                if (res.data.message === "please verify your email") {
                    navigate("/verify",{ state: { email: values.email } })
                }
                else if (res.data.message === "user login sucessfully") {
                    sessionStorage.setItem("key", res.data.token)
                    navigate("/home")
                    console.log("THE END")
                }
                else if (res.data.message === "User and password does not match") {
                    setimpErorr("User and password does not match")
                }
                else if (res.data.message === "User does not exist please register") {
                    setimpErorr("User does not exist please register")
                }
            })
            .catch((err) => console.log(err))
    }

    const HnadleRegister = () => {
        navigate('/register')
    }
    return (
        <div>
            <div>
                <div className="modal-content container" style={{ width: "30%", marginTop: "15%" }}>
                    <div className="modal-header">
                        <h5 className="modal-title" >Login</h5>
                    </div>
                    <div className="modal-body" >
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={schema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, handleChange, handleSubmit, setFieldValue }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3 row">
                                        <div className="col-12">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                placeholder="email"
                                                onChange={handleChange} />
                                            {errors.email && <div className="text-danger">{errors.email}</div>}
                                        </div>

                                    </div>
                                    <div className="mb-3 row">
                                        <div className="col-12">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="password"
                                                name="password"
                                                placeholder="password"
                                                onChange={handleChange}
                                            />
                                            {errors.password && <div className="text-danger">{errors.password}</div>}
                                        </div>

                                    </div>
                                    <div className="mb-3 row mt-4">
                                        <div className="col-12">
                                            <button
                                                type="submit"
                                                className="form-control btn btn-success btn-block"
                                                value="Login"
                                                id="post"
                                            >submit</button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </Formik>

                        <div className="mb-3 row mt-4">
                            <div className="d-grid col-12 mx-auto text-center">
                                <small>==== OR ====</small>
                            </div>
                        </div>

                        {impError && <div className="mb-3 row mt-4">
                            <div className="d-grid col-12 mx-auto text-center">
                                <div className="text-danger">{impError}</div>
                            </div>
                        </div>}

                        <div className="mb-3 row mt-4">
                            <div className="d-grid col-12 mx-auto text-center">
                                <small>Create a new account  <p style={{ textDecoration: "none", color: "blue", cursor: "pointer" }} onClick={HnadleRegister}>Register?</p></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
