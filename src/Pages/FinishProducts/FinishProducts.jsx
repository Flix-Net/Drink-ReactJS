    import React from 'react';
    import {
    Button, InputLabel, MenuItem, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
    import {useDispatch, useSelector} from "react-redux";
    import {getAllProducts} from "../../Redux/Slice/productsSlice";
    import styled from "styled-components";
    import Modal from "../../Components/UI/Modal/Modal";

    import ModalAddNewProduct from "./ModalAddNewProduct";
    import ModalEditProduct from "./ModalEditProduct";
    import ModalDeleteProduct from "./ModalDeleteProduct";

    import ModalEditConfigComp from "./optional module/ModalEditConfigComp";
    import ModalAddComponent from "./optional module/ModalAddComponent";
    import ModalDeleteComponent from "./optional module/ModalDeleteComponent";
    import axios from "axios";


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


    const ContainerBlock = styled.div`
      text-align: center;
      width: 440px;
      padding: 5px;
      margin: 10px;
      border: ${props => props.border || "1px solid grey"} ;
      border-radius: 10px;
      min-height: 150px;
      height: ${props => props.height || "410px"};
    `


    const FinishProducts = () => {

        const dispatch = useDispatch();

        let [activeModalAddNewProduct, setActiveModalAddNewProduct] = React.useState(false);
        let [activeModalEditProduct, setActiveModalEditProduct] = React.useState(false);
        let [activeModalDeleteProduct, setActiveModalDeleteProduct] = React.useState(false);
        let [selectedProductID, setSelectedProductID] = React.useState(0);
        let [activeModalComponents, setActiveModalComponents] = React.useState(false);
        let [componentsByNormal, setComponentsByNormal] = React.useState([]);
        let [activeModalEditComponent, setActiveModalEditComponent] = React.useState(false);
        let [activeModalAddComponent, setActiveModalAddComponent] = React.useState(false);
        let [activeModalDeleteComponent, setActiveModalDeleteComponent] = React.useState(false);




        let {arrProducts} = useSelector(state => state.productReduces) || null;


        let [flag, setFlag] = React.useState(false);

        React.useEffect(()=>{
            dispatch(getAllProducts());
            setFlag(false);
        },[dispatch, flag]);


        async function fetchComponents(selectedProductID)
        {
            let params = {
                inputID : selectedProductID
            }
            const {data} = await axios.post("http://127.0.0.1:4556/api/Components/getComponentsByID", params)
            setComponentsByNormal(data.components);
        }


        React.useEffect(()=>{
            if (selectedProductID > 0)
                fetchComponents(selectedProductID);
            console.log(selectedProductID)
        },[selectedProductID, flag]);


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
                    <Button onClick={()=>setActiveModalAddNewProduct(true)} sx={{ width: 250 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="success">Добавить новый продукт</Button>
                    <Button onClick={()=>setActiveModalEditProduct(true)} sx={{ width: 250 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Редактировать продукт</Button>
                    <Button onClick={()=>setActiveModalDeleteProduct(true)} sx={{ width: 250 }}  InputProps={{ sx: { height: 50 }}} variant="outlined" color="error">Удалить продукт</Button>
                    <Button onClick={()=>{setActiveModalComponents(true)}} sx={{ width: 250 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Изменить рецепт</Button>
                </ManagePanel>

                {activeModalAddNewProduct ?
                    <ModalAddNewProduct active={activeModalAddNewProduct} setActive={setActiveModalAddNewProduct} updateFlag={setFlag}  />
                    :
                        <></>
                }


                {activeModalEditProduct ?
                    <ModalEditProduct active={activeModalEditProduct} setActive={setActiveModalEditProduct} updateFlag={setFlag} />
                    :
                    <></>
                }

                {activeModalDeleteProduct ?
                    <ModalDeleteProduct active={activeModalDeleteProduct} setActive={setActiveModalDeleteProduct} updateFlag={setFlag} />
                    :
                    <></>
                }

                {activeModalComponents ?
                    <Modal display={"flex"} bgInnerColor={"white"} TextColor={"black"} width={"1200px"} height={"600px"} active={activeModalComponents} setActive={setActiveModalComponents} >

                        {componentsByNormal.length > 0 ?
                            <ContainerBlock>
                                <h2>Необходимо</h2>

                                <TableContainer>
                                    <Table size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow key={"Main"}>
                                                <TableCell align="left">Продукт</TableCell>
                                                <TableCell align="left">Количество</TableCell>
                                                <TableCell align="left">Ед. измер.</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {componentsByNormal.map((component) => (
                                                <TableRow key={component.RawMat}>
                                                    <TableCell key={component.RawMat} align="left">{component.RawMat}</TableCell>
                                                    <TableCell key={component.Count} align="left">{(component.Count).toFixed(2)}</TableCell>
                                                    <TableCell key={component.Unit} align="left">{component.Unit}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </ContainerBlock>
                            :
                            <></>
                        }

                        <ContainerBlock>
                            <InputLabel sx={{ mt: 0 }} id="demo-simple-select-label">Выберите напиток</InputLabel>
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

                            <div><Button onClick={()=>setActiveModalEditComponent(true)} sx={{ width: 250, mb:5, mt:5 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="success">Изменить соотношение</Button></div>
                            <div><Button onClick={()=>setActiveModalAddComponent(true)} sx={{ width: 250, mb:5 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Добавить компонент</Button></div>
                            <div><Button onClick={()=>setActiveModalDeleteComponent(true)} sx={{ width: 250, mb:5 }}  InputProps={{ sx: { height: 50 }}} variant="outlined" color="error">Удалить компонент</Button></div>
                        </ContainerBlock>

                    </Modal>
                    :
                    <></>
                }

                {activeModalEditComponent ?
                    <ModalEditConfigComp active={activeModalEditComponent} setActive={setActiveModalEditComponent} selectedProductID={selectedProductID} updateFlag={setFlag} />
                    :
                    <></>

                }

                {activeModalAddComponent ?
                    <ModalAddComponent active={activeModalAddComponent} setActive={setActiveModalAddComponent} selectedProductID={selectedProductID} updateFlag={setFlag} />
                    :
                    <></>

                }

                {activeModalDeleteComponent ?
                    <ModalDeleteComponent active={activeModalDeleteComponent} setActive={setActiveModalDeleteComponent} selectedProductID={selectedProductID} updateFlag={setFlag} />
                    :
                    <></>
                }



            </div>
        );
    };

    export default FinishProducts;