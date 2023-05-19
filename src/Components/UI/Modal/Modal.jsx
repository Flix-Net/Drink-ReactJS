    import React from 'react';
    import styled from "styled-components";

    let StyledModal = styled.div`
      z-index: 100;
      width: 100%;
      height: 100vh;
      background-color: ${props => props.bgColor || "rgba(0, 0, 0, 0.65)"} ;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    `

    let StyledModalContent = styled.div`
      background-color: ${props => props.bgInnerColor || "#050d23"} ;
      padding: 20px 20px 20px;
      border: 3px solid #1565C0;
      border-radius: 12px;
      color: ${props => props.TextColor || "white"} ;
      position: relative;
      width: ${props => props.width || "auto"};
      height: ${props => props.height || "100px"};
      display: ${props => props.display || "block"};
      
      justify-content: center;/////
      text-align: center;          ////////// При условии Display: Flex
      align-items: center;    /////
    `

    let StyledCloseModal = styled.div`
      position: absolute;
      top: 10px;
      right: 10px;
      color: ${props => props.colorClose || "white"} ;
      transition: .3s;
      &:hover {
        color: red;
        cursor: pointer;
      }
    `

    const Modal = (props) => {
        return (
            <StyledModal {...props} scale={"1"}  >
                <StyledModalContent {...props} >
                    <StyledCloseModal  onClick={()=>{props.setActive(false)}}>CLOSE</StyledCloseModal>
                    {props.children}
                </StyledModalContent>
            </StyledModal>
        );
    };

    export default Modal;