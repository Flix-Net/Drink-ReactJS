import React from 'react';
import {Button, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Modal from "../../Components/UI/Modal/Modal";
import {useSelector} from "react-redux";
import axios from "axios";
import {toast} from "react-toastify";

const ModalEditProduct = (props) => {

    let [arrUnits, setArrUnits] = React.useState([]);
    let [selectedProductID, setSelectedProductID] = React.useState(0);
    let {arrProducts} = useSelector(state => state.productReduces);

    let [nameProduct, setNameProduct] = React.useState("");
    let [unitProduct, setUnitProduct] = React.useState(0);

    async function fetchUnits(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/units/getUnits");
        setArrUnits(data.unit);
    }

    React.useEffect(()=>{
        void fetchUnits();
    }, []);

    React.useEffect(()=>{

        const foundProduct = arrProducts.find((product)=> product.ID === selectedProductID );

        if (foundProduct)
        {
            setNameProduct(foundProduct.Name);
            const fountUnit = arrUnits.find((unit)=> unit.Name === foundProduct.Unit );
            setUnitProduct(fountUnit.ID);

        }

    },[selectedProductID])

    const handleEditProduct = async () => {
        if (selectedProductID === 0)
        {
            toast("Выберите продукт!");
        }
        else
        {
            const editProduct = {
                IDProduct: selectedProductID,
                NewNameProduct: nameProduct,
                NewUnit: unitProduct
            }

            const {data} = await axios.put("http://127.0.0.1:4556/api/products/editProduct", editProduct);
            toast(data.message);
            props.updateFlag(true);
        }

    }

    return (
        <Modal bgInnerColor={"white"} TextColor={"black"} width={"600px"} height={"550px"} active={props.active} setActive={props.setActive} >
            <h1>Изменить продукт</h1>

            <InputLabel sx={{ mt: 4 }} id="demo-simple-select-label">Выберите продукт</InputLabel>
            <Select
                sx={{width: 320, mb: 0}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedProductID}
                label="Product"
                onChange={(event) => setSelectedProductID(event.target.value)}
            >
                {arrProducts.map((product)=>(
                    <MenuItem key={product.ID} value={product.ID}>{product.Name}</MenuItem>

                ))

                }
            </Select>

            <InputLabel sx={{ mt: 4 }} id="demo-simple-select-label">Название</InputLabel>
            <TextField value={nameProduct}
                       onChange={(event)=> setNameProduct(event.target.value)}
                       sx={{width: 320}}
                       InputProps={{ sx: { height: 50 } }}
                       label={"Введите название напитка"}
                       id="outlined-basic"
                       variant="outlined"
            />

            <InputLabel sx={{ mt: 4 }} id="demo-simple-select-label">Выберите ед. измерения</InputLabel>
            <Select
                sx={{width: 320, mb: 4}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={unitProduct}
                label="Unit"
                onChange={(event) => setUnitProduct(event.target.value)}
            >
                {arrUnits.map((unit)=>(
                    <MenuItem key={unit.ID} value={unit.ID}>{unit.Name}</MenuItem>
                ))}

            </Select>

            <div><Button onClick={handleEditProduct} sx={{width: 320}}  InputProps={{ sx: { height: 65 }}}  variant="contained">Изменить</Button></div>


        </Modal>
    );
};

export default ModalEditProduct;