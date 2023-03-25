import {Routes,  Route} from "react-router-dom";
import ProductionProducts from "./Pages/ProductionProducts";
import SaleProducts from "./Pages/SaleProducts";
import Header from "./Components/Header/Header";
import Warehouse from "./Pages/Warehouse";
import FinishProducts from "./Pages/FinishProducts";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
      </Routes>

        <ToastContainer position={"bottom-center"} theme={"dark"} />


    </div>
  );
}

export default App;
