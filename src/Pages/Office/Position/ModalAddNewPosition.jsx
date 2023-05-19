import React from 'react';
import {Button, TextField} from "@mui/material";
import Modal from "../../../Components/UI/Modal/Modal";
import axios from "axios";
import {toast} from "react-toastify";

const ModalAddNewPosition = (props) => {

    let [namePosition, setNamePosition] = React.useState("");

    let newPositiion = {
        Position: namePosition
    }
    let addNewPosition = async ()=>{
        const {data} = await axios.post("http://127.0.0.1:4556/api/Position/addNewPosition", newPositiion);
        toast(data.message);

        setNamePosition("");

    }

    return (
        <Modal colorClose={"black"}  bgInnerColor={"white"} TextColor={"black"} width={"500px"} height={"300px"} active={props.active} setActive={props.setActive}>
            <h1>Добавить позицию</h1>
            <div><TextField value={namePosition} onChange={(event)=> setNamePosition(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите название позиции"} id="outlined-basic"  variant="outlined" /></div>

            <div><Button onClick={ addNewPosition } sx={{ width: 320, m:4 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Добавить</Button></div>

        </Modal>
    );
};

export default ModalAddNewPosition;