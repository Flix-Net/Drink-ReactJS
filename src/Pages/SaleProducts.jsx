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
import {getAllProducts} from "../Redux/Slice/productsSlice";
import axios from "axios";
import {toast} from "react-toastify";
import {RiMoneyDollarCircleLine} from "react-icons/ri";
import Modal from "../Components/Modal/Modal";
import moment from "moment";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";

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
    let [costProduct, setCostProduct] = React.useState(100);
    let [arrEmployees, setArrEmployees] = React.useState([]);
    let [selectedEmployee, setSelectedEmployee] = React.useState(0);
    let [warning, setWarning] = React.useState("");
    let [myBalance, setMyBalance] = React.useState(0);
    let [arrHistorySale, setArrHistorySale] = React.useState([]);

    let [selectedDateStart, setSelectedDateStart] = React.useState();
    let [selectedDateEnd, setSelectedDateEnd] = React.useState();
    const handleStartDate = (newValue) => {
        setSelectedDateStart(newValue);
    };
    const handleEndDate = (newValue) => {
        setSelectedDateEnd(newValue);
    };


    const selectionDataByDate = async () => {
        console.log(moment(selectedDateStart).format("YYYY-MM-DD"));
        console.log(moment(selectedDateEnd).format("YYYY-MM-DD"));
        const period = {
            TABLE_NAME: "HistorySaleProducts",
            DATE_START: moment(selectedDateStart).format("YYYY-MM-DD"),
            DATE_END: moment(selectedDateEnd).format("YYYY-MM-DD")
        }

        const {data} = await axios.post("http://127.0.0.1:4556/api/selectionDataByDate", period);
        setArrHistorySale(data);
    }

    async function fetchMyBalance(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/getMyBalance");
        setMyBalance(data);
    }

    async function fetchHistorySale(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/getHistorySaleProducts");
        setArrHistorySale(data);
    }

    React.useEffect(()=>{ fetchMyBalance() },[myBalance]);

    async function fetchEmployees(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/getEmployees");
        setArrEmployees(data);
    }

    React.useEffect(()=>{ fetchEmployees() }, []);

    React.useEffect(()=>{
        dispatch(getAllProducts());
    },[dispatch]);

    const handleSaleProduct = async () => {

        console.log(selectedEmployee);

        if ( selectedProductID < 1 || selectedEmployee < 1 || countProduct < 1 || costProduct < 1 )
        {
            setWarning("Введите данные корректно!");
        }
        else
        {
            setWarning("");

            let params = {
                    IDProduct : selectedProductID,
                    countProduct,
                    priceProduct : costProduct,
                    IDEmployee : selectedEmployee
                }
                const {data} = await axios.post("http://127.0.0.1:4556/api/saleProduct", params);

            if (data) {
                if (data[0].Profit < 0)
                {
                    toast(`Убыток составил ${data[0].Profit * (-1)} сом`);
                }
                else
                {
                    toast(`Прибыль составила ${data[0].Profit} сом`);
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

                <TextField
                    value={costProduct}
                    onChange={(event)=> setCostProduct(event.target.value)}
                    sx={{width: 320, mt:5}}
                    label={"Укажите стоимость"}
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
                <Button onClick={() => {
                    setActiveModalHistorySale(true);
                    fetchHistorySale();
                }} sx={{ width: 200 }}  InputProps={{ sx: { height: 50 }}} variant="contained">История продаж</Button>
            </ManagePanel>


            {activeModalHistorySale ? <Modal  bgInnerColor={"white"} TextColor={"black"} width={"1200px"} height={"650px"} active={activeModalHistorySale} setActive={setActiveModalHistorySale}>
                <BlockTable>
                    <h1>История продаж</h1>
                    <TableContainer >
                        <Table  size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Продукт</TableCell>
                                    <TableCell align="left">Кол-во</TableCell>
                                    <TableCell align="left">Прибыль</TableCell>
                                    <TableCell align="left">Дата</TableCell>
                                    <TableCell align="left">Продавец</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {arrHistorySale.map((sale) => (
                                    <TableRow key={sale.ID} >
                                        <TableCell key={sale.ID} align="left">{sale.Name}</TableCell>
                                        <TableCell key={sale.ID} align="left">{sale.Count}</TableCell>
                                        <TableCell key={sale.ID} align="left">{sale.Profit} сом</TableCell>
                                        <TableCell key={sale.ID} align="left">{sale.Date.substring(0,10)}</TableCell>
                                        <TableCell key={sale.ID} align="left">{sale.FIO}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </BlockTable>


                    <LocalizationProvider  dateAdapter={AdapterMoment }>
                        <DesktopDatePicker
                            label="Date Start"
                            inputFormat="DD/MM/YYYY"
                            value={selectedDateStart}
                            onChange={handleStartDate}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <DesktopDatePicker
                            label="Date End"
                            inputFormat="DD/MM/YYYY"
                            value={selectedDateEnd}
                            onChange={handleEndDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>

                    <div><Button onClick={ selectionDataByDate } sx={{ width: 320, m:4 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Показать</Button></div>


            </Modal>
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