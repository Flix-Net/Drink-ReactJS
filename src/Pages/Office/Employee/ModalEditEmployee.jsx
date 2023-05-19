import React from 'react';
import {Button, MenuItem, Select, TextField} from "@mui/material";
import Modal from "../../../Components/UI/Modal/Modal";
import axios from "axios";
import {toast} from "react-toastify";

const ModalEditEmployee = (props) => {


    let [arrEmployees, setArrEmployees] = React.useState([]);
    let [selectedEmployeeID, setSelectedEmployeeID] = React.useState(0);
    let [arrPosEmployee, setArrPosEmployee] = React.useState([]);
    let [nameEmployee, setNameEmployee] = React.useState("");
    let [selectedPosEmployee, setSelectedPosEmployee] = React.useState("");

    let [salaryEmployee, setSalaryEmployee] = React.useState("");
    let [addressEmployee, setAddressEmployee] = React.useState("");
    let [phoneEmployee, setPhoneEmployee] = React.useState("");

    const editEmployee = async () => {
        const editEmployee = {
            EmployeeID:selectedEmployeeID,
            FIO : nameEmployee,
            Position : selectedPosEmployee,
            Salary : salaryEmployee,
            Address : addressEmployee,
            Phone : phoneEmployee
        };

        const {data} = await axios.put("http://127.0.0.1:4556/api/Employee/editEmployee", editEmployee);
        toast(data.message);

        setSelectedEmployeeID(0);
        setNameEmployee("");
        setSelectedPosEmployee("");
        setSalaryEmployee("");
        setAddressEmployee("");
        setPhoneEmployee("");
        props.flag(true);
    }

    async function fetchEmployees(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/Employee/getEmployees");
        setArrEmployees(data.employees);
    }

    async function fetchPositions(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/Position/getAllPositions");
        setArrPosEmployee(data.positions);
    }

    React.useEffect(()=>{
        fetchPositions();
    }, []);

    React.useEffect(()=>{
        fetchEmployees();
    }, [selectedEmployeeID]);

    React.useEffect(()=>{
        let finedEmployee = arrEmployees.find((employee)=>employee.ID === selectedEmployeeID);

        if (selectedEmployeeID)
        {
            setNameEmployee(finedEmployee.FIO);
            setSelectedPosEmployee(finedEmployee.Position);
            setSalaryEmployee(finedEmployee.Salary);
            setAddressEmployee(finedEmployee.Address);
            setPhoneEmployee(finedEmployee.Phone);
        }


    },[selectedEmployeeID])

    return (
        <Modal colorClose={"black"}  bgInnerColor={"white"} TextColor={"black"} width={"700px"} height={"600px"} active={props.active} setActive={props.setActive}>
            <h1>Редактировать сотрудника</h1>

            <div><Select
                sx={{width: 320, m: 1}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedEmployeeID}
                label="Position"
                onChange={(event)=> setSelectedEmployeeID(event.target.value)}
            >
                {arrEmployees.map((employee)=>(
                    <MenuItem key={employee.ID} value={employee.ID} >{employee.FIO}</MenuItem>
                ))}
            </Select></div>

            <div><TextField value={nameEmployee} onChange={(event)=> setNameEmployee(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите имя"} id="outlined-basic"  variant="outlined" /></div>


            <div><Select
                sx={{width: 320, m: 1}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedPosEmployee}
                label="Position"
                onChange={(event)=>setSelectedPosEmployee(event.target.value)}
            >
                {arrPosEmployee.map((position)=>(
                    <MenuItem  key={position.ID} value={position.ID}>{position.Position}</MenuItem>
                ))

                }
            </Select></div>

            <div><TextField value={salaryEmployee} onChange={(event)=> setSalaryEmployee(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите зарплату"} id="outlined-basic"  variant="outlined" /></div>
            <div><TextField value={addressEmployee} onChange={(event)=> setAddressEmployee(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите адрес"} id="outlined-basic"  variant="outlined" /></div>
            <div><TextField value={phoneEmployee} onChange={(event)=> setPhoneEmployee(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите номер телефона"} id="outlined-basic"  variant="outlined" /></div>

            <div><Button onClick={ editEmployee } sx={{ width: 320, m:4 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Сохранить</Button></div>

        </Modal>
    );
};

export default ModalEditEmployee;