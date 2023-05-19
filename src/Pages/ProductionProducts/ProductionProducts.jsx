    import React from 'react';
    import {
        Button,
        InputLabel,
        MenuItem,
        Select,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow, TextField
    } from "@mui/material";
    import {useDispatch, useSelector} from "react-redux";
    import axios from "axios";
    import {getAllProducts} from "../../Redux/Slice/productsSlice";
    import styled from "styled-components";
    import {toast} from "react-toastify";
    import {RiMoneyDollarCircleLine} from "react-icons/ri";
    import ModalHistoryProduction from "./ModalHistoryProduction";


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

    const MainBlock = styled.div`
      width: 100%;
      display: flex;
    `

    const ContainerBlock = styled.div`
      text-align: center;
      width: 400px;
      padding: 5px;
      margin: 10px;
      border: ${props => props.border || "1px solid grey"} ;
      border-radius: 10px;
      min-height: 150px;
    `

    const MyBalance = styled.div`
      position: absolute;
      top: 110px;
      left: 1110px;
      font-size: 34px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #0d488d;
    
    `


    const ProductionProducts = () => {

        const dispatch = useDispatch();

        let [activeModalHistoryProd, setActiveModalHistoryProd] = React.useState(false);

        const {arrProducts} = useSelector(state => state.productReduces);
        let [selectedProductID, setSelectedProductID] = React.useState(0);
        let [componentsByNormal, setComponentsByNormal] = React.useState([]);
        let [componentsInWarehouse, setComponentsInWarehouse] = React.useState([]);
        let [countProduct, setCountProduct] = React.useState(1);
        let [arrEmployees, setArrEmployees] = React.useState([]);
        let [selectedEmployee, setSelectedEmployee] = React.useState(0);
        let [warning, setWarning] = React.useState("");
        let [myBalance, setMyBalance] = React.useState(0);

        async function fetchEmployees(){
            const {data} = await axios.get("http://127.0.0.1:4556/api/Employee/getEmployees");
            setArrEmployees(data.employees);
        }

        React.useEffect(()=>{ fetchEmployees() }, []);

        async function fetchComponents(selectedProductID)
        {
            let params = {
                inputID : selectedProductID
            }
            const {data} = await axios.post("http://127.0.0.1:4556/api/Components/getComponentsByID", params)
            setComponentsByNormal(data.components);
        }

        async function fetchMyBalance(){
            const {data} = await axios.get("http://127.0.0.1:4556/api/Budget/getMyBalance");
            setMyBalance(data.budget.toFixed(2));
        }

        React.useEffect(()=>{ fetchMyBalance() },[myBalance]);

        async function fetchCountCompFromWarehouse()
        {
            let arr = [];
            for (let compID of componentsByNormal)
            {
                let params = {
                    ComponentID : compID.RawMatID
                }
                const {data} = await axios.post("http://127.0.0.1:4556/api/Components/getCountCompFromWarehouse", params)

                arr.push(data.components[0]);
            }
            setComponentsInWarehouse(arr);
        }

        async function fetchAddFinishProduct()
        {
                let params = {
                    IDProduct : selectedProductID,
                    countProducts : countProduct,
                    IDEmployee : selectedEmployee,
                }
                await axios.post("http://127.0.0.1:4556/api/products/addFinishProduct", params)
        }

        React.useEffect(()=>{
            dispatch(getAllProducts());
        },[dispatch]);

        React.useEffect(()=>{
            if (selectedProductID > 0)
                fetchComponents(selectedProductID);
                setComponentsInWarehouse([]);

        },[selectedProductID]);

        React.useEffect(()=>{
                fetchCountCompFromWarehouse();
        },[componentsByNormal]);

        const handleProductionProduct = async () => {
            if ((countProduct < 1 && selectedProductID === 0) || (countProduct < 1 && selectedProductID > 0) || (countProduct > 0 && selectedProductID === 0) )
            {
                setWarning("Введите данные корректно!");
            }
            else
            {
                let allCompAvailable;

                let product = {
                    productID: selectedProductID
                }
                const {data} = await axios.post("http://127.0.0.1:4556/api/products/checkComponentAvailability", product)
                allCompAvailable = data.Status;

                if (!allCompAvailable)
                {
                    setWarning("Нехватка продуктов!");
                }

                if (allCompAvailable)
                {
                    for (let product of componentsByNormal)
                    {
                        let params = {
                            IDRawMaterial : product.RawMatID,
                            countRawMaterial : (product.Count * countProduct),
                            IDProduct : selectedProductID,
                            IDEmployee: selectedEmployee
                        }
                        await axios.post("http://127.0.0.1:4556/api/products/productionProduct", params);
                        params = {};
                    }
                    let id = {selectedEmployee} ;
                    await axios.post("http://127.0.0.1:4556/api/Employee/upCountProdEmpController", id);
                    setWarning("");
                    fetchCountCompFromWarehouse();
                    fetchAddFinishProduct();
                    toast(`Напиток ${arrProducts[selectedProductID-1].Name} успешно приготовлен!`)
                }

            }
        }

        return (
            <div>
                <h1>Производство продукции</h1>

                <MyBalance> <RiMoneyDollarCircleLine size={"44px"}/> {myBalance} сом</MyBalance>

                <MainBlock>

                    <ContainerBlock border={"none"}>
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

                        <TextField
                            value={countProduct}
                            onChange={(event)=> setCountProduct(event.target.value)}
                            sx={{width: 320, mt:5}}
                            label={"Введите количество"}
                            id="outlined-number"
                            variant="outlined"
                            InputProps={
                            { inputProps: {
                                    min: 1,
                                    type: "number",
                                    pattern: "[0-9]*"
                                } }}
                        />

                        <InputLabel sx={{ mt: 3.5 }} id="demo-simple-select-label">Сотрудник</InputLabel>
                        <Select
                            sx={{width: 320, mb: 0}}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedEmployee}
                            label="Employee"
                        >
                            {arrEmployees.map((employee)=>(
                                <MenuItem onClick={()=> setSelectedEmployee(employee.ID) } key={employee.ID} value={employee.ID}>{employee.FIO}</MenuItem>
                            ))

                            }
                        </Select>

                        <div><Button onClick={handleProductionProduct} sx={{width: 320, mt: 5}}  InputProps={{ sx: { height: 50 }}}  variant="contained">Произвести</Button></div>


                    </ContainerBlock>

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
                                                <TableCell key={component.Count} align="left">{(component.Count * countProduct).toFixed(2)}</TableCell>
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

                    {componentsByNormal.length > 0 ?
                        <ContainerBlock>
                            <h2>На складе</h2>

                            <TableContainer>
                                <Table size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Продукт</TableCell>
                                            <TableCell align="left">Количество</TableCell>
                                            <TableCell align="left">Ед. измер.</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {componentsInWarehouse.map((component) => (
                                            <TableRow key={component.ID}>
                                                <TableCell key={component.Raw} align="left">{component.Raw}</TableCell>
                                                <TableCell key={component.Count} align="left">{component.Count}</TableCell>
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
                </MainBlock>

                {warning ?
                    <h1 style={{marginLeft: "450px"}} >{warning}</h1>
                    :
                    <></>
                }

                <ManagePanel>
                    <Button onClick={() => { setActiveModalHistoryProd(true); }} sx={{ width: 250 }}  InputProps={{ sx: { height: 50 }}} variant="contained">История производства</Button>
                </ManagePanel>

                {activeModalHistoryProd ? <ModalHistoryProduction active={activeModalHistoryProd} setActive={setActiveModalHistoryProd} />
                        :
                    <></>
                }




            </div>
        );
    };

    export default ProductionProducts;