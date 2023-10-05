import { useCallback, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { Button, Card, Typography, CardContent, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

interface EditCategory {
  status: string;
}


const EditCategory: React.FC = () => {
  // const ApiUrl = 'https://week-15-rprasetyob-production.up.railway.app/'
  const ApiUrl = 'http://localhost:4000/'
  const navigate = useNavigate();
  const { id } = useParams();
  const Url1 = ApiUrl + `v1/tasks/${id}`;
  
  const [category, setCategory] = useState<EditCategory>();

  const getCategory = useCallback(
    async () => {
      const response = await fetch(Url1, {
        method: 'GET'
      });
      const data = await response.json();      
      setCategory(data.data);
      console.log(data);
    },
    [Url1]
  );
  const initialValues = {
    status: category?.status || 'Not started'
  };
 
  
  useEffect(
    ()=> {
      getCategory();
    },
    [getCategory]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>(initialValues.status); 

  const handleStatus = (event: SelectChangeEvent) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
  }

  const handleSubmit = async (values: EditCategory) => {
    setIsLoading(true);
    values.status = status;
    console.log(values);

    const Url = ApiUrl + `v1/tasks/${id}`;
    try {
      const response = await fetch(Url, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      console.log(response);
      Swal.fire({
        icon: 'success',
        title: 'Edit task Success',
        text: 'Successfully edit task.',
      });
      navigate('/');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };  

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({
            handleSubmit,
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
              Update Status
            </Typography>
            <Form onSubmit={handleSubmit}>
              <CardContent>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel htmlFor="status">Status</InputLabel>
                  <Select
                    label="Status"
                    name="status"
                    onChange={handleStatus}
                    value={status}
                    placeholder="Choose status"
                    required
                  >
                    <MenuItem value={initialValues.status}><em>{initialValues.status === 'Not started' ? 'Not started (current)' : 'Done / Approved (current)'}</em></MenuItem>
                    <MenuItem value="Done / Approved">Done / Approved</MenuItem>
                    <MenuItem value="Not started">Not started</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
              <Button
                style={{ marginBottom: 10 }}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading || isSubmitting}
                fullWidth
              >
                {isLoading ? "Updating..." : "Update"}
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

export default EditCategory;
