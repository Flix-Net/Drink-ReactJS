import React from 'react';
import axios from "../../../Utils/Axios";
import {toast} from "react-toastify";
import Modal from "../../../Components/UI/Modal/Modal";
import {Button, MenuItem, Select} from "@mui/material";

const ModalDeleteUnit = (props) => {

    let [selectedUnitID, setSelectedUnitID] = React.useState(0);
    let [arrUnits, setArrUnits] = React.useState([]);

    const fetchUnits = async ()=>{
        let {data} = await axios.get("http://127.0.0.1:4556/api/units/getUnits");
        setArrUnits(data.unit);
    };

    React.useEffect(()=>{
        fetchUnits();
    },[selectedUnitID]);

    const deletePosition = async ()=>{
        let {data} = await axios.delete(`http://127.0.0.1:4556/api/units/deleteUnit/${selectedUnitID}`);
        toast(data.message);
        setSelectedUnitID(0);
    }

    return (
        <Modal colorClose={"black"}  bgInnerColor={"white"} TextColor={"black"} width={"500px"} height={"300px"} active={props.active} setActive={props.setActive}>
            <h1>Удалить удиницу измерения</h1>
            <div><Select
                sx={{width: 320, m: 1}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedUnitID}
                label="Unit"
                onChange={(event)=> setSelectedUnitID(event.target.value)}
            >
                {arrUnits.map((unit)=>(
                    <MenuItem key={unit.ID} value={unit.ID} >{unit.Name}</MenuItem>
                ))}
            </Select></div>
            <div><Button onClick={ deletePosition } sx={{ width: 320, m:4 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color={"error"}>Удалить</Button></div>

        </Modal>
    );
};

export default ModalDeleteUnit;