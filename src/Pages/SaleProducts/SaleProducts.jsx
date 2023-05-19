    import React from 'react';
    import {
        Button,
        InputLabel,
        MenuItem,
        Select,
        Table, TableBody, TableCell,
        TableContainer,
        TableHead,
        TableRow,
        TextField
    } from "@mui/material";
    import styled from "styled-components";
    import {useDispatch, useSelector} from "react-redux";
    import {getAllProducts} from "../../Redux/Slice/productsSlice";
    import axios from "axios";
    import {toast} from "react-toastify";
    import {RiMoneyDollarCircleLine} from "react-icons/ri";
    import Modal from "../../Components/UI/Modal/Modal";
    import moment from "moment";
    import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
    import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
    import ModalHistorySale from "./ModalHistorySale";

    let BlockTable = styled.div`
      max-height: 600px;
      overflow: scroll;
    
      margin-bottom: 25px;
      
      ::-webkit-scrollbar-track {
        background: #ff0000;
      }
    
      ::-webkit-scrollbar-thumb {
        background: #0004ff;
      }
    `

    let ManagePanel = styled.div`
      width: 100%;
      height: 80px;
      border: 1px solid grey;
      border-radius: 15px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 40px;
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

        let ContainerBlock = styled.div`
          text-align: center;
          width: 400px;
          padding: 5px;
          margin: 10px;
          border: ${props => props.border || "1px solid grey"} ;
          border-radius: 10px;
          min-height: 150px;
        `

    const SaleProducts = () => {

        const dispatch = useDispatch();
        const {arrProducts} = useSelector(state => state.productReduces);

        let [activeModalHistorySale, setActiveModalHistorySale] = React.useState(false);

        let [selectedProductID, setSelectedProductID] = React.useState(0);
        let [countProduct, setCountProduct] = React.useState(1);
        let [arrEmployees, setArrEmployees] = React.useState([]);
        let [selectedEmployee, setSelectedEmployee] = React.useState(0);
        let [warning, setWarning] = React.useState("");
        let [myBalance, setMyBalance] = React.useState(0);

        async function fetchMyBalance(){
            const {data} = await axios.get("http://127.0.0.1:4556/api/Budget/getMyBalance");
            setMyBalance(data.budget.toFixed(2));
        }

        React.useEffect(()=>{ fetchMyBalance() },[myBalance]);

        async function fetchEmployees(){
            const {data} = await axios.get("http://127.0.0.1:4556/api/Employee/getEmployees");
            setArrEmployees(data.employees);
        }

        React.useEffect(()=>{ fetchEmployees() }, []);

        React.useEffect(()=>{
            dispatch(getAllProducts());
        },[dispatch]);

        const handleSaleProduct = async () => {

            if ( selectedProductID < 1 || selectedEmployee < 1 || countProduct < 1 )
            {
                setWarning("Введите данные корректно!");
            }
            else
            {
                setWarning("");

                let params = {
                        IDProduct : selectedProductID,
                        countProduct,
                        IDEmployee : selectedEmployee
                    };

                const {data} = await axios.post("http://127.0.0.1:4556/api/products/saleProduct", params);

                if (data.Status) {
                    if (data.Profit < 0)
                    {
                        toast(`Убыток составил ${data.Profit * (-1)} сом`);
                    }
                    else
                    {
                        toast(`Прибыль составила ${data.Profit} сом`);
                    }
                    fetchMyBalance();
                }
                else {
                    toast("На складе нет указанного количества продукта");
                }

            }

        }

        return (
            <div>
                <h1>Продажа готовой продукции</h1>

                <MyBalance> <RiMoneyDollarCircleLine size={"44px"}/> {myBalance} сом</MyBalance>

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

                    <div><Button onClick={handleSaleProduct} sx={{width: 320, mt: 5}}  InputProps={{ sx: { height: 50 }}}  variant="contained">Продать</Button></div>

                </ContainerBlock>

                <ManagePanel>
                    <Button onClick={() => { setActiveModalHistorySale(true); }} sx={{ width: 200 }}  InputProps={{ sx: { height: 50 }}} variant="contained">История продаж</Button>
                </ManagePanel>


                {activeModalHistorySale ? <ModalHistorySale active={activeModalHistorySale} setActive={setActiveModalHistorySale} />
                    :
                    <></>
                    }


                {warning ?
                    <h1>{warning}</h1>
                    :
                    <></>
                }

            </div>
        );
    };

    export default SaleProducts;