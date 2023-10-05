import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import { Category, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import TableFooter from "@mui/material/TableFooter";
import { useNavigate } from "react-router-dom";

// table style //
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "8px 16px"
  },
}));

// interface //
interface Category {
  _id: string;
  task: string;
  status: string;
}

const TaskManager: React.FC = () => {
  const ApiUrl = 'https://week-15-rprasetyob-production.up.railway.app/'
  // navigation //
  const navigate = useNavigate();

  // useState //
  const [categories, setCategories] = useState<Category[]>([]);

  // fetching //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchTask = async () => {
    try {
      const Url = ApiUrl + 'v1/tasks';
      const response = await fetch(Url, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {  
        fetchTask();
  }, []);

  // Delete //
  const DeleteCategory = async (_id: string) => {
    try {
      const Url = ApiUrl + `v1/tasks/`+ _id;
      const response = await fetch(Url, {
        method: "DELETE"
      });
      
      if (response.ok){
        setCategories((categories) =>
          categories.filter((category) => category._id !== _id)
        );
        Swal.fire({
          icon: 'success',
          title: 'Delete Task Success',
          text: 'Successfully Delete task.',
          });
      } else {
        console.error("Failed to delete category. Status:", response.status);
      }
    } catch (error) {
      console.error("Error while deleting category:", error);
    }
  };

  return (
    <div style={{alignItems: "center",
      padding: "auto",
      backgroundColor: 'rgb(223, 222, 222)',
      width: "100%",
      height: '100vw',
      position: 'relative',
      overflow: 'auto'}}>
      <div style={{paddingTop: '10vh',
        width: '700px',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'}}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px',
          height: '30px',
          marginLeft: 'auto',
          marginRight: 'auto'}}>
          <Button size="large" onClick={() => navigate("/add")}>
            Add category
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
              <StyledTableCell align="center">ID</StyledTableCell>
                <StyledTableCell align="center">Task</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <StyledTableCell colSpan={4} align="center">
                    No data
                  </StyledTableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <StyledTableRow key={category._id} className="tr">
                    <StyledTableCell align="center">
                      {category._id.slice(20,36)}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="td" style={{maxWidth: '200px', overflow: 'auto'}}>
                      {category.task}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {category.status}
                    </StyledTableCell>
                    <StyledTableCell align="right" className="td">
                      <Stack direction="row" justifyContent={"flex-end"} spacing={2}>
                        <Button
                          onClick={() => navigate(`/edit/${category._id}`)}
                          data-testid={`edit-button-${category._id}`}
                          variant="outlined" startIcon={<Edit />}
                          className="btn-edit"
                          size="small"
                          style={{height: 25}}>
                            edit                 
                        </Button>
                        <Button
                          color="error"
                          variant="contained"
                          className="btn-delete"
                          data-testid={`delete-button-${category._id}`}
                          onClick={() => DeleteCategory(category._id)}
                          endIcon={<DeleteIcon />}
                          size="small"
                          style={{height: 25}}>
                            del                       
                        </Button>
                      </Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default TaskManager;
