import InputImpl from "./InputImpl";

// to do: when the server is hooked up make sure this has the ability to pull
// from the prestablished name of the title. 
function TitleInput(props: {width:number,height:number,marginRight:number}){
    return(<InputImpl 
        startingText= {"Untitled Document"} 
        width={props.width} 
        height={props.height} 
        marginRight={props.marginRight}/>);
}

export default TitleInput