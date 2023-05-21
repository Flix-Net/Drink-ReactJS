    import React from 'react';
    import axios from "../../../Utils/Axios";
    import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material";
    import {v4 as uuidv4} from "uuid";
    import Modal from "../../../Components/UI/Modal/Modal";
    import {toast} from "react-toastify";
    import styled from "styled-components";

    import 'react-datepicker/dist/react-datepicker.css';

    const Calendar = styled.div`
      margin-top: 20px;
      height: 30px;
      text-align: center;
      
    `



    const ModalBank = (props) => {

        let [arrRecords, setArrRecords] = React.useState([]);
        let [date, setDate] = React.useState(new Date());
        let [myBalance, setMyBalance] = React.useState(0);
        let [flag, setFlag] = React.useState(true);
        let [creditSum, setCreditSum] = React.useState(0);
        let [period, setPeriod] = React.useState(1);
        let [percent, setPercent] = React.useState('');
        let [percentFine, setPercentFine] = React.useState('');

        const fetchGetRecords = async ()=>{
            const {data} = await axios.get("http://127.0.0.1:4556/api/Bank/getRecords");
            setArrRecords(data.payments);
        }

        async function fetchMyBalance(){
            const {data} = await axios.get("http://127.0.0.1:4556/api/Budget/getMyBalance");

            setMyBalance(data.budget.toFixed(2));
        }

        React.useEffect(()=>{
            if(flag)
                fetchGetRecords();
                fetchMyBalance();
                setFlag(false);

        },[flag])

        const Payment = async ()=>{
            let time = {
                datePay:date
            }
            const {data} = await axios.post("http://127.0.0.1:4556/api/Bank/payment", time);
            if(data.status === -1)
            {
                toast("Кредит успешно выплачен.");
            } else if (data.status)
            {
                toast(data.message);
            }
            else
            {
                toast("Недостаточно средств!");
            }


            setFlag(true);
        }

        const TakeCredit = async ()=>{
            let sum = {
                creditSum : creditSum,
                Period : period,
                Percent : percent,
                Fine : percentFine
            }
            await axios.post("http://127.0.0.1:4556/api/Bank/credit", sum);
            setFlag(true);
        }

        return (
            <Modal  bgInnerColor={"white"} TextColor={"black"} width={"1480px"} height={"700px"} active={props.active} setActive={props.setActive} >

                <h1>Добро пожаловать в кредитование</h1>

                <h3>Баланс: {myBalance} сом</h3>

                {arrRecords.length > 0 ?
                    <>
                        <h2>Выплаты</h2>
                        <TableContainer style={{ height: `${400}px`,maxHeight: `${400}px`, overflow: 'auto', textAlign:'center' }} >
                            <Table  size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Сумма</TableCell>
                                        <TableCell align="left">Платеж</TableCell>
                                        <TableCell align="left">Процент</TableCell>
                                        <TableCell align="left">Пеня</TableCell>
                                        <TableCell align="left">Дата</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {arrRecords.map((record) => (
                                        <TableRow>
                                            {/*key={uuidv4()}*/}
                                            <TableCell key={uuidv4()} align="left">{record.Sum.toFixed(2)} сом</TableCell>
                                            <TableCell key={uuidv4()} align="left">{record.Payment.toFixed(2)} сом</TableCell>
                                            <TableCell key={uuidv4()} align="left">{record.Percent_Result.toFixed(2)} сом</TableCell>
                                            <TableCell key={uuidv4()} align="left">{record.Fine_Result.toFixed(2)} сом </TableCell>
                                            <TableCell key={uuidv4()} align="left"> {record.Date.slice(0,10) } </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Calendar>
                            <input
                                type={"date"}
                                value={date}
                                onChange={(event)=> setDate(event.target.value)}
                            />
                        </Calendar>

                        <Button onClick={Payment} sx={{ width: 240, mt:5 }} variant="outlined" color="success" >Выплатить</Button>

                    </>
                    :
                    <>
                        <div><TextField value={creditSum} onChange={(event)=> setCreditSum(event.target.value)} sx={{width: 320, mt:10}}  InputProps={{ sx: { height: 50 } }} label={"Введите сумму"} id="outlined-basic"  variant="outlined" /></div>
                        <div><TextField value={period} onChange={(event)=> setPeriod(event.target.value)} sx={{width: 320, mt:3}}  InputProps={{ sx: { height: 50 } }} label={"Введите cрок (год)"} id="outlined-basic"  variant="outlined" /></div>
                        <div><TextField value={percent} onChange={(event)=> setPercent(event.target.value)} sx={{width: 320, mt:3}}  InputProps={{ sx: { height: 50 } }} label={"Введите процент. ставку"} id="outlined-basic"  variant="outlined" /></div>
                        <div><TextField value={percentFine} onChange={(event)=> setPercentFine(event.target.value)} sx={{width: 320, mt:3}}  InputProps={{ sx: { height: 50 } }} label={"Введите штраф. ставку"} id="outlined-basic"  variant="outlined" /></div>

                        <Button onClick={TakeCredit} sx={{ width: 320, mt:5 }} variant="outlined" color="success" >Взять кредит</Button>
                    </>

                }




            </Modal>
        );
    };

    export default ModalBank;