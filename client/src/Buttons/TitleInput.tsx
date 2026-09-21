import Input from "./Input";

function TitleInput(props: {width:number,height:number,marginRight:number}){
    return(<Input 
        icon= {""} 
        width={props.width} 
        height={props.height} 
        marginRight={props.marginRight}/>);
}

export default TitleInput