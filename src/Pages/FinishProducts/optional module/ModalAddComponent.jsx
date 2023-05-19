    import React from 'react';
    import Modal from "../../../Components/UI/Modal/Modal";
    import {Button, InputLabel, MenuItem, Select, TextField} from "@mui/material";
    import {useDispatch, useSelector} from "react-redux";
    import productReduces from "../../../Redux/Slice/productsSlice";
    import rawMaterialReducer, {getRawMaterials} from "../../../Redux/Slice/rawMaterialSlice";
    import axios from "../../../Utils/Axios";
    import {toast} from "react-toastify";

    const ModalAddComponent = (props) => {

        const dispatch = useDispatch();

        //let [selectedProductID, setSelectedProductID] = React.useState(0);
        let [selectedMaterialID, setSelectedMaterialID] = React.useState(0);
        let [countComponent, setCountComponent] = React.useState(0);

        const {arrProducts} = useSelector((state) => state.productReduces) || null;
        const {arrRawMaterials} = useSelector((state) => state.rawMaterialReducer) || null;


        React.useEffect(()=>{
            dispatch(getRawMaterials());
        },[dispatch])

        async function handleAddComponentInProduct()
        {
            const comp = {
                productID: props.selectedProductID,
                rawMaterialID: selectedMaterialID,
                count: countComponent
            }

            const {data} = await axios.post("http://localhost:4556/api/Components/addComponent",comp);
            toast(data.message);
            props.updateFlag(true);
        }

        return (
            <Modal  bgInnerColor={"white"} TextColor={"black"} width={"600px"} height={"500px"} active={props.active} setActive={props.setActive}>

                <h1>Добавить компонент в рецепт</h1>


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
                        <MenuItem key={rawMaterial.ID} value={rawMaterial.ID} > {rawMaterial.Name} </MenuItem>
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


                <div><Button onClick={handleAddComponentInProduct} sx={{width: 320, mt:4}}  InputProps={{ sx: { height: 50 }}}  variant="contained">Добавить</Button></div>


            </Modal>
        );
    };

    export default ModalAddComponent;