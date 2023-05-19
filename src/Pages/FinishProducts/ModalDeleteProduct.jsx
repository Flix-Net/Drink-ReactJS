import React from 'react';
import Modal from "../../Components/UI/Modal/Modal";
import {Button, InputLabel, MenuItem, Select} from "@mui/material";
import {useSelector} from "react-redux";
import axios from "axios";
import {toast} from "react-toastify";

const ModalDeleteProduct = (props) => {

        let [selectedProductID, setSelectedProductID] = React.useState(0);
        let {arrProducts} = useSelector(state => state.productReduces);

        async function handleDeleteProduct(){
            if (selectedProductID === 0)
            {
                toast("Выберите продукт для удаления");
            }
            else
            {
                const { data } = await axios.delete(`http://127.0.0.1:4556/api/products/deleteProduct/${selectedProductID}`);
                toast(data.message);
                props.updateFlag(true);
            }

        }

        return (
            <Modal bgInnerColor={"white"} TextColor={"black"} width={"600px"} height={"300px"} active={props.active} setActive={props.setActive}  >

                <h1>Удалить продукт</h1>

                <InputLabel sx={{ mt: 4 }} id="demo-simple-select-label">Выберите продукт для удаления</InputLabel>
                <Select
                    sx={{width: 320, mb: 4}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedProductID}
                    label="Unit"
                    onChange={(event)=>{setSelectedProductID(event.target.value)}}
                >
                    {arrProducts.map((product)=>(
                        <MenuItem key={product.ID} value={product.ID}>{product.Name}</MenuItem>
                    ))}

                </Select>

                <div><Button onClick={handleDeleteProduct} sx={{width: 320}}  InputProps={{ sx: { height: 65 }}}  variant="contained" color="error" >Удалить продукт</Button></div>


            </Modal>
        );
    };

    export default ModalDeleteProduct;