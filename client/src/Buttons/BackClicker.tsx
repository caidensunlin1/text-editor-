import Clicker from "./Clicker";
import { LeftArrow } from "../assets/Icons";

function BackClicker(props:{height:number, width:number, marginRight: number}){
    return(<Clicker 
        icon= {LeftArrow} 
        height={props.height} 
        width={props.width}
        marginRight={props.marginRight}/>);
}
export default BackClicker
