    import React from 'react';
    import {Button, InputLabel, MenuItem, Select} from "@mui/material";
    import Modal from "../../../Components/UI/Modal/Modal";
    import axios from "../../../Utils/Axios";
    import {toast} from "react-toastify";

    const ModalDeleteComponent = (props) => {

        let [selectedMaterialID, setSelectedMaterialID] = React.useState(0);
        let [arrRawMaterials, setArrRawMaterials] = React.useState([]);


        async function fetchGetRawMaterialByProductID()
        {

            if (props.selectedProductID !== 0)
            {
                let product = {
                    inputID: props.selectedProductID
                };
                const {data} = await axios.post("http://localhost:4556/api/Components/getComponentsByID", product);

                setArrRawMaterials(data.components);
            }

        }


        React.useEffect( ()=>{
            fetchGetRawMaterialByProductID();
        },[selectedMaterialID]);

        React.useEffect( ()=>{
            setSelectedMaterialID(0);
            fetchGetRawMaterialByProductID();
        },[props.selectedProductID]);


        async function handleDeleteComponent()
        {
            const {data} = await axios.delete(`http://localhost:4556/api/Components/deleteComponent/${props.selectedProductID}/${selectedMaterialID}`);
            toast(data.message);
            setSelectedMaterialID(0);
            props.updateFlag(true);
        }


        return (
            <Modal  bgInnerColor={"white"} TextColor={"black"} width={"600px"} height={"500px"} active={props.active} setActive={props.setActive}>

                <h1>Удалить компонент из рецепта</h1>

                <InputLabel sx={{ mt: 3.5 }} id="demo-simple-select-label">Выберите компонент</InputLabel>
                <Select
                    sx={{width: 320, mb: 4}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedMaterialID}
                    label="Unit"
                    onChange={(event)=> setSelectedMaterialID(event.target.value) }
                >
                    {arrRawMaterials.map((rawMaterial)=>(
                        <MenuItem key={rawMaterial.RawMatID} value={rawMaterial.RawMatID} > {rawMaterial.RawMat} </MenuItem>
                    ))}
                </Select>

                <div><Button onClick={handleDeleteComponent} sx={{width: 320, mt:4}}  InputProps={{ sx: { height: 50 }}}  variant="contained" color={"error"} >Удалить</Button></div>


            </Modal>
        );
    };

    export default ModalDeleteComponent;