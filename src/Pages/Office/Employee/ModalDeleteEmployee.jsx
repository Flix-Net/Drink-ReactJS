import React from 'react';
import {Button, MenuItem, Select, TextField} from "@mui/material";
import Modal from "../../../Components/UI/Modal/Modal";
import axios from "axios";
import {toast} from "react-toastify";

const ModalDeleteEmployee = (props) => {


    let [arrEmployees, setArrEmployees] = React.useState([]);
    let [selectedEmployeeID, setSelectedEmployeeID] = React.useState(0);


    const deleteEmployee = async () => {
        if (selectedEmployeeID === 0)
        {
            toast("Выберите сотрудника");
        }
        else
        {
            const {data} = await axios.delete(`http://127.0.0.1:4556/api/Employee/deleteEmployee/${selectedEmployeeID}`);
            toast(data.message);
            setSelectedEmployeeID(0);

            props.flag(true);
        }

    }

    async function fetchEmployees(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/Employee/getListEmployees");
        setArrEmployees(data.employees);
    }

    React.useEffect(()=>{
        fetchEmployees();
    }, [selectedEmployeeID]);


    return (
        <Modal colorClose={"black"}  bgInnerColor={"white"} TextColor={"black"} width={"600px"} height={"300px"} active={props.active} setActive={props.setActive}>
            <h1>Удаление сотрудника</h1>

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

            <div><Button onClick={ deleteEmployee } sx={{ width: 320, m:4 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color={"error"}>Удалить</Button></div>

        </Modal>
    );
};

export default ModalDeleteEmployee;