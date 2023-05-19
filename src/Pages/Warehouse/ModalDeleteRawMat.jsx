    import React from 'react';
    import {Button, InputLabel, MenuItem, Select, TextField} from "@mui/material";
    import Modal from "../../Components/UI/Modal/Modal";
    import {getRawMaterials} from "../../Redux/Slice/rawMaterialSlice";
    import {useDispatch, useSelector} from "react-redux";
    import axios from "../../Utils/Axios";
    import {toast} from "react-toastify";

    const ModalDeleteRawMat = (props) => {

        const dispatch = useDispatch();
        let {arrRawMaterials} = useSelector(state => state.rawMaterialReducer);
        let [selectedProductID, setSelectedProductID] = React.useState(0);

        React.useEffect(()=>{
            dispatch(getRawMaterials());

        },[dispatch,selectedProductID]);

        const DeleteRawMaterial = async ()=>{
            let {data} = await axios.delete(`http://127.0.0.1:4556/api/RawMaterial/deleteRawMaterial/${selectedProductID}`);
            console.log(data);
            toast(data.message);
            props.setUpdateFlag(true);
            setSelectedProductID(0);
        }

        return (
            <Modal  bgInnerColor={"white"} TextColor={"black"} width={"600px"} height={"500px"} active={props.active} setActive={props.setActive}>
                <h1>Удатить сырье</h1>


                <InputLabel sx={{ mt: 3.5 }} id="demo-simple-select-label">Выберите сырье</InputLabel>
                <Select
                    sx={{width: 320, mb: 7}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedProductID}
                    label="RawMaterial"
                    onChange={(event)=> setSelectedProductID(event.target.value)}
                >
                    {arrRawMaterials.map((RawMat)=>(
                        <MenuItem key={RawMat.ID} value={RawMat.ID}>
                            {RawMat.Name}
                        </MenuItem>
                    ))

                    }
                </Select>

                <div><Button onClick={ DeleteRawMaterial } sx={{ width: 320 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color={"error"}>Удалить</Button></div>
                <div><Button onClick={()=>props.setActive(false)} sx={{width: 320, mt: 3}}  InputProps={{ sx: { height: 50 }}} color={"error"}  variant="contained" color={"warning"}>Отмена</Button></div>


            </Modal>
        );
    };

    export default ModalDeleteRawMat;