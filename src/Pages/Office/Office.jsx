    import React from 'react';
    import styled from "styled-components";
    import {Button, InputLabel} from "@mui/material";
    import MainModalEmployee from "./Employee/MainModalEmployee";
    import ModalAddNewPosition from "./Position/ModalAddNewPosition";
    import ModalDeletePosition from "./Position/ModalDeletePosition";
    import ModalAddNewUnit from "./Unit/ModalAddNewUnit";
    import ModalDeleteUnit from "./Unit/ModalDeleteUnit";
    import MainModalSalary from "./Salary/MainModalSalary";
    import ModalPaymentList from "./Salary/ModalPaymentList";
    import ModalBank from "./Bank/ModalBank";


    let ManagePanel = styled.div`
      width: 50%;
      height: 80px;
      border: 1px solid grey;
      border-radius: 7px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 0;
      flex-wrap: wrap;
    `

    const Office = () => {



        let [activeModalEmployee, setActiveModalEmployee] = React.useState(false);
        let [activeModalSalary, setActiveModalSalary] = React.useState(false);
        let [activeModalAddNewPosition, setActiveModalAddNewPosition] = React.useState(false);
        let [activeModalAddNewUnit, setActiveModalAddNewUnit] = React.useState(false);
        let [activeModalDeletePosition, setActiveModalDeletePosition] = React.useState(false);
        let [activeModalDeleteUnit, setActiveModalDeleteUnit] = React.useState(false);
        let [activeModalPaymentList, setActiveModalPaymentList] = React.useState(false);
        let [activeModalBank, setActiveModalBank] = React.useState(false);

        let [selectedYear, setSelectedYear] = React.useState(0);
        let [selectedMonthID, setSelectedMonthID] = React.useState(0);
        let [selectedMonthName, setSelectedMonthName] = React.useState("");

        return (
            <div>
                <h1>Hello Office</h1>

                <InputLabel sx={{ mt: 4.5 }} id="demo-simple-select-label">Банк</InputLabel>
                <ManagePanel>
                    <Button onClick={()=> setActiveModalBank(true)} sx={{ width: 260 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="success" >Банк</Button>
                </ManagePanel>

                <InputLabel sx={{ mt: 4.5 }} id="demo-simple-select-label">Отдел кадров</InputLabel>
                <ManagePanel>
                    <Button onClick={()=> setActiveModalEmployee(true)} sx={{ width: 260 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="success" >Сотрудники</Button>
                </ManagePanel>

                <InputLabel sx={{ mt: 4.5 }} id="demo-simple-select-label">Бухгалтерия</InputLabel>
                <ManagePanel>
                    <Button onClick={()=> setActiveModalSalary(true)} sx={{ width: 260 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="secondary" >Зарплата</Button>
                </ManagePanel>


                <InputLabel sx={{ mt: 6 }} id="demo-simple-select-label">Единицы измерения</InputLabel>
                <ManagePanel>
                    <Button onClick={()=> setActiveModalAddNewUnit(true)} sx={{ width: 260 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="success" >Добавить ед. измерения</Button>
                    <Button onClick={()=> setActiveModalDeleteUnit(true)} sx={{ width: 260 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="error" >Удалить ед. измерения</Button>
                </ManagePanel>

                <InputLabel sx={{ mt: 6 }} id="demo-simple-select-label">Позиции</InputLabel>
                <ManagePanel>
                    <Button onClick={()=> setActiveModalAddNewPosition(true)} sx={{ width: 260 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="success" >Добавить позицию</Button>
                    <Button onClick={()=> setActiveModalDeletePosition(true)} sx={{ width: 260 }}  InputProps={{ sx: { height: 50 }}} variant="contained" color="error" >Удалить позицию</Button>

                </ManagePanel>



                {activeModalBank ? <ModalBank active={activeModalBank} setActive={setActiveModalBank} />
                    :
                    <></>
                }

                {activeModalEmployee ? <MainModalEmployee active={activeModalEmployee} setActive={setActiveModalEmployee} />
                    :
                    <></>
                }

                {activeModalSalary ?
                    <MainModalSalary
                        active={activeModalSalary}
                        setActive={setActiveModalSalary}
                        setActivePaymentList={setActiveModalPaymentList}
                        setYear={setSelectedYear}
                        setMonthID={setSelectedMonthID}
                        setMonthName={setSelectedMonthName}
                    />
                    :
                    <></>
                }

                {activeModalAddNewPosition ? <ModalAddNewPosition active={activeModalAddNewPosition} setActive={setActiveModalAddNewPosition} />
                    :
                    <></>
                }

                {activeModalDeletePosition ? <ModalDeletePosition active={activeModalDeletePosition} setActive={setActiveModalDeletePosition} />
                    :
                    <></>
                }

                {activeModalAddNewUnit ? <ModalAddNewUnit active={activeModalAddNewUnit} setActive={setActiveModalAddNewUnit} />
                    :
                    <></>
                }

                {activeModalDeleteUnit ? <ModalDeleteUnit active={activeModalDeleteUnit} setActive={setActiveModalDeleteUnit} />
                    :
                    <></>
                }

                {activeModalPaymentList ?
                    <ModalPaymentList
                        active={activeModalPaymentList}
                        setActive={setActiveModalPaymentList}
                        MonthID={selectedMonthID}
                        MonthName={selectedMonthName}
                        Year={selectedYear}
                    />
                    :
                    <></>
                }


            </div>
        );
    };

    export default Office;