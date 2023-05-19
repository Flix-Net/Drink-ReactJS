import React from 'react';
import {Button, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Modal from "../../Components/UI/Modal/Modal";
import axios from "axios";
import {toast} from "react-toastify";

const ModalAddNewProduct = (props) => {

    let [nameNewProduct, setNameNewProduct] = React.useState("");
    let [selectedUnit, setSelectedUnit] = React.useState(0);
    let [arrUnits, setArrUnits] = React.useState([]);
    //let [flag, setFlag] = React.useState(false);

    async function fetchUnits(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/units/getUnits");
        setArrUnits(data.unit);
    }

    React.useEffect(()=>{
        void fetchUnits();
    }, []);

    const handleAddNewProduct = async () => {
        const newProduct = {
            Name: nameNewProduct,
            Unit: selectedUnit
        }

        const {data} = await axios.post("http://127.0.0.1:4556/api/products/addNewProduct", newProduct);
        toast(data.message);
        props.updateFlag(true);
    }

    return (
        <Modal  bgInnerColor={"white"} TextColor={"black"} width={"600px"} height={"400px"} active={props.active} setActive={props.setActive}>
            <h1>Добавить продукт</h1>

            <TextField value={nameNewProduct} onChange={(event)=> setNameNewProduct(event.target.value)} sx={{width: 320}}  InputProps={{ sx: { height: 50 } }} label={"Введите название напитка"} id="outlined-basic"  variant="outlined" />

            <InputLabel  sx={{ mt: 3.5 }} id="demo-simple-select-label">Единица измерения</InputLabel>
            <Select
                sx={{width: 320, mb: 7}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedUnit}
                label="Unit"
                onChange={(event)=> setSelectedUnit(event.target.value) }
            >
                {arrUnits.map((unit)=>(
                    <MenuItem key={unit.ID} value={unit.ID}>
                        {unit.Name}
                    </MenuItem>
                ))

                }
            </Select>

            <div><Button onClick={handleAddNewProduct} sx={{width: 320}}  InputProps={{ sx: { height: 50 }}}  variant="contained">Добавить</Button></div>

        </Modal>
    );
};

export default ModalAddNewProduct;