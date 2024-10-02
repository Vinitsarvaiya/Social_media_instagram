import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';

const schema = Yup.object().shape({
    title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    description: Yup.string().required('Description is required').min(3, 'Description must be at least 3 characters'),
    image: Yup.mixed().required('Image is required')
        // .test('fileSize', 'File is too large', value => value && value.size <= 2 * 1024 * 1024)
        // .test('fileType', 'Unsupported File Format', value => 
        //     value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type))
});

const CreatePosts = () => {
    let token = sessionStorage.getItem("key")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('image', values.image);

        console.log(formData)

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/post/create`,formData)
            console.log("Post created", response);
            navigate('/profile');
        } catch (error) {
            console.error("Post error", error);
        }
    };

    return (
        <div>
            <div className="modal-content container" style={{ width: "60%", marginTop: "10%" }}>
                <div className="modal-header">
                    <h5 className="modal-title">Create Post</h5>
                </div>
                <div className="modal-body">
                    <Formik
                        initialValues={{ title: '', description: '', image: null }}
                        validationSchema={schema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, handleChange, handleSubmit, setFieldValue }) => (
                            <form onSubmit={handleSubmit}> 
                                <div className="mb-3 row">
                                    <div className="col-12">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            name="title"
                                            placeholder="Enter title"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errors.title && <div className="text-danger">{errors.title}</div>}
                                </div>
                                <div className="mb-3 row">
                                    <div className="col-12">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            placeholder="Enter description"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errors.description && <div className="text-danger">{errors.description}</div>}
                                </div>
                                <div className="mb-3 row">
                                    <div className="col-12">
                                        <label htmlFor="image" className="form-label">Image</label>
                                        <input
                                            className="form-control"
                                            type="file"
                                            id="image"
                                            name="image"
                                            onChange={(event) => {
                                                setFieldValue("image", event.currentTarget.files[0]);
                                            }}
                                        />
                                    </div>
                                    {errors.image && <div className="text-danger">{errors.image}</div>}
                                </div>
                                <div className="mb-3 row mt-5">
                                    <div className="d-grid gap-2 col-12 mx-auto">
                                        <button type="submit" className="btn btn-success">Submit</button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default CreatePosts;
