    import React from 'react';
    import {
    Button,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField
} from "@mui/material";
    import CheckIcon from "@material-ui/icons/Check";
    import CloseIcon from "@material-ui/icons/Close";
    import Modal from "../../../Components/UI/Modal/Modal";
    import {v4 as uuidv4} from "uuid";
    import axios from "axios";
    import styled from "styled-components";

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


    const ModalPaymentList = (props) => {

        let [arrPaymentList, setArrPaymentList] = React.useState([]);
        let [arrEmployees, setArrEmployees] = React.useState([]);
        let [updateFlag, setUpdateFlag] = React.useState(false);
        let [myBalance, setMyBalance] = React.useState(0);
        let [selectedEmployeeID, setSelectedEmployeeID] = React.useState(0);
        let [resultSalary, setResultSalary] = React.useState(0);
        let [updateArrPaymentList, setUpdateArrPaymentList] = React.useState(false);
        let [sumSalary, setSumSalary] = React.useState(0);

        async function updateSalary ()
        {
            let objSalary = {
                EmployeeID: selectedEmployeeID,
                NewSalary: resultSalary
            }

            await axios.post("http://127.0.0.1:4556/api/Employee/updateSalary", objSalary);
            setUpdateFlag(true);
        }

        function calcSumSalary()
        {
            sumSalary = 0;






        }

        React.useEffect(()=>{
            calcSumSalary();
        },[sumSalary])

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

        async function fetchAddNewPaymentList(){


                let objData = {
                    MonthID:props.MonthID,
                    Year:props.Year
                }

                await axios.post("http://127.0.0.1:4556/api/Salary/newPaymentList", objData);

            console.log("long = " + arrPaymentList.length);

        }

        async function fetchGetPaymentList(){

            let {data} = await axios.get("http://127.0.0.1:4556/api/Salary/getPaymentList");

            setArrPaymentList([]);
            setArrPaymentList(data.recordPayment)
        }

        async function fetchGetSalaryEmployeeID(){


            const emp = arrPaymentList.filter((record) => {
                return record.ID_Employee === selectedEmployeeID;
            });


            setResultSalary(emp[0].Result_Salary);
        }

        React.useEffect(()=>{
            fetchAddNewPaymentList();
            fetchGetPaymentList();

            // Вычисление суммы зарплат
            let sumarySalary = arrPaymentList.reduce((accumulator, payment) => accumulator + payment.Result_Salary, 0);
            setSumSalary(sumarySalary);

            setUpdateFlag(false);
            setUpdateArrPaymentList(true);
        }, [updateFlag]);

        React.useEffect(()=>{

            fetchGetPaymentList();
            setUpdateArrPaymentList(false);

        }, [arrPaymentList & updateArrPaymentList]);

        React.useEffect(()=>{

            fetchGetSalaryEmployeeID();
            setUpdateArrPaymentList(false);

        }, [selectedEmployeeID]);

        function cancelPayments(){
            const {data} = axios.delete("http://127.0.0.1:4556/api/Salary/cancelPayments");
        }

        return (
            <Modal  bgInnerColor={"white"} TextColor={"black"} width={"1480px"} height={"700px"} active={props.active} setActive={props.setActive} >

                <h1>Выплаты</h1>

                <span style={{
                    border: '1px solid black',
                    margin: '0px 200px'}} >Год: {props.Year} | Месяц: {props.MonthName}</span>

                <TableContainer style={{ maxHeight: `${400}px`, overflow: 'auto' }} >
                    <Table  size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell key={uuidv4()} align="left">ФИО</TableCell>
                                <TableCell key={uuidv4()} align="left">Должность</TableCell>
                                <TableCell key={uuidv4()} align="left">Зарплата</TableCell>
                                <TableCell key={uuidv4()} align="left">% бонуса</TableCell>
                                <TableCell key={uuidv4()} align="left">Закупки</TableCell>
                                <TableCell key={uuidv4()} align="left">Производство</TableCell>
                                <TableCell key={uuidv4()} align="left">Продажи</TableCell>
                                <TableCell key={uuidv4()} align="left">Общ. кол-во</TableCell>
                                <TableCell key={uuidv4()} align="left">Бонус</TableCell>
                                <TableCell key={uuidv4()} align="left">Итого</TableCell>
                                <TableCell key={uuidv4()} align="left">Месяц</TableCell>
                                <TableCell key={uuidv4()} align="left">Год</TableCell>
                                <TableCell key={uuidv4()} align="left">Статус</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {arrPaymentList.map((employee) => (
                                <TableRow>
                                    {/*key={uuidv4()}*/}
                                    <TableCell key={uuidv4()} align="left">{employee.FIO}</TableCell>
                                    <TableCell key={uuidv4()} align="left">{employee.Position}</TableCell>
                                    <TableCell key={uuidv4()} align="left">{employee.Salary} сом</TableCell>
                                    <TableCell key={uuidv4()} align="left">{employee.Bonus_Percent} % </TableCell>
                                    <TableCell key={uuidv4()} align="left">{employee.Count_Purchase} </TableCell>
                                    <TableCell key={uuidv4()} align="left">{employee.Count_Production} </TableCell>
                                    <TableCell key={uuidv4()} align="left">{employee.Count_Sale} </TableCell>
                                    <TableCell key={uuidv4()} align="left">{employee.Amount_Count} </TableCell>
                                    <TableCell key={uuidv4()} align="left">{employee.Bonus_Result} сом </TableCell>
                                    <TableCell key={uuidv4()} align="left">{employee.Result_Salary} сом </TableCell>
                                    <TableCell key={uuidv4()} align="left">{employee.Month} </TableCell>
                                    <TableCell key={uuidv4()} align="left">{employee.Year} </TableCell>
                                    <TableCell key={uuidv4()} align="left"> {employee.Status_Payment ? <CheckIcon /> : <CloseIcon />} </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/*style={{marginRight: spacing + 'em'}}*/}
                <h2 style={{
                    border: '1px solid black',
                    margin: '20px 500px'}}>Итого к выплате: {sumSalary} сом</h2>


                <ManagePanel>
                    <Select
                        sx={{ width: 240, mb: 0 }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedEmployeeID}
                        label="Month"
                        onChange={(event) => setSelectedEmployeeID(event.target.value)}
                    >
                        {arrEmployees.map((employee) => (
                            <MenuItem key={employee.ID} value={employee.ID}>
                                {employee.FIO}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField value={resultSalary} onChange={(event)=> setResultSalary(event.target.value)} sx={{width: 240}}  InputProps={{ sx: { height: 50 } }} label={"Зарплата"} id="outlined-basic"  variant="outlined" />



                    <Button  onClick={updateSalary} sx={{ width: 240 }}  InputProps={{ sx: { height: 50 }}} variant="outlined" color="success" >Изменить зарплату</Button>
                    <Button  onClick={()=> {}} sx={{ width: 240 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="success" >Выплатить зарплату</Button>
                    <Button  onClick={cancelPayments} sx={{ width: 240 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="error" >Отменить выплаты</Button>
                </ManagePanel>



            </Modal>
        );
    };

    export default ModalPaymentList;