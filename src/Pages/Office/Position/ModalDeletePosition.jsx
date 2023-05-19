import React from 'react';
import {Button, MenuItem, Select, TextField} from "@mui/material";
import Modal from "../../../Components/UI/Modal/Modal";
import axios from "../../../Utils/Axios";
import {toast} from "react-toastify";

const ModalDeletePosition = (props) => {

    let [selectedPositionID, setSelectedPositionID] = React.useState(0);
    let [arrPositions, setArrPositions] = React.useState([]);

    const fetchPositions = async ()=>{
        let {data} = await axios.get("http://127.0.0.1:4556/api/Position/getAllPositions");
        setArrPositions(data.positions);
    };

    React.useEffect(()=>{
        fetchPositions();
    },[selectedPositionID]);

    const deletePosition = async ()=>{
        let {data} = await axios.delete(`http://127.0.0.1:4556/api/Position/deletePosition/${selectedPositionID}`);
        toast(data.message);
        setSelectedPositionID(0);
    }

    return (
        <Modal colorClose={"black"}  bgInnerColor={"white"} TextColor={"black"} width={"500px"} height={"300px"} active={props.active} setActive={props.setActive}>
            <h1>Удалить позицию</h1>
            <div><Select
                sx={{width: 320, m: 1}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedPositionID}
                label="Position"
                onChange={(event)=> setSelectedPositionID(event.target.value)}
            >
                {arrPositions.map((position)=>(
                    <MenuItem key={position.ID} value={position.ID} >{position.Position}</MenuItem>
                ))}
            </Select></div>
            <div><Button onClick={ deletePosition } sx={{ width: 320, m:4 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color={"error"}>Удалить</Button></div>

        </Modal>
    );
};

export default ModalDeletePosition;