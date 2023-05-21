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
    TableRow
} from "@mui/material";
    import CheckIcon from '@material-ui/icons/Check';
    import CloseIcon from '@material-ui/icons/Close';
    import Modal from "../../../Components/UI/Modal/Modal";
    import axios from "axios";
    import {v4 as uuidv4} from "uuid";
    import styled from "styled-components";
    import {toast} from "react-toastify";
    import ModalPaymentList from "./ModalPaymentList";

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

    const MainModalSalary = (props) => {

        let [activeModalPaymentList, setActiveModalPaymentList] = React.useState(false);

        let [arrRecordSalary, setArrRecordSalary] = React.useState([]);
        let [arrOnRequest, setArrOnRequest] = React.useState([]);

        let [updateFlag, setUpdateFlag] = React.useState(false);
        let arrYears = ["Выберите год",2021,2022,2023,2024,2025,2026];
        let [selectedYear, setSelectedYear] = React.useState(0);
        let [selectedMonthID, setSelectedMonthID] = React.useState(1);
        let [selectedMonthName, setSelectedMonthName] = React.useState("");
        let [payActive, setPayActive] = React.useState(false);

        const arrMonths = Array.from({ length: 12 }, (_, index) => {
            const monthName = new Date(0, index).toLocaleString('default', { month: 'long' });
            const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
            return {
                id: index + 1,
                name: capitalizedMonthName,
            };
        });

        console.log(selectedMonthID);

        async function fetchRecordSalary(){

            const {data} = await axios.get("http://127.0.0.1:4556/api/Salary/getRecordSalary");
            if (arrRecordSalary.length === 0)
            {
                setArrRecordSalary(data.recordSalary);
            }

            setArrOnRequest(data.recordSalary);
        }

        React.useEffect( ()=>{

            setArrOnRequest([]);

             fetchRecordSalary();
            setUpdateFlag(false);

        }, [updateFlag]);

        function sortRecordSalaryByDate()
        {


            let nameMonth = arrMonths.find((month)=>month.id === selectedMonthID);

            const filteredRecords = arrRecordSalary.filter((record) => {
                return record.Month === nameMonth.name && record.Year === selectedYear;
            });

            if (arrOnRequest.length > 0) {
                setArrOnRequest([]);
            }

            if (arrOnRequest.length > 0)
            {
                setArrOnRequest([]);
                setArrOnRequest(filteredRecords);
            }
            else
            {
                setArrOnRequest(filteredRecords);
            }
 
            if (filteredRecords.length === 0)
            {
                setPayActive(true);
                toast(`Выплат за ${nameMonth.name} месяц нет.`)
            }
            else
            {
                setPayActive(false);
            }

        }

         function GetAllRecords()
         {
             setArrOnRequest([]);
             setArrOnRequest(arrRecordSalary);
         }

         function openNewPaymentList()
         {
             props.setActivePaymentList(true);
             props.setYear(selectedYear);
             props.setMonthID(selectedMonthID);
             props.setMonthName(selectedMonthName);
         }


        return (
            <Modal  bgInnerColor={"white"} TextColor={"black"} width={"1480px"} height={"700px"} active={props.active} setActive={props.setActive} >

                <h1>Бухгалтерия</h1>

                <TableContainer style={{ maxHeight: `${400}px`, overflow: 'auto' }} >
                    <Table  size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow key={uuidv4()} >
                                <TableCell key={0} align="left">ФИО</TableCell>
                                <TableCell key={1} align="left">Должность</TableCell>
                                <TableCell key={2} align="left">Зарплата</TableCell>
                                <TableCell key={3} align="left">% бонуса</TableCell>
                                <TableCell key={4} align="left">Закупки</TableCell>
                                <TableCell key={5} align="left">Производство</TableCell>
                                <TableCell key={6} align="left">Продажи</TableCell>
                                <TableCell key={7} align="left">Общ. кол-во</TableCell>
                                <TableCell key={8} align="left">Бонус</TableCell>
                                <TableCell key={9} align="left">Итого</TableCell>
                                <TableCell key={10} align="left">Месяц</TableCell>
                                <TableCell key={11} align="left">Год</TableCell>
                                <TableCell key={12} align="left">Статус</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {arrOnRequest.map((employee) => (
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

                <ManagePanel>


                    <Select
                        sx={{ width: 240, mb: 0 }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedYear || (arrYears.length > 0 ? arrYears[0] : '')}
                        label="year"
                        onChange={(event) => setSelectedYear(event.target.value)}
                    >
                        {arrYears.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select
                        sx={{ width: 240, mb: 0 }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedMonthID}
                        label="Month"
                        onChange={(event) => setSelectedMonthID(event.target.value)}
                    >
                        {arrMonths.map((month) => (
                            <MenuItem
                                onClick={()=>setSelectedMonthName(month.name)}
                                key={month.id} value={month.id}>
                                {month.name}
                            </MenuItem>
                        ))}
                    </Select>


                    <Button onClick={ GetAllRecords } sx={{ width: 240 }}  InputProps={{ sx: { height: 50 }}} variant="outlined" color="success" >Все записи</Button>
                    <Button onClick={ sortRecordSalaryByDate } sx={{ width: 240 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="success" >Вывести</Button>
                    <Button disabled={ payActive ? false : true} onClick={openNewPaymentList} sx={{ width: 240 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="success" >Выплатить зарплату</Button>
                </ManagePanel>

                {activeModalPaymentList ? <ModalPaymentList  active={activeModalPaymentList} setActive={setActiveModalPaymentList} updateFlag={setUpdateFlag} />
                    :
                    <></>
                }

            </Modal>
        );
    };

    export default MainModalSalary;