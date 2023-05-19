    import React from 'react';
    import {Button, InputLabel, MenuItem, Select, TextField} from "@mui/material";
    import Modal from "../../Components/UI/Modal/Modal";
    import axios from "axios";
    import {getRawMaterials} from "../../Redux/Slice/rawMaterialSlice";
    import {useDispatch} from "react-redux";
    import {toast} from "react-toastify";

    const ModalAddNewRawMat = (props) => {

        const dispatch = useDispatch();

        let [selectedUnit, setSelectedUnit] = React.useState(0);
        let [nameRawMat, setNameRawMat] = React.useState("");
        let [arrUnits, setArrUnits] = React.useState([]);

        async function fetchUnits(){
            const {data} = await axios.get("http://127.0.0.1:4556/api/units/getUnits");
            setArrUnits(data.unit);
        }

        React.useEffect(()=>{
            fetchUnits();
        }, []);

        const  AddNewRawMaterial = () => {
            let params = {
                Name: nameRawMat,
                Unit: selectedUnit
            };

            async function fetchAddRawMat(params){
                let {data} = await axios.post("http://127.0.0.1:4556/api/RawMaterial/addNewRawMaterial", params);
                dispatch(getRawMaterials());
                toast(data.message);
            }

            fetchAddRawMat(params);

        }


        return (
            <Modal  bgInnerColor={"white"} TextColor={"black"} width={"600px"} height={"500px"} active={props.active} setActive={props.setActive}>
                <h1>Добавить сырье</h1>

                <TextField value={nameRawMat} onChange={(event)=> setNameRawMat(event.target.value)} sx={{width: 320}}  InputProps={{ sx: { height: 50 } }} label={"Введите название"} id="outlined-basic"  variant="outlined" />

                <InputLabel sx={{ mt: 3.5 }} id="demo-simple-select-label">Единица измерения</InputLabel>
                <Select
                    sx={{width: 320, mb: 7}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedUnit}
                    label="RawMaterial"
                    onChange={(event)=> setSelectedUnit(event.target.value)}
                >
                    {arrUnits.map((unit)=>(
                        <MenuItem key={unit.ID} value={unit.ID}>
                            {unit.Name}
                        </MenuItem>
                    ))

                    }
                </Select>

                <div><Button onClick={ AddNewRawMaterial } sx={{ width: 320 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Добавить</Button></div>
                <div><Button onClick={()=>props.setActive(false)} sx={{width: 320, mt: 3}}  InputProps={{ sx: { height: 50 }}} color={"error"}  variant="contained">Отмена</Button></div>


            </Modal>
        );
    };

    export default ModalAddNewRawMat;