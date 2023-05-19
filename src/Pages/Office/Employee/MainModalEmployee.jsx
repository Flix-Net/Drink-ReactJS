import React from 'react';
import styled from "styled-components";
import {Button, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import ModalAddNewEmployee from "./ModalAddNewEmployee";
import ModalEditEmployee from "./ModalEditEmployee";
import ModalDeleteEmployee from "./ModalDeleteEmployee";
import Modal from "../../../Components/UI/Modal/Modal";
import axios from "axios";

let ManagePanel = styled.div`
      width: 100%;
      height: 80px;
      border: 1px solid grey;
      border-radius: 15px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 40px;
    `

const MainModalEmployee = (props) => {

    let [arrListEmployees, setArrListEmployees] = React.useState([]);
    let [activeModalAddEmployee, setActiveModalAddEmployee] = React.useState(false);
    let [activeModalEditEmployee, setActiveModalEditEmployee] = React.useState(false);
    let [activeModalDeleteEmployee, setActiveModalDeleteEmployee] = React.useState(false);

    let [updateFlag, setUpdateFlag] = React.useState(false);

    async function fetchEmployees(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/Employee/getListEmployees");
        setArrListEmployees(data.employees);
    }

    React.useEffect(()=>{
        fetchEmployees();
        setUpdateFlag(false);
    }, [updateFlag]);

    return (
        <Modal  bgInnerColor={"white"} TextColor={"black"} width={"1400px"} height={"690px"} active={props.active} setActive={props.setActive} >

            <h1>Отдел кадров</h1>

            <TableContainer style={{ maxHeight: `${400}px`, overflow: 'auto' }} >
                <Table  size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ФИО</TableCell>
                            <TableCell align="left">Должность</TableCell>
                            <TableCell align="left">Зарплата</TableCell>
                            <TableCell align="left">Адрес</TableCell>
                            <TableCell align="left">Телефон</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {arrListEmployees.map((employee) => (
                            <TableRow>
                                <TableCell key={employee.ID} align="left">{employee.FIO}</TableCell>
                                <TableCell key={employee.ID} align="left">{employee.Position}</TableCell>
                                <TableCell key={employee.ID} align="left">{employee.Salary} сом</TableCell>
                                <TableCell key={employee.ID} align="left">{employee.Address} </TableCell>
                                <TableCell key={employee.ID} align="left">{employee.Phone} </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ManagePanel>
                <Button onClick={()=> setActiveModalAddEmployee(true)} sx={{ width: 260 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="success" >Добавить сотрудника</Button>
                <Button onClick={()=> setActiveModalEditEmployee(true)} sx={{ width: 260 }}  InputProps={{ sx: { height: 50 }}} variant="contained"  >Редактировать сотрудника</Button>
                <Button onClick={()=> setActiveModalDeleteEmployee(true)} sx={{ width: 260 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="error" >Удалить сотрудника</Button>
            </ManagePanel>

            {activeModalAddEmployee ? <ModalAddNewEmployee active={activeModalAddEmployee} setActive={setActiveModalAddEmployee} flag={setUpdateFlag} />
                :
                <></>
            }

            {activeModalEditEmployee ? <ModalEditEmployee active={activeModalEditEmployee} setActive={setActiveModalEditEmployee} flag={setUpdateFlag} />
                :
                <></>
            }

            {activeModalDeleteEmployee ? <ModalDeleteEmployee active={activeModalDeleteEmployee} setActive={setActiveModalDeleteEmployee} flag={setUpdateFlag} />
                :
                <></>
            }

        </Modal>
    );
};

export default MainModalEmployee;