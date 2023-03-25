import React from 'react';
import {
    Button, InputLabel,
    MenuItem, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {getAllProducts} from "../Redux/Slice/productsSlice";
import styled from "styled-components";
import Modal from "../Components/Modal/Modal";
import axios from "axios";
import {toast} from "react-toastify";
import {getRawMaterials} from "../Redux/Slice/rawMaterialSlice";


let ManagePanel = styled.div`
  width: 100%;
  height: 80px;
  border: 1px solid grey;
  border-radius: 15px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 100px;
`


const FinishProducts = () => {

    const dispatch = useDispatch();

    let [activeModalAddNewProduct, setActiveModalAddNewProduct] = React.useState(false);
    let [activeModalEditComponents, setActiveModalEditComponents] = React.useState(false);

    let [selectedProductID, setSelectedProductID] = React.useState(0);
    let [selectedMaterial, setSelectedMaterial] = React.useState(0);
    let [countComponent, setCountComponent] = React.useState(0);
    let {arrProducts} = useSelector(state => state.productReduces);
    let {arrRawMaterials} = useSelector(state => state.rawMaterialReducer);
    let [nameNewProduct, setNameNewProduct] = React.useState("");
    let [selectedUnit, setSelectedUnit] = React.useState(0);
    let [arrUnits, setArrUnits] = React.useState([]);
    let [flag, setFlag] = React.useState(false);

    React.useEffect(()=>{
        dispatch(getAllProducts());
        setFlag(false);
    },[dispatch, flag]);

    React.useEffect(()=>{
        dispatch(getRawMaterials());
    },[dispatch]);

    async function fetchUnits(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/getUnits");
        setArrUnits(data);
    }

    React.useEffect(()=>{
        void fetchUnits();
    }, []);

    const handleAddNewProduct = async () => {
        const newProduct = {
            Name: nameNewProduct,
            Unit: selectedUnit
        }

        const {data} = await axios.post("http://127.0.0.1:4556/api/addNewProduct", newProduct);
        toast(data);
        setFlag(true);
    }

    const handleAddNewComponent = async () => {
        const newComponent = {
            Product: selectedProductID,
            RawMaterial: selectedMaterial,
            Count: countComponent
        }

        const {data} = await axios.post("http://127.0.0.1:4556/api/addNewComponent", newComponent);
        toast(data);
    }

    return (
        <div>
            <h1>Готовая продукция</h1>

            <TableContainer >
                <Table  size="small" >
                    <TableHead>
                        <TableRow>

                            <TableCell align="left">Название</TableCell>
                            <TableCell align="left">Порция</TableCell>
                            <TableCell align="left">Количество</TableCell>
                            <TableCell align="left">Общ. себес.</TableCell>
                            <TableCell align="left">Себес. за ед.</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {arrProducts.map((product) => (
                            <TableRow key={product.ID}>
                                <TableCell align="left">{product.Name}</TableCell>
                                <TableCell align="left">{product.Unit}</TableCell>
                                <TableCell align="left">{product.Count}</TableCell>
                                <TableCell align="left">{product.Sum} сом</TableCell>
                                <TableCell align="left">{product.Cost} сом</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <ManagePanel>
                <Button onClick={()=>setActiveModalAddNewProduct(true)} sx={{ width: 250 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Добавить продукт</Button>
                <Button onClick={()=>{setActiveModalEditComponents(true)}} sx={{ width: 250 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Добавить рецепт</Button>
            </ManagePanel>

            {activeModalAddNewProduct ?
                    <Modal  bgInnerColor={"white"} TextColor={"black"} width={"600px"} height={"400px"} active={activeModalAddNewProduct} setActive={setActiveModalAddNewProduct}>
                        <h1>Добавить продукт</h1>

                        <TextField value={nameNewProduct} onChange={(event)=> setNameNewProduct(event.target.value)} sx={{width: 320}}  InputProps={{ sx: { height: 50 } }} label={"Введите название напитка"} id="outlined-basic"  variant="outlined" />

                        <InputLabel sx={{ mt: 3.5 }} id="demo-simple-select-label">Единица измерения</InputLabel>
                        <Select
                            sx={{width: 320, mb: 7}}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedUnit}
                            label="Unit"
                        >
                            {arrUnits.map((unit)=>(
                                <MenuItem onClick={()=> setSelectedUnit(unit.ID) } key={unit.ID} value={unit.ID}>{unit.Name}</MenuItem>
                            ))

                            }
                        </Select>

                        <div><Button onClick={handleAddNewProduct} sx={{width: 320}}  InputProps={{ sx: { height: 50 }}}  variant="contained">Добавить</Button></div>

                    </Modal>
                :
                    <></>
                }

            {activeModalEditComponents ?
                <Modal  bgInnerColor={"white"} TextColor={"black"} width={"600px"} height={"500px"} active={activeModalEditComponents} setActive={setActiveModalEditComponents}>
                    <h1>Добавить компонент</h1>

                    <InputLabel sx={{ mt: 2 }} id="demo-simple-select-label">Выберите напиток</InputLabel>
                    <Select
                        sx={{width: 320}}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedProductID}
                        label="RawMaterial"
                    >
                        {arrProducts.map((product)=>(
                            <MenuItem onClick={()=> setSelectedProductID(product.ID) } key={product.ID} value={product.ID}>{product.Name}</MenuItem>
                        ))

                        }
                    </Select>

                    <InputLabel sx={{ mt: 4 }} id="demo-simple-select-label">Выберите продукт</InputLabel>
                    <Select
                        sx={{width: 320, mb: -0.5}}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedMaterial}
                        label="Raw"
                    >
                        {arrRawMaterials.map((material)=>(
                            <MenuItem
                                onClick={() => setSelectedMaterial(material.ID)  }
                                key={material.ID}
                                value={material.ID}>
                                {material.Name}
                            </MenuItem>
                        ))
                        }
                    </Select>

                    <TextField value={countComponent} onChange={(event)=> setCountComponent(event.target.value)} sx={{width: 320, mt: 6}}  InputProps={{ sx: { height: 50 } }} label={"Введите количество"} id="outlined-basic"  variant="outlined" />

                    <div><Button onClick={handleAddNewComponent} sx={{width: 320, mt: 5}}  InputProps={{ sx: { height: 50 }}}  variant="contained">Добавить</Button></div>


                </Modal>
                :
                    <></>
                }

        </div>
    );
};

export default FinishProducts;