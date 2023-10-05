import { useState } from "react";
import { Form, Formik } from "formik";
import { Button, TextField, Card, Typography, CardContent } from "@mui/material";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
  task: Yup.string().required("Category is required"),
});

interface addCategory {
  task: string;
}

const initialValues = {
  task: '',
};

const AddCategory: React.FC = () => {
    const navigate = useNavigate();
    const ApiUrl = 'https://week-15-rprasetyob-production.up.railway.app/'
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (values: addCategory) => {
        setIsLoading(true);
        
        const inputAddData = {
            task: values.task,
        }
        const newName = inputAddData.task
        const url1 = ApiUrl + 'v1/tasks';
        const responseName = await fetch(url1, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
        });
        const data = await responseName.json();
        const existingCategoryNames = data.data.map((category: { task: string; }) => category.task);

        if (existingCategoryNames.includes(newName)) {
        Swal.fire({
            icon: 'error',
            title: 'Add new Category failed',
            text: 'Category name already exists. Please choose a different name.',
        });
        setIsLoading(false);
        } else {
        const Url = ApiUrl + "v1/tasks";
        const response = await fetch(Url, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });
        console.log(response);        

        if (response.ok) {
            Swal.fire({
            icon: 'success',
            title: 'Add Category Success',
            text: 'Successfully added category.',
            });
            navigate("/");
        } else {
            Swal.fire({
            icon: 'error',
            title: 'Add Category Failed',
            text: 'An error occurred during add. Please try again.',
            });
        }
        setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/')
    }

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({
                    handleSubmit,
                    touched,
                    errors,
                    handleChange,
                    handleBlur,
                    isSubmitting,
                }) => (
                    <Card
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '300px',
                            padding: '20px'}}>
                        <Typography
                            sx={{ fontSize: 18 }}
                            color="text.secondary"
                            gutterBottom
                        >
                            Add Category
                        </Typography>
                        <Form onSubmit={handleSubmit}>
                            <CardContent>
                                <TextField
                                    label="Task"
                                    variant="outlined"
                                    name="task"
                                    placeholder="Enter new task"
                                    fullWidth
                                    required
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.task && errors.task)}
                                    helperText={touched.task && errors.task}
                                    sx={{ mb: 2 }}
                                />
                            </CardContent>
                            <Button
                                style={{ marginBottom: 10 }}
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading || isSubmitting}
                                fullWidth
                            >
                                {isLoading ? "Adding..." : "Add"}
                            </Button>
                            <Button
                                className="btnTop"
                                onClick={handleCancel}
                                variant="outlined"
                                color="primary"
                                fullWidth
                            >
                                Cancel
                            </Button>
                        </Form>
                    </Card>
                )}
            </Formik>
        </>
    );
};

export default AddCategory;
