import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as Yup from 'yup';
import { Formik } from 'formik';

const schema = Yup.object().shape({
    otp: Yup.number().required('otp is required'),
});

const OtpVerify = () => {
    const navigate = useNavigate()
    const [Error, setError] = useState(false)
    const [email, setemail] = useState("")
    const [otp, setotp] = useState("")
    const location = useLocation();
    console.log(location)
    const data = location.state;
    console.log(data)

    useEffect(() => {
        if (data) {
            setemail(data.email)
        }
    },[])
    const handleSubmit = (values) => {
       console.log(values)

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/verify`, { email: email, otp: values.otp })
            .then((res) => {
                // console.log(res)

                if (res.data.message === "User verify successfully") {
                    console.log("success")
                    setError(false)
                    navigate("/")
                }
                else if (res.data.message === "Otp dose not match") {
                    setError("Otp dose not match")
                }
                else if (res.data.message === "Please Register first") {
                    navigate('/register')
                }
            })
            .catch((err) => console.log(err))
    }

    const Handleresend = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/resend`, { email: email })
            .then((res) => {
                console.log(res)
                if (res.data.message === "Please Register first") {
                    navigate('/register')
                }
            })
            .catch((err) => console.log(err))
    }

    return (
        <div>
            <div>
                <div className="modal-content container" style={{ width: "30%", marginTop: "15%" }}>
                    <div className="modal-header">
                        <h5 className="modal-title" >Otp Verify</h5>
                    </div>
                    <div className="modal-body" >
                    <Formik
                        initialValues={{ otp:'' }}
                        validationSchema={schema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, handleChange, handleSubmit, setFieldValue }) => (
                            <form onSubmit={handleSubmit}> 
                        <div className="mb-3 row">
                            <div className="col-12">
                                <input type="email" className="form-control" id="email" name="email" value={email} hidden />
                            </div>

                        </div>
                        <div className="mb-3 row">
                            <div className="col-12">
                                <input type="number" className="form-control" id="otp" name="otp" onChange={handleChange} placeholder="Enter OTP" />
                                {errors.otp && <div className="text-danger">{errors.otp}</div>}
                                {!errors.otp?Error && <div className="text-danger">{Error}</div>:""}
                            </div>

                        </div>
                        <div className="mb-3 row mt-4">
                            <div className="d-grid gap-2 col-12 mx-auto">
                                <button  type="submit" className="btn btn-success" value="Verify"
                                    id="post" >submit</button>
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
                        <div className="mb-3 row mt-4">
                            <div className="d-grid col-12 mx-auto text-center">
                                <small>Create a new OTP  <p style={{textDecoration:"none" , color:"blue" , cursor:"pointer"}} onClick={Handleresend}>Resend OTP?</p></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtpVerify
