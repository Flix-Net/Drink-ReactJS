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


    const ModalHistoryPurchase = (props) => {

        let [historyPurchase, setHistoryPurchase] = React.useState([]);
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

            const {data} = await axios.post("http://127.0.0.1:4556/api/RawMaterial/selectionDataByDate", period);
            setHistoryPurchase(data.purchase);
        }


        return (
            <Modal colorClose={"black"}  bgInnerColor={"white"} TextColor={"black"} width={"1200px"} height={"700px"} active={props.active} setActive={props.setActive}>
                <h1>История закупок</h1>
                <BlockTable>
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
        );
    };

    export default ModalHistoryPurchase;