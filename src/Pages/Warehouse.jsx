import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    Button, InputAdornment,
    InputLabel, MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField
} from "@mui/material";
import {getRawMaterials} from "../Redux/Slice/rawMaterialSlice";
import styled from "styled-components";
import Modal from "../Components/Modal/Modal";
import axios from "axios";
import {toast} from "react-toastify";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import moment from "moment";


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

let BlockTotal = styled.div`
  //border: 1px solid grey;
  border-radius: 4px;
  width: 320px;
  height: 270px;
  margin-left: 50px;
  margin-bottom: 195px;
  font-size: 24px;
  //display: flex;
  //flex-direction: column;
  //justify-content: space-around;
`

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

const Warehouse = () => {
    const dispatch = useDispatch();

    // Modal's Window's
    let [activeModalPurchase, setActiveModalPurchase] = React.useState(false);
    let [activeModalAddRaw, setActiveModalAddRaw] = React.useState(false);
    let [activeModalHistory, setActiveModalHistory] = React.useState(false);
    let [activeModalAddEmployee, setActiveModalAddEmployee] = React.useState(false);
    let [activeModalAddUnit, setActiveModalAddUnit] = React.useState(false);

    let [myBalance, setMyBalance] = React.useState(0);
    let [arrUnits, setArrUnits] = React.useState([]);
    let [arrEmployees, setArrEmployees] = React.useState([]);

    let [selectedEmployee, setSelectedEmployee] = React.useState([]);
    let [selectedMaterial, setSelectedMaterial] = React.useState(0);
    let [selectedUnit, setSelectedUnit] = React.useState(0);

    let [nameEmployee, setNameEmployee] = React.useState("");
    let [arrPosEmployee, setArrPosEmployee] = React.useState("");
    let [selectedPosEmployee, setSelectedPosEmployee] = React.useState("");
    let [salaryEmployee, setSalaryEmployee] = React.useState("");
    let [addressEmployee, setAddressEmployee] = React.useState("");
    let [phoneEmployee, setPhoneEmployee] = React.useState("");

    let [nameUnit, setNameUnit] = React.useState("");

    let [nameRawMat, setNameRawMat] = React.useState("");
    let [countRawMaterial, setcountRawMaterial] = React.useState(1);
    let [costRawMaterial, setcostRawMaterial] = React.useState(10);

    let [expenses, setExpenses] = React.useState(0);
    let [historyPurchase, setHistoryPurchase] = React.useState([]);

    let [warning, setWarning] = React.useState("");

    let {arrRawMaterials} = useSelector(state => state.rawMaterialReducer);

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
            TABLE_NAME: "HistoryPurchaseRawMaterials",
            DATE_START: moment(selectedDateStart).format("YYYY-MM-DD"),
            DATE_END: moment(selectedDateEnd).format("YYYY-MM-DD")
        }

        const {data} = await axios.post("http://127.0.0.1:4556/api/selectionDataByDate", period);
        setHistoryPurchase(data);
    }


    React.useEffect(()=>{
        dispatch(getRawMaterials());
    },[dispatch]);

    async function fetchEmployees(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/getEmployees");
        setArrEmployees(data);
    }

    async function fetchMyBalance(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/getMyBalance");
        setMyBalance(data);
    }

    async function fetchUnits(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/getUnits");
        setArrUnits(data);
    }

    async function fetchPositions(){
        const {data} = await axios.get("http://127.0.0.1:4556/api/getAllPositions");
        setArrPosEmployee(data);
    }

    React.useEffect(()=>{
        fetchEmployees();
        fetchUnits();
        fetchPositions();
    }, []);


    React.useEffect(()=>{ fetchMyBalance() },[myBalance]);

    React.useEffect(()=>{
        if (expenses)
        {
            toast(`Стоимость покупки составила ${expenses} сом`);
            setExpenses(0);
        }
    },[expenses])


    const PurchaseRawMaterials = ()=>{
        debugger
        if ( selectedMaterial < 1 || selectedEmployee < 1 || countRawMaterial < 0.01 || costRawMaterial < 1 || countRawMaterial === "0,5" )
        {
            setWarning("Введите данные корректно!");
        }
        else
        {
            console.log(`Количество: ${countRawMaterial}`);
            setWarning("");
            let params = {
                IDRawMaterial:selectedMaterial,
                countRawMaterial: countRawMaterial,
                costRawMaterial: costRawMaterial,
                IDEmployee: selectedEmployee
            };

            async function fetchPurchase(params){
                const {data} = await axios.post("http://127.0.0.1:4556/api/PurchaseRawMaterial", params);
                if( data === "Недостаточно средств на балансе!" )
                {
                    setWarning(data);
                }
                else
                {
                    setWarning("");
                    setExpenses(data[0].expenses);
                    fetchMyBalance();
                    dispatch(getRawMaterials());
                }

            }

            fetchPurchase(params);
        }
    }

    const  AddNewRawMaterial = () => {
        let params = {
            Name: nameRawMat,
            Unit: selectedUnit
        };

        async function fetchAddRawMat(params){
            await axios.post("http://127.0.0.1:4556/api/addNewRawMaterial", params);
            dispatch(getRawMaterials());
        }

        fetchAddRawMat(params);

    }

    const getHistory = () => {
        async function fetchGetHistory(){
            const {data} = await axios.get("http://127.0.0.1:4556/api/getHistoryPurchaseRawMat");
            setHistoryPurchase(data);
        }

        fetchGetHistory();
    }

    const addNewEmployee = async () => {
        const newEmployee = {
            FIO : nameEmployee,
            Position : selectedPosEmployee,
            Salary : salaryEmployee,
            Address : addressEmployee,
            Phone : phoneEmployee
        };

        const {data} = await axios.post("http://127.0.0.1:4556/api/addNewEmployee", newEmployee);
        toast(data.message);
    }

    const addNewUnit = async () => {
        const newUnit = {
            Name : nameUnit
        }
        const {data} = await axios.post("http://127.0.0.1:4556/api/addNewUnit", newUnit);
        toast(data.message);
    }

    return (
        <div>
            <h1>Склад</h1>

            <TableContainer >
                <Table  size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Название</TableCell>
                            <TableCell align="left">Количество</TableCell>
                            <TableCell align="left">Ед. измер.</TableCell>
                            <TableCell align="left">На сумму</TableCell>
                            <TableCell align="left">Цена за ед.</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {arrRawMaterials.map((product) => (
                            <TableRow>
                                <TableCell key={product.ID} align="left">{product.Name}</TableCell>
                                <TableCell key={product.ID} align="left">{product.count}</TableCell>
                                <TableCell key={product.ID} align="left">{product.Unit}</TableCell>
                                <TableCell key={product.ID} align="left">{product.sum} сом</TableCell>
                                <TableCell key={product.ID} align="left">{product.Cost} сом</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <ManagePanel>
                <Button onClick={()=>setActiveModalPurchase(true)} sx={{ width: 200 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Закупка продуктов</Button>
                <Button onClick={() => {
                    setActiveModalHistory(true);
                    getHistory();
                }} sx={{ width: 200 }}  InputProps={{ sx: { height: 50 }}} variant="contained">История закупа</Button>
                <Button onClick={()=> setActiveModalAddRaw(true)} sx={{ width: 200 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="success" >Добавить продукт</Button>

                <Button onClick={async ()=> {
                    setActiveModalAddEmployee(true);
                    await fetchPositions();
                }} sx={{ width: 220 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Добавить сотрудника</Button>

                <Button onClick={()=> setActiveModalAddUnit(true)} sx={{ width: 200 }}  InputProps={{ sx: { height: 50 }}} variant="contained"  >Добавить ед. измер.</Button>
            </ManagePanel>


            {activeModalPurchase ? <Modal display={"flex"} bgInnerColor={"white"} TextColor={"black"} width={"820px"} height={"550px"} active={activeModalPurchase} setActive={setActiveModalPurchase}>
                        <div className={"Block 1"}>
                            <h1>Закупка продуктов</h1>

                            <InputLabel id="demo-simple-select-label">Выберите продукт</InputLabel>
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

                            <h4>Введите количество (Объём)</h4>
                            <TextField value={countRawMaterial} onChange={(event)=> setcountRawMaterial(event.target.value)} sx={{width: 320}}  InputProps={{ sx: { height: 50 } }} label={"Введите количество"} id="outlined-basic"  variant="outlined" />

                            <h4>Введите стоимость продукта</h4>
                            <TextField value={costRawMaterial} onChange={(event) => setcostRawMaterial(event.target.value) } startAdornment={<InputAdornment position="start">$</InputAdornment>} sx={{width: 320, mb: 16.5}}  InputProps={{ sx: { height: 50 } }} label={"Введите цену"} id="outlined-basic"  variant="outlined" />
                        </div>

                        <BlockTotal>
                            <div>Баланс: {myBalance} сом</div>

                            <InputLabel sx={{ mt: 3.5 }} id="demo-simple-select-label">Сотрудник</InputLabel>
                            <Select
                                sx={{width: 320, mb: 7}}
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

                            <div><Button onClick={PurchaseRawMaterials} sx={{width: 320, mt: 8.5}}  InputProps={{ sx: { height: 50 }}}  variant="contained">Покупка</Button></div>
                            <div><Button onClick={()=>setActiveModalPurchase(false)} sx={{width: 320, mt: 3}}  InputProps={{ sx: { height: 50 }}} color={"error"}  variant="contained">Отмена</Button></div>

                            {warning ?
                                <h4>{warning}</h4>
                                :
                                <></>}

                        </BlockTotal>

                    </Modal>
                :
                    <></>
            }


            {activeModalAddRaw ? <Modal  bgInnerColor={"white"} TextColor={"black"} width={"600px"} height={"500px"} active={activeModalAddRaw} setActive={setActiveModalAddRaw}>
                    <h1>Добавить продукт</h1>

                    <TextField value={nameRawMat} onChange={(event)=> setNameRawMat(event.target.value)} sx={{width: 320}}  InputProps={{ sx: { height: 50 } }} label={"Введите название"} id="outlined-basic"  variant="outlined" />

                    <InputLabel sx={{ mt: 3.5 }} id="demo-simple-select-label">Единица измерения</InputLabel>
                    <Select
                        sx={{width: 320, mb: 7}}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedUnit}
                        label="RawMaterial"
                    >
                        {arrUnits.map((unit)=>(
                            <MenuItem onClick={()=> setSelectedUnit(unit.ID) } key={unit.ID} value={unit.ID}>{unit.Name}</MenuItem>
                        ))

                        }
                    </Select>

                    <div><Button onClick={ AddNewRawMaterial } sx={{ width: 320 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Добавить</Button></div>
                    <div><Button onClick={()=>setActiveModalAddRaw(false)} sx={{width: 320, mt: 3}}  InputProps={{ sx: { height: 50 }}} color={"error"}  variant="contained">Отмена</Button></div>


                </Modal>
                :
                    <></>
            }


            {activeModalHistory ? <Modal colorClose={"black"}  bgInnerColor={"white"} TextColor={"black"} width={"1200px"} height={"650px"} active={activeModalHistory} setActive={setActiveModalHistory}>
                        <BlockTable>
                            <h1>История закупок</h1>
                            <TableContainer >
                                <Table  size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Продукт</TableCell>
                                            <TableCell align="left">Кол-во</TableCell>
                                            <TableCell align="left">Ед. измер.</TableCell>
                                            <TableCell align="left">На сумму</TableCell>
                                            <TableCell align="left">Цена за ед.</TableCell>
                                            <TableCell align="left">Дата</TableCell>
                                            <TableCell align="left">Закупщик</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {historyPurchase.map((purchase) => (
                                            <TableRow key={purchase.ID} >
                                                <TableCell key={purchase.ID} align="left">{purchase.Name}</TableCell>
                                                <TableCell key={purchase.ID} align="left">{purchase.Count}</TableCell>
                                                <TableCell key={purchase.ID} align="left">{purchase.Unit}</TableCell>
                                                <TableCell key={purchase.ID} align="left">{purchase.TotalPrice} сом</TableCell>
                                                <TableCell key={purchase.ID} align="left">{purchase.Cost} сом</TableCell>
                                                <TableCell key={purchase.ID} align="left">{purchase.Date.substring(0,10)}</TableCell>
                                                <TableCell key={purchase.ID} align="left">{purchase.FIO}</TableCell>
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


            {activeModalAddEmployee ? <Modal colorClose={"black"}  bgInnerColor={"white"} TextColor={"black"} width={"700px"} height={"600px"} active={activeModalAddEmployee} setActive={setActiveModalAddEmployee}>
                    <h1>Добавить сотрудника</h1>
                    <div><TextField value={nameEmployee} onChange={(event)=> setNameEmployee(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите имя"} id="outlined-basic"  variant="outlined" /></div>

                    <div><Select
                        sx={{width: 320, m: 1}}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedPosEmployee}
                        label="Position"
                    >
                        {arrPosEmployee.map((position)=>(
                            <MenuItem onClick={()=> setSelectedPosEmployee(position.ID) } key={position.ID} value={position.ID}>{position.Position}</MenuItem>
                        ))

                        }
                    </Select></div>

                    <div><TextField value={salaryEmployee} onChange={(event)=> setSalaryEmployee(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите зарплату"} id="outlined-basic"  variant="outlined" /></div>
                    <div><TextField value={addressEmployee} onChange={(event)=> setAddressEmployee(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите адрес"} id="outlined-basic"  variant="outlined" /></div>
                    <div><TextField value={phoneEmployee} onChange={(event)=> setPhoneEmployee(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите номер телефона"} id="outlined-basic"  variant="outlined" /></div>

                    <div><Button onClick={ addNewEmployee } sx={{ width: 320, m:4 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Добавить</Button></div>

                </Modal>
                :
                <></>
            }

            {activeModalAddUnit ?
                <Modal colorClose={"black"} bgInnerColor={"white"} TextColor={"black"} width={"700px"} height={"300px"} active={activeModalAddUnit} setActive={setActiveModalAddUnit}>
                    <h1>Добавить единицу измерения</h1>
                    <div><TextField value={nameUnit} onChange={(event)=> setNameUnit(event.target.value)} sx={{width: 320, m:1}}  InputProps={{ sx: { height: 50 } }} label={"Введите название"} id="outlined-basic"  variant="outlined" /></div>
                    <div><Button onClick={ addNewUnit } sx={{ width: 320, m:4 }}  InputProps={{ sx: { height: 50 }}} variant="contained">Добавить</Button></div>

                </Modal>
                :
                <></>
            }

            </div>
    );
};

export default Warehouse;