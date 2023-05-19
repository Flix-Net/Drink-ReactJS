    import React from 'react';
    import moment from "moment";
    import axios from "axios";
    import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material";
    import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
    import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
    import Modal from "../../Components/UI/Modal/Modal";
    import styled from "styled-components";

    let BlockTable = styled.div`
      max-height: 450px;
      overflow: scroll;
      
      margin-bottom: 25px;
    
      ::-webkit-scrollbar-track {
        background: #ff0000;
      }
    
      ::-webkit-scrollbar-thumb {
        background: #0004ff;
      }
    `


    const ModalHistorySale = (props) => {

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

            const {data} = await axios.post("http://127.0.0.1:4556/api/products/getHistorySaleProducts", period);
            setArrHistorySale(data.purchase);
        }


        return (
            <Modal  bgInnerColor={"white"} TextColor={"black"} width={"1200px"} height={"650px"} active={props.active} setActive={props.setActive}>
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
        );
    };

    export default ModalHistorySale;