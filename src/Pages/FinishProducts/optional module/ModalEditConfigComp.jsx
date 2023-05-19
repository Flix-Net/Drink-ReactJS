    import React from 'react';
    import Modal from "../../../Components/UI/Modal/Modal";
    import {Button, InputLabel, MenuItem, Select, TextField} from "@mui/material";
    import {useSelector} from "react-redux";

    import axios from "../../../Utils/Axios";
    import {toast} from "react-toastify";

    const ModalEditConfigComp = (props) => {


        let [selectedMaterialID, setSelectedMaterialID] = React.useState(0);
        let [countComponent, setCountComponent] = React.useState(0);

        let {arrProducts} = useSelector(state => state.productReduces);
        let [arrRawMaterials, setArrRawMaterials] = React.useState([]);

        React.useEffect(()=>{

            setSelectedMaterialID(0);
            setCountComponent(0);
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

            fetchGetRawMaterialByProductID();
        },[props.selectedProductID]);

        React.useEffect(()=>{

            if (selectedMaterialID !== 0)
            {
                let rawMat = arrRawMaterials.find((rawMat)=> rawMat.RawMatID === selectedMaterialID );
                console.log(rawMat.Count);
                setCountComponent(rawMat.Count);
            }

        },[selectedMaterialID])


        async function handleEditConfigComponent()
        {
            const editComp = {
                productID: props.selectedProductID,
                rawMaterialID: selectedMaterialID,
                count:countComponent
            }
            const {data} = await axios.put("http://localhost:4556/api/Components/editConfigComp", editComp);
            console.log(data.message);
            toast(data.message);
            props.updateFlag(true);
        }


        return (
            <Modal  bgInnerColor={"white"} TextColor={"black"} width={"600px"} height={"500px"} active={props.active} setActive={props.setActive}>

                <h1>Редактировать рецепт</h1>

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

                <TextField
                    value={countComponent}
                    onChange={(event)=> setCountComponent(event.target.value)}
                    sx={{width: 320}}
                    InputProps={{ sx: { height: 50 } }}
                    label={"Введите количество"}
                    id="outlined-basic"
                    variant="outlined"
                />


                <div><Button onClick={handleEditConfigComponent} sx={{width: 320, mt:4}}  InputProps={{ sx: { height: 50 }}}  variant="contained">Сохранить</Button></div>


            </Modal>
        );
    };

    export default ModalEditConfigComp;