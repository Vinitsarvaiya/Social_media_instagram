import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ProfileUpdate = ({ update }) => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("key");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const formik = useFormik({
        initialValues: {
            fullname: '',
            username: '',
            number: '',
            gender: '',
            image: null,
        },
        validationSchema: Yup.object({
            fullname: Yup.string().required('fullname is required'),
            username: Yup.string().required('username is required'),
            number: Yup.string().required('number is required').matches(/^[0-9]+$/, "Must be a number"),
            gender: Yup.string().required('gender is required'),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append('fullname', values.fullname);
            formData.append('username', values.username);
            formData.append('number', values.number);
            formData.append('gender', values.gender);
            formData.append('image', values.image);

            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                console.log("Profile updated successfully:", response);
                update(response);
                navigate('/profilepage');
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
            });
        },
    });

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/userdata`)
            .then((response) => {
                formik.setValues(response.data.user);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, []);

    return (
        <div>
            <div className="modal-content container" style={{ width: "60%", marginTop: "10%" }}>
                <div className="modal-header">
                    <h5 className="modal-title">Update Profile</h5>
                </div>
                <div className="modal-body">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-3 row">
                            <div className="col-12">
                                <label htmlFor="fullname" className="form-label">Full name</label>
                                <input
                                    type="text"
                                    className={`form-control`}
                                    id="fullname"
                                    name="fullname"
                                    placeholder="Enter full name"
                                    value={formik.values.fullname}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.fullname ? (
                                    <div className="text-danger">{formik.errors.fullname}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <div className="col-12">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className={`form-control`}
                                    id="username"
                                    name="username"
                                    placeholder="Enter username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    
                                />
                                {formik.errors.username ? (
                                    <div className="text-danger">{formik.errors.username}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <div className="col-6">
                                <label htmlFor="number" className="form-label">Number</label>
                                <input
                                    type="text"
                                    className={`form-control`}
                                    id="number"
                                    name="number"
                                    placeholder="91*******"
                                    value={formik.values.number}
                                    onChange={formik.handleChange}
                                    
                                />
                                {formik.errors.number ? (
                                    <div className="text-danger">{formik.errors.number}</div>
                                ) : null}
                            </div>
                            <div className="col-6">
                                <label htmlFor="gender" className="form-label">Gender</label><br />
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="male"
                                        value="male"
                                        onChange={formik.handleChange}
                                        
                                        checked={formik.values.gender === "male"}
                                    />
                                    <label className="form-check-label" htmlFor="male">Male</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="female"
                                        value="female"
                                        onChange={formik.handleChange}
                                        
                                        checked={formik.values.gender === "female"}
                                    />
                                    <label className="form-check-label" htmlFor="female">Female</label>
                                </div>
                                {formik.errors.gender ? (
                                    <div className="text-danger">{formik.errors.gender}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <div className="col-12">
                                <label htmlFor="image" className="form-label">Image</label>
                                <input
                                    className={`form-control }`}
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={(event) => {
                                        formik.setFieldValue("image", event.currentTarget.files[0]);
                                    }}
                                    
                                />
                                {formik.errors.image ? (
                                    <div className="text-danger">{formik.errors.image}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="mb-3 row mt-5">
                            <div className="d-grid gap-2 col-12 mx-auto">
                                <button type="submit" className="btn btn-warning">Update</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileUpdate;
