import {Routes,  Route} from "react-router-dom";
import ProductionProducts from "./Pages/ProductionProducts/ProductionProducts";
import SaleProducts from "./Pages/SaleProducts/SaleProducts";
import Header from "./Components/UI/Header/Header";
import Warehouse from "./Pages/Warehouse/Warehouse";
import FinishProducts from "./Pages/FinishProducts/FinishProducts";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Office from "./Pages/Office/Office";

function App() {
  return (
    <div>

      <Header/>

      <Routes>
        <Route path={"/"} element={<ProductionProducts/>} />
        <Route path={"/ProductionProducts"} element={<ProductionProducts/>} />
        <Route path={"/SaleProducts"} element={<SaleProducts/>} />
        <Route path={"/Warehouse"} element={<Warehouse/>} />
        <Route path={"/FinishProducts"} element={<FinishProducts/>} />
        <Route path={"/Office"} element={<Office/>} />
      </Routes>

        <ToastContainer position={"bottom-center"} theme={"dark"} />


    </div>
  );
}

export default App;
