import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';

const schema = Yup.object().shape({
    fullname: Yup.string().required('fullname is required').min(3, 'Title must be at least 3 characters'),
    username: Yup.string().required('username is required').min(3, 'Description must be at least 3 characters'),
    email: Yup.string().email().required('email is required'),
    password: Yup.string().required('password is required').min(3, 'password must be at least 3 characters'),
    confirmpassword: Yup.string().required('confirem password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    number: Yup.string().required('number is required').matches(/^[0-9]+$/, "Must be a number")
        .max(10, 'Must be exactly 10 digits'),
    gender: Yup.string().required("gender is required")
});

const Register = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        console.log(values)
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/register`, values);
            if (res.data.message === "User created successfully") {
                navigate("/verify", { state: { email: res.data.user.email } });
            }
        } catch (err) {
            console.log(err.response.data.errors);
        }
    };

    const HnadleLogin = () => {
        navigate('/')
    }
    return (
        <div>
            <div className="modal-content container" style={{ width: "60%", marginTop: "10%" }}>
                <div className="modal-header">
                    <h5 className="modal-title">Register</h5>
                </div>
                <div className="modal-body">
                    <Formik
                        initialValues={{
                            fullname: '',
                            username: '',
                            email: '',
                            password: '',
                            confirmpassword: '',
                            number: '',
                            gender: ''
                        }}
                        validationSchema={schema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, handleChange, handleSubmit, setFieldValue }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 row">
                                    <div className="col-12">
                                        <label htmlFor="fullname" className="form-label">Full name</label>
                                        <input type="text" className="form-control" id="fullname" name="fullname" placeholder="Enter full name" onChange={handleChange} />
                                        {errors.fullname && <div className="text-danger">{errors.fullname}</div>}
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <div className="col-6">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input type="text" className="form-control" id="username" name="username" placeholder="Enter username" onChange={handleChange} />
                                        {errors.username && <div className="text-danger">{errors.username}</div>}
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <input type="email" className="form-control" id="email" name="email" placeholder="name@example.com" onChange={handleChange} />
                                        {errors.email && <div className="text-danger">{errors.email}</div>}
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <div className="col-6">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="password" className="form-control" id="password" name="password" placeholder="Password" onChange={handleChange} />
                                        {errors.password && <div className="text-danger">{errors.password}</div>}
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
                                        <input type="password" className="form-control" id="confirmpassword" name="confirmpassword" placeholder="Password" onChange={handleChange} />
                                        {errors.confirmpassword && <div className="text-danger">{errors.confirmpassword}</div>}
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <div className="col-6">
                                        <label htmlFor="number" className="form-label">Number</label>
                                        <input type="number" className="form-control" id="number" placeholder="91*******" name="number" onChange={handleChange} />
                                        {errors.number && <div className="text-danger">{errors.number}</div>}
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="gender" className="form-label">Gender</label><br />
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="gender" id="male" value="male" onClick={handleChange} />
                                            <label className="form-check-label" htmlFor="male">Male</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="gender" id="female" value="female" onClick={handleChange} />
                                            <label className="form-check-label" htmlFor="female">Female</label>
                                        </div>
                                        {errors.gender && <div className="text-danger">{errors.gender}</div>}
                                    </div>
                                </div>
                                <div className="mb-3 row mt-5">
                                    <div className="d-grid gap-2 col-12 mx-auto">
                                        <button type="submit" className="btn btn-warning">Register</button>
                                    </div>
                                </div>

                                <div className="mb-3 row mt-4">
                                    <div className="d-grid col-12 mx-auto text-center">
                                        <small>==== OR ====</small>
                                    </div>
                                </div>

                                <div className="mb-3 row mt-4">
                                    <div className="d-grid col-12 mx-auto text-center">
                                        <small>Already have account then <p style={{ textDecoration: "none", color: "blue", cursor: "pointer" }} onClick={HnadleLogin}>Login?</p></small>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Register;
