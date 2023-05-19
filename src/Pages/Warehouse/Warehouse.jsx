import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import {useDispatch, useSelector} from "react-redux";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField
} from "@mui/material";
import {getRawMaterials} from "../../Redux/Slice/rawMaterialSlice";
import styled from "styled-components";
import Modal from "../../Components/UI/Modal/Modal";
import axios from "axios";
import {toast} from "react-toastify";
import ModalAddNewRawMat from "./ModalAddNewRawMat";
import ModalDeleteRawMat from "./ModalDeleteRawMat";
import ModalPurchaseRawMat from "./ModalPurchaseRawMat";
import ModalHistoryPurchase from "./ModalHistoryPurchase";


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



const Warehouse = () => {
    const dispatch = useDispatch();

    let [updateFlag, setUpdateFlag] = React.useState(false);

    // Modal's Window's
    let [activeModalPurchase, setActiveModalPurchase] = React.useState(false);
    let [activeModalAddRaw, setActiveModalAddRaw] = React.useState(false);
    let [activeModalDeleteRaw, setActiveModalDeleteRaw] = React.useState(false);
    let [activeModalHistory, setActiveModalHistory] = React.useState(false);
    let [nameUnit, setNameUnit] = React.useState("");
    let {arrRawMaterials} = useSelector(state => state.rawMaterialReducer) || [];


    React.useEffect(()=>{
        dispatch(getRawMaterials());
        setUpdateFlag(false);
    },[dispatch, updateFlag]);

    return (
        <div>
            <h1>Склад</h1>

            <TableContainer style={{ maxHeight: `${450}px`, overflow: 'auto' }} >
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
                            <TableRow key={product.ID}>
                                <TableCell key={product.Name} align="left">{product.Name}</TableCell>
                                <TableCell key={uuidv4()} align="left">{product.count}</TableCell>
                                <TableCell key={product.Unit} align="left">{product.Unit}</TableCell>
                                <TableCell key={uuidv4()} align="left">{product.sum} сом</TableCell>
                                <TableCell key={uuidv4()} align="left">{product.Cost} сом</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <ManagePanel>
                <Button onClick={()=>setActiveModalPurchase(true)} sx={{ width: 220 }}  InputProps={{ sx: { height: 50 }}} variant="contained"  >Закупка сырья</Button>
                <Button onClick={() => setActiveModalHistory(true)} sx={{ width: 220 }}  InputProps={{ sx: { height: 50 }}} variant="outlined">История закупа</Button>
                <Button onClick={()=> setActiveModalAddRaw(true)} sx={{ width: 220 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="success" >Добавить сырьё</Button>
                <Button onClick={()=> setActiveModalDeleteRaw(true)} sx={{ width: 220 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="error" >Удалить сырьё</Button>
            </ManagePanel>


            {activeModalPurchase ? <ModalPurchaseRawMat active={activeModalPurchase} setActive={setActiveModalPurchase} updateFlag={setUpdateFlag} />
                :
                    <></>
            }


            {activeModalAddRaw ? <ModalAddNewRawMat active={activeModalAddRaw} setActive={setActiveModalAddRaw} />
                :
                    <></>
            }

            {activeModalDeleteRaw ? <ModalDeleteRawMat active={activeModalDeleteRaw} setActive={setActiveModalDeleteRaw} setUpdateFlag={setUpdateFlag} />
                :
                <></>
            }


            {activeModalHistory ? <ModalHistoryPurchase active={activeModalHistory} setActive={setActiveModalHistory} />
                :
                    <></>
            }

        </div>
    );
};

export default Warehouse;