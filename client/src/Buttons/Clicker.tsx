import Button from "./Button";

function Clicker(props:Button){
     const iconLocation: string = (typeof props.icon === "string")? props.icon:"";

    return(
    <div style={{
        width: `${props.width}`,
        height: `${props.height}`,
        marginRight: `${props.marginRight}px`
    }}>
        <button style={{
           cursor: "pointer",
           border: "none" 
        }}>
        <img src={iconLocation} />
        </button>
    </div>);
}

export default Clicker