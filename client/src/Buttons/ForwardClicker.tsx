import Clicker from "./Clicker";
import { RightArrow } from "../assets/Icons";

function ForwardClicker(props: {width:number,height:number,marginRight:number}){
    return(<Clicker 
        icon= {RightArrow} 
        width={props.width} 
        height={props.height}
        marginRight={props.marginRight}/>);
}

export default ForwardClicker