import React from 'react';
import {Button, MenuItem, Select, TextField} from "@mui/material";
import Modal from "../../../Components/UI/Modal/Modal";
import axios from "axios";
import {toast} from "react-toastify";

const ModalAddNewEmployee = (props) => {


    let [arrPosEmployee, setArrPosEmployee] = React.useState([]);
    let [nameEmployee, setNameEmployee] = React.useState("");
    let [selectedPosEmployee, setSelectedPosEmployee] = React.useState("");

    let [salaryEmployee, setSalaryEmployee] = React.useState("");
    let [addressEmployee, setAddressEmployee] = React.useState("");
    let [phoneEmployee, setPhoneEmployee] = React.useState("");

    const addNewEmployee = async () => {
        const newEmployee = {
            FIO : nameEmployee,
            Position : selectedPosEmployee,
            Salary : salaryEmployee,
            Address : addressEmployee,
            Phone : phoneEmployee
        };

        const {data} = await axios.post("http://127.0.0.1:4556/api/Employee/addNewEmployee", newEmployee);
        toast(data.message);

        setNameEmployee("");
        setSelectedPosEmployee("");
        setSalaryEmployee("");
        setAddressEmployee("");
        setPhoneEmployee("");
        props.flag(true);
    }

    async function fetchPositions(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/Position/getAllPositions");
        setArrPosEmployee(data.positions);
    }

    React.useEffect(()=>{
        fetchPositions();
    }, []);

    return (
        <Modal colorClose={"black"}  bgInnerColor={"white"} TextColor={"black"} width={"700px"} height={"600px"} active={props.active} setActive={props.setActive}>
            <h1>Добавить сотрудника</h1>
            <div><TextField value={nameEmployee} onChange={(event)=> setNameEmployee(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите имя"} id="outlined-basic"  variant="outlined" /></div>

            <div><Select
                sx={{width: 320, m: 1}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedPosEmployee}
                label="Position"
            >
                {arrPosEmployee.map((position)=>(
                    <MenuItem onClick={()=> setSelectedPosEmployee(position.ID) } key={position.ID} value={position.ID}>{position.Position}</MenuItem>
                ))

                }
            </Select></div>

            <div><TextField value={salaryEmployee} onChange={(event)=> setSalaryEmployee(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите зарплату"} id="outlined-basic"  variant="outlined" /></div>
            <div><TextField value={addressEmployee} onChange={(event)=> setAddressEmployee(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите адрес"} id="outlined-basic"  variant="outlined" /></div>
            <div><TextField value={phoneEmployee} onChange={(event)=> setPhoneEmployee(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите номер телефона"} id="outlined-basic"  variant="outlined" /></div>

            <div><Button onClick={ addNewEmployee } sx={{ width: 320, m:4 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Добавить</Button></div>

        </Modal>
    );
};

export default ModalAddNewEmployee;