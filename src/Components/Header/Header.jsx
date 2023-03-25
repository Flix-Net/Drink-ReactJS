import React from 'react';
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import styles from "./App.module.css";
import styled from "styled-components";

const MainBar = styled.div`
  border: 1px solid #4040ff;
  border-radius: 10px;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`

const Header = () => {
    return (
        <MainBar>
            <Button variant="outlined"><Link className={styles.Link} to={"/ProductionProducts"}>Производство продукции</Link></Button>
            <Button variant="outlined"><Link className={styles.Link} to={"/SaleProducts"}>Продажа продукции</Link></Button>
            <Button variant="outlined"><Link className={styles.Link} to={"/FinishProducts"}>Готовая продукция</Link></Button>
            <Button variant="outlined"><Link className={styles.Link} to={"/Warehouse"}>Склад</Link></Button>
        </MainBar>
    );
};

export default Header;