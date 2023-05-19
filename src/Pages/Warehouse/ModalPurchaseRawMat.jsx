    import React from 'react';
    import Modal from "../../Components/UI/Modal/Modal";
    import {Button, InputAdornment, InputLabel, MenuItem, Select, TextField} from "@mui/material";
    import {useDispatch, useSelector} from "react-redux";
    import {getRawMaterials} from "../../Redux/Slice/rawMaterialSlice";
    import axios from "axios";
    import styled from "styled-components";
    import {toast} from "react-toastify";

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

    const ModalPurchaseRawMat = (props) => {

        const dispatch = useDispatch();

        let [updateFlag, setUpdateFlag] = React.useState(false);
        let [warning, setWarning] = React.useState("");
        let [selectedEmployee, setSelectedEmployee] = React.useState([]);
        let [selectedMaterial, setSelectedMaterial] = React.useState(0);
        let {arrRawMaterials} = useSelector(state => state.rawMaterialReducer) || [];
        let [arrEmployees, setArrEmployees] = React.useState([]);
        let [myBalance, setMyBalance] = React.useState(0);
        let [countRawMaterial, setCountRawMaterial] = React.useState(1);
        let [costRawMaterial, setCostRawMaterial] = React.useState(10);
        let [expenses, setExpenses] = React.useState(0);


        React.useEffect(()=>{
            dispatch(getRawMaterials());
            setUpdateFlag(false);
        },[dispatch, updateFlag]);

        async function fetchEmployees(){
            const {data} = await axios.get("http://127.0.0.1:4556/api/Employee/getEmployees");
            setArrEmployees(data.employees);
        }

        async function fetchMyBalance(){
            const {data} = await axios.get("http://127.0.0.1:4556/api/Budget/getMyBalance");

            setMyBalance(data.budget.toFixed(2));
        }

        React.useEffect(()=>{
            fetchEmployees();
            fetchMyBalance();

        }, []);

        React.useEffect(()=>{
            if (expenses)
            {
                toast(`Стоимость покупки составила ${expenses} сом`);
                setExpenses(0);
            }
        },[expenses]);

        React.useEffect(()=>{ fetchMyBalance() },[myBalance]);



        const PurchaseRawMaterials = async ()=>{

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


                    const {data} = await axios.post("http://127.0.0.1:4556/api/RawMaterial/purchaseRawMaterial", params);

                    if( data.message === "Недостаточно средств на балансе!" )
                    {
                        setWarning(data.message);
                    }
                    else
                    {
                        setWarning("");
                        setExpenses(data.product[0].expenses);
                        await fetchMyBalance();
                        dispatch(getRawMaterials());
                        props.updateFlag(true);
                    }




            }
        }


        return (
            <Modal display={"flex"} bgInnerColor={"white"} TextColor={"black"} width={"820px"} height={"550px"} active={props.active} setActive={props.setActive}>
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
                    <TextField
                        value={countRawMaterial}
                        onChange={(event)=> setCountRawMaterial(event.target.value)}
                        sx={{width: 320}}
                        InputProps={{ sx: { height: 50 } }}
                        label={"Введите количество"}
                        id="outlined-basic"
                        variant="outlined"
                    />

                    <h4>Введите стоимость продукта</h4>
                    <TextField
                        value={costRawMaterial}
                        onChange={(event) => setCostRawMaterial(event.target.value) }
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        sx={{width: 320, mb: 16.5}}
                        InputProps={{ sx: { height: 50 } }}
                        label={"Введите цену"}
                        id="outlined-basic"
                        variant="outlined"
                    />
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
                        onChange={(event)=> setSelectedEmployee(event.target.value)}
                    >
                        {arrEmployees.map((employee)=>(
                            <MenuItem key={employee.ID} value={employee.ID}>{employee.FIO}</MenuItem>
                        ))

                        }
                    </Select>

                    <div><Button onClick={PurchaseRawMaterials} sx={{width: 320, mt: 8.5}}  InputProps={{ sx: { height: 50 }}}  variant="contained">Покупка</Button></div>
                    <div><Button onClick={()=>props.setActive(false)} sx={{width: 320, mt: 3}}  InputProps={{ sx: { height: 50 }}} color={"error"}  variant="contained">Отмена</Button></div>

                    {warning ?
                        <h4>{warning}</h4>
                        :
                        <></>}

                </BlockTotal>

            </Modal>
        );
    };

    export default ModalPurchaseRawMat;